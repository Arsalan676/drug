import React from 'react';

const NAV = [
  { icon: 'grid_view',              label: 'Dashboard',  active: true  },
  { icon: 'biotech',                label: 'Discovery',  active: false },
  { icon: 'query_stats',            label: 'Analytics',  active: false },
  { icon: 'precision_manufacturing',label: 'Synthesis',  active: false },
  { icon: 'menu_book',              label: 'Library',    active: false },
];

export default function SideNav({ status }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col py-8 px-4 z-40"
           style={{ background: '#1c1b1d', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-10">
        <div className="w-8 h-8 flex items-center justify-center"
             style={{ background: '#ffffff' }}>
          <span className="material-symbols-outlined text-sm" style={{ color: '#1a1c1c' }}>science</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none"
             style={{ fontFamily: 'Instrument Sans' }}>Drug Discovery</p>
          <p className="text-[10px] uppercase tracking-widest mt-0.5"
             style={{ fontFamily: 'JetBrains Mono', color: '#474747' }}>AI Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV.map(item => (
          <a key={item.label} href="#"
             className={`flex items-center gap-4 px-3 py-3 transition-all duration-150 group
               ${item.active
                 ? 'bg-white text-[#1a1c1c]'
                 : 'text-[#919191] hover:bg-[#2a2a2c] hover:text-white'
               }`}>
            <span className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-4">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-white text-[#1a1c1c] font-bold text-xs uppercase tracking-widest transition-all hover:bg-[#e5e1e4] active:scale-[0.98]"
                style={{ fontFamily: 'JetBrains Mono' }}>
          New Experiment
          <span className="material-symbols-outlined text-base">add</span>
        </button>

        <div className="pt-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {[['help_outline','Docs'],['contact_support','Support']].map(([icon, label]) => (
            <a key={label} href="#"
               className="flex items-center gap-3 px-3 py-2 text-[#474747] hover:text-[#919191] transition-colors">
              <span className="material-symbols-outlined text-lg">{icon}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
            </a>
          ))}
        </div>

        {/* API status */}
        <div className="flex items-center gap-2 px-3 py-2">
          <span className={`w-1.5 h-1.5 rounded-full ${
            status === 'online' ? 'bg-[#a8d5a2]' :
            status === 'offline' ? 'bg-[#ffb4ab]' : 'bg-[#919191]'
          }`} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#474747' }}>
            {status === 'online' ? 'API Online' : status === 'offline' ? 'API Offline' : 'Checking…'}
          </span>
        </div>
      </div>
    </aside>
  );
}
