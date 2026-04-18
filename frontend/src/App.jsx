import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import HistorySidebar from './components/shared/HistorySidebar';
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
import AnalyzerDashboard from './pages/AnalyzerDashboard';
import AnalyzerDashboardDesktop from './pages/AnalyzerDashboardDesktop';
import MainAnalyzer from './pages/MainAnalyzer';
import MoleculeComparator from './pages/MoleculeComparator';

import { API_BASE as API_BASE_URL } from './config';

const EmptyHero = ({ onAnalyze, isLoading, repurposingMode, setRepurposingMode, value, setValue }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
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
  const [inputValue, setInputValue] = useState('');

  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('mol_history');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleAnalyze = async (input) => {
    const val = input || inputValue;
    if (!val) return;
    setLoading(true);
    setData(null);
    setRepurposingData(null);
    setErrorType(null);

    const endpoint = repurposingMode ? '/api/v1/repurpose/' : '/api/v1/analyze/';

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: val }),
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
        // Add to history
        const newEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          molecule_name: result.molecule_name,
          canonical_smiles: result.canonical_smiles,
          molecular_formula: result.molecular_formula,
          molecular_weight: result.descriptors.molecular_weight,
          druggability_score: result.druggability.druggability_score,
          grade: result.druggability.grade,
          binding_strength: result.binding_affinity.binding_strength,
          pkd: result.binding_affinity.pkd,
          lipinski_pass: result.lipinski_pass,
          overall_admet_score: result.admet.overall_admet_score,
          fullData: result
        };
        setHistory(prev => {
          const filtered = prev.filter(h => 
            h.molecule_name?.toLowerCase() !== newEntry.molecule_name?.toLowerCase()
          );
          const updated = [newEntry, ...filtered].slice(0, 10);
          try { localStorage.setItem('mol_history', JSON.stringify(updated)); } catch {}
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setErrorType(500);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setRepurposingData(null);
    setErrorType(null);
    setInputValue('');
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

  const mainViewStyle = {
    marginRight: sidebarOpen && window.innerWidth >= 768 ? '320px' : '0',
    transition: 'margin 300ms cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const analyzerContent = (
    <Layout onAnalyze={handleAnalyze} isLoading={loading} onOpenHistory={() => setSidebarOpen(true)}>
      <div className="flex-1 overflow-y-auto bg-[#131315] relative min-h-0" style={mainViewStyle}>
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
              value={inputValue}
              setValue={setInputValue}
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
  return (
    <div className="relative min-h-screen overflow-hidden">
      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#111113] border border-[#27272a] border-r-0 rounded-l-lg px-2 py-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-[#18181b] transition-all group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#52525b] group-hover:text-white transition-colors">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="vertical-rl text-[10px] font-medium text-[#52525b] group-hover:text-white uppercase tracking-[0.08em] transition-colors" style={{ writingMode: 'vertical-rl' }}>
            HISTORY
          </span>
          {history.length > 0 && (
            <span className="bg-[#22c55e] text-[#09090b] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {history.length}
            </span>
          )}
        </button>
      )}

      <HistorySidebar 
        history={history}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(entry) => {
          setData(entry.fullData);
          setInputValue(entry.molecule_name);
          setSidebarOpen(window.innerWidth >= 768);
        }}
        onClear={() => {
          setHistory([]);
          localStorage.removeItem('mol_history');
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<AnalyzerDashboardDesktop onOpenHistory={() => setSidebarOpen(true)} />} />
        <Route path="/discovery" element={<MainAnalyzer onOpenHistory={() => setSidebarOpen(true)} />} />
        <Route 
          path="/analyzer" 
          element={
            <Layout 
              onOpenHistory={() => setSidebarOpen(true)}
              sidebarContent={
                <div className="flex flex-col gap-6">
                  <div className="p-6 bg-white/[0.03] border border-white/5">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block mb-4">Input Stream</span>
                    <InputBar onAnalyze={handleAnalyze} isLoading={loading} initialValue={inputValue} />
                  </div>
                  <StatsStrip />
                </div>
              }
            >
              {error ? (
                <div className="flex-1 flex items-center justify-center p-12">
                  <div className="max-w-md w-full bg-red-500/5 border border-red-500/20 p-8 text-center">
                    <span className="material-symbols-outlined text-red-400 text-4xl mb-4">error</span>
                    <h3 className="text-white font-bold uppercase tracking-tight mb-2">Analysis Failed</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-6">{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="px-6 py-2 border border-white/20 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ) : data ? (
                <ResultsGrid data={data} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 group">
                  <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border border-white/20 rounded-full animate-[spin_60s_linear_infinite]">
                      <div className="absolute inset-4 border border-white/10 rounded-full border-dashed"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-3xl">biotech</span>
                    </div>
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-white">Initialize Molecular Stream</p>
                </div>
              )}

              {/* Fixed footer bar — only when results are showing */}
              {data && !loading && (
                <footer className="fixed bottom-0 right-0 left-20 md:left-64 h-20 bg-[#131315]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-8 md:px-12 z-40" style={mainViewStyle}>
                  <div className="flex gap-8 md:gap-12">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">Global Stability</span>
                      <span className="font-mono text-sm font-bold text-white uppercase">
                        {data.molecule_name} · Grade {data.druggability?.grade}
                      </span>
                    </div>
                    <div className="hidden md:flex flex-col gap-0.5">
                      <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">Confidence</span>
                      <span className="font-mono text-sm font-bold text-white uppercase">
                        {(data.binding_affinity?.confidence * 100 || 0).toFixed(1)}% Accuracy
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
                <footer className="fixed bottom-0 right-0 left-20 md:left-64 h-20 bg-[#131315]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-8 md:px-12 z-40" style={mainViewStyle}>
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
            </Layout>
          } 
        />
        <Route path="/analytics" element={<AnalyzerDashboard onOpenHistory={() => setSidebarOpen(true)} />} />
        <Route path="/compare" element={<MoleculeComparator onOpenHistory={() => setSidebarOpen(true)} />} />
        <Route path="/synthesis" element={<SynthesisPage onOpenHistory={() => setSidebarOpen(true)} />} />
      </Routes>
    </div>
  );
};

export default App;
