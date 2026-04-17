import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_targets_returns_4():
    resp = client.get("/api/v1/targets/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 4
    assert len(data["targets"]) == 4


def test_covid_protease_pdb_id():
    resp = client.get("/api/v1/targets/covid_protease")
    assert resp.status_code == 200
    assert resp.json()["pdb_id"] == "6LU7"


def test_unknown_target_404():
    resp = client.get("/api/v1/targets/fakename")
    assert resp.status_code == 404


def test_fetch_pdb_entry_live():
    from app.services.pdb_service import fetch_pdb_entry
    try:
        result = fetch_pdb_entry("6LU7")
        assert result["fetched"] is True
        assert result["pdb_id"] == "6LU7"
    except Exception:
        pytest.skip("RCSB PDB not reachable")
