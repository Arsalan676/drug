from rdkit import Chem
from app.services.featurizer import compute_features


def test_feature_dim_aspirin():
    mol = Chem.MolFromSmiles("CC(=O)Oc1ccccc1C(=O)O")
    feat = compute_features(mol)
    assert feat["feature_dim"] == 2060


def test_descriptor_keys_present():
    mol = Chem.MolFromSmiles("CC(=O)Oc1ccccc1C(=O)O")
    feat = compute_features(mol)
    expected_keys = {
        "MolWt", "LogP", "NumHDonors", "NumHAcceptors", "TPSA",
        "NumRotatableBonds", "NumAromaticRings", "NumHeavyAtoms",
        "FractionCSP3", "NumRings", "MolMR", "LabuteASA",
    }
    assert set(feat["descriptors"].keys()) == expected_keys


def test_morgan_fp_length():
    mol = Chem.MolFromSmiles("CC(=O)Oc1ccccc1C(=O)O")
    feat = compute_features(mol)
    assert len(feat["morgan_fp"]) == 2048


def test_morgan_fp_binary():
    mol = Chem.MolFromSmiles("CC(=O)Oc1ccccc1C(=O)O")
    feat = compute_features(mol)
    assert all(v in (0.0, 1.0) for v in feat["morgan_fp"])
