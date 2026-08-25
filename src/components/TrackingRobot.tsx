import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { Float, Environment, ContactShadows, Html, useProgress, Sphere, Box, Cylinder, MeshDistortMaterial } from '@react-three/drei';
import { easing } from 'maath';

function RobotMesh() {
  const wrapperRef = useRef<Group>(null);
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const leftEyeRef = useRef<Group>(null);
  const rightEyeRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  
  const [waving, setWaving] = useState(false);
  const [hovered, setHovered] = useState(false);
  const waveTimeout = useRef<NodeJS.Timeout | null>(null);
  const isBlinking = useRef(false);

  const { viewport } = useThree();
  const scrollY = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const targetVector = useMemo(() => new Vector3(), []);
  const smoothedTarget = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    const onMouseMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove);
    
    onScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setWaving(true);
    if (waveTimeout.current) clearTimeout(waveTimeout.current);
    waveTimeout.current = setTimeout(() => setWaving(false), 1500);
  };

  // Random blink generator
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const triggerBlink = () => {
      isBlinking.current = true;
      setTimeout(() => {
        isBlinking.current = false;
      }, 150);
      timeout = setTimeout(triggerBlink, Math.random() * 4000 + 2000);
    };
    timeout = setTimeout(triggerBlink, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useFrame((state, delta) => {
    if (!wrapperRef.current || !groupRef.current || !headRef.current || !leftEyeRef.current || !rightEyeRef.current) return;
    
    // 1. SCROLL-TRIGGERED POSITION & SCALE
    const scrollProgress = Math.min(Math.max(scrollY.current / (window.innerHeight * 0.6), 0), 1);
    const baseScale = viewport.width < 5 ? 0.7 : 0.9;
    const targetScale = baseScale * (1 - scrollProgress * 0.7);

    const paddingX = viewport.width * 0.05;
    const paddingY = viewport.height * 0.05;
    
    const targetX = scrollProgress * (viewport.width / 2 - paddingX - 1.2 * targetScale);
    const targetY = scrollProgress * (-viewport.height / 2 + paddingY + 3.0 * targetScale);

    easing.damp3(wrapperRef.current.position, [targetX, targetY, 0], 0.25, delta);
    easing.damp3(wrapperRef.current.scale, [targetScale, targetScale, targetScale], 0.25, delta);

    // 2. AMBIENT BODY SWAY
    const { x, y } = pointer.current;
    const targetBodyRotX = -y * 0.2;
    const targetBodyRotY = x * 0.3;
    easing.dampE(groupRef.current.rotation, [targetBodyRotX, targetBodyRotY, 0], 0.2, delta);

    // 3. EXACT 3D UNPROJECTION
    targetVector.set(x, y, 0.5).unproject(state.camera);
    targetVector.sub(state.camera.position).normalize();
    const focalPlaneZ = 2; // Target plane slightly in front of the robot (Z=0)
    const distance = (focalPlaneZ - state.camera.position.z) / targetVector.z;
    
    // Calculate exact intersection point on the Z=2 plane
    targetVector.multiplyScalar(distance).add(state.camera.position);
    
    easing.damp3(smoothedTarget, [targetVector.x, targetVector.y, targetVector.z], 0.15, delta);

    // 4. DIRECT NATIVE LOOK-AT
    // The head is constructed with its face pointing towards the local +Z axis.
    // Three.js .lookAt() inherently aligns the local +Z axis towards the target point!
    headRef.current.lookAt(smoothedTarget);
    
    // Update matrices so children (the eyes) can use accurate absolute world orientations
    headRef.current.updateMatrixWorld(true);

    // Point the individual eyes directly at the target for realistic tracking
    leftEyeRef.current.lookAt(smoothedTarget);
    rightEyeRef.current.lookAt(smoothedTarget);

    // 5. EYE BLINK ANIMATION
    const targetBlinkScaleY = isBlinking.current ? 0.1 : 1.0;
    easing.damp3(leftEyeRef.current.scale, [1, targetBlinkScaleY, 1], 0.2, delta);
    easing.damp3(rightEyeRef.current.scale, [1, targetBlinkScaleY, 1], 0.2, delta);
    
    // 6. ARM ANIMATIONS (WAVE)
    if (rightArmRef.current) {
      let rightArmTargetZ = -0.15; // Base resting rotation
      let rightArmTargetX = 0;

      if (waving) {
        // Raise arm to wave
        rightArmTargetZ = -2.8 + Math.sin(state.clock.elapsedTime * 20) * 0.4;
        rightArmTargetX = -0.5; // Slight forward tilt
      }

      easing.dampE(rightArmRef.current.rotation, [rightArmTargetX, 0, rightArmTargetZ], 0.15, delta);
    }
  });

  return (
    <group ref={wrapperRef}>
      <group 
        ref={groupRef} 
        position={[0, -0.5, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={handlePointerDown}
      >
        
        {/* ================= HEAD ================= */}
        <group ref={headRef} position={[0, 1.8, 0]}>
          
          {/* Main Head Core */}
          <Box args={[1.2, 1.1, 1.2]}>
            <meshStandardMaterial color="#E2E8F0" metalness={0.4} roughness={0.4} />
          </Box>
          
          {/* Front Face Plate (+Z direction) */}
          <Box args={[1.0, 0.8, 0.1]} position={[0, 0, 0.61]}>
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
          </Box>

          {/* Left Eye & Pupil */}
          <group ref={leftEyeRef} position={[-0.25, 0.1, 0.65]}>
            <Sphere args={[0.12, 32, 32]}>
              <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} toneMapped={false} />
            </Sphere>
            {/* Pupil flush with the local +Z surface of the sphere */}
            <Box args={[0.08, 0.08, 0.04]} position={[0, 0, 0.12]}>
              <meshBasicMaterial color="#000000" />
            </Box>
          </group>

          {/* Right Eye & Pupil */}
          <group ref={rightEyeRef} position={[0.25, 0.1, 0.65]}>
            <Sphere args={[0.12, 32, 32]}>
              <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} toneMapped={false} />
            </Sphere>
            {/* Pupil flush with the local +Z surface of the sphere */}
            <Box args={[0.08, 0.08, 0.04]} position={[0, 0, 0.12]}>
              <meshBasicMaterial color="#000000" />
            </Box>
          </group>

          {/* Mouth/Voicebox (+Z direction) */}
          <Box args={[0.5, 0.1, 0.1]} position={[0, -0.22, 0.65]}>
            <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1} />
          </Box>

          {/* Antenna */}
          <Cylinder args={[0.02, 0.05, 0.5, 16]} position={[0, 0.8, 0]}>
            <meshStandardMaterial color="#7621B0" metalness={0.8} roughness={0.2} />
          </Cylinder>
          
          <Sphere args={[0.1, 32, 32]} position={[0, 1.05, 0]}>
            <meshStandardMaterial color="#7621B0" emissive="#7621B0" emissiveIntensity={2} />
          </Sphere>
        </group>

        {/* ================= BODY ================= */}
        {/* Chestplate built on +Z to naturally face the camera */}
        <group position={[0, 0.2, 0]}>
          <Cylinder args={[0.8, 0.6, 1.8, 64]}>
            <meshStandardMaterial color="#E2E8F0" metalness={0.7} roughness={0.3} />
          </Cylinder>
          <Sphere args={[0.4, 64, 64]} position={[0, 0.2, 0.4]}>
            <MeshDistortMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} distort={0.4} speed={4} />
          </Sphere>
          <Box args={[0.6, 0.8, 0.2]} position={[0, 0, 0.75]}>
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
          </Box>
        </group>

        {/* ================= ARMS ================= */}
        <group position={[1.0, 0.7, 0]} rotation={[0, 0, 0.15]}>
          <Sphere args={[0.25, 32, 32]}>
            <meshStandardMaterial color="#7621B0" metalness={0.8} roughness={0.2} />
          </Sphere>
          <Cylinder args={[0.12, 0.1, 1.2, 32]} position={[0, -0.6, 0]}>
            <meshStandardMaterial color="#E2E8F0" metalness={0.6} roughness={0.2} />
          </Cylinder>
          <Box args={[0.25, 0.3, 0.25]} position={[0, -1.3, 0]}>
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
          </Box>
        </group>

        <group ref={rightArmRef} position={[-1.0, 0.7, 0]} rotation={[0, 0, -0.15]}>
          <Sphere args={[0.25, 32, 32]}>
            <meshStandardMaterial color="#7621B0" metalness={0.8} roughness={0.2} />
          </Sphere>
          <Cylinder args={[0.12, 0.1, 1.2, 32]} position={[0, -0.6, 0]}>
            <meshStandardMaterial color="#E2E8F0" metalness={0.6} roughness={0.2} />
          </Cylinder>
          <Box args={[0.25, 0.3, 0.25]} position={[0, -1.3, 0]}>
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
          </Box>
        </group>

        {/* ================= BASE ================= */}
        <group position={[0, -1.2, 0]}>
          <Cylinder args={[0.4, 0.8, 0.6, 64]}>
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
          </Cylinder>
          <Sphere args={[0.3, 32, 32]} position={[0, -0.4, 0]}>
            <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1.5} />
          </Sphere>
        </group>

        <ContactShadows position={[0, -3.0, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000" />
      </group>
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return <Html center><div className="text-white text-sm font-medium whitespace-nowrap">{Math.round(progress)}% loaded</div></Html>;
}

export const TrackingRobot = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]} 
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#7621B0" />
        
        <Environment preset="city" />

        <React.Suspense fallback={<Loader />}>
          <Float speed={2.5} rotationIntensity={0.2} floatIntensity={1.0}>
            <RobotMesh />
          </Float>
        </React.Suspense>
      </Canvas>
    </div>
  );
};
