"""
Run with: python -m app.services.model_trainer
Must be executed from the backend/ directory.
"""
import json
import numpy as np
import joblib
from datetime import datetime, timezone
from pathlib import Path
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score
from rdkit import Chem

from app.services.featurizer import compute_features
from app.services.molecule_service import MOLECULE_LOOKUP

MODEL_DIR = Path("data/models")

SEED_SMILES = list(MOLECULE_LOOKUP.values())
SEED_NAMES = list(MOLECULE_LOOKUP.keys())


def _generate_training_data():
    np.random.seed(42)
    feature_vectors = []
    raw_descriptors_list = []

    for smiles in SEED_SMILES:
        mol = Chem.MolFromSmiles(smiles)
        feat = compute_features(mol)
        fv = np.array(feat["feature_vector"], dtype=np.float32)
        desc = feat["descriptors"]

        for _ in range(50):
            variant = fv.copy()
            # add noise only to the descriptor portion (last 12 dims)
            variant[-12:] += np.random.normal(0, 0.05, 12)
            variant[-12:] = np.clip(variant[-12:], 0.0, 1.0)
            feature_vectors.append(variant)
            raw_descriptors_list.append(desc)

    return np.array(feature_vectors, dtype=np.float32), raw_descriptors_list


def _compute_pkd_labels(raw_descriptors_list):
    np.random.seed(42)
    labels = []
    for desc in raw_descriptors_list:
        logp = desc["LogP"]
        mw = desc["MolWt"]
        hbd = desc["NumHDonors"]
        tpsa = desc["TPSA"]
        pkd = (
            5.0
            + (logp * 0.3)
            - (mw / 500)
            + (hbd * 0.2)
            - (tpsa / 200)
            + np.random.normal(0, 0.3)
        )
        labels.append(float(np.clip(pkd, 2.0, 10.0)))
    return np.array(labels, dtype=np.float32)


def _compute_admet_labels(raw_descriptors_list):
    absorption, distribution, metabolism, excretion, toxicity = [], [], [], [], []

    for desc in raw_descriptors_list:
        logp = desc["LogP"]
        mw = desc["MolWt"]
        hbd = desc["NumHDonors"]
        tpsa = desc["TPSA"]
        ar = desc["NumAromaticRings"]

        absorption.append(1 if tpsa < 140 and mw < 500 else 0)
        distribution.append(1 if 1 <= logp <= 3 and mw < 400 and tpsa < 90 else 0)
        metabolism.append(1 if ar >= 2 and logp > 2 else 0)
        excretion.append(1 if tpsa > 60 and hbd >= 1 else 0)
        toxicity.append(1 if logp > 3.5 and mw > 400 else 0)

    return {
        "absorption": np.array(absorption),
        "distribution": np.array(distribution),
        "metabolism": np.array(metabolism),
        "excretion": np.array(excretion),
        "toxicity": np.array(toxicity),
    }


def train_binding_affinity_model(X, raw_descriptors_list):
    y = _compute_pkd_labels(raw_descriptors_list)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    train_r2 = r2_score(y_train, model.predict(X_train))
    test_preds = model.predict(X_test)
    test_r2 = r2_score(y_test, test_preds)
    test_rmse = float(np.sqrt(mean_squared_error(y_test, test_preds)))

    print(f"[Binding Affinity] train_r2={train_r2:.4f}  test_r2={test_r2:.4f}  test_rmse={test_rmse:.4f}")

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_DIR / "binding_affinity_rf.pkl")

    meta = {
        "model_type": "RandomForestRegressor",
        "feature_dim": 2060,
        "output": "pKd",
        "output_range": [2.0, 10.0],
        "train_r2": round(train_r2, 4),
        "test_r2": round(test_r2, 4),
        "test_rmse": round(test_rmse, 4),
        "n_train_samples": int(X_train.shape[0]),
        "trained_at": datetime.now(timezone.utc).isoformat(),
    }
    with open(MODEL_DIR / "binding_affinity_meta.json", "w") as f:
        json.dump(meta, f, indent=2)

    return meta


def train_admet_models(X, raw_descriptors_list):
    admet_labels = _compute_admet_labels(raw_descriptors_list)
    accuracies = {}

    for prop, y in admet_labels.items():
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = RandomForestClassifier(
            n_estimators=150,
            max_depth=10,
            random_state=42,
            n_jobs=-1,
        )
        model.fit(X_train, y_train)
        acc = accuracy_score(y_test, model.predict(X_test))
        accuracies[prop] = round(acc, 4)
        print(f"[ADMET {prop}] accuracy={acc:.4f}")

        joblib.dump(model, MODEL_DIR / f"admet_{prop}.pkl")

    meta = {
        "model_type": "RandomForestClassifier",
        "feature_dim": 2060,
        "accuracies": accuracies,
        "trained_at": datetime.now(timezone.utc).isoformat(),
    }
    with open(MODEL_DIR / "admet_meta.json", "w") as f:
        json.dump(meta, f, indent=2)

    return meta


if __name__ == "__main__":
    print("Generating training data...")
    X, raw_descriptors_list = _generate_training_data()
    print(f"Dataset shape: {X.shape}")

    print("\nTraining binding affinity model...")
    train_binding_affinity_model(X, raw_descriptors_list)

    print("\nTraining ADMET models...")
    train_admet_models(X, raw_descriptors_list)

    print("\nAll models trained and saved to data/models/")
