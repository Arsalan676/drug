import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

  // Molecule Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let molecules = [];
    let mouse = { x: null, y: null };
    let animationFrameId;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      molecules = [];
      for (let i = 0; i < 40; i++) {
        molecules.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 20 + 10,
          speedX: Math.random() * 0.4 - 0.2,
          speedY: Math.random() * 0.4 - 0.2,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: Math.random() * 0.01 - 0.005,
          type: Math.floor(Math.random() * 2) // 0: ring, 1: chain
        });
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const drawMolecule = (m) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.rotation);

      if (m.type === 0) { // Benzene ring style
        for (let i = 0; i < 6; i++) {
          let x = m.size * Math.cos(i * Math.PI / 3);
          let y = m.size * Math.sin(i * Math.PI / 3);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      } else { // Chain style
        ctx.moveTo(-m.size, 0);
        ctx.lineTo(-m.size / 2, m.size / 2);
        ctx.lineTo(0, 0);
        ctx.lineTo(m.size / 2, m.size / 2);
        ctx.lineTo(m.size, 0);
      }
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      molecules.forEach(m => {
        m.x += m.speedX;
        m.y += m.speedY;
        m.rotation += m.rotSpeed;

        // Mouse repulsion
        if (mouse.x && mouse.y) {
          let dx = mouse.x - m.x;
          let dy = mouse.y - m.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            m.x -= dx * 0.01;
            m.y -= dy * 0.01;
          }
        }

        // Bounds check
        if (m.x < 0) m.x = canvas.width;
        if (m.x > canvas.width) m.x = 0;
        if (m.y < 0) m.y = canvas.height;
        if (m.y > canvas.height) m.y = 0;

        drawMolecule(m);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', init);
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Intersection Observer for Reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-20');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLaunch = () => navigate('/analyzer');

  return (
    <div className="bg-[#131315] text-[#e5e1e4] selection:bg-white/20 min-h-screen font-sans">
      {/* Molecular Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 hidden md:block opacity-40" />

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-8 py-4">
        <div className="text-xl font-bold tracking-tighter text-white">MoleculeAI</div>
        <div className="hidden md:flex gap-8 items-center tracking-tight text-sm font-medium">
          <a className="text-white border-b border-white pb-1" href="#how-it-works">How it works</a>
          <a className="text-neutral-400 hover:text-white transition-colors" href="#">Targets</a>
          <a className="text-neutral-400 hover:text-white transition-colors" href="#">Insights</a>
          <a className="text-neutral-400 hover:text-white transition-colors" href="#">Documentation</a>
        </div>
        <button 
          onClick={handleLaunch}
          className="bg-white text-black px-4 py-2 text-sm font-bold active:scale-95 transition-transform"
        >
          Launch Analyzer
        </button>
      </nav>

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
            <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">AI-POWERED DRUG DISCOVERY</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] text-white">
            Analyze any molecule. <br />
            <span className="text-neutral-500">Instantly.</span>
          </h1>
          <p className="max-w-2xl text-neutral-400 text-lg mb-12">
            From molecule name to full binding affinity, ADMET profile, and 3D optimization. Precision-engineered for molecular researchers.
          </p>
          <div className="w-full max-w-xl bg-white/5 p-1 rounded-lg flex items-center mb-10 border border-white/10">
            <div className="px-4 text-neutral-500">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="bg-transparent border-none focus:ring-0 w-full font-mono text-sm text-white placeholder:text-neutral-600 outline-none" 
              placeholder="Try: Aspirin, Imatinib, or SMILES string..." 
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLaunch()}
            />
            <button 
              onClick={handleLaunch}
              className="bg-white text-black px-6 py-3 font-bold text-sm shrink-0"
            >
              ANALYZE
            </button>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 text-sm font-bold text-white border border-white/20 hover:bg-white/5 transition-colors">See how it works</button>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="mt-32 border-y border-white/5 bg-white/[0.02] py-12">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-mono text-2xl font-medium text-white mb-1">&lt;1s</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Analysis time</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-mono text-2xl font-medium text-white mb-1">12</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Molecular descriptors</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-mono text-2xl font-medium text-white mb-1">4</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Protein targets</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-mono text-2xl font-medium text-white mb-1">3</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">AI models</span>
            </div>
          </div>
        </section>

        {/* Pipeline (How it works) */}
        <section id="how-it-works" className="py-32 max-w-7xl mx-auto px-8 reveal opacity-0 translate-y-20 transition-all duration-700">
          <h2 className="font-mono text-[12px] uppercase tracking-[0.3em] text-neutral-500 mb-16 text-center">Protocol Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {[
              { num: '01', icon: 'input', title: 'Input', desc: 'Provide SMILES, IUPAC name, or CID. Our resolver handles chemical normalization automatically.' },
              { num: '02', icon: 'rebase_edit', title: 'Resolve', desc: 'Structural parsing using RDKit kernels ensures valency validation and tautomer selection.' },
              { num: '03', icon: 'memory', title: 'Compute', desc: 'Parallel inference across graph neural networks predicts binding energy and pharmacokinetic params.' },
              { num: '04', icon: 'monitoring', title: 'Interpret', desc: 'Export publication-ready data cards including ADMET toxicity radars and binding scores.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-4 relative">
                <div className="text-[64px] font-bold font-mono text-white/[0.03] leading-none absolute -top-10 -left-4 select-none">{step.num}</div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">{step.icon}</span>
                </div>
                <h3 className="font-bold text-lg text-white">{step.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Results Preview */}
        <section className="py-32 bg-white/[0.01] border-y border-white/5 reveal opacity-0 translate-y-20 transition-all duration-700">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight text-white">Full-Spectrum <br />Molecular Profiling</h2>
              <div className="space-y-4">
                {[
                  'Molecule Identity & Validation',
                  'Binding Affinity Prediction (pKd)',
                  'Lipinski\'s Rule of Five Check',
                  'ADMET Profile Analysis',
                  'Solubility & Permeability',
                  'Synthesis Accessibility (SA) Score'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-b border-white/5 group">
                    <span className="font-mono text-neutral-600 transition-colors group-hover:text-white">0{i + 1}</span>
                    <span className="font-medium text-neutral-400 group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Mock Results Card */}
            <div className="bg-[#1c1b1d] p-8 border border-white/10 shadow-2xl rounded-sm">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <span className="font-mono text-[10px] uppercase text-neutral-500 block mb-1">Target Analysis</span>
                  <h3 className="text-2xl font-bold text-white">Imatinib Mesylate</h3>
                </div>
                <div className="bg-white/5 px-3 py-1 font-mono text-[12px] border border-white/10 text-neutral-400">CID: 5291</div>
              </div>
              <div className="relative h-64 mb-12 bg-[#131315] flex items-center justify-center border border-white/5 overflow-hidden">
                <img 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" 
                  src="https://images.unsplash.com/photo-1532187875605-1ef6ec23916d?auto=format&fit=crop&q=80&w=1000" 
                  alt="molecules"
                />
                <div className="z-10 flex flex-col items-center">
                  <div className="text-5xl font-bold font-mono text-white">8.42</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-2">pKd Affinity Score</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">MW</div>
                  <div className="font-mono text-sm text-white">493.6 g/mol</div>
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">LogP</div>
                  <div className="font-mono text-sm text-white">4.50</div>
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">H-Bond Donors</div>
                  <div className="font-mono text-sm text-white">2</div>
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">H-Bond Acceptors</div>
                  <div className="font-mono text-sm text-white">7</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Protein Targets */}
        <section className="py-32 max-w-7xl mx-auto px-8 reveal opacity-0 translate-y-20 transition-all duration-700">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-white">Core Protein Targets</h2>
              <p className="text-neutral-400">Validated benchmarks for cross-docking precision.</p>
            </div>
            <button className="px-4 py-2 border border-white/20 text-sm font-mono flex items-center gap-2 hover:bg-white hover:text-black transition-all text-neutral-400">
              VIEW ALL TARGETS <span className="material-symbols-outlined">north_east</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { badge: 'COVID-19', id: '6LU7', name: 'Main Protease', desc: 'Inhibition of SARS-CoV-2 viral replication cycle.', color: 'red' },
              { badge: 'CML', id: '2HYY', name: 'Abl Kinase', desc: 'Target for Chronic Myeloid Leukemia therapies.', color: 'blue' },
              { badge: 'Alzheimer\'s', id: '1EVE', name: 'AChE', desc: 'Acetylcholinesterase inhibition studies.', color: 'yellow' },
              { badge: 'Diabetes', id: '2J78', name: 'PTP1B', desc: 'Protein tyrosine phosphatase for insulin resistance.', color: 'green' }
            ].map((t, i) => (
              <div key={i} className="bg-[#1c1b1d] p-6 border border-white/5 hover:border-white/20 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-10">
                  <div className={`px-2 py-0.5 text-[10px] font-mono uppercase border border-opacity-30 ${
                    t.color === 'red' ? 'bg-red-900/20 text-red-400 border-red-900' :
                    t.color === 'blue' ? 'bg-blue-900/20 text-blue-400 border-blue-900' :
                    t.color === 'yellow' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900' :
                    'bg-green-900/20 text-green-400 border-green-900'
                  }`}>{t.badge}</div>
                  <div className="font-mono text-lg font-bold text-white opacity-40 group-hover:opacity-100 transition-opacity">{t.id}</div>
                </div>
                <h4 className="font-bold mb-2 text-white">{t.name}</h4>
                <p className="text-xs text-neutral-500 mb-6 leading-relaxed">{t.desc}</p>
                <button
                  onClick={handleLaunch}
                  className="text-xs font-mono uppercase tracking-widest flex items-center gap-2 text-white/40 group-hover:text-white transition-all outline-none"
                >
                  Analyze Target <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Strip */}
        <section className="py-20 bg-white/[0.01] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-center gap-4">
            {['FastAPI', 'RDKit', 'scikit-learn', 'PyTorch', 'PostgreSQL', 'Docker'].map((tech) => (
              <span key={tech} className="font-mono text-[10px] uppercase text-neutral-500 px-4 py-2 border border-white/5 bg-white/5 whitespace-nowrap">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 max-w-4xl mx-auto px-8 text-center reveal opacity-0 translate-y-20 transition-all duration-700">
          <h2 className="text-5xl font-bold tracking-tighter mb-8 text-white leading-tight">Ready to analyze a molecule?</h2>
          <p className="text-neutral-400 text-lg mb-12">Join 400+ pharmaceutical research teams using MoleculeAI to accelerate lead identification.</p>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleLaunch}
              className="px-12 py-5 bg-white text-black font-bold text-lg hover:bg-neutral-200 transition-all active:scale-95"
            >
              Start Discovery Free
            </button>
            <div className="font-mono text-[11px] text-neutral-600 tracking-wider">
              GET /api/v1/analyze?smiles=CC(=O)OC1=CC=CC=C1C(=O)O
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 mt-20 bg-[#131315]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-16">
          <div className="col-span-1">
            <div className="text-lg font-bold text-white mb-4">MoleculeAI</div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 leading-relaxed">
              Molecular Intelligence Editorial. <br /> Precision Brutalism Framework.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="font-mono text-[10px] text-white uppercase tracking-widest font-bold">Navigation</h5>
            <ul className="space-y-2">
              <li><button onClick={handleLaunch} className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors">Analyzer</button></li>
              <li><a className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors" href="#">Benchmarks</a></li>
              <li><a className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors" href="#">Documentation</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-mono text-[10px] text-white uppercase tracking-widest font-bold">Legal</h5>
            <ul className="space-y-2">
              <li><a className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors" href="#">Terms of Service</a></li>
              <li><a className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors" href="#">Security</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-mono text-[10px] text-white uppercase tracking-widest font-bold">Access</h5>
            <ul className="space-y-2">
              <li><a className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors" href="#">API Access</a></li>
              <li><a className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-white transition-colors" href="#">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-12 pb-8 border-t border-white/5 pt-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-700">
            © 2026 MoleculeAI. All rights reserved. Precision-Engineered for Drug Discovery.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
