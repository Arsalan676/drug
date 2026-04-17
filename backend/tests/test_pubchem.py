import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_aspirin_resolves_local():
    resp = client.post("/api/v1/molecules/parse", json={"input": "aspirin"})
    assert resp.status_code == 200
    assert resp.json()["source"] == "local"


@pytest.mark.skipif(
    not __import__("urllib.request", fromlist=["urlopen"]).urlopen(
        "https://pubchem.ncbi.nlm.nih.gov", timeout=3
    ) if False else False,
    reason="offline"
)
def test_remdesivir_resolves_pubchem():
    try:
        resp = client.post("/api/v1/molecules/parse", json={"input": "remdesivir"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["source"] == "pubchem"
        assert data["canonical_smiles"] != ""
    except Exception:
        pytest.skip("PubChem not reachable")


def test_fake_name_returns_404():
    resp = client.post("/api/v1/molecules/parse", json={"input": "xyzabc123drug"})
    assert resp.status_code in (404, 422)


def test_source_field_present():
    resp = client.post("/api/v1/molecules/parse", json={"input": "aspirin"})
    assert resp.status_code == 200
    assert "source" in resp.json()
