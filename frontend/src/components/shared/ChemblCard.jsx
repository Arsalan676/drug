import React from 'react';

const ChemblCard = ({ chemblData }) => {
  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl p-6 w-full flex flex-col">
      <span className="text-[13px] font-medium text-neutral-400 uppercase tracking-[0.08em] mb-6">
        05 · CH-EMBL CONTEXT
      </span>
      
      <div className="flex-1 flex flex-col gap-5">
        <div>
          <span className="font-mono text-[11px] text-neutral-400 uppercase">Similar Ligands</span>
          <div className="flex gap-1.5 mt-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 h-10 bg-[#1c1b1d] border border-white/5 flex items-center justify-center rounded-sm">
                <span className="text-[10px] text-neutral-600 font-mono">L-{i}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-neutral-400">Database Matches</span>
            <span className="text-[15px] font-mono text-white">{chemblData?.matches || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-neutral-400">IC50 Mean (nM)</span>
            <span className="text-[15px] font-mono text-white">{chemblData?.ic50_mean || '---'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-neutral-400">Target Selectivity</span>
            <span className="text-[15px] font-mono text-white">{chemblData?.selectivity || 'High'}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-6 border-t border-white/5">
        <button className="w-full py-2 bg-[#1c1b1d] hover:bg-[#27272a] text-[12px] text-neutral-400 uppercase font-bold tracking-widest transition-colors">
          View ChEMBL Record
        </button>
      </div>
    </div>
  );
};

export default ChemblCard;
