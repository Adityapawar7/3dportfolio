import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { Float } from '@react-three/drei';

interface Real3DMascotProps {
  onPointerStateChange?: (hovered: boolean) => void;
}

// ── Material Palette ─────────────────────────────────────────────

// Primary white shell
const ShellWhite = () => (
  <meshPhysicalMaterial color="#e8eaed" roughness={0.32} metalness={0.06} clearcoat={0.35} clearcoatRoughness={0.35} sheen={0.25} sheenColor="#ffffff" sheenRoughness={0.5} />
);

// Light grey panels
const PanelLightGrey = () => (
  <meshPhysicalMaterial color="#c8ccd2" roughness={0.38} metalness={0.08} clearcoat={0.2} clearcoatRoughness={0.45} />
);

// Medium grey for joints & mechanical detail
const JointGrey = () => (
  <meshStandardMaterial color="#8e939a" roughness={0.42} metalness={0.25} />
);

// Dark grey for recesses, vents, deep details
const DarkGrey = () => (
  <meshStandardMaterial color="#4a4e55" roughness={0.5} metalness={0.35} />
);

// Charcoal for deep insets
const Charcoal = () => (
  <meshStandardMaterial color="#2c2f35" roughness={0.55} metalness={0.4} />
);

// Visor glass
const VisorGlass = () => (
  <meshPhysicalMaterial color="#0f1318" roughness={0.06} metalness={0.45} clearcoat={1.0} clearcoatRoughness={0.04} reflectivity={0.95} envMapIntensity={1.8} />
);

// Cyan glow (eyes, indicators)
const CyanGlow = () => (
  <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={2.8} roughness={0.15} metalness={0.1} />
);

// Soft cyan (smile, accents)
const CyanSoft = () => (
  <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.2} roughness={0.3} metalness={0.1} />
);

// Warm amber indicator
const AmberGlow = () => (
  <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.8} roughness={0.2} metalness={0.1} />
);

// Metallic chrome trim
const ChromeTrim = () => (
  <meshStandardMaterial color="#d4d6da" roughness={0.08} metalness={0.95} />
);

// Brushed aluminium
const BrushedAlum = () => (
  <meshStandardMaterial color="#b8bcc2" roughness={0.22} metalness={0.75} />
);


