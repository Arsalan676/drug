import React from 'react';

const SkeletonCard = ({ height = 200, rows = 3 }) => {
  return (
    <div 
      className="bg-[#111113] border border-[#27272a] rounded-xl p-6 w-full overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .skeleton-shimmer {
            background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s ease-in-out infinite;
            border-radius: 6px;
          }
        `}
      </style>
      
      {/* Row 1: Top Label */}
      <div className="skeleton-shimmer w-[80px] h-[10px]" />
      
      {/* Row 2: Main Value */}
      <div className="skeleton-shimmer w-[140px] h-[32px] mt-4" />
      
      {/* Row 3+: Content Lines */}
      {Array.from({ length: Math.max(0, rows) }).map((_, i) => (
        <div 
          key={i} 
          className="skeleton-shimmer w-full h-[10px] mt-3" 
        />
      ))}
    </div>
  );
};

export default SkeletonCard;
