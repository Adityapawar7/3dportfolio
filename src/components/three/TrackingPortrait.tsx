import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointLight, BufferGeometry, Float32BufferAttribute, Points } from 'three';
import { Html, useProgress, ContactShadows, Environment } from '@react-three/drei';
import { TrackingPortraitProps } from '../../types';
import { Real3DMascot } from './Real3DMascot';

// Studio-quality lighting with pointer-tracking key light
function StudioLighting() {
  const keyLightRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (!keyLightRef.current) return;
    const { x, y } = state.pointer;
    keyLightRef.current.position.x = x * 4;
    keyLightRef.current.position.y = y * 3.5;
  });

  return (
    <>
      {/* KEY LIGHT — Tracks mouse for specular catch-lights on sunglasses & skin */}
      <pointLight ref={keyLightRef} position={[0, 0, 4.5]} intensity={25} color="#fff5ee" distance={14} />

      {/* FILL LIGHT — Soft Warm (Camera Left) */}
      <pointLight position={[-5, 1.5, 2]} intensity={15} color="#ffe8d6" distance={14} />

      {/* RIM LIGHT — Purple Accent (Back Left) */}
      <pointLight position={[-4, 3, -2]} intensity={28} color="#a855f7" distance={16} />

      {/* RIM LIGHT — Orange Accent (Back Right) */}
      <pointLight position={[4, -2, -2]} intensity={28} color="#f97316" distance={16} />

      {/* TOP HAIR LIGHT — Picks up jet-black specular sheen */}
      <directionalLight position={[0, 6, 1]} intensity={2.2} color="#e8e0f0" />

      {/* BOTTOM FILL — Prevents harsh chin/jaw shadows */}
      <pointLight position={[0, -3.5, 3]} intensity={8} color="#d7e2ea" distance={10} />

      {/* AMBIENT — Low-key studio base */}
      <ambientLight intensity={1.0} />
    </>
  );
}

// Subtle floating particle halo
function ParticleHalo({ count = 50 }: { count?: number }) {
  const pointsRef = useRef<Points>(null);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3.2 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.08;
    pointsRef.current.rotation.x += delta * 0.04;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.045} color="#c084fc" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 bg-[#0C0C0C]/90 px-5 py-3 rounded-2xl border border-[rgba(215,226,234,0.15)] backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]">Loading Mascot</span>
        <span className="text-[9px] text-purple-400 font-mono font-bold">{Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

export const TrackingPortrait: React.FC<TrackingPortraitProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative ${className} select-none`}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Studio Environment for realistic reflections on sunglasses */}
        <Environment preset="studio" />

        <StudioLighting />

        <React.Suspense fallback={<Loader />}>
          <Real3DMascot onPointerStateChange={setIsHovered} />
          <ParticleHalo count={50} />

          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.5}
            scale={5}
            blur={2.8}
            far={3}
            color="#000000"
          />
        </React.Suspense>
      </Canvas>

      {/* Interaction Hint Badge */}
      <div className="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0C0C0C]/80 border border-[rgba(215,226,234,0.15)] backdrop-blur-md text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#D7E2EA]/80 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isHovered ? 'Click to Spin!' : '3D Interactive'}
        </span>
      </div>
    </div>
  );
};
