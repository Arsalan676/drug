import json
import urllib.request

TARGET_PROTEINS = {
    "covid_protease": {
        "pdb_id": "6LU7",
        "name": "SARS-CoV-2 Main Protease",
        "disease": "COVID-19",
        "description": "Primary drug target for COVID-19 antivirals like Paxlovid",
    },
    "cancer_bcr_abl": {
        "pdb_id": "1IEP",
        "name": "BCR-ABL Tyrosine Kinase",
        "disease": "Chronic Myeloid Leukemia",
        "description": "Target of imatinib (Gleevec) — first targeted cancer therapy",
    },
    "alzheimers_ace": {
        "pdb_id": "1O86",
        "name": "Acetylcholinesterase",
        "disease": "Alzheimer's Disease",
        "description": "Target of donepezil and rivastigmine for Alzheimer's treatment",
    },
    "diabetes_dpp4": {
        "pdb_id": "2I78",
        "name": "Dipeptidyl Peptidase 4 (DPP-4)",
        "disease": "Type 2 Diabetes",
        "description": "Target of sitagliptin (Januvia) and other gliptins",
    },
}


def fetch_pdb_entry(pdb_id: str) -> dict:
    url = f"https://data.rcsb.org/rest/v1/core/entry/{pdb_id}"
    try:
        with urllib.request.urlopen(url, timeout=8) as r:
            data = json.loads(r.read())
        struct = data.get("struct", {})
        exptl = data.get("exptl", [{}])[0]
        rcsb = data.get("rcsb_entry_info", {})
        resolution = rcsb.get("resolution_combined", [None])
        return {
            "pdb_id":        pdb_id,
            "title":         struct.get("title", "Unknown"),
            "method":        exptl.get("method", "Unknown"),
            "resolution":    resolution[0] if resolution else None,
            "polymer_count": rcsb.get("deposited_polymer_entity_instance_count", 0),
            "atom_count":    rcsb.get("deposited_atom_count", 0),
            "rcsb_url":      f"https://www.rcsb.org/structure/{pdb_id}",
            "image_url":     f"https://cdn.rcsb.org/images/structures/{pdb_id.lower()}_assembly-1.jpeg",
            "fetched":       True,
        }
    except Exception:
        return {"pdb_id": pdb_id, "fetched": False, "title": "Could not fetch PDB data"}


_targets_cache: list[dict] | None = None


def get_all_targets() -> list[dict]:
    global _targets_cache
    if _targets_cache is not None:
        return _targets_cache
    result = []
    for key, meta in TARGET_PROTEINS.items():
        entry = fetch_pdb_entry(meta["pdb_id"])
        result.append({**meta, "target_key": key, "pdb_data": entry})
    _targets_cache = result
    return result
