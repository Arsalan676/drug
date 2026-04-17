import re
import json
import urllib.request
from rdkit import Chem
from rdkit.Chem import Descriptors, Crippen, rdMolDescriptors
from rdkit.Chem.inchi import MolToInchiKey

from app.models.schemas import MoleculeInfo

MOLECULE_LOOKUP = {
    "aspirin": "CC(=O)Oc1ccccc1C(=O)O",
    "caffeine": "Cn1cnc2c1c(=O)n(c(=O)n2C)C",
    "benzene": "c1ccccc1",
    "ibuprofen": "CC(C)Cc1ccc(cc1)C(C)C(=O)O",
    "paracetamol": "CC(=O)Nc1ccc(O)cc1",
}

_SMILES_PATTERN = re.compile(r"[=#()[\]0-9\\/@+\-]")


def _looks_like_smiles(text: str) -> bool:
    return bool(_SMILES_PATTERN.search(text))


def fetch_smiles_from_pubchem_sync(name: str) -> str | None:
    import urllib.parse
    import ssl
    encoded = urllib.parse.quote(name)
    url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{encoded}/property/IsomericSMILES/JSON"

    # Bypass SSL verification — needed on macOS where system certs may not be installed
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'DrugDiscoveryApp/1.0'})
        with urllib.request.urlopen(req, timeout=12, context=ctx) as r:
            data = json.loads(r.read())
            props = data["PropertyTable"]["Properties"][0]
            return props.get("IsomericSMILES") or props.get("SMILES")
    except Exception as e:
        print(f"PubChem lookup failed for '{name}': {e}")
        return None


def calculate_qed_score(mol: Chem.Mol) -> float:
    from rdkit.Chem import QED
    try:
        return round(float(QED.qed(mol)), 3)
    except Exception:
        return 0.5


def calculate_sas_score(mol: Chem.Mol) -> float:
    # Sascore is usually a contrib script, we'll use a robust heuristic 
    # based on rings, chiral centers and heavy atoms as a proxy if sascore isn't available
    from rdkit.Chem import rdMolDescriptors
    try:
        num_rings = rdMolDescriptors.CalcNumRings(mol)
        num_chiral = len(Chem.FindMolChiralCenters(mol, includeUnassigned=True))
        weight = mol.GetNumHeavyAtoms()
        # Heuristic: base 3 + complexity factors
        score = 2.0 + (num_rings * 0.5) + (num_chiral * 0.8) + (weight * 0.05)
        return round(min(10.0, max(1.0, score)), 2)
    except Exception:
        return 5.0


def _build_mol_info(mol: Chem.Mol, source: str) -> MoleculeInfo:
    mw = round(Descriptors.MolWt(mol), 2)
    logp = round(Crippen.MolLogP(mol), 2)
    hbd = Descriptors.NumHDonors(mol)
    hba = Descriptors.NumHAcceptors(mol)
    return MoleculeInfo(
        canonical_smiles=Chem.MolToSmiles(mol),
        molecular_formula=rdMolDescriptors.CalcMolFormula(mol),
        molecular_weight=mw,
        num_atoms=mol.GetNumAtoms(),
        num_rings=rdMolDescriptors.CalcNumRings(mol),
        num_hbd=hbd,
        num_hba=hba,
        logp=logp,
        inchi_key=MolToInchiKey(mol) or "",
        lipinski_pass=(mw < 500 and logp < 5 and hbd <= 5 and hba <= 10),
        qed_score=calculate_qed_score(mol),
        sa_score=calculate_sas_score(mol),
        source=source,
    )


def parse_molecule(input_str: str, input_type: str = "auto") -> MoleculeInfo:
    # SMILES input
    if input_type == "smiles" or (input_type == "auto" and _looks_like_smiles(input_str)):
        mol = Chem.MolFromSmiles(input_str)
        if mol is None:
            raise ValueError(f"Invalid SMILES: {input_str}")
        return _build_mol_info(mol, source="smiles_input")

    # Name resolution
    name_lower = input_str.lower()
    local_smiles = MOLECULE_LOOKUP.get(name_lower)
    if local_smiles:
        mol = Chem.MolFromSmiles(local_smiles)
        print(f"Resolved '{input_str}' via local dict")
        return _build_mol_info(mol, source="local")

    if input_type == "name" or input_type == "auto":
        smiles = fetch_smiles_from_pubchem_sync(input_str)
        if smiles:
            mol = Chem.MolFromSmiles(smiles)
            if mol is None:
                raise ValueError(f"PubChem returned unparseable SMILES for: {input_str}")
            print(f"Resolved '{input_str}' via PubChem")
            return _build_mol_info(mol, source="pubchem")

    raise ValueError(f"Molecule '{input_str}' not found in PubChem or local database")


def generate_3d_sdf(smiles: str) -> str:
    from rdkit.Chem import rdDistGeom, rdForceFieldHelpers
    mol = Chem.MolFromSmiles(smiles)
    if not mol:
        raise ValueError("Invalid SMILES for 3D generation")
    
    mol = Chem.AddHs(mol)
    rdDistGeom.EmbedMolecule(mol, rdDistGeom.ETKDG())
    rdForceFieldHelpers.MMFFOptimizeMolecule(mol)
    
    import io
    output = io.StringIO()
    writer = Chem.SDWriter(output)
    writer.write(mol)
    writer.close()
    return output.getvalue()

