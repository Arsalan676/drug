import React from 'react';
import Layout from '../components/shared/Layout';

const AnalyzerDashboardDesktop = () => {
  return (
    <Layout>
      <main className="flex-1 overflow-y-auto bg-[#131315] relative custom-scrollbar">
        {/* Atmospheric Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <div className="px-12 py-10 flex flex-col gap-10">
          {/* Dashboard Title Section */}
          <div className="flex justify-between items-end border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-[0.75rem] text-neutral-500 tracking-widest uppercase mb-2 block">Active Analysis / Project 049</span>
              <h1 className="text-4xl font-bold tracking-tighter uppercase text-white">Molecular Structure: C20H25N3O</h1>
            </div>
            <div className="text-right">
              <span className="font-mono text-[0.75rem] text-neutral-500 uppercase">Analysis ID: </span>
              <span className="font-mono text-[0.75rem] text-white">#MOL-8839-XZ</span>
            </div>
          </div>

          {/* Top Grid: 3D Visualizer & Quick Metrics */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: 3D Visualization */}
            <div className="col-span-12 lg:col-span-8 bg-[#1c1b1d] relative min-h-[500px] flex items-center justify-center overflow-hidden border border-white/5">
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-4">
                <div className="bg-[#353437]/80 backdrop-blur-md px-4 py-3 rounded-sm border border-white/10">
                  <span className="font-mono text-[0.65rem] text-neutral-400 block mb-1 uppercase tracking-widest">Viewport Config</span>
                  <div className="flex gap-4">
                    <button className="text-[10px] font-mono text-white bg-white/10 px-2 py-1 uppercase font-bold">Grid: On</button>
                    <button className="text-[10px] font-mono text-neutral-500 px-2 py-1 uppercase">Ray: Off</button>
                    <button className="text-[10px] font-mono text-white bg-white/10 px-2 py-1 uppercase font-bold">Res: 4K</button>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]"></div>
              
              {/* Mock 3D Model Placeholder */}
              <img 
                alt="3D Molecular Model" 
                className="w-3/4 h-3/4 object-contain opacity-90 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] grayscale hover:grayscale-0 transition-all duration-1000" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKsBuJSLxqDaw8jiTp3zPh7_AqEQPjh1VWd1u_1hLOOx5MTlZK_n13pqcHp8uvj1Zk2uoFbI2APl0UuQLmGX-NS-Fuz-1EhyCNnApGTKlI0bFJWuC3yii4cZgIqImAxLf3V5I3-kChEOrvrF0nfDuyk71ssH6A5vsixxwRx8PD2I7mXztiqXGcpbLxeosPrJP_83h0OY0T5X2AeUt5v6CoXZemk9_SzDYNrbMUIerVDEP1aPKrpYbql86p8RA9qW9jIyONJsh7kFc"
              />
              
              <div className="absolute bottom-6 right-6 flex gap-2">
                {['zoom_in', 'zoom_out', 'refresh'].map((icon) => (
                  <button key={icon} className="w-10 h-10 flex items-center justify-center bg-[#2a2a2c] border border-white/10 hover:bg-white/10 transition-colors text-white">
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Key Metrics */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              {/* Metric Card 1 */}
              <div className="bg-[#1c1b1d] p-8 flex flex-col justify-between group cursor-default border border-white/5">
                <span className="font-mono text-[0.7rem] text-neutral-500 uppercase tracking-widest">Molecular Mass</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tighter text-white">323.43</span>
                  <span className="font-mono text-sm text-neutral-500 uppercase">g/mol</span>
                </div>
                <div className="mt-6 w-full h-1 bg-neutral-800 relative overflow-hidden rounded-full">
                  <div className="absolute left-0 top-0 h-full w-3/4 bg-white transition-all group-hover:w-4/5"></div>
                </div>
              </div>

              {/* Metric Card 2 */}
              <div className="bg-[#1c1b1d] p-8 flex flex-col justify-between group cursor-default border border-white/5">
                <span className="font-mono text-[0.7rem] text-neutral-500 uppercase tracking-widest">LogP (Lipophilicity)</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tighter text-white">2.45</span>
                  <span className="font-mono text-sm text-neutral-500">± 0.04</span>
                </div>
                <div className="mt-6 flex gap-1.5 h-2">
                  {[1, 1, 0, 0, 0].map((active, i) => (
                    <div key={i} className={`flex-1 ${active ? 'bg-white' : 'bg-white/10'}`}></div>
                  ))}
                </div>
              </div>

              {/* Solubility Profile Visualization */}
              <div className="bg-[#1c1b1d] p-8 flex flex-col gap-4 flex-grow border border-white/5">
                <span className="font-mono text-[0.7rem] text-neutral-500 uppercase tracking-widest">Solubility Profile</span>
                <div className="flex-grow flex items-center justify-center relative min-h-[160px]">
                  {/* TODO: Wire real radar chart data */}
                  <svg className="w-full h-full max-h-40 overflow-visible" viewBox="0 0 100 100">
                    <circle className="text-white/10" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="0.5"></circle>
                    <circle className="text-white/10" cx="50" cy="50" fill="none" r="30" stroke="currentColor" strokeWidth="0.5"></circle>
                    <path className="text-white/10" d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.5"></path>
                    <polygon fill="white" fillOpacity="0.2" points="50,10 80,40 60,80 20,50 40,20" stroke="white" strokeWidth="1.5"></polygon>
                  </svg>
                  <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-50">
                    <span className="font-mono text-[8px] text-neutral-500 self-center uppercase">pH 7.4</span>
                    <div className="flex justify-between w-full">
                      <span className="font-mono text-[8px] text-neutral-500 uppercase">H2O</span>
                      <span className="font-mono text-[8px] text-neutral-500 uppercase">DMSO</span>
                    </div>
                    <span className="font-mono text-[8px] text-neutral-500 self-center uppercase">Octanol</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5 text-center">
                  <span className="font-mono text-[0.65rem] text-white uppercase font-bold tracking-widest">Optimal Range Detected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Binding Affinities Section */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">Binding Affinities</h2>
              <div className="h-[1px] flex-grow bg-white/10"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'H-Bond Acceptors', value: '4', tag: 'Within Lipinski', desc: 'Maximum efficiency predicted at Nitrogen sites 1, 3, and 7.' },
                { label: 'H-Bond Donors', value: '1', tag: 'Highly Stable', desc: 'Hydroxyl group orientation suggests strong target interaction.', highlight: true },
                { label: 'Rotatable Bonds', value: '6', tag: 'Medium Flexibility', desc: 'Conformational entropy remains within acceptable simulation limits.' },
              ].map((item) => (
                <div key={item.label} className="bg-[#1c1b1d] p-8 flex flex-col gap-2 border border-white/5">
                  <span className="font-mono text-[0.65rem] text-neutral-500 uppercase tracking-widest">{item.label}</span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-3xl font-bold font-mono text-white">{item.value}</span>
                    <span className={`text-[9px] font-mono px-3 py-1 uppercase font-bold tracking-wider rounded-full ${item.highlight ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-4 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Safety ADMET Protocol Table */}
          <section className="flex flex-col gap-6 pb-32">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">Safety ADMET Protocol</h2>
              <div className="h-[1px] flex-grow bg-white/10"></div>
            </div>
            <div className="overflow-hidden bg-[#1c1b1d] border border-white/5 rounded-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#2a2a2c]">
                  <tr>
                    <th className="px-8 py-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">Parameter</th>
                    <th className="px-8 py-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">Methodology</th>
                    <th className="px-8 py-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">Value / Confidence</th>
                    <th className="px-8 py-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { p: 'Absorption (HIA)', m: 'Caco-2 Cell Permeability', v: '92.4%', c: '(±1.2)', s: 'Optimal' },
                    { p: 'Blood-Brain Barrier', m: 'LogBB Logarithmic Scale', v: '-0.45', c: '(Medium)', s: 'Permeable' },
                    { p: 'CYP Inhibitor Profile', m: '3A4 / 2D6 Fluorescence', v: 'None Detected', c: '(High)', s: 'Neutral', dim: true },
                    { p: 'Acute Oral Toxicity', m: 'LD50 Pred. Rat Model', v: '1240 mg/kg', c: '(Cat 4)', s: 'High Risk', error: true },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6 font-bold text-sm tracking-tight text-white uppercase">{row.p}</td>
                      <td className="px-8 py-6 font-mono text-[0.7rem] text-neutral-500 uppercase">{row.m}</td>
                      <td className="px-8 py-6 font-mono text-sm text-white">
                        {row.v} <span className="text-neutral-600 ml-2">{row.c}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`font-mono text-[9px] px-4 py-1.5 uppercase font-bold tracking-widest rounded-full ${row.error ? 'bg-red-500/20 text-red-400' : row.dim ? 'bg-neutral-800 text-neutral-500' : 'bg-white/10 text-white'}`}>
                          {row.s}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer Action Bar */}
        <footer className="fixed bottom-0 right-0 left-20 md:left-64 h-24 bg-[#131315]/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-12 z-40">
          <div className="flex gap-12">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Analysis Confidence</span>
              <span className="font-mono text-sm font-bold text-white uppercase tracking-tighter">98.2% Accuracy Score</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Est. Synthesis Time</span>
              <span className="font-mono text-sm font-bold text-white uppercase tracking-tighter">14h 22m Prediction</span>
            </div>
          </div>
          <div className="flex gap-6">
            <button className="px-10 py-4 bg-transparent text-white font-mono text-[0.75rem] uppercase font-bold tracking-widest border border-white/20 hover:bg-white hover:text-black transition-all rounded-sm">
              Save Draft
            </button>
            <button className="px-12 py-4 bg-white text-black font-mono text-[0.75rem] uppercase font-bold tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.05] transition-transform rounded-sm">
              Execute Synthesis
            </button>
          </div>
        </footer>
      </main>
    </Layout>
  );
};

export default AnalyzerDashboardDesktop;
