import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-slate-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
