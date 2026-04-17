from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.molecule_service import generate_3d_sdf

router = APIRouter(prefix="/structure", tags=["Structure"])

class Structure3DRequest(BaseModel):
    smiles: str

@router.post("/3d")
def get_3d_structure(request: Structure3DRequest):
    try:
        sdf = generate_3d_sdf(request.smiles)
        return {"sdf": sdf}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
