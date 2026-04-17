import json
import urllib.request
import urllib.parse


def _phase_label(phase: int) -> str:
    labels = {0: "Preclinical", 1: "Phase I", 2: "Phase II", 3: "Phase III", 4: "Approved"}
    return labels.get(phase, "Unknown")


def _empty_chembl() -> dict:
    return {
        "chembl_id": "N/A",
        "max_phase": 0,
        "phase_label": "Not in clinical trials",
        "molecule_type": "Unknown",
        "first_approval": None,
        "oral": False,
        "topical": False,
        "indication_class": "Unknown",
        "therapeutic_flag": False,
        "natural_product": 0,
        "black_box_warning": 0,
        "chirality": -1,
        "found_in_chembl": False,
    }


def fetch_chembl_data(molecule_name: str) -> dict:
    base = "https://www.ebi.ac.uk/chembl/api/data"
    try:
        name_encoded = urllib.parse.quote(molecule_name.upper())
        url = f"{base}/molecule?pref_name={name_encoded}&format=json"
        with urllib.request.urlopen(url, timeout=8) as r:
            data = json.loads(r.read())
        molecules = data.get("molecules", [])
        if not molecules:
            return _empty_chembl()
        m = molecules[0]
        return {
            "chembl_id":         m.get("molecule_chembl_id", "N/A"),
            "max_phase":         m.get("max_phase", 0),
            "phase_label":       _phase_label(m.get("max_phase", 0)),
            "molecule_type":     m.get("molecule_type", "Unknown"),
            "first_approval":    m.get("first_approval", None),
            "oral":              m.get("oral", False),
            "topical":           m.get("topical", False),
            "indication_class":  m.get("indication_class", "Unknown"),
            "therapeutic_flag":  m.get("therapeutic_flag", False),
            "natural_product":   m.get("natural_product", 0),
            "black_box_warning": m.get("black_box_warning", 0),
            "chirality":         m.get("chirality", -1),
            "found_in_chembl":   True,
        }
    except Exception:
        return _empty_chembl()
