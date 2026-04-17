import numpy as np
from rdkit import Chem
from rdkit.Chem import AllChem, Descriptors, Crippen, rdMolDescriptors

_DESCRIPTOR_RANGES = {
    "MolWt":             (0, 1000),
    "LogP":              (-10, 10),
    "NumHDonors":        (0, 20),
    "NumHAcceptors":     (0, 20),
    "TPSA":              (0, 500),
    "NumRotatableBonds": (0, 30),
    "NumAromaticRings":  (0, 10),
    "NumHeavyAtoms":     (0, 100),
    "FractionCSP3":      (0, 1),
    "NumRings":          (0, 10),
    "MolMR":             (0, 300),
    "LabuteASA":         (0, 500),
}


def compute_features(mol: Chem.Mol) -> dict:
    fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)
    morgan_fp = np.array(fp, dtype=np.float32)

    descriptors = {
        "MolWt":             Descriptors.MolWt(mol),
        "LogP":              Crippen.MolLogP(mol),
        "NumHDonors":        Descriptors.NumHDonors(mol),
        "NumHAcceptors":     Descriptors.NumHAcceptors(mol),
        "TPSA":              Descriptors.TPSA(mol),
        "NumRotatableBonds": Descriptors.NumRotatableBonds(mol),
        "NumAromaticRings":  rdMolDescriptors.CalcNumAromaticRings(mol),
        "NumHeavyAtoms":     Descriptors.HeavyAtomCount(mol),
        "FractionCSP3":      Descriptors.FractionCSP3(mol),
        "NumRings":          rdMolDescriptors.CalcNumRings(mol),
        "MolMR":             Crippen.MolMR(mol),
        "LabuteASA":         rdMolDescriptors.CalcLabuteASA(mol),
    }

    normalized = []
    for key, val in descriptors.items():
        lo, hi = _DESCRIPTOR_RANGES[key]
        norm = (val - lo) / (hi - lo) if hi != lo else 0.0
        normalized.append(np.clip(norm, 0.0, 1.0))

    descriptor_array = np.array(normalized, dtype=np.float32)
    combined = np.concatenate([morgan_fp, descriptor_array])

    assert not np.any(np.isnan(combined)), "NaN in feature vector"
    assert not np.any(np.isinf(combined)), "Inf in feature vector"

    return {
        "morgan_fp": morgan_fp.tolist(),
        "descriptors": descriptors,
        "feature_vector": combined.tolist(),
        "feature_dim": int(combined.shape[0]),
    }
