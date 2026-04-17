import re
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
}

_SMILES_PATTERN = re.compile(r"[=#()[\]0-9\\/@+\-]")


def _looks_like_smiles(text: str) -> bool:
    return bool(_SMILES_PATTERN.search(text))


def _mol_from_input(input_str: str, input_type: str) -> Chem.Mol:
    if input_type == "smiles":
        mol = Chem.MolFromSmiles(input_str)
        if mol is None:
            raise ValueError(f"Invalid SMILES: {input_str}")
        return mol

    if input_type == "name":
        smiles = MOLECULE_LOOKUP.get(input_str.lower())
        if smiles is None:
            raise ValueError(f"Unknown molecule name: {input_str}")
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            raise ValueError(f"Failed to parse SMILES for: {input_str}")
        return mol

    # auto
    if _looks_like_smiles(input_str):
        mol = Chem.MolFromSmiles(input_str)
        if mol is None:
            raise ValueError(f"Invalid SMILES: {input_str}")
        return mol

    smiles = MOLECULE_LOOKUP.get(input_str.lower())
    if smiles is None:
        raise ValueError(f"Unknown molecule name: {input_str}")
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"Failed to parse SMILES for: {input_str}")
    return mol


def parse_molecule(input_str: str, input_type: str = "auto") -> MoleculeInfo:
    mol = _mol_from_input(input_str, input_type)

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
    )
