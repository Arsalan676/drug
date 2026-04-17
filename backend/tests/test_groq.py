from app.services.groq_service import generate_clinical_interpretation, _fallback_interpretation


_SAMPLE = {
    "molecule_name": "aspirin",
    "molecular_weight": 180.16,
    "descriptors": {"LogP": 1.31},
    "lipinski_pass": True,
    "binding_affinity": {"pkd": 4.9, "binding_strength": "Weak"},
    "admet": {
        "overall_admet_score": 80.0,
        "toxicity": {"label": "Non-toxic"},
        "absorption": {"label": "Pass"},
    },
    "druggability": {"druggability_score": 65.5, "grade": "B"},
    "chembl_data": {"phase_label": "Approved"},
}


def test_fallback_returns_interpretation():
    result = _fallback_interpretation(_SAMPLE)
    assert "interpretation" in result
    assert len(result["interpretation"]) > 10
    assert result["source"] == "rule_based"


def test_generate_returns_dict():
    result = generate_clinical_interpretation(_SAMPLE)
    assert isinstance(result, dict)
    assert "interpretation" in result
    assert "source" in result


def test_analyze_includes_ai_interpretation():
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    resp = client.post("/api/v1/analyze/", json={"input": "aspirin"})
    assert resp.status_code == 200
    data = resp.json()
    assert "ai_interpretation" in data
    assert "interpretation" in data["ai_interpretation"]
