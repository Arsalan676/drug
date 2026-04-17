import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_full_pipeline_aspirin():
    resp = client.post("/api/v1/analyze/", json={"input": "aspirin"})
    assert resp.status_code == 200
    score = resp.json()["druggability"]["druggability_score"]
    assert 0 <= score <= 100


def test_processing_time_under_5s():
    resp = client.post("/api/v1/analyze/", json={"input": "aspirin"})
    assert resp.status_code == 200
    assert resp.json()["processing_time_ms"] < 5000


def test_all_top_level_keys():
    resp = client.post("/api/v1/analyze/", json={"input": "aspirin"})
    assert resp.status_code == 200
    data = resp.json()
    for key in (
        "molecule_name", "canonical_smiles", "molecular_formula", "molecular_weight",
        "descriptors", "lipinski_pass", "lipinski_details",
        "binding_affinity", "admet", "druggability", "processing_time_ms",
    ):
        assert key in data


def test_grade_valid():
    resp = client.post("/api/v1/analyze/", json={"input": "aspirin"})
    assert resp.status_code == 200
    assert resp.json()["druggability"]["grade"] in ("A", "B", "C", "D")


def test_list_molecules():
    resp = client.get("/api/v1/analyze/molecules")
    assert resp.status_code == 200
    molecules = resp.json()["molecules"]
    assert len(molecules) >= 1
