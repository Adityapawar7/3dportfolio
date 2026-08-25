import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TrackingPortrait } from '../three/TrackingPortrait';
import photoUrl from '../../assets/images/edited-photo.png';

export const GlobalMascot: React.FC = () => {
  const { scrollY } = useScroll();
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parallax calculations based on absolute scroll pixels
  // We transition fully by the time the user scrolls past the first section (windowHeight)
  const scrollThreshold = windowHeight * 0.8;

  // Scale down from 1 to 0.45 (slightly larger than before)
  const scale = useTransform(scrollY, [0, scrollThreshold], [1, 0.45], { clamp: true });
  
  // Move to the bottom right corner
  // x: 0 to ~32vw (moves right, not quite as far)
  const x = useTransform(scrollY, [0, scrollThreshold], ['0vw', '32vw'], { clamp: true });
  
  // y: 0 to ~30vh (moves down)
  const y = useTransform(scrollY, [0, scrollThreshold], ['0vh', '30vh'], { clamp: true });
  
  // Z-index management to ensure it doesn't block interactions when large, but stays on top when small
  // At top (large), we want pointer events on it, but it shouldn't block the screen entirely.
  // We'll manage pointer-events using CSS classes dynamically.

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      <motion.div 
        style={{ scale, x, y }}
        className="pointer-events-auto origin-center mt-[8vh] sm:mt-0"
      >
        <TrackingPortrait 
          src={photoUrl} 
          className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[540px] md:h-[540px] lg:w-[640px] lg:h-[640px] translate-y-[3vh] sm:translate-y-0 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        />
      </motion.div>
    </div>
  );
};
