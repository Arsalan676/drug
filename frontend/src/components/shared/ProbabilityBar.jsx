import React from 'react';

const ProbabilityBar = ({
  label,
  probability,
  pass,
  badgeText,
  barColor,
}) => {
  const successColor = '#22c55e';
  const failureColor = '#ef4444';
  
  const currentColor = barColor || (pass ? successColor : failureColor);
  
  const badgeStyle = {
    background: pass ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)',
    color: pass ? successColor : failureColor,
    border: `1px solid ${pass ? 'rgba(34,197,94,0.20)' : 'rgba(239,68,68,0.20)'}`,
  };

  const fillStyle = {
    backgroundColor: currentColor,
    width: `${Math.min(probability * 100, 100)}%`,
    transition: 'width 600ms ease',
  };

  return (
    <div className="w-full">
      {(label || badgeText) && (
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#fafafa]">{label}</span>
          <span 
            className="text-[11px] font-medium uppercase tracking-[0.06em] rounded-full px-[10px] py-[3px]"
            style={badgeStyle}
          >
            {badgeText}
          </span>
        </div>
      )}
      <div className={`w-full h-[6px] bg-[#27272a] rounded-full ${(label || badgeText) ? 'mt-2' : ''}`}>
        <div 
          className="h-[6px] rounded-full"
          style={fillStyle}
        />
      </div>
    </div>
  );
};

export default ProbabilityBar;
