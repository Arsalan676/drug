import React, { useState } from 'react';
import Layout from '../components/shared/Layout';
import { API_BASE as API_BASE_URL } from '../config';

const PropertyRow = ({ label, val1, val2, highBetter = true, isPercent = false }) => {
  const getHighlight = (v1, v2) => {
    if (v1 === v2) return '';
    if (highBetter) {
      return v1 > v2 ? 'text-green-400 font-bold' : 'text-red-400';
    } else {
      return v1 < v2 ? 'text-green-400 font-bold' : 'text-red-400';
    }
  };

  return (
    <div className="grid grid-cols-3 border-b border-white/5 py-4 px-6 items-center">
      <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">{label}</div>
      <div className={`text-center font-mono text-sm ${getHighlight(val1, val2)}`}>
        {val1 ?? '—'}{isPercent && val1 != null ? '%' : ''}
      </div>
      <div className={`text-center font-mono text-sm ${getHighlight(val2, val1)}`}>
        {val2 ?? '—'}{isPercent && val2 != null ? '%' : ''}
      </div>
    </div>
  );
};

const MoleculeComparator = () => {
  const [mol1, setMol1] = useState(null);
  const [mol2, setMol2] = useState(null);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const fetchMol = async (input, setMol, setLoading) => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analyze/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      if (res.ok) {
        const data = await res.json();
        setMol(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto bg-[#131315] relative min-h-0">
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 px-8 py-12 max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-[0.3em] mb-4 block">
              Comparative Analysis / Dual Stream
            </span>
            <h1 className="text-4xl font-bold tracking-tighter uppercase text-white">Molecule Comparator</h1>
          </div>

          {/* Input Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              { id: 1, val: input1, setter: setInput1, fetch: () => fetchMol(input1, setMol1, setLoading1), loading: loading1, data: mol1 },
              { id: 2, val: input2, setter: setInput2, fetch: () => fetchMol(input2, setMol2, setLoading2), loading: loading2, data: mol2 }
            ].map((slot) => (
              <div key={slot.id} className="bg-[#1c1b1d] border border-white/5 p-6 rounded-sm shadow-2xl">
                <div className="flex gap-2">
                  <input
                    value={slot.val}
                    onChange={(e) => slot.setter(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && slot.fetch()}
                    placeholder="Enter Molecule Name or SMILES..."
                    className="flex-1 bg-black/40 border border-white/10 px-4 py-3 font-mono text-sm text-white outline-none focus:border-white/30"
                  />
                  <button
                    onClick={slot.fetch}
                    disabled={slot.loading}
                    className="bg-white text-black px-6 py-3 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50"
                  >
                    {slot.loading ? '...' : 'LOAD'}
                  </button>
                </div>
                {slot.data && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <h3 className="text-xl font-bold text-white uppercase truncate">{slot.data.molecule_name}</h3>
                    <p className="text-[10px] font-mono text-neutral-500 truncate mt-1">{slot.data.canonical_smiles}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {(mol1 || mol2) && (
            <div className="bg-[#1c1b1d] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
              <div className="grid grid-cols-3 bg-white/5 border-b border-white/10 px-6 py-4">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">Parameter</div>
                <div className="text-center text-[11px] font-mono text-white uppercase tracking-widest font-bold">Molecule A</div>
                <div className="text-center text-[11px] font-mono text-white uppercase tracking-widest font-bold">Molecule B</div>
              </div>

              {/* General Metrics */}
              <div className="bg-white/[0.02] px-6 py-2 border-b border-white/5">
                <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Global Stability</span>
              </div>
              <PropertyRow label="Druggability" val1={mol1?.druggability?.druggability_score} val2={mol2?.druggability?.druggability_score} />
              <PropertyRow label="Binding Affinity" val1={mol1?.binding_affinity?.pkd} val2={mol2?.binding_affinity?.pkd} />
              <PropertyRow label="ADMET Score" val1={mol1?.admet?.overall_admet_score} val2={mol2?.admet?.overall_admet_score} isPercent />

              {/* Molecular Properties */}
              <div className="bg-white/[0.02] px-6 py-2 border-b border-white/5 mt-4">
                <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Physical Chemistry</span>
              </div>
              <PropertyRow label="Molecular Weight" val1={mol1?.molecular_properties?.molecular_weight} val2={mol2?.molecular_properties?.molecular_weight} highBetter={false} />
              <PropertyRow label="LogP (Hydrophobicity)" val1={mol1?.molecular_properties?.logP} val2={mol2?.molecular_properties?.logP} highBetter={false} />
              <PropertyRow label="TPSA" val1={mol1?.molecular_properties?.tpsa} val2={mol2?.molecular_properties?.tpsa} highBetter={false} />
              <PropertyRow label="Rotatable Bonds" val1={mol1?.molecular_properties?.rotatable_bonds} val2={mol2?.molecular_properties?.rotatable_bonds} highBetter={false} />

              {/* ADMET Details */}
              <div className="bg-white/[0.02] px-6 py-2 border-b border-white/5 mt-4">
                <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">PHARMACOKINETICS</span>
              </div>
              <PropertyRow label="Absorption" val1={mol1?.admet?.absorption?.score ? mol1.admet.absorption.score * 100 : null} val2={mol2?.admet?.absorption?.score ? mol2.admet.absorption.score * 100 : null} isPercent />
              <PropertyRow label="Toxicity Risk" val1={mol1?.admet?.toxicity?.score ? mol1.admet.toxicity.score * 100 : null} val2={mol2?.admet?.toxicity?.score ? mol2.admet.toxicity.score * 100 : null} highBetter={false} isPercent />
            </div>
          )}

          {!mol1 && !mol2 && (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/5 bg-white/[0.01]">
              <span className="material-symbols-outlined text-neutral-700 text-4xl mb-4">compare_arrows</span>
              <p className="font-mono text-xs text-neutral-600 uppercase tracking-widest leading-relaxed text-center px-12">
                Awaiting input stream... <br/> Load two molecules to initiate structural comparison
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MoleculeComparator;
