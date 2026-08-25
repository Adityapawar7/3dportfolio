import React from 'react';
import {
  HeroSection,
  MarqueeSection,
  AboutSection,
  ServicesSection,
  ProjectsSection,
} from './sections';
import { Footer, LenisProvider } from './components/layout';
import { CustomCursor, NoiseOverlay, GlobalMascot } from './components/common';

export default function App() {
  return (
    <LenisProvider>
      <CustomCursor />
      <NoiseOverlay />
      <GlobalMascot />
      <main className="w-full relative flex flex-col bg-[#050505] font-sans overflow-clip selection:bg-cyan-500/30 selection:text-cyan-50">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <Footer />
      </main>
    </LenisProvider>
  );
}
