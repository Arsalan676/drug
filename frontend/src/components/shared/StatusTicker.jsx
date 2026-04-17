import React from 'react';

const StatusTicker = () => {
  const items = [
    { label: 'System Nominal', value: 'TPU Cluster 4 Active', status: 'bg-emerald-500' },
    { label: 'Latent Space Vector', value: '[0.12, -0.99, 1.44, 0.52]' },
    { label: 'Queue', value: '14 Active Jobs' },
    { label: 'Core Temp', value: '34.2°C' },
    { label: 'Last Checksum', value: '0x8F22A' },
  ];

  return (
    <section className="mt-auto py-6 border-t border-white/5 px-8">
      <div className="flex gap-12 overflow-hidden whitespace-nowrap">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.status && <span className={`w-1.5 h-1.5 rounded-full ${item.status}`}></span>}
            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-tighter">
              {item.label}: <span className="text-neutral-400">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatusTicker;
