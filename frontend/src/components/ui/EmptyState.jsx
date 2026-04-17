import React from 'react';

export default function EmptyState() {
  const DEMOS = ['Aspirin', 'Ibuprofen', 'Remdesivir', 'Caffeine', 'Metformin'];

  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-up">

      {/* Icon */}
      <div className="relative mb-10">
        <div className="w-24 h-24 flex items-center justify-center"
             style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#1c1b1d' }}>
          <span className="material-symbols-outlined text-5xl" style={{ color: '#353437' }}>
            science
          </span>
        </div>
        {/* Corner marks */}
        {['-top-px -left-px','−top-px -right-px','-bottom-px -left-px','-bottom-px -right-px'].map((pos, i) => (
          <span key={i}
            className={`absolute w-2 h-2 ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'}`}
            style={{ border: '1px solid rgba(255,255,255,0.15)',
                     borderRight: i % 2 === 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                     borderLeft:  i % 2 === 0 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                     borderBottom: i >= 2    ? '1px solid rgba(255,255,255,0.15)' : 'none',
                     borderTop:    i < 2     ? '1px solid rgba(255,255,255,0.15)' : 'none',
                     background: 'transparent' }} />
        ))}
      </div>

      <p className="text-white font-bold text-xl mb-2 tracking-tight"
         style={{ fontFamily: 'Instrument Sans' }}>
        Ready for Analysis
      </p>
      <p className="text-sm mb-10 text-center max-w-xs"
         style={{ color: '#474747', fontFamily: 'Instrument Sans' }}>
        Enter a molecule name or SMILES string above to run the full computational pipeline
      </p>

      {/* Try these */}
      <div className="flex flex-col items-center gap-3">
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase',
                       letterSpacing: '0.12em', color: '#353437' }}>
          Try one of these
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {DEMOS.map(name => (
            <span key={name}
                  style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#474747',
                           border: '1px solid #353437', padding: '4px 10px',
                           textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {name}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
