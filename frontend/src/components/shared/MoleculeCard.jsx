import React, { useState, useEffect } from 'react';
import MoleculeViewer3D from './MoleculeViewer3D';

const MoleculeCard = ({ moleculeData }) => {
  const [sdfData, setSdfData] = useState(null);
  const [is3DLoading, setIs3DLoading] = useState(false);

  useEffect(() => {
    if (moleculeData?.canonical_smiles) {
      fetch3DStructure(moleculeData.canonical_smiles);
    }
  }, [moleculeData?.canonical_smiles]);

  const fetch3DStructure = async (smiles) => {
    setIs3DLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/structure/3d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ smiles }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSdfData(data.sdf || '');
      }
    } catch (error) {
      console.error('Failed to fetch 3D structure:', error);
    } finally {
      setIs3DLoading(false);
    }
  };

  return (
    <div className="bg-[#1c1b1d] p-6 flex flex-col h-full border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">Molecular Identity</h3>
        <span className="material-symbols-outlined text-neutral-600">fingerprint</span>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <label className="font-mono text-[10px] text-neutral-500 mb-2 block uppercase">SMILES Notation</label>
          <div className="bg-[#2a2a2c] p-4 font-mono text-xs text-white break-all leading-loose border border-white/5 rounded-sm">
            {moleculeData?.canonical_smiles || 'N/A'}
          </div>
        </div>

        <div>
          <label className="font-mono text-[11px] font-medium text-[#52525b] uppercase tracking-wider mb-2 block">
            3D Conformation
          </label>
          <MoleculeViewer3D 
            sdfData={sdfData} 
            isLoading={is3DLoading} 
          />
        </div>

        <div>
          <label className="font-mono text-[10px] text-neutral-500 mb-2 block uppercase">Molecular Weight</label>
          <div className="flex gap-4 items-center">
            <div className="flex-1 h-1 bg-[#353437] rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000" 
                style={{ width: `${Math.min((moleculeData?.mw || 0) / 5, 100)}%` }}
              ></div>
            </div>
            <span className="font-mono text-[10px] text-white">
              {moleculeData?.mw ? `${moleculeData.mw.toFixed(1)} g/mol` : '---'}
            </span>
          </div>
        </div>
      </div>

      <button className="mt-8 w-full border border-white/20 py-3 text-white font-mono text-[11px] tracking-widest hover:bg-white hover:text-black transition-all uppercase font-bold">
        Run Structural Audit
      </button>
    </div>
  );
};

export default MoleculeCard;
