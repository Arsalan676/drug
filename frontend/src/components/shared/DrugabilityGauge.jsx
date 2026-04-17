import React from 'react';

const DrugabilityGauge = ({ score, grade }) => {
  const gradeColors = {
    A: '#22c55e',
    B: '#eab308',
    C: '#f97316',
    D: '#ef4444',
  };

  const gradeColor = gradeColors[grade] || gradeColors.A;
  const radius = 52;
  const circumference = 2 * Math.PI * radius; // 326.73

  const validScore = typeof score === 'number' && !isNaN(score) ? score : 0;

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 120 120" width={120} height={120}>
        {/* Background ring */}
        <circle
          cx={60}
          cy={60}
          r={radius}
          stroke="#27272a"
          strokeWidth={8}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx={60}
          cy={60}
          r={radius}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - validScore / 100)}
          stroke={gradeColor}
          style={{ transition: 'stroke-dashoffset 800ms ease' }}
        />
        {/* Center text */}
        <text
          x={60}
          y={65}
          textAnchor="middle"
          fontSize={24}
          fontWeight={800}
          fill="#fafafa"
          fontFamily="Inter, sans-serif"
        >
          {validScore}
        </text>
      </svg>
    </div>
  );
};

export default DrugabilityGauge;
