from fastapi import APIRouter, HTTPException
from rdkit import Chem

from app.models.schemas import MoleculeParseRequest, BindingAffinityResponse, AdmetResponse
from app.services.molecule_service import parse_molecule
from app.services.featurizer import compute_features
from app.services.prediction_service import predict_binding_affinity, predict_admet

router = APIRouter(prefix="/predict", tags=["Predictions"])


def _get_feature_vector(request: MoleculeParseRequest):
    try:
        mol_info = parse_molecule(request.input, request.input_type)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    mol = Chem.MolFromSmiles(mol_info.canonical_smiles)
    feat = compute_features(mol)
    return mol_info, feat


@router.post("/binding", response_model=BindingAffinityResponse)
def binding(request: MoleculeParseRequest):
    mol_info, feat = _get_feature_vector(request)
    result = predict_binding_affinity(feat["feature_vector"])

    return BindingAffinityResponse(
        molecule_name=request.input,
        canonical_smiles=mol_info.canonical_smiles,
        pkd=result["pkd"],
        binding_strength=result["binding_strength"],
        confidence_interval=result["confidence_interval"],
        percentile_rank=result["percentile_rank"],
        descriptors=feat["descriptors"],
    )


@router.post("/admet", response_model=AdmetResponse)
def admet(request: MoleculeParseRequest):
    mol_info, feat = _get_feature_vector(request)
    result = predict_admet(feat["feature_vector"])

    return AdmetResponse(
        molecule_name=request.input,
        canonical_smiles=mol_info.canonical_smiles,
        admet=result,
        overall_admet_score=result["overall_admet_score"],
        lipinski_pass=mol_info.lipinski_pass,
    )
