import React from 'react';
import ProbabilityBar from './ProbabilityBar';

const BindingAffinityCard = ({ bindingAffinity }) => {
  const { pkd, binding_strength, confidence_interval, percentile_rank } = bindingAffinity;
  const [low, high] = confidence_interval || [0, 0];

  const strengthStyles = {
    Strong: { color: '#22c55e', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.20)' },
    Moderate: { color: '#eab308', bg: 'rgba(234,179,8,0.10)', border: 'rgba(234,179,8,0.20)' },
    Weak: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.20)' },
  };

  const currentStrengthStyle = strengthStyles[binding_strength] || strengthStyles.Moderate;

  const getPercentileColor = (percentile) => {
    if (percentile >= 75) return '#22c55e';
    if (percentile >= 50) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl p-6 w-full flex flex-col items-center">
      <span className="text-[11px] font-medium text-[#52525b] uppercase tracking-[0.08em] self-start mb-6">
        02 · BINDING AFFINITY
      </span>

      <div className="flex flex-col items-center text-center">
        <h2 className="text-[56px] font-extrabold text-[#fafafa] leading-none mb-1">
          {pkd.toFixed(1)}
        </h2>
        <span className="text-[12px] font-normal text-[#52525b]">
          pKd (Predicted)
        </span>

        <div 
          className="mt-4 text-[11px] font-medium uppercase tracking-[0.06em] rounded-full px-[10px] py-[3px]"
          style={{
            color: currentStrengthStyle.color,
            backgroundColor: currentStrengthStyle.bg,
            border: `1px solid ${currentStrengthStyle.border}`
          }}
        >
          {binding_strength}
        </div>
      </div>

      <div className="w-full h-px bg-[#1f1f22] my-4" />

      <div className="w-full space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-normal text-[#52525b]">Confidence Interval</span>
          <span className="text-[13px] font-medium text-[#a1a1aa]">[{low.toFixed(2)} – {high.toFixed(2)}]</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-normal text-[#52525b]">Percentile Rank</span>
            <span className="text-[13px] font-medium text-[#a1a1aa]">{percentile_rank}th</span>
          </div>
          <ProbabilityBar
            probability={percentile_rank / 100}
            pass={percentile_rank >= 50}
            barColor={getPercentileColor(percentile_rank)}
          />
        </div>
      </div>

      <p className="text-[11px] font-normal text-[#52525b] italic mt-6 text-center">
        Higher pKd = stronger predicted binding
      </p>
    </div>
  );
};

export default BindingAffinityCard;
