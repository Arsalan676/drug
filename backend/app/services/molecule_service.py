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
    "ibuprofen": "CC(C)Cc1ccc(cc1)C(C)C(=O)O",
    "paracetamol": "CC(=O)Nc1ccc(O)cc1",
    "penicillin": "CC1(C)SC2C(NC1=O)C(=O)N2CC(=O)O",
    "morphine": "OC1=CC=C2C=CC(NCC23CCc4c3cc5CC1Oc5c4)C",
    "metformin": "CN(C)C(=N)NC(=N)N",
    "atorvastatin": "CC(C)c1c(C(=O)Nc2ccccc2F)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CCC(O)CC(O)CC(=O)O",
    "tamoxifen": "CCC(=C(c1ccccc1)c1ccc(OCCN(C)C)cc1)c1ccccc1",
    "chloroquine": "CCN(CC)CCCC(C)Nc1ccnc2cc(Cl)ccc12",
    "benzene": "c1ccccc1",
}

_SMILES_PATTERN = re.compile(r"[=#()[\]0-9\\/@+\-]")


def _looks_like_smiles(text: str) -> bool:
    return bool(_SMILES_PATTERN.search(text))


def fetch_smiles_from_pubchem_sync(name: str) -> str | None:
    import urllib.parse
    encoded = urllib.parse.quote(name)
    url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{encoded}/property/IsomericSMILES/JSON"
    try:
        with urllib.request.urlopen(url, timeout=8) as r:
            data = json.loads(r.read())
            return data["PropertyTable"]["Properties"][0]["IsomericSMILES"]
    except Exception:
        return None


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

