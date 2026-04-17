import React from 'react';
import CardShell, { CardLabel, Bar, Badge } from '../ui/CardShell';

const STRENGTH_VARIANT = { Strong: 'strong', Moderate: 'moderate', Weak: 'weak' };
const STRENGTH_COLOR   = { Strong: '#a8d5a2', Moderate: '#f0c080', Weak: '#919191' };

export default function BindingAffinityCard({ affinity }) {
  const variant = STRENGTH_VARIANT[affinity.binding_strength] || 'weak';
  const color   = STRENGTH_COLOR[affinity.binding_strength]   || '#919191';

  return (
    <CardShell className="p-6 animate-fade-up animate-delay-1">
      <div className="flex items-center justify-between mb-8">
        <div>
          <CardLabel>Binding Affinity</CardLabel>
          <div className="flex items-baseline gap-3 mt-2">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 64, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: '#ffffff' }}>
              {affinity.pkd.toFixed(2)}
            </span>
            <div className="flex flex-col gap-1">
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#919191' }}>pKd Score</span>
              <Badge variant={variant}>{affinity.binding_strength}</Badge>
            </div>
          </div>
        </div>
        <span className="material-symbols-outlined text-4xl" style={{ color: '#353437' }}>
          {affinity.binding_strength === 'Strong' ? 'trending_up' : affinity.binding_strength === 'Moderate' ? 'trending_flat' : 'trending_down'}
        </span>
      </div>

      {/* Percentile bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <CardLabel>Percentile Rank</CardLabel>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#c6c6c6', fontWeight: 700 }}>
            {affinity.percentile_rank.toFixed(1)}%
          </span>
        </div>
        <Bar value={affinity.percentile_rank} color={color} delay={200} />
      </div>

      {/* Confidence interval */}
      <div className="flex items-center justify-between pt-4"
           style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <CardLabel>95% Confidence Interval</CardLabel>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#c6c6c6' }}>
          [{affinity.confidence_interval[0].toFixed(2)}, {affinity.confidence_interval[1].toFixed(2)}]
        </span>
      </div>
    </CardShell>
  );
}
