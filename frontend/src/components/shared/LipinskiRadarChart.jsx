import React from 'react';

const LipinskiRadarChart = ({ descriptors, lipinski_details, lipinski_pass }) => {
  if (!descriptors || !lipinski_details) return null;

  // 1. Data Processing & Normalization
  const mw = descriptors.molecular_weight || 0;
  const logp = descriptors.logp || 0;
  const hbd = lipinski_details.hbd || 0;
  const hba = lipinski_details.hba || 0;
  const tpsa = descriptors.tpsa || 0;

  const normalize = {
    MW: (val) => val / 500,
    LogP: (val) => Math.abs(val) / 5,
    HBD: (val) => val / 5,
    HBA: (val) => val / 10,
    TPSA: (val) => val / 140,
  };

  const rawValues = { MW: mw, LogP: logp, HBD: hbd, HBA: hba, TPSA: tpsa };
  const normalizedValues = {
    MW: Math.min(1.5, normalize.MW(mw)),
    LogP: Math.min(1.5, normalize.LogP(logp)),
    HBD: Math.min(1.5, normalize.HBD(hbd)),
    HBA: Math.min(1.5, normalize.HBA(hba)),
    TPSA: Math.min(1.5, normalize.TPSA(tpsa)),
  };

  // 2. SVG Geometry Settings
  const cx = 200;
  const cy = 200;
  const maxRadius = 140; // 1.0 normalized value = 140px

  const axes = [
    { key: 'MW', label: 'MW', val: mw, unit: ' Da', limit: '≤ 500', angle: -90 },
    { key: 'LogP', label: 'LogP', val: logp, unit: '', limit: '≤ 5', angle: -18 },
    { key: 'HBD', label: 'HBD', val: hbd, unit: '', limit: '≤ 5', angle: 54 },
    { key: 'HBA', label: 'HBA', val: hba, unit: '', limit: '≤ 10', angle: 126 },
    { key: 'TPSA', label: 'TPSA', val: tpsa, unit: ' Å²', limit: '≤ 140', angle: 198 },
  ];

  const getXY = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  // 3. Coordinate Generation
  const ringLevels = [0.33, 0.66, 1.0];
  const gridRings = ringLevels.map(level => 
    axes.map(axis => getXY(axis.angle, level * maxRadius))
  );

  const idealPoints = axes.map(axis => getXY(axis.angle, maxRadius))
    .map(p => `${p.x},${p.y}`).join(' ');

  const moleculePoints = axes.map(axis => getXY(axis.angle, normalizedValues[axis.key] * maxRadius))
    .map(p => `${p.x},${p.y}`).join(' ');

  const labelOffset = 30; // Further beyond maxRadius

  // 4. Style & Colors
  const activeColor = lipinski_pass ? '#22c55e' : '#ef4444';
  const activeFill = lipinski_pass ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';

  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl p-6 w-full shadow-2xl overflow-hidden flex flex-col items-center">
      <style>
        {`
          @keyframes radarFadeIn {
            from { opacity: 0; transform: scale(0.8); transform-origin: 200px 200px; }
            to   { opacity: 1; transform: scale(1);   transform-origin: 200px 200px; }
          }
          .animate-radar {
            opacity: 0;
            animation: radarFadeIn 600ms ease 200ms forwards;
          }
          .animate-dot {
            opacity: 0;
            animation: radarFadeIn 400ms ease forwards;
          }
        `}
      </style>

      <div className="w-full flex justify-between items-center mb-6">
        <span className="text-[13px] font-medium text-neutral-400 uppercase tracking-[0.08em]">
          Lipinski Rule-of-5
        </span>
        <div className={`px-2.5 py-1 rounded-sm text-[12px] font-black tracking-widest uppercase border ${
          lipinski_pass 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {lipinski_pass ? 'Pass' : 'Fail'}
        </div>
      </div>

      {/* SVG Radar */}
      <div className="relative w-full max-w-[340px] aspect-square mx-auto mb-6">
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl overflow-visible">
          {/* Layer 1: Grid Rings */}
          {gridRings.map((points, i) => (
            <polygon 
              key={i} 
              points={points.map(p => `${p.x},${p.y}`).join(' ')} 
              fill="none" 
              stroke="#27272a" 
              strokeWidth="1" 
            />
          ))}

          {/* Layer 2: Axis Lines */}
          {axes.map((axis, i) => {
            const end = getXY(axis.angle, 1.5 * maxRadius);
            return (
              <line 
                key={i} 
                x1={cx} y1={cy} 
                x2={end.x} y2={end.y} 
                stroke="#27272a" 
                strokeWidth="1" 
              />
            );
          })}

          {/* Layer 3: Ideal Zone */}
          <polygon 
            points={idealPoints} 
            fill="rgba(34, 197, 94, 0.08)" 
            stroke="#22c55e" 
            strokeWidth="1.5" 
            strokeDasharray="4 3" 
          />

          {/* Layer 4: Molecule Polygon */}
          <polygon 
            points={moleculePoints} 
            fill={activeFill} 
            stroke={activeColor} 
            strokeWidth="2" 
            className="animate-radar"
          />

          {/* Layer 5: Data Points */}
          {axes.map((axis, i) => {
            const p = getXY(axis.angle, normalizedValues[axis.key] * maxRadius);
            return (
              <circle 
                key={i} 
                cx={p.x} cy={p.y} r="4" 
                fill={activeColor} 
                stroke="#111113" 
                strokeWidth="2"
                className="animate-dot"
                style={{ animationDelay: `${300 + i * 60}ms` }}
              />
            );
          })}

          {/* Layer 6: Labels & Values */}
          {axes.map((axis, i) => {
            const p = getXY(axis.angle, 1.5 * maxRadius + labelOffset);
            
            // Adjust label positions for better readability
            let dx = 0, dy = 0;
            if (axis.key === 'MW') dy = -8;
            if (axis.key === 'LogP') dx = 12;
            if (axis.key === 'HBD') { dx = 12; dy = 8; }
            if (axis.key === 'HBA') { dx = -12; dy = 8; }
            if (axis.key === 'TPSA') dx = -12;

            const isViolating = normalizedValues[axis.key] > 1.0;

            return (
              <g key={i} transform={`translate(${p.x + dx}, ${p.y + dy})`}>
                <text 
                  textAnchor="middle" 
                  fill="#e5e5e5" 
                  fontSize="14" 
                  fontFamily="Inter, sans-serif" 
                  fontWeight="600"
                >
                  {axis.label} {isViolating && <tspan fill="#ef4444">⚠</tspan>}
                </text>
                <text 
                  y="18" 
                  textAnchor="middle" 
                  fill="#fafafa" 
                  fontSize="12" 
                  fontFamily="Inter, sans-serif" 
                  fontWeight="600"
                >
                  {axis.val.toFixed(1)}{axis.unit}
                </text>
              </g>
            );
          })}

          {/* Layer 7: Legend */}
          <g transform="translate(140, 385)">
             <line x1="0" y1="0" x2="15" y2="0" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 2" />
             <text x="20" y="4" fill="#a1a1aa" fontSize="12" fontFamily="Inter, sans-serif">Ideal</text>
             
             <line x1="80" y1="0" x2="95" y2="0" stroke={activeColor} strokeWidth="1.5" />
             <text x="100" y="4" fill="#a1a1aa" fontSize="12" fontFamily="Inter, sans-serif">Actual</text>
          </g>
        </svg>
      </div>

      {/* Property Chips Grid */}
      <div className="grid grid-cols-5 gap-2 w-full mt-4">
        {axes.map(axis => {
          const isPass = normalizedValues[axis.key] <= 1.0;
          return (
            <div key={axis.key} className="bg-[#18181b] border border-[#27272a] rounded-lg p-2.5 text-center flex flex-col justify-between">
              <span className="text-[11px] text-neutral-400 uppercase font-mono tracking-wider">{axis.label}</span>
              <div className={`text-[13px] font-bold my-1 ${isPass ? 'text-green-400' : 'text-red-400'}`}>
                {axis.val.toFixed(0)}
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">{axis.limit}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LipinskiRadarChart;
