import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_overall_admet_score_range():
    resp = client.post("/api/v1/predict/admet", json={"input": "aspirin"})
    assert resp.status_code == 200
    score = resp.json()["overall_admet_score"]
    assert 0 <= score <= 100


def test_all_admet_keys_present():
    resp = client.post("/api/v1/predict/admet", json={"input": "aspirin"})
    assert resp.status_code == 200
    admet = resp.json()["admet"]
    for key in ("absorption", "distribution", "metabolism", "excretion", "toxicity"):
        assert key in admet


def test_toxicity_label():
    resp = client.post("/api/v1/predict/admet", json={"input": "aspirin"})
    assert resp.status_code == 200
    label = resp.json()["admet"]["toxicity"]["label"]
    assert label in ("Non-toxic", "Toxic")


def test_caffeine_absorption():
    resp = client.post("/api/v1/predict/admet", json={"input": "caffeine"})
    assert resp.status_code == 200
    # caffeine: TPSA~58, MolWt~194 — should pass absorption
    assert resp.json()["admet"]["absorption"]["pass"] is True
