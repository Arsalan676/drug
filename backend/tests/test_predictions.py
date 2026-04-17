import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_binding_strength_valid():
    resp = client.post("/api/v1/predict/binding", json={"input": "aspirin"})
    assert resp.status_code == 200
    assert resp.json()["binding_strength"] in ("Strong", "Moderate", "Weak")


def test_pkd_in_range():
    resp = client.post("/api/v1/predict/binding", json={"input": "aspirin"})
    assert resp.status_code == 200
    assert 2.0 <= resp.json()["pkd"] <= 10.0


def test_canonical_smiles_nonempty():
    resp = client.post("/api/v1/predict/binding", json={"input": "aspirin"})
    assert resp.status_code == 200
    assert resp.json()["canonical_smiles"] != ""
