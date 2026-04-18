import React, { useState } from 'react';
import Layout from '../components/shared/Layout';
import MoleculeViewer3D from '../components/shared/MoleculeViewer3D';
import { API_BASE } from '../config';

/* ─────────────────────────── helpers ─────────────────────────── */
const truncateSmiles = (s, n = 28) => (s?.length > n ? s.slice(0, n) + '…' : s || '—');

const stepStatusMeta = (idx, total, isLoading) => {
  if (isLoading) return { dot: 'bg-white animate-pulse', label: 'QUEUED', text: 'text-neutral-500' };
  if (idx === 0) return { dot: 'bg-white', label: 'COMPLETED', text: 'text-white' };
  if (idx < Math.ceil(total / 2)) return { dot: 'bg-neutral-400', label: 'COMPLETED', text: 'text-neutral-300' };
  return { dot: 'bg-neutral-700', label: 'QUEUED', text: 'text-neutral-600' };
};

/* ─────────────────────────── sub-components ─────────────────────────── */
const InputBar = ({ onPredict, isLoading }) => {
  const [value, setValue] = useState('');
  const submit = () => value.trim() && onPredict(value.trim());

  return (
    <div className="flex gap-2 w-full">
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 text-sm pointer-events-none">biotech</span>
        <input
          className="w-full bg-[#1c1b1d] border border-white/10 text-white font-mono text-sm pl-11 pr-4 py-3.5 outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
          placeholder="aspirin · ibuprofen · CC(=O)Oc1ccccc1C(=O)O"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
        />
      </div>
      <button
        onClick={submit}
        disabled={isLoading || !value.trim()}
        className="px-8 py-3.5 bg-white text-black font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isLoading ? 'Predicting...' : 'Predict Route'}
      </button>
    </div>
  );
};

