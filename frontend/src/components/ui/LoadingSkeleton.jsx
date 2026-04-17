import React from 'react';

function Bone({ className = '' }) {
  return (
    <div className={`animate-skeleton ${className}`}
         style={{ background: '#2a2a2c' }} />
  );
}

function SkeletonCard({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}
         style={{ background: '#2a2a2c', border: '1px solid rgba(255,255,255,0.05)' }}>
      {children}
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4">

      {/* Molecule card — full width */}
      <div className="col-span-12">
        <SkeletonCard className="flex gap-6">
          <div className="flex-1 space-y-3">
            <Bone className="h-3 w-24" />
            <Bone className="h-7 w-48" />
            <Bone className="h-3 w-32" />
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Bone className="h-2 w-16" />
                  <Bone className="h-5 w-12" />
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>
      </div>

      {/* Binding + ADMET */}
      <div className="col-span-5">
        <SkeletonCard className="space-y-6">
          <Bone className="h-3 w-28" />
          <Bone className="h-16 w-32" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Bone className="h-2 w-24" />
              <Bone className="h-2 w-8" />
            </div>
            <Bone className="h-px w-full" />
          </div>
        </SkeletonCard>
      </div>

      <div className="col-span-7">
        <SkeletonCard className="space-y-5">
          <div className="flex justify-between">
            <Bone className="h-3 w-36" />
            <Bone className="h-6 w-10" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Bone className="h-2 w-20" />
                <Bone className="h-2 w-10" />
              </div>
              <Bone className="h-px w-full" />
            </div>
          ))}
        </SkeletonCard>
      </div>

      {/* Druggability + ChEMBL */}
      <div className="col-span-4">
        <SkeletonCard className="space-y-5">
          <Bone className="h-3 w-32" />
          <div className="flex gap-5 items-center">
            <Bone className="w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Bone className="h-10 w-10" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-4/5" />
            </div>
          </div>
        </SkeletonCard>
      </div>

      <div className="col-span-4">
        <SkeletonCard className="space-y-4">
          <Bone className="h-3 w-28" />
          <Bone className="h-5 w-16" />
          <Bone className="h-6 w-40" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Bone className="h-2 w-14" />
                <Bone className="h-4 w-10" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>

      {/* AI card */}
      <div className="col-span-4">
        <SkeletonCard className="space-y-4">
          <Bone className="h-3 w-36" />
          <div className="pl-4 space-y-2" style={{ borderLeft: '2px solid #353437' }}>
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-4/5" />
            <Bone className="h-3 w-full mt-2" />
            <Bone className="h-3 w-3/4" />
          </div>
        </SkeletonCard>
      </div>

    </div>
  );
}
