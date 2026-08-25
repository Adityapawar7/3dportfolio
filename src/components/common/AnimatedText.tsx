import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { AnimatedTextProps } from '../../types';

interface AnimatedCharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative">
      <span className="opacity-0">{char}</span>
      <motion.span 
        className="absolute left-0 top-0 text-[#D7E2EA]"
        style={{ opacity }}
      >
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split(' ');
  let charCounter = 0;
  const totalChars = text.replace(/ /g, '').length;

  return (
    <p ref={containerRef} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map((word, wordIndex) => {
        const characters = word.split('');
        return (
          <span key={wordIndex} className="mr-[0.25em] relative inline-flex">
            {characters.map((char, charIndex) => {
              const start = (charCounter / totalChars) * 0.9;
              const end = start + 0.1;
              charCounter++;

              return (
                <AnimatedChar
                  key={charIndex}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </span>
        );
      })}
    </p>
  );
};
