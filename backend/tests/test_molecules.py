import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_parse_by_name_aspirin():
    resp = client.post("/api/v1/molecules/parse", json={"input": "aspirin", "input_type": "auto"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["molecular_formula"] == "C9H8O4"


def test_parse_by_smiles_ethanol():
    resp = client.post("/api/v1/molecules/parse", json={"input": "CCO", "input_type": "smiles"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["canonical_smiles"] != ""
    assert data["molecular_weight"] > 0


def test_parse_invalid_name():
    resp = client.post("/api/v1/molecules/parse", json={"input": "notamolecule", "input_type": "name"})
    assert resp.status_code == 422


def test_parse_invalid_smiles():
    resp = client.post("/api/v1/molecules/parse", json={"input": "ZZZZZ", "input_type": "smiles"})
    assert resp.status_code == 422
