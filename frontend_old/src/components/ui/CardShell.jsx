import React from 'react';

export default function CardShell({ children, className = '', style = {} }) {
  return (
    <div
      className={`flex flex-col ${className}`}
      style={{ background: '#2a2a2c', border: '1px solid rgba(255,255,255,0.05)', ...style }}>
      {children}
    </div>
  );
}

export function CardLabel({ children }) {
  return (
    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#919191' }}>
      {children}
    </span>
  );
}

export function CardValue({ children, className = '' }) {
  return (
    <span className={`text-white font-bold ${className}`}
          style={{ fontFamily: 'JetBrains Mono' }}>
      {children}
    </span>
  );
}

export function Bar({ value, color = '#ffffff', delay = 0 }) {
  return (
    <div className="w-full h-px" style={{ background: '#353437' }}>
      <div
        className="h-full bar-animated"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color, animationDelay: `${delay}ms` }}
      />
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const styles = {
    pass:     'bg-white text-[#1a1c1c]',
    fail:     'border border-[#ffb4ab] text-[#ffb4ab]',
    strong:   'bg-white text-[#1a1c1c]',
    moderate: 'border border-[#474747] text-[#f0c080]',
    weak:     'border border-[#474747] text-[#919191]',
    safe:     'bg-white text-[#1a1c1c]',
    toxic:    'border border-[#ffb4ab] text-[#ffb4ab]',
    approved: 'bg-white text-[#1a1c1c]',
    phase:    'border border-[#474747] text-[#f0c080]',
    unknown:  'border border-[#474747] text-[#919191]',
    default:  'border border-[#474747] text-[#919191]',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${styles[variant] || styles.default}`}
          style={{ fontFamily: 'JetBrains Mono' }}>
      {children}
    </span>
  );
}
