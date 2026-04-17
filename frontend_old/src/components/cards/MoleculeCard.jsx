import React, { useState } from 'react';
import CardShell, { CardLabel, CardValue, Badge } from '../ui/CardShell';

const PROPS = [
  { key: 'molecular_weight',  label: 'Mol Weight',    unit: 'g/mol',   fmt: v => v.toFixed(2) },
  { key: 'logp',              label: 'LogP',           unit: 'clogP',   fmt: v => v.toFixed(2) },
  { key: 'num_hbd',           label: 'H-Bond Donors',  unit: '',        fmt: v => v },
  { key: 'num_hba',           label: 'H-Bond Acceptors',unit: '',       fmt: v => v },
  { key: 'num_rings',         label: 'Rings',          unit: '',        fmt: v => v },
  { key: 'num_atoms',         label: 'Atoms',          unit: '',        fmt: v => v },
];

export default function MoleculeCard({ data }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(data.canonical_smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CardShell className="p-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <CardLabel>Active Ligand</CardLabel>
          <h3 className="text-white text-2xl font-bold mt-1 capitalize"
              style={{ fontFamily: 'Instrument Sans' }}>
            {data.molecule_name}
          </h3>
          <p className="mt-1 text-sm" style={{ color: '#919191', fontFamily: 'JetBrains Mono' }}>
            {data.molecular_formula}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={data.lipinski_pass ? 'pass' : 'fail'}>
            {data.lipinski_pass ? 'Lipinski ✓' : 'Lipinski ✗'}
          </Badge>
          <Badge variant="default">{data.source || 'local'}</Badge>
        </div>
      </div>

      {/* Property grid */}
      <div className="grid grid-cols-3 gap-4 mb-6"
           style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
        {PROPS.map(({ key, label, unit, fmt }) => (
          <div key={key}>
            <CardLabel>{label}</CardLabel>
            <p className="mt-1" style={{ fontFamily: 'JetBrains Mono', fontSize: 16, fontWeight: 700, color: '#e5e1e4' }}>
              {fmt(data[key] ?? (key === 'logp' ? data.descriptors?.LogP : 0))}
              {unit && <span style={{ fontSize: 10, color: '#919191', marginLeft: 4 }}>{unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* SMILES */}
      <button onClick={copy}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#353437] transition-colors group"
              style={{ background: '#201f22', border: '1px solid rgba(255,255,255,0.05)' }}>
        <code className="text-[11px] truncate flex-1 mr-3" style={{ color: '#c6c6c6' }}>
          {data.canonical_smiles}
        </code>
        <span className="material-symbols-outlined text-base flex-shrink-0 transition-colors"
              style={{ color: copied ? '#a8d5a2' : '#474747' }}>
          {copied ? 'check' : 'content_copy'}
        </span>
      </button>
    </CardShell>
  );
}
