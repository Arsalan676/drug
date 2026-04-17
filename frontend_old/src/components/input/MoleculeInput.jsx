import React, { useState, useEffect, useRef } from 'react';
import { endpoints } from '../../api';

export default function MoleculeInput({ onAnalyze, isLoading }) {
  const [input, setInput] = useState('');
  const [demos, setDemos] = useState([]);
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    endpoints.getMolecules()
      .then(r => setDemos(r.data?.molecules || r.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = e => { e.preventDefault(); if (input.trim()) onAnalyze(input.trim()); };

  return (
    <div className="max-w-2xl mx-auto mb-12 animate-fade-up">
      <p className="text-center mb-1 font-bold text-2xl tracking-tight text-white"
         style={{ fontFamily: 'Instrument Sans' }}>
        Analyze Any Molecule
      </p>
      <p className="text-center text-sm mb-8" style={{ color: '#919191', fontFamily: 'Instrument Sans' }}>
        Enter a drug name, SMILES string, or select from examples
      </p>

      <form onSubmit={submit} className="flex gap-2">
        <div className="flex flex-1 items-stretch" style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#1c1b1d' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. Aspirin, Remdesivir, CC(=O)Oc1ccccc1C(=O)O"
            disabled={isLoading}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-[#474747] outline-none"
            style={{ fontFamily: 'JetBrains Mono' }}
          />
          {/* Demo dropdown */}
          <div ref={dropRef} className="relative" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              disabled={isLoading}
              className="h-full px-4 flex items-center gap-2 text-[#919191] hover:text-white transition-colors"
              style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Demos
              <span className="material-symbols-outlined text-sm">{open ? 'expand_less' : 'expand_more'}</span>
            </button>
            {open && (
              <ul className="absolute right-0 top-full z-50 w-48 py-1 mt-1"
                  style={{ background: '#2a2a2c', border: '1px solid rgba(255,255,255,0.08)' }}>
                {demos.map(m => (
                  <li key={m}
                      onClick={() => { setInput(m); setOpen(false); }}
                      className="px-4 py-2.5 cursor-pointer text-[#c6c6c6] hover:bg-white hover:text-[#1a1c1c] transition-colors capitalize"
                      style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-7 py-3 bg-white text-[#1a1c1c] font-bold text-xs uppercase tracking-widest transition-all hover:bg-[#e5e1e4] active:scale-[0.97] disabled:opacity-40 flex items-center gap-2"
          style={{ fontFamily: 'JetBrains Mono' }}>
          {isLoading
            ? <><span className="material-symbols-outlined text-base animate-spin-slow">autorenew</span>Running</>
            : <><span className="material-symbols-outlined text-base">biotech</span>Analyze</>
          }
        </button>
      </form>
    </div>
  );
}
