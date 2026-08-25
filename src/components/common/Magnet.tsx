import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { MagnetProps } from '../../types';

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = Math.abs(e.clientX - centerX);
    const distanceY = Math.abs(e.clientY - centerY);

    if (distanceX < (width / 2) + padding && distanceY < (height / 2) + padding) {
      const x = (e.clientX - centerX) / strength;
      const y = (e.clientY - centerY) / strength;
      mouseX.set(x);
      mouseY.set(y);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <motion.div
        style={{ x: springX, y: springY, willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
};
