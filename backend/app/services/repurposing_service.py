import asyncio
import logging
import httpx
from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit import DataStructs

logger = logging.getLogger(__name__)

REPURPOSING_TARGETS = {
    "covid_protease": {
        "name": "COVID-19 Main Protease",
        "disease": "COVID-19",
        "chembl_target_id": "CHEMBL3927143",
        "pdb_id": "6LU7"
    },
    "cancer_bcr_abl": {
        "name": "BCR-ABL Kinase",
        "disease": "Chronic Myeloid Leukemia",
        "chembl_target_id": "CHEMBL1862",
        "pdb_id": "2HYY"
    },
    "alzheimers_ace": {
        "name": "Acetylcholinesterase",
        "disease": "Alzheimer's Disease",
        "chembl_target_id": "CHEMBL220",
        "pdb_id": "1EVE"
    },
    "diabetes_dpp4": {
        "name": "DPP-4 Inhibitor",
        "disease": "Type 2 Diabetes",
        "chembl_target_id": "CHEMBL284",
        "pdb_id": "2I78"
    }
}

_ligand_cache: dict[str, list[str]] = {}

async def fetch_chembl_ligands(chembl_target_id: str) -> list[str]:
    """Fetch known active ligands for a ChEMBL target."""
    if chembl_target_id in _ligand_cache:
        return _ligand_cache[chembl_target_id]

    url = f"https://www.ebi.ac.uk/chembl/api/data/activity.json?target_chembl_id={chembl_target_id}&standard_type=IC50&standard_value__lte=10000&limit=30&format=json"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            smiles_list = []
            for activity in data.get("activities", []):
                smiles = activity.get("canonical_smiles")
                if smiles:
                    smiles_list.append(smiles)
            
            # Use set to dedup then back to list
            smiles_list = list(set(smiles_list))[:30]
            _ligand_cache[chembl_target_id] = smiles_list
            return smiles_list
            
    except Exception as e:
        logger.warning(f"Failed to fetch ligands for {chembl_target_id}: {e}")
        return []

def compute_tanimoto(query_smiles: str, ligand_smiles_list: list[str]) -> float:
    """Compute maximum Tanimoto similarity between query and a list of ligands."""
    if not ligand_smiles_list:
        return 0.0

    query_mol = Chem.MolFromSmiles(query_smiles)
    if not query_mol:
        return 0.0
    
    query_fp = AllChem.GetMorganFingerprintAsBitVect(query_mol, 2, nBits=2048)
    
    max_similarity = 0.0
    for smile in ligand_smiles_list:
        try:
            mol = Chem.MolFromSmiles(smile)
            if not mol:
                continue
            fp = AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=2048)
            sim = DataStructs.TanimotoSimilarity(query_fp, fp)
            if sim > max_similarity:
                max_similarity = sim
        except:
            continue
            
    return round(max_similarity, 3)

def get_confidence_label(tanimoto: float) -> str:
    if tanimoto >= 0.5:
        return "High"
    elif tanimoto >= 0.3:
        return "Medium"
    else:
        return "Low"

def compute_repurposing_score(pkd: float, tanimoto: float) -> float:
    # Combined score 0-100: pkd (scaled 0-10) is 60%, tanimoto (0-1) is 40%
    combined = (pkd / 10.0) * 0.6 + tanimoto * 0.4
    return round(combined * 100, 1)

async def analyze_repurposing(smiles: str, pkd: float) -> list[dict]:
    tasks = []
    for target_key, info in REPURPOSING_TARGETS.items():
        tasks.append(process_target(target_key, info, smiles, pkd))
    
    results = await asyncio.gather(*tasks)
    
    # Sort by score descending
    results.sort(key=lambda x: x["repurposing_score"], reverse=True)
    
    # Add rank
    for i, res in enumerate(results):
        res["rank"] = i + 1
        
    return results

async def process_target(target_key: str, info: dict, smiles: str, pkd: float) -> dict:
    ligands = await fetch_chembl_ligands(info["chembl_target_id"])
    tanimoto = compute_tanimoto(smiles, ligands)
    confidence = get_confidence_label(tanimoto)
    score = compute_repurposing_score(pkd, tanimoto)
    
    return {
        "target_key": target_key,
        "name": info["name"],
        "disease": info["disease"],
        "pdb_id": info["pdb_id"],
        "pkd": pkd,
        "tanimoto_similarity": tanimoto,
        "confidence": confidence,
        "repurposing_score": score,
        "ligands_fetched": len(ligands)
    }
