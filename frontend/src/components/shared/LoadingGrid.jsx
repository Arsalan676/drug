import React from 'react';
import SkeletonCard from './SkeletonCard';

const LoadingGrid = () => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Loading Header */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-4 h-4 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        <span className="text-[13px] text-[#a1a1aa] ml-2 font-normal">
          Analyzing molecule...
        </span>
      </div>

      {/* 12-Column Grid */}
      <div className="grid grid-cols-12 gap-4 w-full">
        {/* Row 1 */}
        <div className="col-span-12 lg:col-span-7">
          <SkeletonCard height={220} rows={3} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <SkeletonCard height={220} rows={2} />
        </div>

        {/* Row 2 */}
        <div className="col-span-12 md:col-span-5">
          <SkeletonCard height={280} rows={5} />
        </div>
        <div className="col-span-12 md:col-span-4">
          <SkeletonCard height={280} rows={6} />
        </div>
        <div className="col-span-12 md:col-span-3">
          <SkeletonCard height={280} rows={4} />
        </div>

        {/* Row 3 */}
        <div className="col-span-12">
          <SkeletonCard height={160} rows={2} />
        </div>
      </div>
    </div>
  );
};

export default LoadingGrid;
