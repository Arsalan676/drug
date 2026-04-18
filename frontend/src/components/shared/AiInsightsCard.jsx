import React from 'react';

const AiInsightsCard = ({ aiInterpretation, processingTime }) => {
  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[13px] font-medium text-neutral-400 uppercase tracking-[0.08em]">
          06 · AI SYNTHESIS INSIGHTS
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="font-mono text-[12px] text-neutral-400">
            Processed in {processingTime || 0}ms
          </span>
        </div>
      </div>
      
      <div className="bg-[#18181b] border-l-2 border-white/20 p-6">
        <p className="text-[17px] leading-relaxed text-[#fafafa] font-normal italic">
          "{aiInterpretation?.interpretation || aiInterpretation || 'Analysis complete. Generating structural insights...'}"
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-[#1c1b1d] border border-white/5 rounded-lg">
          <span className="font-mono text-[11px] text-neutral-400 uppercase">Primary Recommendation</span>
          <p className="text-[15px] text-white font-medium mt-1">Advance to Docking</p>
        </div>
        <div className="p-4 bg-[#1c1b1d] border border-white/5 rounded-lg">
          <span className="font-mono text-[11px] text-neutral-400 uppercase">Optimization Path</span>
          <p className="text-[15px] text-white font-medium mt-1">Reduction of polar surface area</p>
        </div>
        <div className="p-4 bg-[#1c1b1d] border border-white/5 rounded-lg">
          <span className="font-mono text-[11px] text-neutral-400 uppercase">Risk Assessment</span>
          <p className="text-[15px] text-white font-medium mt-1">Minor hERG liability detected</p>
        </div>
      </div>
    </div>
  );
};

export default AiInsightsCard;
