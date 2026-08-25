import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, MathUtils } from 'three';
import { Float, Html, useProgress, useTexture } from '@react-three/drei';

function PortraitMesh({ src }: { src: string }) {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(src);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const { x, y } = state.pointer;
    
    const targetRotationX = MathUtils.lerp(meshRef.current.rotation.x, -y * 0.8, 0.05);
    const targetRotationY = MathUtils.lerp(meshRef.current.rotation.y, x * 0.8, 0.05);
    
    meshRef.current.rotation.set(targetRotationX, targetRotationY, 0);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial map={texture} transparent={true} />
      </mesh>
    </Float>
  );
}

function Loader() {
  const { progress } = useProgress();
  return <Html center><div className="text-white text-sm font-medium">{Math.round(progress)}% loaded</div></Html>;
}

interface TrackingPortraitProps {
  src: string;
  className?: string;
}

export const TrackingPortrait = ({ src, className = '' }: TrackingPortraitProps) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1} />
        <React.Suspense fallback={<Loader />}>
          <PortraitMesh src={src} />
        </React.Suspense>
      </Canvas>
    </div>
  );
};
