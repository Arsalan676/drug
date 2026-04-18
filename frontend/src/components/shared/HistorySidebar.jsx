import React from 'react';

const toSubscript = (str) => {
  if (!str) return '';
  return str.replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
};

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const GradeBadge = ({ grade }) => {
  const colors = {
    A: 'bg-green-500/20 text-green-400 border-green-500/30',
    B: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    C: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    D: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${colors[grade] || colors.C}`}>
      {grade}
    </span>
  );
};

const HistorySidebar = ({ history, isOpen, onClose, onSelect, onClear }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const getScoreColor = (score, thresholds) => {
    if (score >= thresholds[0]) return 'text-green-400';
    if (score >= thresholds[1]) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getStrengthColor = (strength) => {
    const s = strength?.toLowerCase();
    if (s === 'strong') return 'text-green-400';
    if (s === 'moderate') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[99] transition-opacity duration-300 pointer-events-auto"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed top-0 right-0 h-screen z-[100] bg-[#111113] border-l border-[#27272a] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col overflow-hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          w-full md:w-[320px]`}
      >
        {/* Sidebar Header */}
        <header className="h-[56px] flex items-center justify-between px-5 border-b border-[#1f1f22] shrink-0">
          <div className="flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#52525b] mr-2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="font-semibold text-[14px] text-[#fafafa] font-sans">Analysis History</span>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button 
                onClick={onClear}
                title="Clear history"
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#18181b] text-[#52525b] hover:text-[#ef4444] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 3v10m4-10v10"/>
                </svg>
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#18181b] text-[#52525b] hover:text-[#fafafa] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Sidebar Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#27272a] mb-3">
                <path d="M20.38 3.46L16 2.64V8l4.38.82L23 5zM4 2v1l1.58.21C6.27 3.31 7 4.1 7 5a3 3 0 0 1-3 3 4.5 4.5 0 0 0-4.5 4.5V19a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9.6c.14-.11.2-.28.16-.45l-.47-1.85a.5.5 0 0 0-.64-.36l-2.07.72c-.17.06-.23.23-.17.4l.47 1.85c.04.17-.03.34-.16.45L16 11V5.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11L11 8.5c-.24-.13-.54-.05-.67.19a.496.496 0 0 0 .19.67L14 11.5v5.03c0 .28-.22.5-.5.5s-.5-.22-.5-.5V12L9 14.5c-.24.13-.54.05-.67-.19a.496.496 0 0 1 .19-.67L12 11.5V5.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11l-4.5-2.5c-.24-.13-.54-.05-.67.19a.496.496 0 0 0 .19.67L9 11.5v5.03c0 .28-.22.5-.5.5s-.5-.22-.5-.5V14.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5v2.85c0 .1.03.2.08.28l1 1.62c.11.18.3.3.52.33l1.8.22c.22.03.41.15.52.33l1 1.62c.05.08.08.18.08.28V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8.5a1.5 1.5 0 0 1 1.5-1.5z"/>
              </svg>
              <p className="font-medium text-[13px] text-[#52525b] font-sans">No molecules analyzed yet</p>
              <p className="text-[12px] text-[#3f3f46] mt-1 font-sans">Analyze a molecule to see your history here</p>
            </div>
          ) : (
            <div className="py-2">
              <div className="px-5 py-3 text-[11px] font-medium text-[#3f3f46] uppercase tracking-[0.06em] font-sans">
                This session · {history.length} molecule{history.length !== 1 ? 's' : ''}
              </div>
              
              {history.map((entry, idx) => (
                <div 
                  key={entry.id}
                  onClick={() => onSelect(entry)}
                  className="mx-4 mb-3 rounded-lg bg-[#18181b] border border-[#27272a] p-4 cursor-pointer hover:border-[#3f3f46] hover:bg-[#1c1c20] active:scale-[0.98] transition-all relative group"
                >
                  {idx === 0 && (
                    <span className="absolute top-2 right-2 text-[9px] font-medium text-[#52525b] uppercase tracking-[0.06em] font-sans">
                      LATEST
                    </span>
                  )}
                  
                  {/* Top Row */}
                  <div className="flex justify-between items-start pr-8">
                    <div className="min-w-0">
                      <h4 className="font-bold text-[13px] text-[#fafafa] truncate pr-2 font-sans">
                        {entry.molecule_name}
                      </h4>
                      <p className="text-[11px] text-[#52525b] mt-0.5 font-sans">
                        {toSubscript(entry.molecular_formula)}
                      </p>
                    </div>
                    <GradeBadge grade={entry.grade} />
                  </div>

                  {/* Middle Row: Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-[#111113] border border-[#1f1f22] rounded-md p-2 text-center">
                      <div className="text-[13px] font-bold text-[#fafafa] font-mono leading-none">{entry.pkd?.toFixed(1) || '—'}</div>
                      <div className="text-[10px] text-[#52525b] mt-1 font-sans">pKd</div>
                    </div>
                    <div className="bg-[#111113] border border-[#1f1f22] rounded-md p-2 text-center">
                      <div className={`text-[13px] font-bold font-mono leading-none ${getScoreColor(entry.overall_admet_score, [80, 60])}`}>
                        {entry.overall_admet_score}%
                      </div>
                      <div className="text-[10px] text-[#52525b] mt-1 font-sans">ADMET</div>
                    </div>
                    <div className="bg-[#111113] border border-[#1f1f22] rounded-md p-2 text-center">
                      <div className={`text-[13px] font-bold font-mono leading-none ${getScoreColor(entry.druggability_score, [70, 50])}`}>
                        {entry.druggability_score}
                      </div>
                      <div className="text-[10px] text-[#52525b] mt-1 font-sans">Score</div>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`text-[10px] font-medium font-sans ${getStrengthColor(entry.binding_strength)}`}>
                        {entry.binding_strength}
                      </span>
                      <span className="mx-2 text-[#27272a]">•</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${entry.lipinski_pass ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
                      <span className="text-[10px] text-[#52525b] ml-1 font-sans font-bold">L5</span>
                    </div>
                    <span className="text-[11px] text-[#3f3f46] font-sans">
                      {getRelativeTime(entry.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <footer className="shrink-0 border-t border-[#1f1f22] px-5 py-4 flex justify-between items-center bg-[#111113]">
          <span className="text-[11px] text-[#3f3f46] font-sans">Stored locally</span>
          {history.length > 0 && (
            <button 
              onClick={onClear}
              className="text-[12px] text-[#52525b] hover:text-[#ef4444] transition-colors font-sans"
            >
              Clear all
            </button>
          )}
        </footer>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 9999px }
      `}} />
    </>
  );
};

export default HistorySidebar;
