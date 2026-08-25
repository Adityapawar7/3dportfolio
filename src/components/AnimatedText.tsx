import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText = ({ text, className = '' }: AnimatedTextProps) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split(' ');
  let charCount = 0;
  const totalChars = text.replace(/ /g, '').length;

  return (
    <p ref={containerRef} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map((word, wordIndex) => {
        const characters = word.split('');
        return (
          <span key={wordIndex} className="mr-[0.25em] relative inline-flex">
            {characters.map((char, charIndex) => {
              const start = (charCount / totalChars) * 0.9;
              const end = start + 0.1;
              charCount++;
              
              const opacity = useTransform(
                scrollYProgress,
                [start, end],
                [0.2, 1]
              );

              return (
                <span key={charIndex} className="relative">
                  <span className="opacity-0">{char}</span>
                  <motion.span 
                    className="absolute left-0 top-0 text-[#D7E2EA]"
                    style={{ opacity }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </p>
  );
};
