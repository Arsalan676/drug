import React from 'react';
import CardShell, { CardLabel, Badge } from '../ui/CardShell';

function phaseBadge(label) {
  if (label === 'Approved') return 'approved';
  if (label?.startsWith('Phase')) return 'phase';
  return 'unknown';
}

export default function ChEMBLCard({ chembl }) {
  if (!chembl.found_in_chembl) {
    return (
      <CardShell className="p-6 animate-fade-up animate-delay-4">
        <CardLabel>ChEMBL Clinical Data</CardLabel>
        <div className="flex-1 flex flex-col items-center justify-center py-8 gap-3">
          <span className="material-symbols-outlined text-4xl" style={{ color: '#353437' }}>database</span>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#474747' }}>
            Not found in ChEMBL
          </p>
        </div>
      </CardShell>
    );
  }

  return (
    <CardShell className="p-6 animate-fade-up animate-delay-4">
      <div className="flex items-start justify-between mb-6">
        <CardLabel>ChEMBL Clinical Data</CardLabel>
        <Badge variant={phaseBadge(chembl.phase_label)}>{chembl.phase_label}</Badge>
      </div>

      {/* Indication */}
      <div className="mb-5">
        <CardLabel>Indication</CardLabel>
        <p className="mt-1 text-white font-semibold text-base" style={{ fontFamily: 'Instrument Sans' }}>
          {chembl.indication_class || 'Unknown'}
        </p>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-4 mb-5"
           style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
        <div>
          <CardLabel>First Approval</CardLabel>
          <p className="mt-1 font-bold" style={{ fontFamily: 'JetBrains Mono', color: '#e5e1e4' }}>
            {chembl.first_approval || '—'}
          </p>
        </div>
        <div>
          <CardLabel>ChEMBL ID</CardLabel>
          <p className="mt-1" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#919191' }}>
            {chembl.chembl_id}
          </p>
        </div>
        <div>
          <CardLabel>Routes</CardLabel>
          <p className="mt-1 flex gap-2 flex-wrap">
            {chembl.oral    && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#c6c6c6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>● Oral</span>}
            {chembl.topical && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#c6c6c6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>● Topical</span>}
            {!chembl.oral && !chembl.topical && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#474747' }}>—</span>}
          </p>
        </div>
        <div>
          <CardLabel>Molecule Type</CardLabel>
          <p className="mt-1" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#c6c6c6' }}>
            {chembl.molecule_type || '—'}
          </p>
        </div>
      </div>

      {/* Black box warning */}
      {chembl.black_box_warning === 1 && (
        <div className="flex items-center gap-2 px-3 py-2"
             style={{ background: 'rgba(255,180,171,0.08)', border: '1px solid rgba(255,180,171,0.2)' }}>
          <span className="material-symbols-outlined text-base" style={{ color: '#ffb4ab' }}>warning</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ffb4ab' }}>
            Black Box Warning
          </span>
        </div>
      )}
    </CardShell>
  );
}
