import React from 'react';
import Layout from '../components/shared/Layout';

const MainAnalyzer = ({ onOpenHistory }) => {
  return (
    <Layout onOpenHistory={onOpenHistory}>
      <div className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-y-auto custom-scrollbar relative">
        {/* Atmospheric Lighting Glow */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white opacity-[0.02] blur-[120px] pointer-events-none"></div>

        {/* Left Column: Molecular Structure */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1c1b1d] p-6 flex-1 min-h-[400px] flex flex-col relative overflow-hidden group border border-white/5">
            <div className="flex justify-between items-start mb-4 z-10">
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1 text-white">MOL-7829-X</h3>
                <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest opacity-80">Active Ligand Binding Mode</span>
              </div>
              <span className="material-symbols-outlined text-neutral-500 cursor-pointer hover:text-white transition-colors">open_in_full</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              <img 
                alt="3D Molecular Model" 
                className="w-full h-full object-contain mix-blend-screen opacity-90 group-hover:scale-105 transition-transform duration-1000" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVvlQYLYgpB52Nu9phJuhx87Pwd8AL_0BOlmK7isGwD233sntFS-iJmTms134n7Rj0K-fAGTkkvkUzMD8VeohVDHoiJunnCM-qXmHeZj3L-Fms-w2sLjHDwQoXdP9jqrwd2fFW_gnAA0KtTc4n173Wr-EY8i174ncvpfVVhvbVpUpUy7Nl3mgsYInSntGAqp2WN7jkF5YlDNByzoiLqElmXICG6GhzYewGxmfupri5jGho1hnXZA9YdYIiBeYcmzSVKQWztc5fWaM"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1d] via-transparent to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 z-10 border-t border-white/10 pt-6">
              {[
                { label: 'Molecular Mass', value: '442.54', unit: 'g/mol' },
                { label: 'LogP (Lipophilicity)', value: '3.12', unit: 'clogP' },
                { label: 'H-Bond Donors', value: '2' },
                { label: 'PSA (Surface Area)', value: '84.32', unit: 'Å²' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-mono text-[10px] text-neutral-500 uppercase mb-1">{item.label}</p>
                  <p className="font-mono text-lg font-bold text-white">
                    {item.value} {item.unit && <span className="text-xs font-normal text-neutral-500">{item.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Center Column: Binding Affinity */}
        <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#1c1b1d] p-6 flex flex-col h-full border border-white/5">
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-6 text-white">Binding Affinity Profile</h3>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-7xl font-bold tracking-tighter text-white">8.42</span>
                <div className="flex flex-col">
                  <span className="font-mono text-sm font-bold text-neutral-500">pKd Score</span>
                  <span className="text-[10px] uppercase tracking-widest text-white flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                    High Affinity
                  </span>
                </div>
              </div>
            </div>

            {/* Affinity Spectrum Chart */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex justify-between items-end mb-2">
                <h4 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Spectral Affinity (nM range)</h4>
                <span className="font-mono text-[10px] text-neutral-400">Target: BRAF V600E</span>
              </div>
              <div className="flex items-end gap-2 h-48 px-2 border-b border-white/10">
                {[30, 45, 85, 60, 25, 40, 15, 70].map((height, i) => (
                  <div 
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`flex-1 transition-all duration-300 relative group cursor-pointer ${i === 2 ? 'bg-white' : 'bg-neutral-800 hover:bg-neutral-600'}`}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2a2a2c] text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] border border-white/10 z-20 whitespace-nowrap">
                      {i === 2 ? '8.42 pKd' : `${(height/10).toFixed(2)} pKd`}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 px-2">
                {['S1', 'S2', 'S3 (Act)', 'S4', 'S5', 'S6', 'S7', 'S8'].map((label, i) => (
                  <span key={i} className={`font-mono text-[8px] uppercase ${i === 2 ? 'text-white font-bold' : 'text-neutral-600'}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-[#2a2a2c] p-6 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Inhibition Potential</span>
                <span className="font-mono text-xs font-bold text-white">98.2%</span>
              </div>
              <div className="w-full bg-[#1c1b1d] h-[2px]">
                <div className="bg-white h-full w-[98.2%]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: ADMET Safety */}
        <section className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="bg-[#1c1b1d] p-6 flex flex-col border border-white/5">
            <h3 className="font-bold text-lg mb-8 text-white">ADMET Safety Profile</h3>
            <div className="space-y-8">
              {[
                { label: 'Absorption', value: '0.88', percentage: 88, status: 'High' },
                { label: 'BBB Penetration', value: '0.12', percentage: 12, status: 'Low', warning: true },
                { label: 'Toxicity Risk', value: '0.04', percentage: 4, status: 'Minimal' },
                { label: 'Metabolic Stability', value: '0.75', percentage: 75, status: 'Stable' },
              ].map((item) => (
                <div key={item.label} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{item.label}</span>
                    <span className={`font-mono text-xs font-bold ${item.warning ? 'text-red-400' : 'text-white'}`}>
                      {item.status} ({item.value})
                    </span>
                  </div>
                  <div className="h-1 bg-[#2a2a2c] relative">
                    <div className={`h-full ${item.warning ? 'bg-red-400' : 'bg-white'}`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-2 border-white border-dashed flex items-center justify-center mb-4">
                <span className="font-mono text-xl font-bold text-white">A+</span>
              </div>
              <p className="font-mono text-[10px] text-neutral-500 uppercase mb-1">Final Clearance</p>
              <p className="text-xs font-bold text-white uppercase tracking-tighter">Recommended for Phase I Trials</p>
            </div>
          </div>
        </section>

        {/* Bottom Section: High Probability Targets */}
        <section className="col-span-12">
          <div className="bg-[#1c1b1d] p-8 border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg text-white uppercase tracking-tight">High-Probability Targets</h3>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Showing Top 3 Matches</span>
                <span className="material-symbols-outlined text-neutral-500 hover:text-white cursor-pointer transition-colors">filter_list</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { category: 'Oncology', score: '94%', name: 'EGFR Variant 8' },
                { category: 'Neuro', score: '82%', name: 'MAO-B Receptor' },
                { category: 'Immunology', score: '77%', name: 'IL-6 Pathway' },
              ].map((target) => (
                <div key={target.name} className="bg-[#2a2a2c] p-6 flex flex-col justify-between group hover:bg-white transition-all duration-300 cursor-pointer border border-white/5">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-2 py-0.5 bg-[#1c1b1d] text-white font-mono text-[9px] uppercase font-bold tracking-tighter group-hover:bg-black">
                      {target.category}
                    </div>
                    <span className="font-mono text-2xl font-bold text-white group-hover:text-black">{target.score}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-black text-xl mb-1 uppercase tracking-tight">{target.name}</h4>
                    <p className="font-mono text-[10px] text-neutral-500 group-hover:text-black/60 uppercase">Binding Confidence Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MainAnalyzer;
