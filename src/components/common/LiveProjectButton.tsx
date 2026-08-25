import React from 'react';

interface LiveProjectButtonProps {
  className?: string;
  href?: string;
  onClick?: () => void;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  className = '',
  href,
  onClick
}) => {
  const buttonClasses = `
    inline-flex items-center justify-center
    px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-[#D7E2EA] text-[#D7E2EA]
    uppercase tracking-widest text-[10px] sm:text-xs font-bold
    transition-colors hover:bg-[#D7E2EA]/10 shrink-0 cursor-pointer
    ${className}
  `;

  if (href) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={buttonClasses}
        onClick={onClick}
      >
        Live Project
      </a>
    );
  }

  return (
    <button className={buttonClasses} onClick={onClick}>
      Live Project
    </button>
  );
};
