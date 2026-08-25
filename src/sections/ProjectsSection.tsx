import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { FadeIn, LiveProjectButton } from '../components';
import { projectsData } from '../data/projects';
import { ProjectItem } from '../types';

interface CardProps {
  project: ProjectItem;
  i: number;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}

const Card: React.FC<CardProps> = ({ project, i, progress, range, targetScale }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate scale down effect as cards stack (overall progress)
  const scale = useTransform(progress, range, [1, targetScale]);
  
  // Local scroll progress for inner parallax (card entering/leaving screen)
  const { scrollYProgress: localProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });
  
  // Inner image vertical parallax
  const innerY = useTransform(localProgress, [0, 1], ['-10%', '10%']);
  
  return (
    <div 
      ref={containerRef} 
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div 
        style={{ 
          scale,
          top: `calc(-5vh + ${i * 28}px)`
        }} 
        className="relative flex flex-col gap-6 p-6 sm:p-10 w-full max-w-[1200px] h-[85vh] origin-top glass-panel rounded-[40px] md:rounded-[60px]"
      >
        {/* Top Header */}
        <div className="flex flex-row justify-between items-center w-full gap-4 shrink-0">
          <div className="flex flex-row items-center gap-4 sm:gap-6 text-white">
            <span className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter text-outline">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col border-l-2 border-white/20 pl-4 sm:pl-6">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8892B0] font-bold mb-1">
                {project.category}
              </span>
              <h3 className="font-black text-xl sm:text-3xl md:text-4xl tracking-tight leading-none">
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton href={project.liveUrl} className="hidden sm:block" />
        </div>

        {/* Image Grid 40/60 */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4 min-h-0 h-full w-full">
          {/* Left Column - 40% */}
          <div className="w-full sm:w-[40%] flex flex-col gap-4 h-full shrink-0">
            <div className="flex-1 rounded-[24px] sm:rounded-[32px] overflow-hidden group">
              <motion.img 
                style={{ y: innerY, scale: 1.15 }}
                src={project.images.topLeft} 
                alt={`${project.name} interface preview`} 
                loading="lazy" 
                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out origin-center" 
              />
            </div>
            <div className="flex-1 rounded-[24px] sm:rounded-[32px] overflow-hidden group">
              <motion.img 
                style={{ y: innerY, scale: 1.15 }}
                src={project.images.bottomLeft} 
                alt={`${project.name} feature screenshot`} 
                loading="lazy" 
                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out origin-center" 
              />
            </div>
          </div>
          
          {/* Right Column - 60% */}
          <div className="w-full sm:w-[60%] h-full shrink-0 rounded-[24px] sm:rounded-[32px] overflow-hidden flex-1 group">
            <motion.img 
              style={{ y: innerY, scale: 1.15 }}
              src={project.images.right} 
              alt={`${project.name} showcase hero preview`} 
              loading="lazy" 
              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out origin-center" 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="bg-transparent relative z-30 -mt-10 sm:-mt-12 md:-mt-14 w-full pt-10"
    >
      <div className="pt-16 sm:pt-24 pb-8 sm:pb-12 px-6">
        <FadeIn>
          <h2 
            className="hero-heading font-black uppercase tracking-tighter leading-none text-center" 
            style={{ fontSize: 'clamp(3.5rem, 14vw, 150px)' }}
          >
            PROJECTS
          </h2>
        </FadeIn>
      </div>

      <div className="pb-[10vh] px-4 sm:px-6">
        {projectsData.map((project, i) => {
          const targetScale = 1 - ((projectsData.length - 1 - i) * 0.03);
          return (
            <Card 
              key={project.name}
              i={i}
              project={project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
};
