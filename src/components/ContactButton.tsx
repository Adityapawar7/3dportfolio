import React from 'react';

export const ContactButton = ({ className = '' }: { className?: string }) => {
  return (
    <button
      className={`
        relative overflow-hidden
        px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-black uppercase tracking-widest text-white text-[10px] sm:text-xs
        transition-transform hover:scale-105 active:scale-95 shrink-0
        ${className}
      `}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: 'inset 0 0 0 1.5px rgba(255, 255, 255, 1)'
      }}
    >
      <span className="relative z-10 contact-btn-shadow">
        Contact Me
      </span>
    </button>
  );
};
