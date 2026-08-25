import React from 'react';

export const LiveProjectButton = ({ className = '' }: { className?: string }) => {
  return (
    <button
      className={`
        px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-[#D7E2EA] text-[#D7E2EA]
        uppercase tracking-widest text-[10px] sm:text-xs font-bold
        transition-colors hover:bg-[#D7E2EA]/10 shrink-0
        ${className}
      `}
    >
      Live Project
    </button>
  );
};
