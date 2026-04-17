from typing import Literal
from pydantic import BaseModel


class MoleculeParseRequest(BaseModel):
    input: str
    input_type: Literal["name", "smiles", "auto"] = "auto"


class MoleculeInfo(BaseModel):
    canonical_smiles: str
    molecular_formula: str
    molecular_weight: float
    num_atoms: int
    num_rings: int
    num_hbd: int
    num_hba: int
    logp: float
    inchi_key: str
    lipinski_pass: bool


class FeaturizeResponse(BaseModel):
    descriptors: dict
    feature_dim: int
    morgan_fp_bits_set: int


class BindingAffinityResponse(BaseModel):
    molecule_name: str
    canonical_smiles: str
    pkd: float
    binding_strength: str
    confidence_interval: list[float]
    percentile_rank: float
    descriptors: dict


class AdmetResponse(BaseModel):
    molecule_name: str
    canonical_smiles: str
    admet: dict
    overall_admet_score: float
    lipinski_pass: bool


class FullAnalysisResponse(BaseModel):
    molecule_name: str
    canonical_smiles: str
    molecular_formula: str
    molecular_weight: float
    descriptors: dict
    lipinski_pass: bool
    lipinski_details: dict
    binding_affinity: dict
    admet: dict
    druggability: dict
    processing_time_ms: float
