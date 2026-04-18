import time
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IBM_RXN_BASE = "https://rxn.app.accelerate.science/rxn/api/api/v1"
_project_id_cache: dict[str, str] = {}


def _session(api_key: str) -> requests.Session:
    s = requests.Session()
    s.headers.update({
        "Content-Type": "application/json",
        "Authorization": api_key,
    })
    s.verify = False
    return s


def _get_or_create_project(session: requests.Session) -> str:
    cache_key = session.headers.get("Authorization", "")
    if cache_key in _project_id_cache:
        return _project_id_cache[cache_key]

    r = session.get(f"{IBM_RXN_BASE}/projects", timeout=15)
    r.raise_for_status()
    content = r.json().get("payload", {}).get("content", [])
    if content:
        project_id = content[0]["id"]
    else:
        cr = session.post(f"{IBM_RXN_BASE}/projects", json={"name": "DrugDiscovery"}, timeout=15)
        cr.raise_for_status()
        project_id = cr.json()["payload"]["id"]

    _project_id_cache[cache_key] = project_id
    return project_id


def predict_retrosynthesis_sync(smiles: str, api_key: str, steps: int = 3) -> dict:
    session = _session(api_key)
    project_id = _get_or_create_project(session)

    body = {
        "aiModel": "2020-07-01",
        "isinteractive": False,
        "parameters": {
            "availability_pricing_threshold": 0,
            "available_smiles": None,
            "exclude_smiles": None,
            "exclude_substructures": None,
            "exclude_target_molecule": True,
            "fap": 0.6,
            "max_steps": steps,
            "nbeams": 10,
            "pruning_steps": 2,
            "search_strategy": "hyper",
        },
        "product": smiles,
    }
    params = {"projectId": project_id, "aiModel": "2020-07-01"}

    # Submit with retry on rate-limit
    for attempt in range(4):
        resp = session.post(
            f"{IBM_RXN_BASE}/retrosynthesis/rs",
            json=body,
            params=params,
            timeout=30,
        )
        if resp.status_code == 429:
            time.sleep(8 * (attempt + 1))
            continue
        break

    if not resp.ok:
        raise ValueError(f"IBM RXN submit error {resp.status_code}: {resp.text[:300]}")

    prediction_id = resp.json().get("payload", {}).get("id")
    if not prediction_id:
        raise ValueError(f"No prediction ID in response: {resp.text[:200]}")

    # Poll until complete (5s intervals, max 120s)
    results_url = f"{IBM_RXN_BASE}/retrosynthesis/{prediction_id}"
    for _ in range(24):
        time.sleep(5)
        poll = session.get(results_url, timeout=15)
        if poll.status_code == 429:
            time.sleep(10)
            continue
        if not poll.ok:
            raise ValueError(f"IBM RXN poll error {poll.status_code}: {poll.text[:200]}")
        payload = poll.json().get("payload", {})
        status = payload.get("status")
        if status == "SUCCESS":
            return _parse_result(payload, smiles)
        elif status == "ERROR":
            raise ValueError(f"IBM RXN prediction failed: {payload.get('errorMessage', 'unknown')}")

    raise TimeoutError("IBM RXN prediction timed out after 120 seconds")


def _parse_result(payload: dict, target_smiles: str) -> dict:
    sequences = payload.get("sequences", [])
    if not sequences:
        return _empty_synthesis(target_smiles)

    # Take highest-confidence sequence
    best = sorted(sequences, key=lambda s: s.get("confidence", 0), reverse=True)[0]

    steps = []
    counter = [1]
    _traverse_tree(best.get("tree", {}), steps, counter)

    # Fallback: parse reactionSmiles directly if tree gave nothing
    if not steps and best.get("reactionSmiles"):
        steps = _parse_reaction_smiles(best["reactionSmiles"])

    return {
        "target_smiles": target_smiles,
        "num_steps": best.get("steps", len(steps)),
        "overall_confidence": round(best.get("confidence", 0), 3),
        "steps": steps,
        "model": "IBM RXN AI (2020-07-01)",
        "status": "success",
    }


def _traverse_tree(node: dict, steps: list, counter: list) -> None:
    """Each non-leaf tree node represents one reaction step (children → node)."""
    children = node.get("children", [])
    if not children:
        return

    reactants = [c["smiles"] for c in children if c.get("smiles")]
    product = node.get("smiles", "")

    # Skip trivial steps where reactant == product (commercially available molecule)
    non_trivial_reactants = [r for r in reactants if r != product]
    if non_trivial_reactants and product:
        rxn_smiles = ".".join(non_trivial_reactants) + ">>" + product
        rclass = node.get("rclass") or ""
        reaction_type = rclass if rclass and rclass.lower() not in ("", "unrecognized") else "Transformation"
        steps.append({
            "step": counter[0],
            "reaction_smiles": rxn_smiles,
            "reactants": non_trivial_reactants,
            "product": product,
            "confidence": round(node.get("confidence", 0), 3),
            "reaction_type": reaction_type,
            "template_score": 0.0,
        })
        counter[0] += 1

    for child in children:
        _traverse_tree(child, steps, counter)


def _parse_reaction_smiles(rxn_smiles: str) -> list:
    """Parse a single reactionSmiles string into a step list."""
    if ">>" not in rxn_smiles:
        return []
    parts = rxn_smiles.split(">>")
    product = parts[1] if len(parts) > 1 else ""
    reactants = [r for r in parts[0].split(".") if r != product]
    if not reactants:
        return []
    return [{
        "step": 1,
        "reaction_smiles": rxn_smiles,
        "reactants": reactants,
        "product": product,
        "confidence": 1.0,
        "reaction_type": "Transformation",
        "template_score": 0.0,
    }]


def _empty_synthesis(smiles: str) -> dict:
    return {
        "target_smiles": smiles,
        "num_steps": 0,
        "overall_confidence": 0.0,
        "steps": [],
        "model": "IBM RXN AI",
        "status": "empty",
    }
