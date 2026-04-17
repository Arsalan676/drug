import React from 'react';
import CardShell, { CardLabel, Bar, Badge } from '../ui/CardShell';

const ROWS = ['absorption','distribution','metabolism','excretion','toxicity'];

function rowVariant(prop, item) {
  if (prop === 'toxicity') return item.label === 'Non-toxic' ? 'safe' : 'toxic';
  return item.pass ? 'pass' : 'fail';
}
function barColor(prop, item) {
  if (prop === 'toxicity') return item.pass ? '#a8d5a2' : '#ffb4ab';
  return item.pass ? '#ffffff' : '#ffb4ab';
}

export default function ADMETCard({ admet }) {
  return (
    <CardShell className="p-6 animate-fade-up animate-delay-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <CardLabel>ADMET Safety Profile</CardLabel>
        </div>
        <div className="text-center">
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
            {admet.overall_admet_score.toFixed(0)}
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#919191', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
            / 100
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {ROWS.map((prop, i) => {
          const item = admet[prop];
          return (
            <div key={prop} className="space-y-2">
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#919191' }}>
                  {prop === 'excretion' ? 'Excretion' :
                   prop === 'distribution' ? 'Distribution (BBB)' :
                   prop === 'metabolism' ? 'Metabolism (CYP3A4)' :
                   prop.charAt(0).toUpperCase() + prop.slice(1)}
                </span>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#c6c6c6' }}>
                    {(item.probability * 100).toFixed(0)}%
                  </span>
                  <Badge variant={rowVariant(prop, item)}>{item.label}</Badge>
                </div>
              </div>
              <Bar value={item.probability * 100} color={barColor(prop, item)} delay={i * 80} />
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}
