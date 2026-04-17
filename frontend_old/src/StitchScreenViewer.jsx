import React from 'react';

const screens = [
  { name: 'Analyzer Dashboard (Carbon)', img: '/src/assets/screenshots/analyzer_dashboard_carbon.png', html: '/src/components/stitch_screens/analyzer_dashboard_carbon.html' },
  { name: 'Synthesis Engine (Carbon)', img: '/src/assets/screenshots/synthesis_engine_carbon.png', html: '/src/components/stitch_screens/synthesis_engine_carbon.html' },
  { name: 'Main Analyzer (Desktop)', img: '/src/assets/screenshots/main_analyzer_desktop.png', html: '/src/components/stitch_screens/main_analyzer_desktop.html' },
  { name: 'Synthesis Engine (Desktop Carbon)', img: '/src/assets/screenshots/synthesis_engine_desktop_carbon.png', html: '/src/components/stitch_screens/synthesis_engine_desktop_carbon.html' },
  { name: 'Analyzer Dashboard (Precision)', img: '/src/assets/screenshots/analyzer_dashboard_desktop_precision.png', html: '/src/components/stitch_screens/analyzer_dashboard_desktop_precision.html' }
];

const StitchScreenViewer = () => {
  return (
    <div style={{ padding: '40px', background: '#0a0e27', color: 'white' }}>
      <h2 style={{ marginBottom: '32px', color: '#00d9ff' }}>Stitch Design Reference Screens</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {screens.map((s, idx) => (
          <div key={idx} style={{ background: '#1a1f3a', border: '1px solid #2d3748', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ marginBottom: '12px' }}>{s.name}</h4>
            <img src={s.img} alt={s.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '12px', border: '1px solid #2d3748' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
               <a href={s.html} target="_blank" rel="noreferrer" style={{ fontSize: '13px', background: '#2d3748', padding: '6px 12px', borderRadius: '6px' }}>View Original HTML</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StitchScreenViewer;
