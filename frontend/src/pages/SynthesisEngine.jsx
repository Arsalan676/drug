import React from 'react';
import Layout from '../components/shared/Layout';

const SynthesisEngine = () => {
  return (
    <Layout>
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="p-8 max-w-[1400px]">
          {/* Header & Hero Section */}
          <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white opacity-50">CORE ENGINE v4.2</span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white">Synthesis Engine</h2>
              <p className="text-neutral-400 max-w-xl text-lg leading-relaxed font-light">
                Autonomous ligand design and property prediction via high-fidelity molecular dynamics and neural synthesis kernels.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-[#1c1b1d] p-6 flex flex-col gap-1 rounded-sm min-w-[160px] border border-white/5">
                <span className="font-mono text-[10px] text-neutral-500 uppercase">Active Threads</span>
                <span className="font-mono text-2xl text-white font-bold">12,402</span>
              </div>
              <div className="bg-[#1c1b1d] p-6 flex flex-col gap-1 rounded-sm min-w-[160px] border border-white/5">
                <span className="font-mono text-[10px] text-neutral-500 uppercase">Success Rate</span>
                <span className="font-mono text-2xl text-white font-bold">98.4%</span>
              </div>
            </div>
          </section>

          {/* Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
            {/* Detailed Molecular Analysis */}
            <div className="lg:col-span-8 bg-[#1c1b1d] rounded-sm p-1 border border-white/5">
              <div className="bg-[#2a2a2c] p-4 flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Active Molecular Analysis: LIG_7741_B</span>
                <div className="flex gap-2 items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-mono text-[9px] text-emerald-500 uppercase">Processing</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                <div className="bg-[#1c1b1d] p-8 aspect-square relative group overflow-hidden">
                  <img 
                    alt="Molecular Structure" 
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 transition-transform duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_iJvnYdLSz1bHnIkr1k67csmMWwX0VTnHNrBCDANXjhgrt1tejxjed4L0XUV2nhzKRqUZSOLlVdmvm21AE_q06IHboDKPC96cGROARH-n6fXNyMDj1Bqvs_H8Lax_yZG7Hu_bJUQM_N2esp5fIbDaS0aMOpc8R8usBAbqXK18nKHJKprRF5vUK25Fksi6gWbGWCVy9lSjkwFCCOEYF9sjEi-MTq_4goxsISBBy46qsu1hTZrQ5Yhjx7FHNf52V6abT-uIFC1_nZI"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1d] to-transparent p-6 flex flex-col justify-end">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Visualization Kernel 0.9</span>
                  </div>
                </div>
                <div className="bg-[#1c1b1d] p-8 flex flex-col gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Binding Affinity</label>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-4xl text-white font-bold">-14.2</span>
                      <span className="font-mono text-sm text-neutral-400">kcal/mol</span>
                    </div>
                    <div className="w-full h-1 bg-[#353437]">
                      <div className="h-full bg-white w-[88%]"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'LogP', value: '2.41' },
                      { label: 'MW', value: '412.3' },
                      { label: 'PSA', value: '78.4' },
                      { label: 'RO5', value: 'PASS', color: 'text-emerald-400' },
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-1">
                        <span className="font-mono text-[9px] uppercase text-neutral-500">{stat.label}</span>
                        <p className={`font-mono text-lg ${stat.color || 'text-white'}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      Predicted pose shows significant hydrogen bonding with <span className="text-white font-mono">GLN189</span> and <span className="text-white font-mono">HIS163</span>. Optimization recommended for S2 subsite.
                    </p>
                    <button className="w-full py-2 bg-[#353437] text-white font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors font-bold">
                      Export Trajectory
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Synthesis Predictions */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#1c1b1d] rounded-sm flex-1 p-6 relative border border-white/5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] mb-6 text-white border-b border-white/5 pb-4">Synthesis Strategy</h3>
                <div className="space-y-8">
                  {[
                    { step: '01', title: 'Suzuki Coupling', desc: 'Catalytic cross-coupling using Pd(dppf)Cl2. Est. Yield: 78%' },
                    { step: '02', title: 'Deprotection', desc: 'TFA removal of Boc group at 25°C. Est. Yield: 94%' },
                    { step: '03', title: 'Recrystallization', desc: 'Ethanol/Water gradient for high-purity isolation.' },
                  ].map((s) => (
                    <div key={s.step} className="relative pl-8 border-l border-white/10 space-y-2">
                      <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${s.step === '01' ? 'bg-white' : 'bg-neutral-700'}`}></div>
                      <span className="font-mono text-[10px] text-neutral-500 uppercase">Step {s.step} / {s.title}</span>
                      <p className="text-sm text-neutral-300 leading-snug">{s.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-white/5 border-l-2 border-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span className="font-mono text-[10px] text-white uppercase font-bold">AI Confidence: 0.94</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-medium">Path optimized for low cost and minimal byproduct formation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* High Probability Targets Grid */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] mb-1 text-neutral-500">SYNTHESIS PIPELINE</h3>
                <p className="text-2xl font-bold text-white tracking-tight uppercase">High-Probability Targets</p>
              </div>
              <div className="flex gap-4">
                <button className="material-symbols-outlined text-neutral-500 hover:text-white transition-colors">filter_list</button>
                <button className="material-symbols-outlined text-neutral-500 hover:text-white transition-colors">sort</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: '001', name: 'Mpro Protease', type: 'VIRAL-01', prob: '88.2%', drug: 'HIGH', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyAZVRtPwVZXHKPyM-_BsCqqglM-SdTRDDIfeJJOjfEPEcm51J4vE3w2x9mLyskjJlASd7kpz7t3xJm9inMhNw6n7uXCiE0nhu16HghYvE72yqMopNQJ77uttNXHSNPXZhAtc739cvcUXvdhEVhc9rDDWRJx9-ThL97_ZYQo7DnXTVbbqdUNSDQghzLQiCmH5aY21IwJOBf2IvsGCSQEY3mR8AMpLQUfSDymvNSX7fiGUEBMDlGwou5p4yvAaWZzGOmIWgW45dPKU' },
                { id: '002', name: 'BCR-ABL1', type: 'ONCO-09', prob: '74.5%', drug: 'MED', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgDoRFicgAPNLYVSDXHIyAjv3KvMACooFoTtpO_LTotlL74qWlMLkCeCesmM2rr4SbZuxrgxmozwgsTOXgLgowkj5zjJTwxz5vobntsNz9TDzsoK7W0zdiT9XiglGXrLfBEZDN5Drntn-ClijjG6rUycoMPmkl8qvkYzjN_p_wks2_K3o8LaSUXdM6ipUM8v6nnjE__sVfGTxBgZeKAMRNd8wUCFfnDSrqP1-t9rTRm2R_ksiWnsZ_CfXiEOHXr8FRSJfbs_N6LN4' },
                { id: '003', name: 'EGFR T790M', type: 'ONCO-12', prob: '92.1%', drug: 'HIGH', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7ixVi8gU2KIcrIjwhwsX5FWCqi5WEdh3yB23ne9wGRnEkaqxx_YNZWoI3_49ca7VuKB9uilt3EvoRZTTjnuvLusrPunpRHFo7sEBCLp1rN9ILSC9KVCrHVLcrbJMx-ni9Yo9MH8Thc995YTdf9XwqzHjhaYQCZES0IK6aSxg5J4NDAfsiVTEUSPWWRJnGCS222x_1tL0AxQ0umX_fwraRF8dtpGtaosal2wwp2u2fWLyODiR9swAKyvi16gl06AgX5xbC6KWH5ao' },
                { id: '004', name: 'K-Ras G12D', type: 'ONCO-01', prob: '61.8%', drug: 'HARD', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVF1nErGzckmyas_b0cJqvjZ1KlCGY2-fnQlwm0Kir3KFZs4nCR3FVbf6s4i7K4efgJfUPOiG0Am-myU59EPcg7VIKBvvFQoIHsaIPnZMAgq0a1s4pa_Kmx9MeZ7y6RLmFBzWhzgRlMLCoCXmv_-Tbfvz0pgrNqLSOKTDjNq08HAvyEZfdeM4bx586X5A6sQ3H6NGHnQeKLiPgzqSoa0eezFUB8M-irbITYKjIpkxic6Xjd4_f2ZayWYNwofpmLL8qjcdGrEbM4fw' },
              ].map((target) => (
                <div key={target.id} className="bg-[#1c1b1d] group hover:bg-[#2a2a2c] transition-all p-px border border-white/5">
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-neutral-500 uppercase">TARGET_{target.id}</p>
                        <h4 className="text-xl font-bold text-white leading-tight">{target.name}</h4>
                      </div>
                      <span className="px-2 py-1 bg-white/10 font-mono text-[9px] text-white rounded-sm">{target.type}</span>
                    </div>
                    <div className="h-32 bg-[#0e0e10] overflow-hidden rounded-sm relative">
                      <img 
                        alt={target.name} 
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-80 transition-opacity duration-500" 
                        src={target.img}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-neutral-500 uppercase">Hit Prob</span>
                        <p className="font-mono text-lg text-white font-bold">{target.prob}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-neutral-500 uppercase">Druggability</span>
                        <p className="font-mono text-lg text-white font-bold">{target.drug}</p>
                      </div>
                    </div>
                    <button className="w-full py-3 border border-white/10 font-mono text-[10px] uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all font-bold">
                      Initiate Design
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default SynthesisEngine;
