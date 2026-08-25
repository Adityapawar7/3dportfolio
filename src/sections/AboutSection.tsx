import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FadeIn, AnimatedText, ContactButton } from '../components';
import { personalBio } from '../data/navigation';

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Different parallax speeds for the floating decorations
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -350]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <section id="about" ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-center py-32 px-6 overflow-hidden">
      {/* 3D Decorative Icons - Volumetric Style */}
      {/* Yellow Sphere */}
      <motion.div style={{ y: y1 }} className="absolute top-12 left-6 sm:top-24 sm:left-12 lg:top-32 lg:left-24 z-20">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_15px_25px_rgba(255,222,0,0.4)]" aria-hidden="true">
            <defs>
              <radialGradient id="sphere-yellow" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#ffde00" />
                <stop offset="85%" stopColor="#d869f4" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#sphere-yellow)" />
            <circle cx="35" cy="40" r="6" fill="#000000" />
            <circle cx="33" cy="38" r="2" fill="#ffffff" />
            <circle cx="65" cy="40" r="6" fill="#000000" />
            <circle cx="63" cy="38" r="2" fill="#ffffff" />
            <path d="M 30 60 Q 50 80 70 60" fill="none" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
            <path d="M 30 60 Q 50 80 70 60" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" transform="translate(0, -2)" opacity="0.8"/>
          </svg>
        </FadeIn>
      </motion.div>

      {/* Purple Sparkle Star */}
      <motion.div style={{ y: y2 }} className="absolute top-16 right-6 sm:top-24 sm:right-12 lg:top-40 lg:right-32 z-20">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_15px_25px_rgba(128,46,225,0.6)]" aria-hidden="true">
            <defs>
              <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#d869f4" />
                <stop offset="70%" stopColor="#802ee1" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
              <linearGradient id="star-inner" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#d869f4" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 50 5 C 55 40 60 45 95 50 C 60 55 55 60 50 95 C 45 60 40 55 5 50 C 40 45 45 40 50 5 Z" fill="url(#star-grad)" />
            <path d="M 50 15 C 53 42 58 47 85 50 C 58 53 53 58 50 85 C 47 58 42 53 15 50 C 42 47 47 42 50 15 Z" fill="none" stroke="url(#star-inner)" strokeWidth="2" />
          </svg>
        </FadeIn>
      </motion.div>

      {/* Isometric 3D Cube */}
      <motion.div style={{ y: y3 }} className="absolute bottom-12 left-6 sm:bottom-24 sm:left-12 lg:bottom-40 lg:left-32 z-20">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_15px_25px_rgba(216,105,244,0.5)]" aria-hidden="true">
            <defs>
              <linearGradient id="cube-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#d869f4" />
                <stop offset="100%" stopColor="#802ee1" />
              </linearGradient>
              <linearGradient id="cube-left" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#802ee1" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
              <linearGradient id="cube-right" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d869f4" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
              <linearGradient id="cube-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 50 15 L 85 32.5 L 50 50 L 15 32.5 Z" fill="url(#cube-top)" />
            <path d="M 15 32.5 L 50 50 L 50 85 L 15 67.5 Z" fill="url(#cube-left)" />
            <path d="M 85 32.5 L 85 67.5 L 50 85 L 50 50 Z" fill="url(#cube-right)" />
            <path d="M 50 15 L 15 32.5 L 50 50 L 85 32.5 Z" fill="none" stroke="url(#cube-highlight)" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 50 50 L 50 85" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
            <path d="M 15 32.5 L 15 67.5" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </FadeIn>
      </motion.div>

      {/* 3D Pointer Cursor */}
      <motion.div style={{ y: y4 }} className="absolute bottom-12 right-6 sm:bottom-24 sm:right-12 lg:bottom-32 lg:right-24 z-20">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_15px_25px_rgba(255,222,0,0.4)] transform -rotate-12" aria-hidden="true">
            <defs>
              <linearGradient id="cursor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#ffde00" />
                <stop offset="70%" stopColor="#d869f4" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
              <linearGradient id="cursor-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 35 15 L 75 60 L 55 65 L 65 90 L 50 95 L 40 70 L 25 80 Z" fill="#000000" />
            <path d="M 32 10 L 72 55 L 52 60 L 62 85 L 47 90 L 37 65 L 22 75 Z" fill="#802ee1" />
            <path d="M 30 5 L 70 50 L 50 55 L 60 80 L 45 85 L 35 60 L 20 70 Z" fill="url(#cursor-grad)" />
            <path d="M 30 5 L 70 50 L 50 55 L 60 80 L 45 85 L 35 60 L 20 70 Z" fill="none" stroke="url(#cursor-bevel)" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </FadeIn>
      </motion.div>

      <div className="z-10 flex flex-col items-center text-center max-w-5xl mx-auto mt-10 sm:mt-20 px-4">
        <FadeIn y={30}>
          <h2 className="hero-heading font-black uppercase tracking-tighter leading-none mb-12 sm:mb-16" style={{ fontSize: 'clamp(3.5rem, 12vw, 150px)' }}>
            ABOUT ME
          </h2>
        </FadeIn>
        
        <div className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.3] tracking-tight text-center mb-16 sm:mb-20 max-w-[95vw] sm:max-w-4xl mx-auto text-[#F3F4F6]">
          <AnimatedText text={personalBio.bio} />
        </div>

        <FadeIn delay={0.3} y={20}>
          <ContactButton href="#contact" />
        </FadeIn>
      </div>
    </section>
  );
};
