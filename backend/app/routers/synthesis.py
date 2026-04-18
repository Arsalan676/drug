import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import settings
from app.services.rxn_service import predict_retrosynthesis_sync
from app.services.molecule_service import parse_molecule

router = APIRouter(prefix="/synthesis", tags=["Synthesis"])


class SynthesisRequest(BaseModel):
    input: str
    steps: int = 3


@router.post("/predict")
def predict_synthesis(request: SynthesisRequest):
    if not settings.IBM_RXN_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="IBM_RXN_API_KEY not configured. Add it to your .env file.",
        )

    t0 = time.perf_counter()

    try:
        mol_info = parse_molecule(request.input)
        smiles = mol_info.canonical_smiles
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    try:
        result = predict_retrosynthesis_sync(smiles, settings.IBM_RXN_API_KEY, request.steps)
    except TimeoutError:
        raise HTTPException(status_code=504, detail="IBM RXN prediction timed out after 90s")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"IBM RXN error: {str(e)}")

    result["molecule_name"] = request.input
    result["processing_time_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    return result
