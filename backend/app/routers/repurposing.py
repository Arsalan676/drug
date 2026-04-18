import time
from fastapi import APIRouter, HTTPException

from app.models.schemas import MoleculeParseRequest, RepurposingResponse
from app.services.molecule_service import parse_molecule
from app.services.featurizer import compute_features
from app.services.prediction_service import predict_binding_affinity
from app.services.repurposing_service import analyze_repurposing
from rdkit import Chem

router = APIRouter(prefix="/repurpose", tags=["Repurposing"])

@router.post("/", response_model=RepurposingResponse)
async def repurpose(request: MoleculeParseRequest):
    t0 = time.perf_counter()

    try:
        mol_info = parse_molecule(request.input, request.input_type)
    except ValueError as e:
        msg = str(e)
        status = 404 if "not found" in msg else 422
        raise HTTPException(status_code=status, detail=msg)

    # 1. Get pKd from existing binding affinity predictor
    mol = Chem.MolFromSmiles(mol_info.canonical_smiles)
    if not mol:
        raise HTTPException(status_code=422, detail="Invalid SMILES generated")
        
    feat = compute_features(mol)
    fv = feat["feature_vector"]
    binding_result = predict_binding_affinity(fv)
    pkd = binding_result["pkd"]

    # 2. Call repurposing analysis (async)
    results = await analyze_repurposing(mol_info.canonical_smiles, pkd)

    processing_time_ms = round((time.perf_counter() - t0) * 1000, 2)

    return RepurposingResponse(
        molecule_name=request.input,
        canonical_smiles=mol_info.canonical_smiles,
        results=results,
        best_target=results[0],
        processing_time_ms=processing_time_ms
    )
