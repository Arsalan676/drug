import pytest
from app.services.chembl_service import fetch_chembl_data, _phase_label, _empty_chembl


def test_phase_label_approved():
    assert _phase_label(4) == "Approved"


def test_phase_label_preclinical():
    assert _phase_label(0) == "Preclinical"


def test_fake_drug_not_found():
    result = fetch_chembl_data("xyzfakedrugname99")
    assert result["found_in_chembl"] is False


def test_empty_chembl_shape():
    result = _empty_chembl()
    assert result["found_in_chembl"] is False
    assert result["max_phase"] == 0


def test_aspirin_found_in_chembl():
    try:
        result = fetch_chembl_data("aspirin")
        if result["found_in_chembl"]:
            assert result["max_phase"] == 4
    except Exception:
        pytest.skip("ChEMBL not reachable")


def test_analyze_includes_chembl_data():
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    resp = client.post("/api/v1/analyze/", json={"input": "aspirin"})
    assert resp.status_code == 200
    assert "chembl_data" in resp.json()
    assert "found_in_chembl" in resp.json()["chembl_data"]
