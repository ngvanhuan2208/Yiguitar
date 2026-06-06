import React from 'react';

const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-t-[#00c7d3] border-[#00c7d3]/10',
    white: 'border-t-white border-white/10',
    slate: 'border-t-slate-800 border-slate-100',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizeClasses[size] || sizeClasses.md} 
          ${colorClasses[color] || colorClasses.primary} 
          rounded-full animate-spin
        `}
      />
    </div>
  );
};

export default Spinner;
