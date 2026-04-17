import time
from fastapi import APIRouter, HTTPException
from rdkit import Chem

from app.models.schemas import MoleculeParseRequest, FullAnalysisResponse
from app.services.molecule_service import parse_molecule, MOLECULE_LOOKUP
from app.services.featurizer import compute_features
from app.services.prediction_service import (
    predict_binding_affinity,
    predict_admet,
    compute_druggability_score,
)
from app.services.chembl_service import fetch_chembl_data
from app.services.groq_service import generate_clinical_interpretation

router = APIRouter(prefix="/analyze", tags=["Analysis"])


@router.get("/molecules")
def list_molecules():
    return {"molecules": list(MOLECULE_LOOKUP.keys())}


@router.post("/", response_model=FullAnalysisResponse)
def analyze(request: MoleculeParseRequest):
    t0 = time.perf_counter()

    try:
        mol_info = parse_molecule(request.input, request.input_type)
    except ValueError as e:
        msg = str(e)
        status = 404 if "not found" in msg else 422
        raise HTTPException(status_code=status, detail=msg)

    mol = Chem.MolFromSmiles(mol_info.canonical_smiles)
    feat = compute_features(mol)
    fv = feat["feature_vector"]

    binding_result = predict_binding_affinity(fv)
    admet_result = predict_admet(fv)
    druggability_result = compute_druggability_score(binding_result, admet_result, mol_info.lipinski_pass)

    try:
        chembl_data = fetch_chembl_data(request.input)
    except Exception:
        from app.services.chembl_service import _empty_chembl
        chembl_data = _empty_chembl()

    full_response_dict = {
        "molecule_name": request.input,
        "molecular_weight": mol_info.molecular_weight,
        "descriptors": feat["descriptors"],
        "lipinski_pass": mol_info.lipinski_pass,
        "binding_affinity": binding_result,
        "admet": admet_result,
        "druggability": druggability_result,
        "chembl_data": chembl_data,
    }
    ai_interpretation = generate_clinical_interpretation(full_response_dict)

    processing_time_ms = round((time.perf_counter() - t0) * 1000, 2)

    return FullAnalysisResponse(
        molecule_name=request.input,
        canonical_smiles=mol_info.canonical_smiles,
        molecular_formula=mol_info.molecular_formula,
        molecular_weight=mol_info.molecular_weight,
        descriptors=feat["descriptors"],
        lipinski_pass=mol_info.lipinski_pass,
        lipinski_details={
            "mw": mol_info.molecular_weight,
            "logp": mol_info.logp,
            "hbd": mol_info.num_hbd,
            "hba": mol_info.num_hba,
        },
        binding_affinity=binding_result,
        admet=admet_result,
        druggability=druggability_result,
        chembl_data=chembl_data,
        ai_interpretation=ai_interpretation,
        processing_time_ms=processing_time_ms,
    )
