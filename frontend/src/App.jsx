import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import LandingPage from './pages/LandingPage';
import SynthesisPage from './pages/SynthesisPage';
import LoadingGrid from './components/shared/LoadingGrid';
import MoleculeCard from './components/shared/MoleculeCard';
import BindingAffinityCard from './components/shared/BindingAffinityCard';
import AdmetCard from './components/shared/AdmetCard';
import DrugabilityCard from './components/shared/DrugabilityCard';
import ChemblCard from './components/shared/ChemblCard';
import AiInsightsCard from './components/shared/AiInsightsCard';
import RepurposingCard from './components/shared/RepurposingCard';
import ResultsGrid from './components/shared/ResultsGrid';

import { API_BASE as API_BASE_URL } from './config';

const EmptyHero = ({ onAnalyze, isLoading, repurposingMode, setRepurposingMode }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/analyze/molecules`)
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
        <span className="font-mono text-[13px] text-neutral-400 uppercase tracking-[0.3em] mb-6 block">
          Neural Architecture Analysis / Awaiting Input
        </span>
        <h1 className="text-5xl font-bold text-white tracking-tighter uppercase mb-4">
          Molecular Intelligence
        </h1>
        <p className="font-mono text-sm text-neutral-500 mb-10">
          {repurposingMode 
            ? "Enter a drug molecule to identify potential new disease targets and therapeutic indications" 
            : "Enter a compound name or SMILES notation to begin structural analysis"}
        </p>

        {/* Mode Toggle */}
        <div className="mb-10 flex items-center bg-[#18181b] border border-[#27272a] rounded-full p-1 shadow-inner">
          <button 
            onClick={() => setRepurposingMode(false)}
            className={`px-6 py-1.5 rounded-full text-[13px] font-mono font-bold uppercase tracking-widest transition-all ${
              !repurposingMode ? 'bg-[#fafafa] text-[#09090b]' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Analyze Drug
          </button>
          <button 
            onClick={() => setRepurposingMode(true)}
            className={`px-6 py-1.5 rounded-full text-[13px] font-mono font-bold uppercase tracking-widest transition-all ${
              repurposingMode ? 'bg-[#fafafa] text-[#09090b]' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Find Disease Target
          </button>
        </div>

        <div className="w-full bg-[#1c1b1d] border border-white/10 p-1.5 flex gap-2 focus-within:border-white/30 transition-all shadow-xl">
          <input
            className="flex-1 bg-transparent text-white font-mono text-sm px-4 py-3 outline-none placeholder:text-neutral-600"
            placeholder={repurposingMode ? "e.g., Aspirin, Metformin, Imatinib..." : "aspirin · ibuprofen · CC(=O)Oc1ccccc1C(=O)O"}
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
            {isLoading ? 'Processing...' : (repurposingMode ? 'Search Targets' : 'Analyze')}
          </button>
        </div>

        {!repurposingMode && suggestions.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest self-center mr-2">Quick select:</span>
            {suggestions.map(name => (
              <button
                key={name}
                onClick={() => { setValue(name); onAnalyze(name); }}
                className="px-3 py-1.5 bg-[#1c1b1d] border border-white/5 font-mono text-[12px] text-neutral-400 uppercase hover:border-white/20 hover:text-white transition-all whitespace-nowrap"
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

const AnalysisHeader = ({ data, onNewAnalysis, mode }) => (
  <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
    <div>
      <span className="font-mono text-[0.8rem] text-neutral-400 tracking-widest uppercase mb-2 block">
        {mode === 'repurposing' ? 'Repurposing Analysis' : 'Active Analysis'} / Project {String(Date.now()).slice(-4)}
      </span>
      <h1 className="text-3xl font-bold tracking-tighter uppercase text-white">
        {data.molecule_name}
        {data.molecular_formula && (
          <span className="text-neutral-500 font-mono text-base ml-4">
            {data.molecular_formula}
          </span>
        )}
      </h1>
    </div>
    <div className="flex items-center gap-6">
      {!data.results && (
        <>
          <div className="text-right hidden md:block">
            <p className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest mb-0.5">Molecular Weight</p>
            <p className="font-mono text-sm text-white font-bold">{data.molecular_weight?.toFixed(2)} g/mol</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest mb-0.5">Analysis ID</p>
            <p className="font-mono text-sm text-white font-bold">#MOL-{String(data.molecular_weight).replace('.', '')}</p>
          </div>
        </>
      )}
      <button
        onClick={onNewAnalysis}
        className="px-5 py-2 border border-white/20 font-mono text-[12px] uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white/40 transition-all"
      >
        New Analysis
      </button>
    </div>
  </div>
);

const App = () => {
  const [data, setData] = useState(null);
  const [repurposingData, setRepurposingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [repurposingMode, setRepurposingMode] = useState(false);

  const handleAnalyze = async (inputValue) => {
    if (!inputValue) return;
    setLoading(true);
    setData(null);
    setRepurposingData(null);
    setErrorType(null);

    const endpoint = repurposingMode ? '/api/v1/repurpose/' : '/api/v1/analyze/';

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputValue }),
      });
      
      if (!res.ok) {
        setErrorType(res.status);
        return;
      }
      
      const result = await res.json();
      if (repurposingMode) {
        setRepurposingData(result);
      } else {
        setData(result);
      }
    } catch {
      setErrorType(500);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setRepurposingData(null);
    setErrorType(null);
  };

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

  const analyzerContent = (
    <Layout onAnalyze={handleAnalyze} isLoading={loading}>
      <div className="flex-1 overflow-y-auto bg-[#131315] relative min-h-0">
        {/* Atmospheric glow */}
        <div className="fixed top-0 right-0 w-[700px] h-[700px] bg-white/[0.025] blur-[140px] rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none z-0" />

        <div className="relative z-10 px-8 md:px-12 py-10">
          {!data && !repurposingData && !loading && !errorType && (
            <EmptyHero 
              onAnalyze={handleAnalyze} 
              isLoading={loading} 
              repurposingMode={repurposingMode}
              setRepurposingMode={(mode) => {
                setRepurposingMode(mode);
                handleReset();
              }}
            />
          )}

          {loading && (
            <div className="animate-pulse">
              <LoadingGrid />
            </div>
          )}

          {data && !loading && (
            <div>
              <AnalysisHeader data={data} onNewAnalysis={handleReset} />
              <ResultsGrid data={data} />
            </div>
          )}

          {repurposingData && !loading && (
            <div className="max-w-5xl mx-auto">
              <AnalysisHeader data={repurposingData} onNewAnalysis={handleReset} mode="repurposing" />
              <RepurposingCard 
                results={repurposingData.results} 
                bestTarget={repurposingData.best_target} 
                moleculeName={repurposingData.molecule_name} 
              />
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
                <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">Druggability</span>
                <span className="font-mono text-sm font-bold text-white uppercase">
                  {data.druggability.druggability_score.toFixed(1)} / 100 · Grade {data.druggability.grade}
                </span>
              </div>
              <div className="hidden md:flex flex-col gap-0.5">
                <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">Processing Time</span>
                <span className="font-mono text-sm font-bold text-white uppercase">{data.processing_time_ms} ms</span>
              </div>
              <div className="hidden md:flex flex-col gap-0.5">
                <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">Lipinski</span>
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

        {/* Footer for repurposing mode */}
        {repurposingData && !loading && (
          <footer className="fixed bottom-0 right-0 left-20 md:left-64 h-20 bg-[#131315]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-8 md:px-12 z-40">
            <div className="flex gap-8 md:gap-12">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">Highest Potential</span>
                <span className="font-mono text-sm font-bold text-white uppercase">
                  {repurposingData.best_target.disease} · {repurposingData.best_target.repurposing_score.toFixed(1)}/100
                </span>
              </div>
              <div className="hidden md:flex flex-col gap-0.5">
                <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">Integration</span>
                <span className="font-mono text-sm font-bold text-white uppercase">Live ChEMBL Fetch</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 border border-white/20 font-mono text-[10px] uppercase font-bold tracking-widest text-white hover:bg-white hover:text-black transition-all"
              >
                New Search
              </button>
              <button className="px-8 py-2.5 bg-white text-black font-mono text-[10px] uppercase font-bold tracking-[0.15em] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Download PDF
              </button>
            </div>
          </footer>
        )}
      </div>
    </Layout>
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/analyzer" element={analyzerContent} />
      <Route path="/synthesis" element={<SynthesisPage />} />
    </Routes>
  );
};

export default App;
