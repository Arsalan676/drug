import React from 'react';

export const Navbar = () => (
  <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#131315]/80 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xs">AG</div>
      <span className="font-bold tracking-tighter text-white uppercase text-sm">Drug Discovery Intelligence</span>
    </div>
    <div className="flex gap-6">
      <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">PRIME-NODE-04</span>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    </div>
  </nav>
);

export const HeroInput = ({ onAnalyze, isLoading }) => {
  const [value, setValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:8000/api/v1/analyze/molecules')
      .then(res => res.json())
      .then(data => setSuggestions(data.molecules || []))
      .catch(err => console.error('Failed to load local database', err));
  }, []);
  
  return (
    <section className="py-20 flex flex-col items-center text-center">
      <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">Neural Architecture Analysis</span>
      <h1 className="text-6xl font-bold text-white tracking-tighter uppercase mb-8 max-w-3xl">
        Decode Molecular <br/><span className="text-neutral-500">Viability In Real-time</span>
      </h1>
      <div className="w-full max-w-2xl bg-[#1c1b1d] border border-white/10 p-2 flex gap-2 focus-within:border-white/30 transition-all">
        <input 
          className="flex-1 bg-transparent border-none text-white font-mono text-sm px-4 focus:ring-0 placeholder:text-neutral-600 outline-none"
          placeholder="Enter SMILES notation or molecule name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && value && onAnalyze(value)}
        />
        <button 
          onClick={() => onAnalyze(value)}
          disabled={isLoading || !value}
          className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Analyze'}
        </button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="text-[9px] text-[#52525b] uppercase font-bold tracking-widest self-center mr-2">Quick Select:</span>
          {suggestions.map(name => (
            <button 
              key={name}
              onClick={() => {
                setValue(name);
                onAnalyze(name);
              }}
              className="px-3 py-1.5 bg-[#1c1b1d] border border-white/5 text-[10px] text-neutral-400 font-mono uppercase hover:border-white/20 hover:text-white transition-all whitespace-nowrap"
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <p className="mt-8 text-[10px] text-neutral-600 font-mono uppercase tracking-widest">Powered by Advanced Agentic Coding Architecture</p>
    </section>
  );
};

export const ErrorState = ({ type }) => (
  <div className="py-12 px-8 bg-red-500/10 border border-red-500/20 text-center rounded-xl mb-12">
    <span className="material-symbols-outlined text-red-500 mb-4 text-4xl">warning</span>
    <h3 className="text-red-500 font-bold uppercase tracking-tighter text-xl">Analysis Terminal Failure</h3>
    <p className="text-red-400/60 font-mono text-xs mt-2 uppercase tracking-widest">
      {type === 404 ? 'Target molecule not found in primary databases' : 'Critical backend processing error (Error Code: ' + type + ')'}
    </p>
  </div>
);

export const ProteinTargetsSection = () => (
  <section className="py-24 border-t border-white/5">
    <h2 className="text-2xl font-bold text-white tracking-tighter uppercase mb-12">Binding Affinity Targets</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {['BRAF V600E', 'EGFR Variant', 'HDAC6', 'MAO-B'].map(target => (
        <div key={target} className="p-6 bg-[#1c1b1d] border border-white/5 hover:border-white/20 transition-all group">
          <span className="font-mono text-[9px] text-neutral-500 uppercase">{target}</span>
          <div className="text-xl font-bold text-white mt-2 group-hover:text-green-400 transition-colors uppercase select-none">Active Site</div>
        </div>
      ))}
    </div>
  </section>
);

export const Footer = () => (
  <footer className="py-12 border-t border-white/5 flex flex-col items-center">
    <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest mb-4">© 2026 DeepMind Agentic Coding Division</span>
    <div className="flex gap-8">
      <span className="text-[10px] text-neutral-700 font-mono uppercase hover:text-white cursor-pointer transition-colors">Documentation</span>
      <span className="text-[10px] text-neutral-700 font-mono uppercase hover:text-white cursor-pointer transition-colors">API Endpoint</span>
      <span className="text-[10px] text-neutral-700 font-mono uppercase hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
    </div>
  </footer>
);
