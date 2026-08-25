import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { marqueeRow1, marqueeRow2 } from '../data/marquee';

// Triple items for seamless scroll continuation
const row1Tripled = [...marqueeRow1, ...marqueeRow1, ...marqueeRow1];
const row2Tripled = [...marqueeRow2, ...marqueeRow2, ...marqueeRow2];

export const MarqueeSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Inertial spring for scroll responsiveness
  const springProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
  
  const x1 = useTransform(springProgress, [0, 1], [-500, 500]);
  const x2 = useTransform(springProgress, [0, 1], [500, -500]);

  return (
    <section 
      ref={containerRef} 
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden w-full flex flex-col gap-3"
      aria-label="Portfolio Work Marquee"
    >
      {/* Row 1 - Moves Right */}
      <motion.div 
        className="flex gap-3 whitespace-nowrap min-w-max"
        style={{ x: x1, willChange: 'transform' }}
      >
        {row1Tripled.map((src, i) => (
          <img 
            key={`r1-${i}`} 
            src={src} 
            alt={`Work highlight preview ${i + 1}`} 
            loading="lazy"
            className="w-[300px] h-[190px] sm:w-[420px] sm:h-[270px] rounded-2xl object-cover shrink-0 select-none"
          />
        ))}
      </motion.div>

      {/* Row 2 - Moves Left */}
      <motion.div 
        className="flex gap-3 whitespace-nowrap min-w-max"
        style={{ x: x2, willChange: 'transform' }}
      >
        {row2Tripled.map((src, i) => (
          <img 
            key={`r2-${i}`} 
            src={src} 
            alt={`Work highlight preview ${i + 1}`} 
            loading="lazy"
            className="w-[300px] h-[190px] sm:w-[420px] sm:h-[270px] rounded-2xl object-cover shrink-0 select-none"
          />
        ))}
      </motion.div>
    </section>
  );
};
