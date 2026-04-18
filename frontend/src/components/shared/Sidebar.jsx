import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'ANALYZE', icon: 'biotech', path: '/analyzer' },
  { name: 'ANALYTICS', icon: 'query_stats', path: '/analytics' },
  { name: 'COMPARE', icon: 'compare_arrows', path: '/compare' },
  { name: 'SYNTHESIS', icon: 'precision_manufacturing', path: '/synthesis' },
  { name: 'LIBRARY', icon: 'menu_book', path: '#' },
  { name: 'HISTORY', icon: 'history', path: '#history' },
];

const Sidebar = ({ onOpenHistory }) => {
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
            <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 mt-1">Precision Brutalism</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isHistory = item.name === 'HISTORY';
          
          const content = (
            <>
              <span
                className="material-symbols-outlined flex-shrink-0 text-[24px] w-6 h-6 flex items-center justify-center"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="hidden md:block truncate">{item.name}</span>
            </>
          );

          const className = `flex items-center gap-3 px-3 py-3 font-mono text-[13px] uppercase tracking-widest transition-all rounded-sm overflow-hidden min-w-0 w-full text-left ${
            isActive
              ? 'bg-white text-black font-bold'
              : 'text-neutral-300 hover:bg-[#2a2a2c] hover:text-white'
          }`;

          if (isHistory) {
            return (
              <button
                key={item.name}
                onClick={onOpenHistory}
                className={className}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={className}
            >
              {content}
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
          <a className="flex items-center gap-4 px-3 py-2 text-neutral-400 font-mono text-[13px] uppercase tracking-widest hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">description</span>
            
          </a>
          <a className="flex items-center gap-4 px-3 py-2 text-neutral-400 font-mono text-[13px] uppercase tracking-widest hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">contact_support</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