const StepsTimeline = ({ steps, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-0 mt-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="relative pl-8 pb-10 border-l border-white/10">
            <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-neutral-800 animate-pulse border-2 border-[#131315]" />
            <div className="space-y-2">
              <div className="h-2 w-24 bg-neutral-800 rounded animate-pulse" />
              <div className="h-3 w-40 bg-neutral-700 rounded animate-pulse" />
              <div className="h-2 w-32 bg-neutral-800 rounded animate-pulse mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!steps?.length) return (
    <div className="mt-6 text-center py-8">
      <span className="material-symbols-outlined text-neutral-700 text-4xl block mb-3">route</span>
      <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">No route predicted yet</p>
    </div>
  );

  return (
    <div className="space-y-0 mt-2">
      {steps.map((s, idx) => {
        const meta = stepStatusMeta(idx, steps.length, false);
        return (
          <div
            key={s.step}
            className={`relative pl-8 pb-10 ${idx === steps.length - 1 ? '' : 'border-l border-white/10'}`}
          >
            <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full ${meta.dot} border-2 border-[#1c1b1d]`} />
            <div className="space-y-1.5">
              <span className={`font-mono text-[9px] uppercase tracking-widest ${meta.text}`}>
                STEP {String(s.step).padStart(2, '0')} — {meta.label}
              </span>
              <p className="text-sm font-bold text-white uppercase tracking-tight leading-tight">
                {s.reaction_type || 'Transformation'}
              </p>
              <p className="font-mono text-[10px] text-neutral-500 leading-relaxed">
                {s.reactants?.length > 0
                  ? `${s.reactants.length} precursor${s.reactants.length > 1 ? 's' : ''} → product`
                  : truncateSmiles(s.reaction_smiles)}
              </p>
              {/* Confidence bar */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-[2px] bg-neutral-800">
                  <div
                    className="bg-white h-full transition-all duration-700"
                    style={{ width: `${(s.confidence * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] text-neutral-500 w-10 text-right">
                  {(s.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ReactionDetail = ({ step }) => {
  if (!step) return null;
  const parts = step.reaction_smiles?.split('>>') || [];
  const reactants = parts[0]?.split('.') || [];
  const product = parts[1] || '';

  return (
    <div className="bg-[#2a2a2c]/60 border border-white/5 p-5 space-y-4">
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 block">
        Reaction Detail — Step {String(step.step).padStart(2, '0')}
      </span>
      <div className="flex items-center gap-3 flex-wrap">
        {reactants.map((r, i) => (
          <React.Fragment key={i}>
            <div className="bg-[#1c1b1d] border border-white/10 px-3 py-2">
              <span className="font-mono text-[10px] text-neutral-400 block mb-0.5">R{i + 1}</span>
              <span className="font-mono text-[11px] text-white">{truncateSmiles(r, 22)}</span>
            </div>
            {i < reactants.length - 1 && (
              <span className="material-symbols-outlined text-neutral-700 text-sm">add</span>
            )}
          </React.Fragment>
        ))}
        {reactants.length > 0 && (
          <>
            <span className="material-symbols-outlined text-neutral-500 text-sm">arrow_forward</span>
            <div className="bg-white/5 border border-white/20 px-3 py-2">
              <span className="font-mono text-[10px] text-neutral-400 block mb-0.5">Product</span>
              <span className="font-mono text-[11px] text-white">{truncateSmiles(product, 22)}</span>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-4 pt-2 border-t border-white/5">
        <div>
          <span className="font-mono text-[9px] text-neutral-600 uppercase">Confidence</span>
          <p className="font-mono text-sm text-white font-bold">{(step.confidence * 100).toFixed(1)}%</p>
        </div>
        {step.template_score > 0 && (
          <div>
            <span className="font-mono text-[9px] text-neutral-600 uppercase">Template Score</span>
            <p className="font-mono text-sm text-white font-bold">{(step.template_score * 100).toFixed(1)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricsPanel = ({ result, isLoading }) => {
  const score = result ? (result.overall_confidence * 100).toFixed(1) : '—';
  const numSteps = result?.num_steps ?? '—';

  return (
    <div className="flex flex-col gap-6">
      {/* Confidence Index */}
      <div className="bg-[#2a2a2c] p-6 relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rotate-45 translate-x-8 -translate-y-8 pointer-events-none" />
        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-[0.2em] block mb-4">Confidence Index</span>
        {isLoading ? (
          <div className="h-12 w-28 bg-neutral-800 rounded animate-pulse" />
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-white tracking-tighter">{score}</span>
              {result && <span className="font-mono text-xl text-neutral-600">%</span>}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${result ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-700'}`} />
              <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider font-bold">
                {result ? result.model : 'Awaiting Input'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Steps count */}
      <div className="p-2 border-l-2 border-white/10 ml-2">
        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-[0.2em] block">Synthesis Steps</span>
        {isLoading ? (
          <div className="h-10 w-12 bg-neutral-800 rounded animate-pulse mt-3" />
        ) : (
          <>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl font-bold text-white tracking-tighter">{numSteps}</span>
              {result && <span className="font-mono text-sm text-neutral-600 uppercase font-bold">steps</span>}
            </div>
            <p className="font-mono text-[10px] text-neutral-500 mt-2 leading-relaxed">
              {result
                ? 'Retrosynthetic path computed by IBM RXN neural model.'
                : 'Enter a molecule to predict synthesis route.'}
            </p>
          </>
        )}
      </div>

      {/* Grid of mini metrics */}
      {result && (
        <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
          {[
            { label: 'Target', value: truncateSmiles(result.target_smiles, 10) },
            { label: 'Status', value: result.status === 'success' ? 'SUCCESS' : result.status?.toUpperCase() },
            { label: 'Time', value: `${result.processing_time_ms?.toFixed(0) || '—'}ms` },
            { label: 'Model', value: 'IBM RXN' },
          ].map(m => (
            <div key={m.label} className="p-4 bg-[#1c1b1d]">
              <span className="font-mono text-[9px] font-bold text-neutral-600 uppercase tracking-widest block">{m.label}</span>
              <div className="font-mono text-sm font-bold text-white mt-1 uppercase leading-none truncate">{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Confidence distribution (only when result exists) */}
      {result?.steps?.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Step Confidence</span>
            <span className="font-mono text-[10px] text-neutral-700">per step</span>
          </div>
          <div className="flex items-end gap-1 h-10">
            {result.steps.map((s, i) => (
              <div
                key={i}
                style={{ height: `${(s.confidence * 100).toFixed(0)}%` }}
                className="flex-1 bg-white/60 hover:bg-white transition-colors cursor-default"
                title={`Step ${s.step}: ${(s.confidence * 100).toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[8px] text-neutral-700 uppercase">S1</span>
            <span className="font-mono text-[8px] text-neutral-700 uppercase">S{result.steps.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const ErrorPanel = ({ message, onDismiss }) => (
  <div className="flex-1 flex items-center justify-center p-12">
    <div className="w-full max-w-md bg-red-500/10 border border-red-500/20 p-8 text-center">
      <span className="material-symbols-outlined text-red-400 text-4xl mb-3 block">error_outline</span>
      <h3 className="text-red-400 font-bold uppercase tracking-tighter text-lg mb-2">Prediction Failed</h3>
      <p className="font-mono text-xs text-red-400/60 uppercase tracking-widest mb-6 leading-relaxed">{message}</p>
      <button
        onClick={onDismiss}
        className="px-6 py-2 border border-red-500/30 font-mono text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all"
      >
        Try Again
      </button>
    </div>
  </div>
);

/* ─────────────────────────── main page ─────────────────────────── */
const SynthesisPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [sdfData, setSdfData] = useState(null);

  const handlePredict = async (input) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setSelectedStep(null);
    setSdfData(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/synthesis/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, steps: 3 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || `Error ${res.status}`);
        return;
      }
      setResult(data);
      if (data.steps?.length) setSelectedStep(data.steps[0]);

      // Fetch 3D structure
      if (data.target_smiles) {
        const sRes = await fetch(`${API_BASE}/api/v1/structure/3d`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ smiles: data.target_smiles }),
        });
        if (sRes.ok) {
          const sData = await sRes.json();
          setSdfData(sData.sdf || '');
        }
      }
    } catch {
      setError('Network error — is the backend running on port 8000?');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setSelectedStep(null);
    setSdfData(null);
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col overflow-hidden bg-[#131315]">

        {/* Top bar: header + input */}
        <div className="flex-shrink-0 px-8 py-6 border-b border-white/5 bg-[#131315]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <span className="font-mono text-[12px] uppercase tracking-[0.3em] text-neutral-400 block mb-1">
                CORE ENGINE v4.2 / IBM RXN AI
              </span>
              <h2 className="text-2xl font-bold tracking-tighter text-white uppercase">Synthesis Engine</h2>
            </div>
            <div className="flex gap-4">
              <div className="bg-[#1c1b1d] px-5 py-3 flex flex-col border border-white/5">
                <span className="font-mono text-[11px] text-neutral-400 uppercase">Model</span>
                <span className="font-mono text-sm text-white font-bold">IBM RXN AI</span>
              </div>
              <div className="bg-[#1c1b1d] px-5 py-3 flex flex-col border border-white/5">
                <span className="font-mono text-[11px] text-neutral-400 uppercase">Max Steps</span>
                <span className="font-mono text-sm text-white font-bold">3 routes</span>
              </div>
            </div>
          </div>
          <InputBar onPredict={handlePredict} isLoading={loading} />
        </div>

        {/* Main content: 3-column layout */}
        {error ? (
          <ErrorPanel message={error} onDismiss={handleReset} />
        ) : (
          <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden relative min-h-0">
            {/* Dot-grid background */}
            <div
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            />

            {/* Left: Synthesis Strategy Timeline */}
            <aside className="col-span-12 lg:col-span-3 bg-[#1c1b1d] border-r border-white/5 flex flex-col z-10 min-h-0">
              <div className="p-8 flex-1 overflow-y-auto min-h-0">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-neutral-400 block mb-1">Active Sequence</span>
                    <h3 className="text-lg font-bold tracking-tight text-white uppercase">
                      {result ? result.molecule_name : 'Awaiting Input'}
                    </h3>
                  </div>
                  <span className="material-symbols-outlined text-neutral-700">query_stats</span>
                </div>

                <StepsTimeline steps={result?.steps} isLoading={loading} />

                {result?.steps?.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest block">Select step to inspect</span>
                    {result.steps.map(s => (
                      <button
                        key={s.step}
                        onClick={() => setSelectedStep(s)}
                        className={`w-full text-left px-3 py-2 font-mono text-[12px] uppercase tracking-widest transition-all border ${
                          selectedStep?.step === s.step
                            ? 'bg-white text-black border-white'
                            : 'text-neutral-500 border-white/5 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        Step {String(s.step).padStart(2, '0')} — {s.reaction_type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mini sparkline */}
              <div className="flex-shrink-0 p-8 bg-[#2a2a2c]/30 border-t border-white/5">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block mb-4">
                  Step Confidence (%)
                </span>
                <div className="flex items-end gap-1.5 h-12">
                  {(result?.steps?.length
                    ? result.steps.map(s => s.confidence * 100)
                    : [50, 75, 33, 100, 66, 50, 25, 45, 90, 60]
                  ).map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 transition-all duration-500 ${h > 80 ? 'bg-white' : h > 50 ? 'bg-neutral-400' : 'bg-neutral-700'}`}
                    />
                  ))}
                </div>
              </div>
            </aside>

            {/* Center: 3D viewer + reaction detail */}
            <section className="col-span-12 lg:col-span-6 relative flex flex-col p-8 overflow-y-auto bg-[#131315]">
              <div className="absolute top-0 left-0 flex items-center gap-3 p-6 z-10">
                <div className="h-px w-8 bg-white/30" />
                <span className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
                  {result ? `Target: ${result.target_smiles?.slice(0, 30)}…` : 'Live Render Kernel::VX4'}
                </span>
              </div>

              {/* Molecule 3D viewer */}
              <div className="flex-1 flex items-center justify-center min-h-[280px] relative">
                {loading ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-40 h-40">
                      <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_8s_linear_infinite]" />
                      <div className="absolute inset-4 border border-white/5 rounded-full border-dashed animate-[spin_5s_linear_infinite_reverse]" />
                      <div className="absolute inset-8 border border-white/10 rounded-full animate-[spin_3s_linear_infinite]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl animate-pulse">biotech</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[13px] text-white uppercase tracking-widest mb-1">Computing Retrosynthesis</p>
                      <p className="font-mono text-[12px] text-neutral-400">IBM RXN AI · up to 90 seconds</p>
                    </div>
                  </div>
                ) : sdfData ? (
                  <div className="w-full h-full min-h-[280px]">
                    <MoleculeViewer3D sdfData={sdfData} isLoading={false} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 border border-white/20 rounded-full animate-[spin_60s_linear_infinite]">
                        <div className="absolute inset-4 border border-white/10 rounded-full border-dashed" />
                      </div>
                    </div>
                    <span className="font-mono text-[12px] text-neutral-400 uppercase tracking-widest">Enter molecule to begin</span>
                  </div>
                )}
              </div>

              {/* Selected step reaction detail */}
              {selectedStep && !loading && (
                <div className="flex-shrink-0 mt-6">
                  <ReactionDetail step={selectedStep} />
                </div>
              )}

              {/* Bottom controls */}
              <div className="flex-shrink-0 flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest">
                  {result ? `${result.num_steps} steps · ${result.processing_time_ms?.toFixed(0)}ms` : 'Coord Axis: VX4 // 02'}
                </span>
                <div className="flex gap-2">
                  {result && (
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 border border-white/10 font-mono text-[12px] uppercase tracking-widest text-neutral-300 hover:text-white hover:border-white/30 transition-all"
                    >
                      Reset
                    </button>
                  )}
                  <button className="bg-white text-black px-6 py-2 font-mono text-[12px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
                    Export
                  </button>
                </div>
              </div>
            </section>

            {/* Right: Metrics panel */}
            <aside className="col-span-12 lg:col-span-3 bg-[#1c1b1d] border-l border-white/5 p-8 overflow-y-auto z-10 min-h-0">
              <MetricsPanel result={result} isLoading={loading} />
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SynthesisPage;
