import React from 'react';
import CardShell, { CardLabel, Bar } from '../ui/CardShell';

const GRADE_COLOR = { A: '#a8d5a2', B: '#ffffff', C: '#f0c080', D: '#ffb4ab' };
const BREAKDOWN = [
  { key: 'binding_contribution', label: 'Binding',  max: 40 },
  { key: 'admet_contribution',   label: 'ADMET',    max: 45 },
  { key: 'lipinski_contribution',label: 'Lipinski', max: 15 },
];

export default function DruggabilityCard({ druggability }) {
  const gradeColor = GRADE_COLOR[druggability.grade] || '#919191';

  return (
    <CardShell className="p-6 animate-fade-up animate-delay-3">
      <CardLabel>Druggability Score</CardLabel>

      {/* Score + Grade */}
      <div className="flex items-center gap-6 my-6">
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#353437" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={gradeColor}
              strokeWidth="8"
              strokeLinecap="square"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - druggability.druggability_score / 100)}`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              {druggability.druggability_score.toFixed(0)}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#919191', textTransform: 'uppercase' }}>
              /100
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="w-12 h-12 flex items-center justify-center mb-3"
               style={{ border: `2px dashed ${gradeColor}` }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 700, color: gradeColor }}>
              {druggability.grade}
            </span>
          </div>
          <p className="text-sm leading-snug" style={{ color: '#c6c6c6', fontFamily: 'Instrument Sans' }}>
            {druggability.interpretation}
          </p>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-3 mb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
        <CardLabel>Score Breakdown</CardLabel>
        {BREAKDOWN.map(({ key, label, max }) => {
          const val = druggability.breakdown[key];
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between">
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#474747' }}>
                  {label}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#919191' }}>
                  {val.toFixed(1)} / {max}
                </span>
              </div>
              <Bar value={(val / max) * 100} color={gradeColor} />
            </div>
          );
        })}
      </div>

      {/* Recommendation */}
      <p className="text-xs italic" style={{ color: '#919191', fontFamily: 'Instrument Sans' }}>
        {druggability.recommendation}
      </p>
    </CardShell>
  );
}