export const Real3DMascot: React.FC<Real3DMascotProps> = ({ onPointerStateChange }) => {
  const groupRef = useRef<Group>(null);
  const eyeLRef = useRef<any>(null);
  const eyeRRef = useRef<any>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const spinRot = useRef(0);
  const bounce = useRef(1);

  // Global mouse tracking state
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1] relative to the entire window, not the canvas
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Use our global mouse coordinates instead of state.pointer
    const { x, y } = mouse.current;

    groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, x * 0.25, 0.06);
    groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, y * 0.18, 0.06);

    if (isSpinning) {
      spinRot.current += delta * 10;
      bounce.current = MathUtils.lerp(bounce.current, 1, 0.07);
      if (spinRot.current >= Math.PI * 2) { spinRot.current = 0; setIsSpinning(false); }
    }

    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -y * 0.4, 0.06);
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, x * 0.5 + spinRot.current, isSpinning ? 0.18 : 0.06);
    groupRef.current.rotation.z = MathUtils.lerp(groupRef.current.rotation.z, -x * 0.06, 0.06);
    bounce.current = MathUtils.lerp(bounce.current, 1, 0.05);
    groupRef.current.scale.setScalar(bounce.current);

    // Eye cursor tracking
    const t = state.clock.getElapsedTime();
    if (eyeLRef.current) {
      eyeLRef.current.position.x = -0.32 + x * 0.04;
      eyeLRef.current.position.y = 0.42 + y * 0.03;
      eyeLRef.current.scale.y = 0.16 + Math.sin(t * 3) * 0.004;
    }
    if (eyeRRef.current) {
      eyeRRef.current.position.x = 0.32 + x * 0.04;
      eyeRRef.current.position.y = 0.42 + y * 0.03;
      eyeRRef.current.scale.y = 0.16 + Math.sin(t * 3) * 0.004;
    }
  });

  const handleClick = () => {
    if (!isSpinning) { setIsSpinning(true); bounce.current = 1.14; }
  };

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; onPointerStateChange?.(true); }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; onPointerStateChange?.(false); }}
    >
      <Float speed={2} rotationIntensity={0.08} floatIntensity={0.4}>
        <group scale={[0.92, 0.92, 0.92]} position={[0, -0.3, 0]}>

          {/* ══════════════════════════════════════════════════ */}
          {/*            HEAD — MAIN SHELL                     */}
          {/* ══════════════════════════════════════════════════ */}
          <mesh position={[0, 0.65, 0]}>
            <sphereGeometry args={[1.05, 64, 64]} />
            <ShellWhite />
          </mesh>

          {/* Head top cap — grey accent */}
          <mesh position={[0, 1.25, 0]} scale={[0.85, 0.4, 0.85]}>
            <sphereGeometry args={[0.85, 48, 48]} />
            <PanelLightGrey />
          </mesh>

          {/* Head seam line — horizontal ring around forehead */}
          <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.92, 0.018, 12, 48]} />
            <JointGrey />
          </mesh>

          {/* Head side ear modules */}
          <group position={[-1.02, 0.7, 0]}>
            <mesh scale={[0.2, 0.35, 0.3]}>
              <sphereGeometry args={[0.9, 24, 24]} />
              <PanelLightGrey />
            </mesh>
            {/* Ear grille vent slits */}
            {[-0.08, 0, 0.08].map((yOff, i) => (
              <mesh key={`el${i}`} position={[-0.16, yOff, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.08, 0.015, 0.002]}>
                <boxGeometry args={[1, 1, 1]} />
                <DarkGrey />
              </mesh>
            ))}
          </group>
          <group position={[1.02, 0.7, 0]}>
            <mesh scale={[0.2, 0.35, 0.3]}>
              <sphereGeometry args={[0.9, 24, 24]} />
              <PanelLightGrey />
            </mesh>
            {[-0.08, 0, 0.08].map((yOff, i) => (
              <mesh key={`er${i}`} position={[0.16, yOff, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.08, 0.015, 0.002]}>
                <boxGeometry args={[1, 1, 1]} />
                <DarkGrey />
              </mesh>
            ))}
          </group>


          {/* ══════════════════════════════════════════════════ */}
          {/*           FACE VISOR — GLOSSY SCREEN              */}
          {/* ══════════════════════════════════════════════════ */}
          {/* Visor bezel frame — grey */}
          <mesh position={[0, 0.55, 0.68]} scale={[0.84, 0.58, 0.1]}>
            <sphereGeometry args={[1, 36, 36]} />
            <JointGrey />
          </mesh>

          {/* Inner visor trim — darker */}
          <mesh position={[0, 0.55, 0.7]} scale={[0.8, 0.54, 0.08]}>
            <sphereGeometry args={[1, 32, 32]} />
            <DarkGrey />
          </mesh>

          {/* Main visor glass */}
          <mesh position={[0, 0.55, 0.72]} scale={[0.78, 0.52, 0.25]}>
            <sphereGeometry args={[1, 48, 48]} />
            <VisorGlass />
          </mesh>


          {/* ══════════════════════════════════════════════════ */}
          {/*           EYES — CURSOR-TRACKING GLOW             */}
          {/* ══════════════════════════════════════════════════ */}
          {/* Eye glow halos */}
          <mesh position={[-0.32, 0.42, 0.93]} scale={[0.22, 0.2, 0.02]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} transparent opacity={0.3} />
          </mesh>
          <mesh position={[0.32, 0.42, 0.93]} scale={[0.22, 0.2, 0.02]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} transparent opacity={0.3} />
          </mesh>

          {/* Main eyes */}
          <mesh ref={eyeLRef} position={[-0.32, 0.42, 0.95]} scale={[0.18, 0.16, 0.06]}>
            <sphereGeometry args={[1, 24, 24]} />
            <CyanGlow />
          </mesh>
          <mesh ref={eyeRRef} position={[0.32, 0.42, 0.95]} scale={[0.18, 0.16, 0.06]}>
            <sphereGeometry args={[1, 24, 24]} />
            <CyanGlow />
          </mesh>

          {/* Eye pupils — darker core */}
          <mesh position={[-0.32, 0.42, 0.97]} scale={[0.08, 0.07, 0.03]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#0e7490" emissive="#0891b2" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0.32, 0.42, 0.97]} scale={[0.08, 0.07, 0.03]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#0e7490" emissive="#0891b2" emissiveIntensity={1.5} />
          </mesh>

          {/* Smile */}
          <mesh position={[0, 0.18, 0.95]} scale={[0.22, 0.06, 0.04]}>
            <torusGeometry args={[0.8, 0.35, 12, 24, Math.PI]} />
            <CyanSoft />
          </mesh>


          {/* ══════════════════════════════════════════════════ */}
          {/*         ANTENNA ASSEMBLY                          */}
          {/* ══════════════════════════════════════════════════ */}
          {/* Base plate */}
          <mesh position={[0, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 24]} />
            <JointGrey />
          </mesh>
          {/* Base ring */}
          <mesh position={[0, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.12, 0.02, 12, 24]} />
            <ChromeTrim />
          </mesh>
          {/* Stem lower — thicker */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.05, 0.04, 0.22, 16]} />
            <BrushedAlum />
          </mesh>
          {/* Stem upper — thinner */}
          <mesh position={[0, 1.68, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.2, 16]} />
            <ChromeTrim />
          </mesh>
          {/* Joint ring between stems */}
          <mesh position={[0, 1.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.05, 0.015, 8, 16]} />
            <JointGrey />
          </mesh>
          {/* Glowing tip ball */}
          <mesh position={[0, 1.82, 0]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <CyanGlow />
          </mesh>
          {/* Tip glow halo */}
          <mesh position={[0, 1.82, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} transparent opacity={0.2} />
          </mesh>


          {/* ══════════════════════════════════════════════════ */}
          {/*       NECK JOINT — MECHANICAL DETAIL              */}
          {/* ══════════════════════════════════════════════════ */}
          {/* Primary neck ring */}
          <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.065, 16, 36]} />
            <JointGrey />
          </mesh>
          {/* Inner neck mechanism */}
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.08, 32]} />
            <DarkGrey />
          </mesh>
          {/* Neck bolts — 4 around the ring */}
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
            <mesh key={`nb${i}`} position={[Math.cos(angle) * 0.55, -0.02, Math.sin(angle) * 0.55]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <ChromeTrim />
            </mesh>
          ))}


          {/* ══════════════════════════════════════════════════ */}
          {/*     BODY — CAPSULE WITH PANEL DETAILS             */}
          {/* ══════════════════════════════════════════════════ */}
          {/* Main body capsule */}
          <mesh position={[0, -0.55, 0]}>
            <capsuleGeometry args={[0.72, 0.8, 16, 48]} />
            <ShellWhite />
          </mesh>

          {/* Chest front panel — light grey */}
          <mesh position={[0, -0.38, 0.62]} scale={[0.55, 0.62, 0.15]}>
            <sphereGeometry args={[0.9, 32, 32]} />
            <PanelLightGrey />
          </mesh>

          {/* Chest panel border trim */}
          <mesh position={[0, -0.38, 0.63]} scale={[0.58, 0.65, 0.02]}>
            <sphereGeometry args={[0.9, 24, 24]} />
            <JointGrey />
          </mesh>

          {/* Chest glow power dot */}
          <mesh position={[0, -0.18, 0.76]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <CyanGlow />
          </mesh>
          {/* Power dot ring */}
          <mesh position={[0, -0.18, 0.75]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.12, 0.015, 12, 24]} />
            <JointGrey />
          </mesh>

          {/* Belly secondary indicator — amber */}
          <mesh position={[0, -0.55, 0.72]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <AmberGlow />
          </mesh>

          {/* Side panel seam lines */}
          <mesh position={[-0.62, -0.45, 0.28]} rotation={[0, 0.4, 0]} scale={[0.01, 0.45, 0.01]}>
            <boxGeometry args={[1, 1, 1]} />
            <JointGrey />
          </mesh>
          <mesh position={[0.62, -0.45, 0.28]} rotation={[0, -0.4, 0]} scale={[0.01, 0.45, 0.01]}>
            <boxGeometry args={[1, 1, 1]} />
            <JointGrey />
          </mesh>

          {/* Side body vents — left */}
          {[-0.35, -0.48, -0.61].map((yPos, i) => (
            <mesh key={`vl${i}`} position={[-0.72, yPos, 0.12]} rotation={[0, Math.PI / 2, 0]} scale={[0.06, 0.012, 0.002]}>
              <boxGeometry args={[1, 1, 1]} />
              <DarkGrey />
            </mesh>
          ))}
          {/* Side body vents — right */}
          {[-0.35, -0.48, -0.61].map((yPos, i) => (
            <mesh key={`vr${i}`} position={[0.72, yPos, 0.12]} rotation={[0, Math.PI / 2, 0]} scale={[0.06, 0.012, 0.002]}>
              <boxGeometry args={[1, 1, 1]} />
              <DarkGrey />
            </mesh>
          ))}

          {/* Mid body seam ring */}
          <mesh position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.72, 0.015, 10, 40]} />
            <JointGrey />
          </mesh>

          {/* Back panel detail — grey rectangle */}
          <mesh position={[0, -0.4, -0.65]} scale={[0.35, 0.4, 0.08]}>
            <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
            <PanelLightGrey />
          </mesh>
          {/* Back panel screws */}
          <mesh position={[-0.12, -0.25, -0.7]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 8]} />
            <ChromeTrim />
          </mesh>
          <mesh position={[0.12, -0.25, -0.7]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 8]} />
            <ChromeTrim />
          </mesh>
          <mesh position={[-0.12, -0.55, -0.7]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 8]} />
            <ChromeTrim />
          </mesh>
          <mesh position={[0.12, -0.55, -0.7]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 8]} />
            <ChromeTrim />
          </mesh>

          {/* Back vent port */}
          <mesh position={[0, -0.7, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <Charcoal />
          </mesh>
          <mesh position={[0, -0.7, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.012, 8, 16]} />
            <JointGrey />
          </mesh>


          {/* ══════════════════════════════════════════════════ */}
          {/*      ARMS — DETAILED MECHANICAL JOINTS            */}
          {/* ══════════════════════════════════════════════════ */}
          {/* Left Arm */}
          <group position={[-0.88, -0.35, 0]} rotation={[0, 0, 0.35]}>
            {/* Shoulder mount plate */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
              <JointGrey />
            </mesh>
            {/* Shoulder ball joint */}
            <mesh>
              <sphereGeometry args={[0.14, 20, 20]} />
              <PanelLightGrey />
            </mesh>
            {/* Shoulder ring */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.14, 0.012, 8, 16]} />
              <ChromeTrim />
            </mesh>
            {/* Upper arm */}
            <mesh position={[-0.18, -0.22, 0]} rotation={[0, 0, 0.15]}>
              <capsuleGeometry args={[0.1, 0.26, 8, 20]} />
              <ShellWhite />
            </mesh>
            {/* Arm panel stripe */}
            <mesh position={[-0.18, -0.22, 0.1]} rotation={[0, 0, 0.15]} scale={[0.06, 0.18, 0.01]}>
              <boxGeometry args={[1, 1, 1]} />
              <PanelLightGrey />
            </mesh>
            {/* Elbow joint */}
            <mesh position={[-0.22, -0.4, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <JointGrey />
            </mesh>
            {/* Hand nub */}
            <mesh position={[-0.24, -0.48, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <PanelLightGrey />
            </mesh>
            {/* Hand detail ring */}
            <mesh position={[-0.24, -0.42, 0]} rotation={[0, 0, 0.15]}>
              <torusGeometry args={[0.08, 0.01, 8, 12]} />
              <JointGrey />
            </mesh>
          </group>

          {/* Right Arm */}
          <group position={[0.88, -0.35, 0]} rotation={[0, 0, -0.35]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
              <JointGrey />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.14, 20, 20]} />
              <PanelLightGrey />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.14, 0.012, 8, 16]} />
              <ChromeTrim />
            </mesh>
            <mesh position={[0.18, -0.22, 0]} rotation={[0, 0, -0.15]}>
              <capsuleGeometry args={[0.1, 0.26, 8, 20]} />
              <ShellWhite />
            </mesh>
            <mesh position={[0.18, -0.22, 0.1]} rotation={[0, 0, -0.15]} scale={[0.06, 0.18, 0.01]}>
              <boxGeometry args={[1, 1, 1]} />
              <PanelLightGrey />
            </mesh>
            <mesh position={[0.22, -0.4, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <JointGrey />
            </mesh>
            <mesh position={[0.24, -0.48, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <PanelLightGrey />
            </mesh>
            <mesh position={[0.24, -0.42, 0]} rotation={[0, 0, -0.15]}>
              <torusGeometry args={[0.08, 0.01, 8, 12]} />
              <JointGrey />
            </mesh>
          </group>


          {/* ══════════════════════════════════════════════════ */}
          {/*      BOTTOM BASE — WITH DETAIL RINGS              */}
          {/* ══════════════════════════════════════════════════ */}
          {/* Base hemisphere */}
          <mesh position={[0, -1.35, 0]}>
            <sphereGeometry args={[0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <PanelLightGrey />
          </mesh>

          {/* Base rim ring — chrome */}
          <mesh position={[0, -1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.035, 14, 36]} />
            <ChromeTrim />
          </mesh>

          {/* Inner base ring */}
          <mesh position={[0, -1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.35, 0.02, 10, 24]} />
            <JointGrey />
          </mesh>

          {/* Base glow ring — subtle cyan */}
          <mesh position={[0, -1.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.45, 0.012, 10, 32]} />
            <CyanSoft />
          </mesh>

          {/* Bottom center port */}
          <mesh position={[0, -1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
            <Charcoal />
          </mesh>

        </group>
      </Float>
    </group>
  );
};
