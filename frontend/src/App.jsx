import React, { useState } from 'react';
import Layout from './components/shared/Layout';
import LoadingGrid from './components/shared/LoadingGrid';
import MoleculeCard from './components/shared/MoleculeCard';
import BindingAffinityCard from './components/shared/BindingAffinityCard';
import AdmetCard from './components/shared/AdmetCard';
import DrugabilityCard from './components/shared/DrugabilityCard';
import ChemblCard from './components/shared/ChemblCard';
import AiInsightsCard from './components/shared/AiInsightsCard';

const EmptyHero = ({ onAnalyze, isLoading }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  React.useEffect(() => {
    fetch('http://localhost:8000/api/v1/analyze/molecules')
      .then(res => res.json())
      .then(data => setSuggestions(data.molecules || []))
      .catch(() => {});
  }, []);

  const submit = () => value.trim() && onAnalyze(value.trim());

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center py-32 px-12 overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">
        <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-[0.3em] mb-6 block">
          Neural Architecture Analysis / Awaiting Input
        </span>
        <h1 className="text-5xl font-bold text-white tracking-tighter uppercase mb-4">
          Molecular Intelligence
        </h1>
        <p className="font-mono text-sm text-neutral-500 mb-12">
          Enter a compound name or SMILES notation to begin structural analysis
        </p>

        <div className="w-full bg-[#1c1b1d] border border-white/10 p-1.5 flex gap-2 focus-within:border-white/30 transition-all">
          <input
            className="flex-1 bg-transparent text-white font-mono text-sm px-4 py-3 outline-none placeholder:text-neutral-600"
            placeholder="aspirin · ibuprofen · CC(=O)Oc1ccccc1C(=O)O"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoFocus
          />
          <button
            onClick={submit}
            disabled={isLoading || !value.trim()}
            className="bg-white text-black px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Analyze'}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest self-center mr-2">Quick select:</span>
            {suggestions.map(name => (
              <button
                key={name}
                onClick={() => { setValue(name); onAnalyze(name); }}
                className="px-3 py-1.5 bg-[#1c1b1d] border border-white/5 font-mono text-[10px] text-neutral-400 uppercase hover:border-white/20 hover:text-white transition-all whitespace-nowrap"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AnalysisHeader = ({ data, onNewAnalysis }) => (
  <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
    <div>
      <span className="font-mono text-[0.7rem] text-neutral-500 tracking-widest uppercase mb-2 block">
        Active Analysis / Project {String(Date.now()).slice(-4)}
      </span>
      <h1 className="text-3xl font-bold tracking-tighter uppercase text-white">
        {data.molecule_name}
        <span className="text-neutral-500 font-mono text-base ml-4">
          {data.molecular_formula}
        </span>
      </h1>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right hidden md:block">
        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-0.5">Molecular Weight</p>
        <p className="font-mono text-sm text-white font-bold">{data.molecular_weight.toFixed(2)} g/mol</p>
      </div>
      <div className="text-right hidden md:block">
        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-0.5">Analysis ID</p>
        <p className="font-mono text-sm text-white font-bold">#MOL-{String(data.molecular_weight).replace('.', '')}</p>
      </div>
      <button
        onClick={onNewAnalysis}
        className="px-5 py-2 border border-white/20 font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white/40 transition-all"
      >
        New Analysis
      </button>
    </div>
  </div>
);

const LipinskiCard = ({ data }) => {
  const { lipinski_details, lipinski_pass } = data;
  const rules = [
    { label: 'MW < 500',  value: `${lipinski_details.mw.toFixed(1)}`,   pass: lipinski_details.mw < 500 },
    { label: 'LogP < 5',  value: `${lipinski_details.logp.toFixed(2)}`,  pass: lipinski_details.logp < 5 },
    { label: 'HBD ≤ 5',   value: `${lipinski_details.hbd}`,              pass: lipinski_details.hbd <= 5 },
    { label: 'HBA ≤ 10',  value: `${lipinski_details.hba}`,              pass: lipinski_details.hba <= 10 },
  ];
  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl p-6 flex flex-col h-full">
      <span className="text-[11px] font-medium text-[#52525b] uppercase tracking-[0.08em] mb-6">
        Lipinski Rules
      </span>
      <div className="flex flex-col gap-4 flex-1">
        {rules.map(r => (
          <div key={r.label} className="flex justify-between items-center">
            <span className="font-mono text-[11px] text-neutral-400 uppercase">{r.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-white font-medium">{r.value}</span>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${r.pass ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-white/5 text-center">
        <span className={`font-mono text-[10px] uppercase tracking-widest font-bold ${lipinski_pass ? 'text-green-400' : 'text-red-400'}`}>
          {lipinski_pass ? '✓ Lipinski Pass' : '✗ Lipinski Fail'}
        </span>
      </div>
    </div>
  );
};

const ResultsLayout = ({ data }) => (
  <div className="flex flex-col gap-6 pb-28">
    {/* Row 1: 3-column main grid */}
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <MoleculeCard moleculeData={data} />
      </div>
      <div className="col-span-12 lg:col-span-5">
        <BindingAffinityCard bindingAffinity={data.binding_affinity} />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <AdmetCard admet={data.admet} />
      </div>
    </div>

    {/* Row 2: druggability + chembl + lipinski */}
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-5">
        <DrugabilityCard druggability={data.druggability} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <ChemblCard chemblData={data.chembl_data} />
      </div>
      <div className="col-span-12 md:col-span-3">
        <LipinskiCard data={data} />
      </div>
    </div>

    {/* Row 3: full-width AI insights */}
    <AiInsightsCard
      aiInterpretation={data.ai_interpretation}
      processingTime={data.processing_time_ms}
    />
  </div>
);

const ErrorPanel = ({ type, onDismiss }) => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="w-full max-w-md bg-red-500/10 border border-red-500/20 p-10 text-center">
      <span className="material-symbols-outlined text-red-400 text-5xl mb-4 block">error_outline</span>
      <h3 className="text-red-400 font-bold uppercase tracking-tighter text-xl mb-3">Analysis Failed</h3>
      <p className="font-mono text-xs text-red-400/60 uppercase tracking-widest mb-8">
        {type === 404
          ? 'Molecule not found in PubChem or local database'
          : `Backend error — code ${type}`}
      </p>
      <button
        onClick={onDismiss}
        className="px-8 py-3 border border-red-500/30 font-mono text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all"
      >
        Try Again
      </button>
    </div>
  </div>
);

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const handleAnalyze = async (inputValue) => {
    if (!inputValue) return;
    setLoading(true);
    setData(null);
    setErrorType(null);

    try {
      const res = await fetch('http://localhost:8000/api/v1/analyze/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputValue }),
      });
      if (!res.ok) {
        setErrorType(res.status);
        return;
      }
      setData(await res.json());
    } catch {
      setErrorType(500);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setErrorType(null);
  };

  return (
    <Layout onAnalyze={handleAnalyze} isLoading={loading}>
      <div className="flex-1 overflow-y-auto bg-[#131315] relative min-h-0">
        {/* Atmospheric glow */}
        <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-white/[0.025] blur-[140px] rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none z-0" />

        <div className="relative z-10 px-8 md:px-12 py-10">
          {!data && !loading && !errorType && (
            <EmptyHero onAnalyze={handleAnalyze} isLoading={loading} />
          )}

          {loading && (
            <div className="animate-pulse">
              <LoadingGrid />
            </div>
          )}

          {data && !loading && (
            <div>
              <AnalysisHeader data={data} onNewAnalysis={handleReset} />
              <ResultsLayout data={data} />
            </div>
          )}

          {errorType && !loading && (
            <ErrorPanel type={errorType} onDismiss={handleReset} />
          )}
        </div>

        {/* Fixed footer bar — only when results are showing */}
        {data && !loading && (
          <footer className="fixed bottom-0 right-0 left-20 md:left-64 h-20 bg-[#131315]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-8 md:px-12 z-40">
            <div className="flex gap-8 md:gap-12">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Druggability</span>
                <span className="font-mono text-sm font-bold text-white uppercase">
                  {data.druggability.druggability_score.toFixed(1)} / 100 · Grade {data.druggability.grade}
                </span>
              </div>
              <div className="hidden md:flex flex-col gap-0.5">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Processing Time</span>
                <span className="font-mono text-sm font-bold text-white uppercase">{data.processing_time_ms} ms</span>
              </div>
              <div className="hidden md:flex flex-col gap-0.5">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Lipinski</span>
                <span className={`font-mono text-sm font-bold uppercase ${data.lipinski_pass ? 'text-green-400' : 'text-red-400'}`}>
                  {data.lipinski_pass ? 'Pass' : 'Fail'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 border border-white/20 font-mono text-[10px] uppercase font-bold tracking-widest text-white hover:bg-white hover:text-black transition-all"
              >
                New Analysis
              </button>
              <button className="px-8 py-2.5 bg-white text-black font-mono text-[10px] uppercase font-bold tracking-[0.15em] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Export Report
              </button>
            </div>
          </footer>
        )}
      </div>
    </Layout>
  );
};

export default App;
