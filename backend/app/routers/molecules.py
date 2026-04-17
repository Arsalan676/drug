from fastapi import APIRouter, HTTPException
from rdkit import Chem

from app.models.schemas import MoleculeParseRequest, MoleculeInfo, FeaturizeResponse
from app.services.molecule_service import parse_molecule
from app.services.featurizer import compute_features

router = APIRouter(prefix="/molecules", tags=["Molecules"])


@router.post("/parse", response_model=MoleculeInfo)
def parse(request: MoleculeParseRequest):
    try:
        return parse_molecule(request.input, request.input_type)
    except ValueError as e:
        msg = str(e)
        status = 404 if "not found" in msg else 422
        raise HTTPException(status_code=status, detail=msg)


@router.post("/featurize", response_model=FeaturizeResponse)
def featurize(request: MoleculeParseRequest):
    try:
        mol_info = parse_molecule(request.input, request.input_type)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    mol = Chem.MolFromSmiles(mol_info.canonical_smiles)
    feat = compute_features(mol)

    return FeaturizeResponse(
        descriptors=feat["descriptors"],
        feature_dim=feat["feature_dim"],
        morgan_fp_bits_set=int(sum(feat["morgan_fp"])),
    )
