import React, { useState, useEffect } from 'react';
import { endpoints } from '../../api';
import { CardLabel } from '../ui/CardShell';

export default function ProteinTargets() {
  const [targets, setTargets] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    endpoints.getTargets()
      .then(r => {
        const list = r.data?.targets || r.data || [];
        setTargets(list);
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col h-full overflow-y-auto"
           style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', background: '#1c1b1d' }}>
      <div className="sticky top-0 px-5 py-4"
           style={{ background: '#1c1b1d', borderBottom: '1px solid rgba(255,255,255,0.05)', zIndex: 10 }}>
        <CardLabel>Protein Targets</CardLabel>
        <p className="mt-0.5 text-xs" style={{ color: '#474747', fontFamily: 'Instrument Sans' }}>
          {targets.length} disease targets
        </p>
      </div>

      <div className="p-4 space-y-3">
        {targets.length === 0 && (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-3xl block mb-2" style={{ color: '#353437' }}>
              coronavirus
            </span>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#474747', textTransform: 'uppercase' }}>
              Loading targets…
            </p>
          </div>
        )}

        {targets.map((t, i) => {
          const isOpen = selected === i;
          const pdb = t.pdb_data || {};
          return (
            <div key={t.target_key || i}
                 className="cursor-pointer transition-all"
                 style={{ border: `1px solid ${isOpen ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`, background: isOpen ? '#2a2a2c' : '#201f22' }}
                 onClick={() => setSelected(isOpen ? null : i)}>
              {/* Image */}
              {pdb.image_url && (
                <img
                  src={pdb.image_url}
                  alt={t.name}
                  className="w-full object-cover"
                  style={{ height: isOpen ? 120 : 80, filter: 'grayscale(40%)', transition: 'height 0.3s ease' }}
                  onError={e => e.target.style.display = 'none'}
                />
              )}
              {!pdb.image_url && (
                <div className="flex items-center justify-center" style={{ height: isOpen ? 80 : 56, background: '#131315' }}>
                  <span className="material-symbols-outlined text-3xl" style={{ color: '#353437' }}>biotech</span>
                </div>
              )}

              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-white text-sm font-semibold leading-tight"
                     style={{ fontFamily: 'Instrument Sans' }}>
                    {t.name}
                  </p>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#919191', flexShrink: 0 }}>
                    {t.pdb_id}
                  </span>
                </div>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#474747' }}>
                  {t.disease}
                </p>

                {isOpen && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs leading-relaxed" style={{ color: '#919191', fontFamily: 'Instrument Sans' }}>
                      {t.description}
                    </p>
                    {pdb.resolution && (
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#474747' }}>
                        Resolution: {pdb.resolution}Å · {pdb.method || 'X-RAY'}
                      </p>
                    )}
                    <a
                      href={pdb.rcsb_url || `https://www.rcsb.org/structure/${t.pdb_id}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-white hover:text-[#c6c6c6] transition-colors"
                      style={{ fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      View in RCSB
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
