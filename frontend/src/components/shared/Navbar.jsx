import React, { useState } from 'react';

const Navbar = ({ onAnalyze, isLoading }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim() && onAnalyze) onAnalyze(value.trim());
  };

  return (
    <header className="flex justify-between items-center w-full px-8 py-4 bg-[#131315] border-b border-white/10 z-30 sticky top-0">
      <div className="flex items-center gap-12">
        <span className="font-bold text-lg tracking-tighter text-white uppercase">MOLECULAR INTELLIGENCE</span>
        <nav className="hidden lg:flex items-center gap-8">
          
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"></span>
          <input
            className="bg-[#2a2a2c] border-none text-sm font-mono py-2 pl-9 pr-10 w-72 rounded-sm focus:ring-1 focus:ring-white transition-all text-white outline-none"
            placeholder="Molecule name or SMILES..."
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {isLoading ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            value && (
              <button
                onClick={handleSubmit}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            )
          )}
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <button className="hover:text-white transition-colors scale-95 active:scale-100"><span className="material-symbols-outlined">science</span></button>
          <button className="hover:text-white transition-colors scale-95 active:scale-100"><span className="material-symbols-outlined">settings</span></button>
          <button className="hover:text-white transition-colors scale-95 active:scale-100 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 ml-2 cursor-pointer bg-[#2a2a2c] flex items-center justify-center">
            <span className="material-symbols-outlined text-neutral-500 text-sm">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
