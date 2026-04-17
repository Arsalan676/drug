import numpy as np
import joblib
from pathlib import Path

from app.config import settings

_binding_model = None
_admet_models: dict = {}

ADMET_PROPERTIES = ["absorption", "distribution", "metabolism", "excretion", "toxicity"]


def _load_binding_model():
    global _binding_model
    if _binding_model is None:
        path = Path(settings.MODEL_DIR) / "binding_affinity_rf.pkl"
        _binding_model = joblib.load(path)
    return _binding_model


def _load_admet_model(prop: str):
    if prop not in _admet_models:
        path = Path(settings.MODEL_DIR) / f"admet_{prop}.pkl"
        _admet_models[prop] = joblib.load(path)
    return _admet_models[prop]


def predict_binding_affinity(feature_vector: list[float]) -> dict:
    model = _load_binding_model()
    X = np.array(feature_vector, dtype=np.float32).reshape(1, -1)
    pkd = float(model.predict(X)[0])
    pkd = round(np.clip(pkd, 2.0, 10.0), 3)

    if pkd > 7:
        strength = "Strong"
    elif pkd >= 5:
        strength = "Moderate"
    else:
        strength = "Weak"

    return {
        "pkd": pkd,
        "binding_strength": strength,
        "confidence_interval": [round(pkd - 0.5, 3), round(pkd + 0.5, 3)],
        "percentile_rank": round((pkd - 2.0) / (10.0 - 2.0) * 100, 2),
    }


def predict_admet(feature_vector: list[float]) -> dict:
    X = np.array(feature_vector, dtype=np.float32).reshape(1, -1)
    result = {}
    scores_for_avg = []

    for prop in ADMET_PROPERTIES:
        model = _load_admet_model(prop)
        proba = float(model.predict_proba(X)[0][1])

        if prop == "toxicity":
            is_pass = proba < 0.5
            label = "Non-toxic" if is_pass else "Toxic"
            scores_for_avg.append(1.0 - proba)
        else:
            is_pass = proba >= 0.5
            label = "Pass" if is_pass else "Fail"
            scores_for_avg.append(proba)

        result[prop] = {
            "probability": round(proba, 4),
            "pass": is_pass,
            "label": label,
        }

    overall = round(float(np.mean(scores_for_avg)) * 100, 2)
    result["overall_admet_score"] = overall
    return result


def compute_druggability_score(
    binding_result: dict,
    admet_result: dict,
    lipinski_pass: bool,
) -> dict:
    binding_component = binding_result["percentile_rank"] * 0.40
    admet_component = admet_result["overall_admet_score"] * 0.45
    lipinski_component = 100.0 if lipinski_pass else 30.0
    lipinski_weighted = lipinski_component * 0.15

    score = round(min(100.0, max(0.0, binding_component + admet_component + lipinski_weighted)), 1)

    if score >= 75:
        grade = "A"
        interpretation = "Excellent candidate — strong binding, favorable ADMET, drug-like properties"
        recommendation = "Advance to lead optimization and in vitro validation studies."
    elif score >= 55:
        grade = "B"
        interpretation = "Promising candidate — moderate profile, warrants further investigation"
        recommendation = "Perform structural optimization to improve weak ADMET or binding properties."
    elif score >= 35:
        grade = "C"
        interpretation = "Marginal candidate — significant limitations in binding or ADMET"
        recommendation = "Consider scaffold redesign to address key pharmacological deficiencies."
    else:
        grade = "D"
        interpretation = "Poor candidate — major pharmacological or toxicity concerns"
        recommendation = "Deprioritize; explore alternative chemotypes with better drug-like profiles."

    return {
        "druggability_score": score,
        "grade": grade,
        "interpretation": interpretation,
        "recommendation": recommendation,
        "breakdown": {
            "binding_contribution": round(binding_component, 2),
            "admet_contribution": round(admet_component, 2),
            "lipinski_contribution": round(lipinski_weighted, 2),
        },
    }
