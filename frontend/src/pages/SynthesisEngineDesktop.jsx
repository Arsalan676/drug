import React from 'react';
import Layout from '../components/shared/Layout';

const SynthesisEngineDesktop = () => {
  return (
    <Layout>
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden relative">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {/* Left Side Panel: Synthesis Strategy */}
        <aside className="col-span-12 lg:col-span-3 bg-[#1c1b1d] border-r border-white/5 flex flex-col h-full z-10">
          <div className="p-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Active Sequence</span>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase mt-1">Strategy Alpha-7</h2>
              </div>
              <span className="material-symbols-outlined text-neutral-600">analytics</span>
            </div>
            
            {/* Timeline */}
            <div className="space-y-0">
              {[
                { step: '01', status: 'COMPLETED', title: 'Catalyst Injection', desc: 'Pre-molar saturation phase at 420K completed successfully.', active: false, done: true },
                { step: '02', status: 'PROCESSING', title: 'Lattice Stability', desc: 'Current stability variance within nominal range.', active: true, progress: 66 },
                { step: '03', status: 'QUEUED', title: 'Thermal Stabilization', active: false },
                { step: '04', status: 'QUEUED', title: 'Bond Crystallization', active: false },
              ].map((item, index, arr) => (
                <div key={item.step} className={`relative pl-8 pb-12 ${index === arr.length - 1 ? 'border-l border-transparent' : 'border-l border-white/10'}`}>
                  <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full border border-[#131315] ${item.done ? 'bg-white' : item.active ? 'bg-white animate-pulse' : 'bg-neutral-800'}`}></div>
                  <div className="flex flex-col gap-1">
                    <span className={`font-mono text-[9px] uppercase tracking-wider ${item.active ? 'text-white font-bold' : 'text-neutral-500'}`}>
                      STEP {item.step} — {item.status}
                    </span>
                    <span className={`text-sm font-bold ${item.active || item.done ? 'text-white' : 'text-neutral-600'} uppercase`}>
                      {item.title}
                    </span>
                    {item.desc && <p className="text-[11px] text-neutral-500 leading-relaxed mt-2 font-light">{item.desc}</p>}
                    {item.progress && (
                      <div className="w-full h-[2px] bg-neutral-800 mt-3 overflow-hidden rounded-full">
                        <div className="bg-white h-full" style={{ width: `${item.progress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Sparkline for Stability */}
          <div className="mt-auto p-8 bg-[#2a2a2c]/30 border-t border-white/5">
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block mb-6">Oscillation Delta (mHz)</span>
            <div className="flex items-end gap-1.5 h-12">
              {[50, 75, 33, 100, 66, 50, 25, 45, 90, 60].map((h, i) => (
                <div 
                  key={i} 
                  style={{ height: `${h}%` }} 
                  className={`flex-1 transition-all duration-500 ${h > 80 ? 'bg-white' : h > 50 ? 'bg-neutral-400' : 'bg-neutral-800'}`}
                ></div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Pane: 3D Visualization */}
        <section className="col-span-12 lg:col-span-6 relative flex items-center justify-center p-12 overflow-hidden bg-[#131315]">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-0 left-0 flex items-center gap-4 z-20">
              <div className="h-px w-8 bg-white/50"></div>
              <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">Live Render Kernel::VX4</span>
            </div>
            
            {/* Main Visualization Asset */}
            <div className="m-auto w-4/5 aspect-square relative z-10 flex items-center justify-center">
              <img 
                alt="Molecular Lattice" 
                className="w-full h-full object-contain filter grayscale invert brightness-200 mix-blend-screen opacity-50 hover:opacity-100 transition-opacity duration-1000" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDluRSIPLRBUMrdI27JSnkNh2hMoqHAe6CBECc3Y-6zbVx_zT1q-QWpC-zQU5CT9G9pCzGAtmyownT5oWNjXF2YsdjNwOzuXYePwGQDyGQsXmjdhGA9R75K8-7Of1rksC_Oa4_PaKmQc54BdZHfMAHuz_Hxt9wmwcegqLzawfvET-NVmGC899iMC8itNyhxACE5o_CvJWIftiuag_sm8hR5iFI9SzEtYYerTJ5YuM8g_m2JWL8CGEIi8THWacRfnumXuivX-NcrXL4"
              />
              {/* Overlay Telemetry Circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[110%] h-[110%] border border-white/5 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                  <div className="w-[85%] h-[85%] border border-white/10 rounded-full border-dashed"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 flex flex-col items-end gap-3 z-20">
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest opacity-60">Coord Axis: 142.0.42 // 02</span>
              <div className="flex gap-4">
                <button className="bg-[#1c1b1d] p-3 text-neutral-400 hover:text-white transition-all border border-white/5 rounded-sm">
                  <span className="material-symbols-outlined text-sm">zoom_in</span>
                </button>
                <button className="bg-[#1c1b1d] p-3 text-neutral-400 hover:text-white transition-all border border-white/5 rounded-sm">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
                <button className="bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-sm">
                  Snapshot
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side Panel: Efficiency & Metrics */}
        <aside className="col-span-12 lg:col-span-3 bg-[#1c1b1d] border-l border-white/5 p-8 flex flex-col z-10">
          <div className="flex flex-col gap-10">
            {/* Confidence Metric */}
            <div className="bg-[#2a2a2c] p-6 relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rotate-45 translate-x-8 -translate-y-8"></div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-[0.2em]">Confidence Index</span>
              <div className="flex items-baseline gap-2 mt-6">
                <span className="text-5xl font-bold text-white tracking-tighter">98.4</span>
                <span className="font-mono text-xl text-neutral-600">%</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider font-bold">Nominal Variance</span>
              </div>
            </div>

            {/* Processing Metric */}
            <div className="p-2 border-l-2 border-white/10 ml-2">
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-[0.2em]">Processing Speed</span>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-bold text-white tracking-tighter">1.2</span>
                <span className="font-mono text-sm text-neutral-600 uppercase font-bold">ms / node</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-4 leading-relaxed font-light">
                HPC cluster latency optimized for real-time synthesis feedback loops.
              </p>
            </div>

            {/* Grid of Small Metrics */}
            <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
              {[
                { label: 'Yield Pred.', value: '92.8%' },
                { label: 'Thermal', value: '312.4K' },
                { label: 'Atomic %', value: '14.22' },
                { label: 'Complexity', value: 'S-III' },
              ].map((m) => (
                <div key={m.label} className="p-5 bg-[#1c1b1d]">
                  <span className="font-mono text-[9px] font-bold text-neutral-600 uppercase tracking-widest">{m.label}</span>
                  <div className="text-lg font-bold text-white mt-1 uppercase leading-none">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Distribution Chart */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Bond Distribution</span>
                <span className="font-mono text-[10px] text-neutral-700">ISO:04</span>
              </div>
              <div className="flex h-2.5 gap-0.5 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[40%]"></div>
                <div className="bg-neutral-400 h-full w-[25%] opacity-80"></div>
                <div className="bg-neutral-600 h-full w-[15%] opacity-60"></div>
                <div className="bg-neutral-800 h-full w-[20%]"></div>
              </div>
              <div className="flex justify-between mt-3">
                <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-widest font-bold">C-H 42%</span>
                <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-widest font-bold">O-H 12%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
};

export default SynthesisEngineDesktop;
