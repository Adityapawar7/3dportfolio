import React from 'react';

interface ContactButtonProps {
  className?: string;
  onClick?: () => void;
  href?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  className = '',
  onClick,
  href = '#contact'
}) => {
  const content = (
    <span className="relative z-10 contact-btn-shadow">
      Contact Me
    </span>
  );

  const buttonClasses = `
    inline-flex items-center justify-center relative overflow-hidden
    px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-black uppercase tracking-widest text-white text-[10px] sm:text-xs
    transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer
    ${className}
  `;

  const buttonStyle = {
    background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
    boxShadow: 'inset 0 0 0 1.5px rgba(255, 255, 255, 1)'
  };

  if (href.startsWith('#')) {
    return (
      <a href={href} className={buttonClasses} style={buttonStyle} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button className={buttonClasses} style={buttonStyle} onClick={onClick}>
      {content}
    </button>
  );
};
