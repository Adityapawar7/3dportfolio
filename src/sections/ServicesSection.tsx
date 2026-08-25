import React from 'react';
import { FadeIn } from '../components';
import { servicesData } from '../data/services';

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="relative bg-transparent text-[#F3F4F6] py-32 px-6 md:px-12 w-full z-20">
      <div className="max-w-screen-2xl mx-auto">
        <FadeIn>
          <h2 className="font-black uppercase tracking-tighter leading-none text-center mb-16 sm:mb-24 text-outline" style={{ fontSize: 'clamp(3rem, 12vw, 150px)' }}>
            Services
          </h2>
        </FadeIn>

        <div className="flex flex-col border-t border-white/10">
          {servicesData.map((service, i) => (
            <FadeIn key={service.name} delay={i * 0.1} y={20} className="w-full border-b border-white/10 group">
              <div className="flex flex-row items-center py-10 sm:py-16 gap-6 sm:gap-12 md:gap-24 hover:bg-white/[0.02] transition-colors duration-500 px-4 sm:px-8 relative overflow-hidden">
                {/* Number */}
                <div 
                  className="font-black leading-none shrink-0 text-white/10 group-hover:text-white/80 transition-colors duration-500" 
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                
                {/* Text */}
                <div className="flex flex-col gap-3 sm:gap-5 z-10">
                  <h3 
                    className="font-bold uppercase tracking-tight group-hover:text-white transition-colors duration-500" 
                    style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2.5rem)' }}
                  >
                    {service.name}
                  </h3>
                  <p 
                    className="text-[#8892B0] max-w-2xl font-medium leading-relaxed group-hover:text-gray-300 transition-colors duration-500"
                    style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.15rem)' }}
                  >
                    {service.description}
                  </p>
                </div>
                
                {/* Hover Reveal Highlight (Background blur accent) */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-x-full group-hover:translate-x-0" />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
