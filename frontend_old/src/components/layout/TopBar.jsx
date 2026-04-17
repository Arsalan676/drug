import React from 'react';

export default function TopBar({ processingTime }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16"
            style={{ background: '#131315', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-10">
        <h1 className="text-white font-bold tracking-tighter text-lg"
            style={{ fontFamily: 'Instrument Sans' }}>
          Molecular Intelligence
        </h1>
        <nav className="flex items-center gap-7">
          {[['Research', true], ['Datasets', false], ['Simulations', false]].map(([label, active]) => (
            <a key={label} href="#"
               className={`text-sm transition-colors pb-1 ${
                 active
                   ? 'text-white border-b border-white'
                   : 'text-[#474747] hover:text-[#919191]'
               }`}
               style={{ fontFamily: 'Instrument Sans', fontWeight: active ? 600 : 400 }}>
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5"
             style={{ background: '#1c1b1d', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="material-symbols-outlined text-lg" style={{ color: '#474747' }}>search</span>
          <input
            placeholder="Search molecules…"
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[#474747] w-40"
            style={{ fontFamily: 'JetBrains Mono' }}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#474747] hover:text-white cursor-pointer transition-colors">notifications</span>
          <span className="material-symbols-outlined text-[#474747] hover:text-white cursor-pointer transition-colors">settings</span>
        </div>

        {processingTime > 0 && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#474747', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {(processingTime / 1000).toFixed(2)}s
          </span>
        )}
      </div>
    </header>
  );
}
