import React from 'react';
import { personalBio } from '../../data/navigation';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="w-full bg-transparent py-32 px-6 border-t border-white/10 text-center text-[#F3F4F6] relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        <h3 className="font-sans font-medium text-xs sm:text-sm tracking-[0.3em] uppercase text-[#8892B0]">
          Let’s Build Something Unforgettable
        </h3>
        
        <p className="text-base sm:text-lg text-white/60 max-w-xl font-medium leading-relaxed pb-6">
          Available for select 3D modeling, dynamic brand identity, and premium web design projects.
        </p>
        
        {/* Responsive Email Link */}
        <a
          href={`mailto:${personalBio.email}`}
          className="w-full text-center text-[5.5vw] sm:text-[4vw] md:text-[3.5vw] font-black hero-heading hover:opacity-80 transition-opacity tracking-tighter leading-none relative group inline-block whitespace-nowrap"
        >
          {personalBio.email.toUpperCase()}
          {/* Subtle underline that sweeps across on hover */}
          <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-white scale-x-0 origin-right transition-transform duration-500 ease-out group-hover:scale-x-100 group-hover:origin-left" />
        </a>

        <div className="pt-24 text-[10px] font-bold tracking-[0.2em] uppercase text-[#8892B0]/60">
          © {new Date().getFullYear()} {personalBio.name}. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
