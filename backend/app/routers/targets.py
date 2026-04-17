from fastapi import APIRouter, HTTPException
from app.services.pdb_service import get_all_targets, TARGET_PROTEINS, fetch_pdb_entry

router = APIRouter(prefix="/targets", tags=["Protein Targets"])


@router.get("/")
def list_targets():
    targets = get_all_targets()
    return {"targets": targets, "total": len(targets)}


@router.get("/{target_key}")
def get_target(target_key: str):
    if target_key not in TARGET_PROTEINS:
        raise HTTPException(status_code=404, detail=f"Target '{target_key}' not found")
    meta = TARGET_PROTEINS[target_key]
    pdb_data = fetch_pdb_entry(meta["pdb_id"])
    return {**meta, "target_key": target_key, "pdb_data": pdb_data}
