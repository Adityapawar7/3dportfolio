import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MathUtils, Group } from 'three';
import { MeshDistortMaterial, Float } from '@react-three/drei';

interface GlassGeometricMeshProps {
  scale?: number;
  position?: [number, number, number];
}

export const GlassGeometricMesh: React.FC<GlassGeometricMeshProps> = ({
  scale = 1,
  position = [0, 0, 0]
}) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<any>(null);

  const prevPointer = useRef({ x: 0, y: 0 });
  const pointerSpeed = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    const { x, y } = state.pointer;

    // Calculate mouse velocity/speed across the screen
    const dx = x - prevPointer.current.x;
    const dy = y - prevPointer.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy) * 10;
    prevPointer.current = { x, y };

    pointerSpeed.current = MathUtils.lerp(pointerSpeed.current, speed, 0.08);

    // Continuous autonomous 3D rotation
    meshRef.current.rotation.x += delta * 0.35;
    meshRef.current.rotation.y += delta * 0.55;

    // Follow pointer tilt & position
    groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, position[0] + x * 0.4, 0.06);
    groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, position[1] + y * 0.3, 0.06);
    groupRef.current.rotation.z = MathUtils.lerp(groupRef.current.rotation.z, -x * 0.25, 0.06);

    // Dynamically increase liquid glass distortion when mouse moves fast
    if (materialRef.current) {
      const baseDistort = 0.35;
      const dynamicDistort = baseDistort + Math.min(pointerSpeed.current * 0.45, 0.65);
      materialRef.current.distort = MathUtils.lerp(materialRef.current.distort || 0.35, dynamicDistort, 0.1);
      materialRef.current.speed = 2.5 + pointerSpeed.current * 2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Floating Chromatic Glass Torus / Organic Ring */}
        <mesh ref={meshRef}>
          <torusGeometry args={[2.5, 0.38, 32, 100]} />
          <MeshDistortMaterial
            ref={materialRef}
            color="#802ee1"
            emissive="#3b0764"
            emissiveIntensity={0.4}
            roughness={0.05}
            metalness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.05}
            transmission={0.85}
            thickness={1.5}
            ior={1.45}
            distort={0.35}
            speed={3}
            transparent={true}
            opacity={0.88}
          />
        </mesh>
      </Float>
    </group>
  );
};
