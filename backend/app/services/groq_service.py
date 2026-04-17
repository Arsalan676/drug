from app.config import get_settings

_client = None


def get_groq_client():
    global _client
    if _client is None:
        settings = get_settings()
        if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your_groq_api_key_here":
            return None
        try:
            from groq import Groq
            _client = Groq(api_key=settings.GROQ_API_KEY)
        except ImportError:
            return None
    return _client


def _fallback_interpretation(analysis: dict) -> dict:
    score = analysis.get("druggability", {}).get("druggability_score", 0)
    grade = analysis.get("druggability", {}).get("grade", "N/A")
    strength = analysis.get("binding_affinity", {}).get("binding_strength", "Unknown")
    toxicity = analysis.get("admet", {}).get("toxicity", {}).get("label", "Unknown")
    admet_score = analysis.get("admet", {}).get("overall_admet_score", 0)
    drug = analysis.get("molecule_name", "This molecule")

    sentence1 = (
        f"{drug.capitalize()} shows {strength.lower()} binding affinity, "
        f"suggesting {'significant target engagement' if strength == 'Strong' else 'moderate to limited target engagement'} in silico."
    )
    sentence2 = (
        f"The ADMET profile scores {admet_score:.1f}/100 with a toxicity assessment of '{toxicity}', "
        f"indicating {'acceptable' if toxicity == 'Non-toxic' else 'potentially concerning'} safety characteristics."
    )
    sentence3 = (
        f"With an overall druggability grade of {grade} ({score}/100), "
        f"{'further lead optimization and in vitro validation are recommended' if grade in ('A','B') else 'significant structural modification or scaffold replacement should be considered'}."
    )

    return {
        "interpretation": f"{sentence1} {sentence2} {sentence3}",
        "source": "rule_based",
        "model": None,
    }


def generate_clinical_interpretation(analysis: dict) -> dict:
    client = get_groq_client()
    if client is None:
        return _fallback_interpretation(analysis)

    settings = get_settings()
    drug = analysis.get("molecule_name", "This molecule")
    score = analysis.get("druggability", {}).get("druggability_score", 0)
    grade = analysis.get("druggability", {}).get("grade", "N/A")
    pkd = analysis.get("binding_affinity", {}).get("pkd", 0)
    strength = analysis.get("binding_affinity", {}).get("binding_strength", "Unknown")
    admet_score = analysis.get("admet", {}).get("overall_admet_score", 0)
    toxicity = analysis.get("admet", {}).get("toxicity", {}).get("label", "Unknown")
    absorption = analysis.get("admet", {}).get("absorption", {}).get("label", "Unknown")
    mw = analysis.get("molecular_weight", 0)
    logp = analysis.get("descriptors", {}).get("LogP", 0)
    lipinski = analysis.get("lipinski_pass", False)
    chembl_phase = analysis.get("chembl_data", {}).get("phase_label", "Unknown")

    prompt = f"""You are a medicinal chemistry expert providing a brief clinical assessment.
Given the following AI-computed drug analysis data, write exactly 3 sentences:
1. Sentence 1: Assess the binding affinity and what it means clinically.
2. Sentence 2: Comment on the ADMET profile and safety.
3. Sentence 3: Give a recommendation for next steps.

Data:
- Drug: {drug}
- Druggability Score: {score}/100 (Grade {grade})
- Binding Affinity: pKd={pkd:.2f} ({strength} binding)
- ADMET Score: {admet_score:.1f}/100
- Toxicity: {toxicity}
- Absorption: {absorption}
- Molecular Weight: {mw:.1f} Da
- LogP: {logp:.2f}
- Lipinski's Rule of Five: {"Pass" if lipinski else "Fail"}
- Clinical Stage (ChEMBL): {chembl_phase}

Write in professional but accessible language. Be specific. Maximum 3 sentences total."""

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=200,
        )
        text = response.choices[0].message.content.strip()
        return {"interpretation": text, "source": "groq", "model": settings.GROQ_MODEL}
    except Exception:
        return _fallback_interpretation(analysis)
