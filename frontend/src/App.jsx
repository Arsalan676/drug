import { useState, useEffect } from 'react';
import { useAnalyze } from './hooks';
import { endpoints } from './api';

import SideNav           from './components/layout/SideNav';
import TopBar            from './components/layout/TopBar';
import MoleculeInput     from './components/input/MoleculeInput';
import MoleculeCard      from './components/cards/MoleculeCard';
import BindingAffinityCard from './components/cards/BindingAffinityCard';
import ADMETCard         from './components/cards/ADMETCard';
import DruggabilityCard  from './components/cards/DruggabilityCard';
import ChEMBLCard        from './components/cards/ChEMBLCard';
import AIInsightsCard    from './components/cards/AIInsightsCard';
import ProteinTargets    from './components/targets/ProteinTargets';
import LoadingSkeleton   from './components/ui/LoadingSkeleton';
import EmptyState        from './components/ui/EmptyState';

export default function App() {
  const { data, loading, error, analyze, processingTime } = useAnalyze();
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const check = () =>
      endpoints.healthCheck()
        .then(() => setApiStatus('online'))
        .catch(() => setApiStatus('offline'));
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#131315' }}>

      {/* ── Left sidebar ── */}
      <SideNav status={apiStatus} />

      {/* ── Main area (offset by sidebar width) ── */}
      <div className="flex flex-col flex-1 overflow-hidden" style={{ marginLeft: 256 }}>
        <TopBar processingTime={processingTime} />

        {/* ── Content row: scrollable canvas + right panel ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Scrollable main canvas */}
          <main className="flex-1 overflow-y-auto px-8 py-8">
            <MoleculeInput onAnalyze={analyze} isLoading={loading} />

            {/* Error */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
                <div className="w-16 h-16 flex items-center justify-center mb-5"
                     style={{ border: '1px solid rgba(255,180,171,0.3)', background: 'rgba(255,180,171,0.05)' }}>
                  <span className="material-symbols-outlined text-3xl" style={{ color: '#ffb4ab' }}>error</span>
                </div>
                <p className="text-white font-bold text-lg mb-2"
                   style={{ fontFamily: 'Instrument Sans' }}>Analysis Failed</p>
                <p className="text-sm text-center max-w-sm mb-6"
                   style={{ color: '#919191', fontFamily: 'Instrument Sans' }}>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-white text-[#1a1c1c] text-xs font-bold uppercase tracking-widest hover:bg-[#e5e1e4] transition-colors"
                  style={{ fontFamily: 'JetBrains Mono' }}>
                  Retry
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && <LoadingSkeleton />}

            {/* Empty state */}
            {!data && !loading && !error && <EmptyState />}

            {/* Results */}
            {data && !loading && (
              <div className="grid grid-cols-12 gap-4">

                {/* Row 1: Molecule — full width */}
                <div className="col-span-12 animate-fade-up">
                  <MoleculeCard data={data} />
                </div>

                {/* Row 2: Binding (5) + ADMET (7) */}
                <div className="col-span-5 animate-fade-up animate-delay-1">
                  <BindingAffinityCard affinity={data.binding_affinity} />
                </div>
                <div className="col-span-7 animate-fade-up animate-delay-2">
                  <ADMETCard admet={data.admet} />
                </div>

                {/* Row 3: Druggability (4) + ChEMBL (4) + AI (4) */}
                <div className="col-span-4 animate-fade-up animate-delay-3">
                  <DruggabilityCard druggability={data.druggability} />
                </div>
                <div className="col-span-4 animate-fade-up animate-delay-4">
                  <ChEMBLCard chembl={data.chembl_data} />
                </div>
                <div className="col-span-4 animate-fade-up animate-delay-5">
                  <AIInsightsCard ai={data.ai_interpretation} />
                </div>

                {/* Row 4: Bottom stats bar */}
                <div className="col-span-12 animate-fade-up animate-delay-6">
                  <div className="flex items-center justify-between px-6 py-4"
                       style={{ background: '#1c1b1d', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-8">
                      {[
                        ['Molecule', data.molecule_name],
                        ['Formula',  data.molecular_formula],
                        ['MW',       `${data.molecular_weight} g/mol`],
                        ['Pipeline', `${data.processing_time_ms.toFixed(0)} ms`],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#474747' }}>
                            {label}
                          </span>
                          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#c6c6c6', marginTop: 2, fontWeight: 700 }}>
                            {val}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a8d5a2' }} />
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#474747' }}>
                        Analysis Complete
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </main>

          {/* Right panel: Protein targets */}
          <ProteinTargets />
        </div>
      </div>

    </div>
  );
}
