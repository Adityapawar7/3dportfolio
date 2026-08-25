import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FadeIn, ContactButton, Navbar } from '../components';
import { personalBio } from '../data/navigation';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const nameChars = Array.from(personalBio.name);
  
  // Parallax configuration
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Text scrolls UP faster than the page
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex flex-col justify-between overflow-hidden p-6 sm:p-10 mx-auto">
      {/* Navbar */}
      <Navbar />

      {/* Main Heading (Foreground Parallax) */}
      <motion.div 
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <div className="w-full text-center flex flex-col items-center justify-center pointer-events-none mt-[8vh]">
          {/* Small Top Text */}
          <div className="flex items-center gap-4 mb-2 opacity-80">
            <span className="w-8 sm:w-16 h-[2px] bg-white/40" />
            <h2 className="font-sans font-medium uppercase tracking-[0.3em] text-xs sm:text-sm text-white">
              Hi, I'm
            </h2>
            <span className="w-8 sm:w-16 h-[2px] bg-white/40" />
          </div>

          {/* Massive Name */}
          <h1 className="hero-heading font-black uppercase tracking-tighter leading-none text-[13vw] sm:text-[12vw] md:text-[11vw] lg:text-[10vw] whitespace-nowrap overflow-hidden flex justify-center pb-4 w-full px-4">
            <span className="flex">
              {nameChars.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2 + index * 0.05,
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>
        </div>
      </motion.div>

      {/* Bottom Tagline & Action CTA */}
      <div className="flex justify-between items-end w-full relative z-30 pb-2">
        <FadeIn delay={1.2} y={20} className="w-1/2 sm:w-1/3 text-left">
          <p className="text-[#8892B0] text-[9px] sm:text-xs font-semibold tracking-[0.2em] uppercase max-w-[220px] leading-relaxed">
            {personalBio.tagline}
          </p>
        </FadeIn>
        
        <FadeIn delay={1.4} y={20}>
          <ContactButton href="#contact" />
        </FadeIn>
      </div>
    </section>
  );
};
