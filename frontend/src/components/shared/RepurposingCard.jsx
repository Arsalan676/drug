import React from 'react';

const RepurposingCard = ({ results, bestTarget, moleculeName }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl p-8 w-full shadow-2xl relative overflow-hidden group">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[13px] font-mono font-medium text-neutral-400 uppercase tracking-[0.2em] mb-1.5 block">
              Repurposing Candidates / Target Profiling
            </span>
            <h2 className="text-2xl font-bold text-[#fafafa] tracking-tight">
              {moleculeName} <span className="text-neutral-500">Analysis</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
              Live ChEMBL API
            </span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[11px] font-mono text-blue-400 uppercase tracking-widest">
              Tanimoto Max
            </span>
          </div>
        </div>

        {/* Best Target Highlight */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between group/hero hover:border-white/20 transition-all">
          <div className="flex gap-5 items-center">
            <div className="w-16 h-16 bg-white flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-black text-3xl font-light">target</span>
            </div>
            <div>
              <p className="text-[11px] font-mono text-blue-400 uppercase tracking-widest mb-1">Top Therapeutic Indication</p>
              <h3 className="text-xl font-bold text-[#fafafa] mb-1">{bestTarget.disease}</h3>
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-mono text-neutral-400 uppercase">{bestTarget.name}</span>
                <span className="w-1 h-1 bg-neutral-600 rounded-full" />
                <span className="text-[14px] font-mono text-neutral-400 uppercase">PDB: {bestTarget.pdb_id}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center gap-8">
            <div className="text-center">
              <p className="text-[12px] font-mono text-neutral-400 uppercase tracking-widest mb-1">Confidence</p>
              <div className={`px-3 py-1 rounded-sm text-[11px] font-mono font-bold uppercase tracking-widest ${
                bestTarget.confidence === 'High' ? 'bg-green-500/10 text-green-400' :
                bestTarget.confidence === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-orange-500/10 text-orange-400'
              }`}>
                {bestTarget.confidence}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-mono text-neutral-400 uppercase tracking-widest mb-1">Compatibility Score</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black tracking-tighter ${
                  bestTarget.repurposing_score >= 70 ? 'text-green-400' :
                  bestTarget.repurposing_score >= 50 ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {bestTarget.repurposing_score.toFixed(1)}
                </span>
                <span className="text-lg font-bold text-neutral-500">/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-[#1f1f22] mb-8" />

        {/* Ranked Targets List */}
        <div className="space-y-3">
          {results.map((target) => (
            <div 
              key={target.target_key} 
              className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-default group/row"
            >
              <span className="font-mono text-[14px] text-neutral-400 w-6">0{target.rank}</span>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[16px] font-bold text-[#fafafa]">{target.name}</span>
                  <span className="px-2 py-0.5 bg-white/5 rounded text-[11px] font-mono text-neutral-400 uppercase">{target.disease}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-[3px] bg-[#27272a] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000" 
                      style={{ width: `${target.tanimoto_similarity * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-mono text-neutral-400 uppercase">
                    Similarity: {(target.tanimoto_similarity * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-2 py-1 rounded text-[11px] font-mono font-bold ${
                  target.repurposing_score >= 70 ? 'text-green-400' :
                  target.repurposing_score >= 50 ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {target.repurposing_score.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[13px] text-neutral-400 italic font-mono uppercase tracking-wider text-center">
            Composite Score Algorithm = Binding Affinity (60%) + Structural Similarity to {results[0]?.ligands_fetched || 'N/A'} Known Inhibitors (40%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default RepurposingCard;
