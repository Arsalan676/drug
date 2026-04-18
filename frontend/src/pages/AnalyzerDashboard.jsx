import React from 'react';
import Layout from '../components/shared/Layout';
import MoleculeCard from '../components/shared/MoleculeCard';

const AnalyzerDashboard = ({ onOpenHistory }) => {
  const mockMolecule = {
    canonical_smiles: "CC(C)C1=CC=C(C=C1)C2=CC(=NO2)C(=O)NC3=CC=CC(=C3)N4CCOCC4",
    mw: 412.5,
  };

  return (
    <Layout onOpenHistory={onOpenHistory}>
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {/* Hero Analysis Section */}
        <section className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 lg:col-span-8">
            <div className="relative h-[480px] bg-[#1c1b1d] overflow-hidden group border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#131315] via-transparent to-white/5"></div>
              <img 
                alt="Molecular Visualization" 
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuS99eLDzgnkUmpACqY3e_eC5_AVp9uFSnICFgYHjR0a1Syy4NGuqX3qWxu8cUZ5_gNd05YfOBSOn1dPdFF16f6eikjCm6siRjqIk3fxioFK3Pq-_ofby67OY3xdUr8HikEUDBGZ-lzXwShYlypggTfrwQ6GuzkBGN4BdjVLK3v5f-TzGNdml67SlS_i_Uut1d0deW60H2kbbP9EJ5tI-loRXy96fkwlv_zwGBeC2T7hFh56HaCbMfjUJjpZg0BZvK6k8ZyfzJkyQ"
              />
              <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-1">
                <span className="font-mono text-[10px] text-white uppercase tracking-[0.3em] mb-2 opacity-70">Primary Structure</span>
                <h2 className="text-5xl font-bold tracking-tighter text-white uppercase">QX-4492-DELTA</h2>
                <p className="text-neutral-400 max-w-xl mt-4 leading-relaxed font-body">
                  Synthetic macrocycle derivative targeting the catalytic domain of HDAC6. Optimized for high blood-brain barrier permeability and selective enzymatic inhibition.
                </p>
              </div>
              <div className="absolute top-8 right-8 flex flex-col gap-4">
                <div className="bg-[#353437]/80 backdrop-blur-md p-4 flex flex-col gap-1 border-l-2 border-white">
                  <span className="font-mono text-[10px] text-neutral-400">BINDING AFFINITY</span>
                  <span className="font-mono text-2xl font-bold text-white">-12.4 <span className="text-xs font-normal">kcal/mol</span></span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <MoleculeCard moleculeData={mockMolecule} />
          </div>
        </section>

        {/* Identity Matrix & Analytics Bento */}
        <section className="grid grid-cols-12 gap-6">
          {/* Identity Matrix Card */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#1c1b1d] p-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">Identity Matrix</h3>
              <span className="material-symbols-outlined text-white text-sm">qr_code_2</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#2a2a2c] border border-white/5">
                <span className="font-mono text-[9px] text-neutral-500 uppercase">Lipinski Rule</span>
                <p className="font-mono text-lg text-white font-bold mt-1">PASS</p>
              </div>
              <div className="p-4 bg-[#2a2a2c] border border-white/5">
                <span className="font-mono text-[9px] text-neutral-500 uppercase">H-Bond Donors</span>
                <p className="font-mono text-lg text-white font-bold mt-1">02</p>
              </div>
              <div className="p-4 bg-[#2a2a2c] border border-white/5">
                <span className="font-mono text-[9px] text-neutral-500 uppercase">Rotatable Bonds</span>
                <p className="font-mono text-lg text-white font-bold mt-1">07</p>
              </div>
              <div className="p-4 bg-[#2a2a2c] border border-white/5">
                <span className="font-mono text-[9px] text-neutral-500 uppercase">LogP</span>
                <p className="font-mono text-lg text-white font-bold mt-1">3.41</p>
              </div>
            </div>
          </div>

          {/* Analysis Overview */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 bg-[#1c1b1d] p-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">Binding Analysis</h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-white"></div>
                <div className="w-2 h-2 bg-neutral-700"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="font-mono text-[10px] text-neutral-500">RESIDUE INTERACTION</span>
                  <p className="text-xl font-bold tracking-tight text-white mt-1 uppercase">PHE-412 • TRP-22</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-white">88.4%</span>
                  <div className="w-24 h-1 bg-[#353437] mt-1">
                    <div className="w-[88%] h-full bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="font-mono text-[10px] text-neutral-500">SOLVENT ACCESSIBILITY</span>
                  <p className="text-xl font-bold tracking-tight text-white mt-1 uppercase">114.2 Å²</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-white">42.1%</span>
                  <div className="w-24 h-1 bg-[#353437] mt-1">
                    <div className="w-[42%] h-full bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 flex gap-4">
                <div className="flex-1 text-center py-3 bg-[#2a2a2c] font-mono text-[10px] text-neutral-400">HYDROPHOBIC: 4.2</div>
                <div className="flex-1 text-center py-3 bg-[#2a2a2c] font-mono text-[10px] text-neutral-400">ELECTROSTATIC: -2.1</div>
              </div>
            </div>
          </div>

          {/* ADMET Profile */}
          <div className="col-span-12 md:col-span-12 lg:col-span-3 bg-white p-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-mono text-[11px] tracking-widest text-black font-bold uppercase">Safety ADMET</h3>
              <span className="material-symbols-outlined text-black">security</span>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Hepatotoxicity', value: 'LOW' },
                { label: 'hERG Inhibition', value: 'SAFE' },
                { label: 'CYP2D6 Affinity', value: 'MEDIUM', outline: true },
                { label: 'Oral Absorption', value: '94.2%', raw: true },
                { label: 'CNS Penetration', value: 'HIGH', raw: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-black font-medium">{item.label}</span>
                  {item.raw ? (
                    <span className="font-mono text-xs font-bold text-black">{item.value}</span>
                  ) : (
                    <span className={`font-mono text-[10px] px-2 py-0.5 font-bold ${item.outline ? 'border border-black text-black' : 'bg-black text-white uppercase'}`}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
              <div className="pt-6">
                <button className="w-full bg-black text-white py-3 text-[10px] font-mono tracking-widest uppercase font-bold hover:bg-neutral-800 transition-colors">
                  Export Safety Dossier
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AnalyzerDashboard;
