import React from 'react';
import { navigationLinks } from '../../data/navigation';
import { FadeIn } from '../common/FadeIn';

export const Navbar: React.FC = () => {
  return (
    <FadeIn delay={0} y={-20} className="w-full relative z-20">
      <nav className="flex justify-between items-center w-full" aria-label="Main Navigation">
        {navigationLinks.map((item) => (
          <a 
            key={item.label} 
            href={item.href}
            className="text-[#D7E2EA] uppercase tracking-widest text-[10px] sm:text-xs font-bold transition-opacity hover:opacity-70"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </FadeIn>
  );
};
