import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: 'grid_view', path: '/' },
  { name: 'Discovery', icon: 'biotech', path: '/analyzer' },
  { name: 'Analytics', icon: 'query_stats', path: '/dashboard' },
  { name: 'Synthesis', icon: 'precision_manufacturing', path: '/synthesis' },
  { name: 'Library', icon: 'menu_book', path: '#' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-[#1c1b1d] w-20 md:w-64 border-r border-white/5">
      <div className="mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
            <span className="material-symbols-outlined text-black text-lg">science</span>
          </div>
          <div className="hidden md:block">
            <h1 className="font-black text-white text-base leading-none">Research Unit</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Precision Brutalism</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-3 py-3 font-mono text-[11px] uppercase tracking-widest transition-all rounded-sm ${
                isActive 
                  ? 'bg-white text-black font-bold' 
                  : 'text-neutral-400 hover:bg-[#2a2a2c] hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill-current' : ''}`} 
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className="hidden md:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <button className="hidden md:flex w-full bg-white text-black font-bold py-3 px-4 rounded-sm text-sm items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <span className="material-symbols-outlined text-sm">add</span>
          New Experiment
        </button>
        <div className="pt-6 space-y-2 border-t border-white/5">
          <a className="flex items-center gap-4 px-3 py-2 text-neutral-500 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">help_outline</span>
            <span className="hidden md:block">Documentation</span>
          </a>
          <a className="flex items-center gap-4 px-3 py-2 text-neutral-500 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">contact_support</span>
            <span className="hidden md:block">Support</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
