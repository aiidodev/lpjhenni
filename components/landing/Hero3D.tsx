"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera, Points } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function seeded(index: number) {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function Particles({
  count,
  spread,
  color,
  size,
  drift,
  reactive,
}: {
  count: number;
  spread: [number, number, number];
  color: string;
  size: number;
  drift: number;
  reactive?: boolean;
}) {
  const ref = useRef<THREE.Points>(null);
  const [positions, basePositions] = useMemo(() => {
    const data = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      base[i * 3] = (seeded(i + 1) - 0.5) * spread[0];
      base[i * 3 + 1] = (seeded(i + 2) - 0.5) * spread[1];
      base[i * 3 + 2] = (seeded(i + 3) - 0.5) * spread[2];
      data[i * 3] = base[i * 3];
      data[i * 3 + 1] = base[i * 3 + 1];
      data[i * 3 + 2] = base[i * 3 + 2];
    }
    return [data, base];
  }, [count, spread]);

  useFrame(({ pointer, clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * drift + pointer.x * 0.3;
    ref.current.rotation.x = pointer.y * 0.15 + Math.sin(t * 0.2) * 0.06;
    if (reactive) {
      const geo = ref.current.geometry;
      const attr = geo.attributes.position as THREE.BufferAttribute;
      const cursorX = pointer.x * (spread[0] * 0.45);
      const cursorY = pointer.y * (spread[1] * 0.42);
      for (let i = 0; i < count; i += 1) {
        const ix = i * 3;
        const bx = basePositions[ix];
        const by = basePositions[ix + 1];
        const bz = basePositions[ix + 2];
        const dx = bx - cursorX;
        const dy = by - cursorY;
        const distance = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        const wave = Math.sin(t * 1.8 + i * 0.025) * 0.14;
        const force = Math.max(0, 1.5 - distance) * 0.32;
        attr.array[ix] = bx + (dx / distance) * force + wave;
        attr.array[ix + 1] = by + (dy / distance) * force + Math.cos(t * 1.4 + i * 0.02) * 0.06;
        attr.array[ix + 2] = bz + Math.sin(t * 1.1 + i * 0.03) * 0.28;
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.8} />
    </Points>
  );
}

function WaveGrid({ y, tone, wireOpacity }: { y: number; tone: string; wireOpacity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = -Math.PI / 2 + pointer.y * 0.1;
    ref.current.rotation.z = pointer.x * 0.12;
    ref.current.position.z = Math.sin(t * 0.8) * 0.32;
  });
  return (
    <mesh ref={ref} position={[0, y, -1]}>
      <planeGeometry args={[30, 16, 50, 50]} />
      <meshStandardMaterial color={tone} wireframe opacity={wireOpacity} transparent />
    </mesh>
  );
}

function CoreObject() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ pointer, clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.4 + pointer.x * 0.45;
    ref.current.rotation.x = Math.sin(t * 0.6) * 0.15 + pointer.y * 0.2;
    ref.current.position.x = pointer.x * 0.5;
    ref.current.position.y = pointer.y * 0.35 + Math.sin(t * 0.9) * 0.12;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.7}>
      <mesh ref={ref} position={[0, 0.15, 0]}>
        <icosahedronGeometry args={[1.25, 6]} />
        <meshPhysicalMaterial
          color="#c4c4c4"
          emissive="#6b6b7a"
          emissiveIntensity={0.35}
          roughness={0.12}
          transmission={0.22}
          thickness={1.2}
          metalness={0.55}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>
    </Float>
  );
}

type Hero3DProps = {
  onReady?: () => void;
  scrollProgress?: number;
};

function ScrollCameraRig({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    const t = Math.min(1, Math.max(0, scrollProgress));
    const targetZ = 7.5 - t * 1.8;
    const targetY = 0.2 + t * 0.85 + pointer.y * 0.2;
    const targetX = pointer.x * 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.lookAt(0, 0.05 + t * 0.4, 0);
  });
  return null;
}

export function Hero3D({ onReady, scrollProgress = 0 }: Hero3DProps) {
  return (
    <div className="absolute inset-0 h-full min-h-[100vh] w-full">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 52, position: [0, 0.2, 7.5] }}
        onCreated={() => onReady?.()}
      >
        <fog attach="fog" args={["#0a0a0a", 5.5, 22]} />
        <PerspectiveCamera makeDefault position={[0, 0.2, 7.5]} />
        <ambientLight intensity={0.38} />
        <pointLight position={[0, 2.3, 5.5]} intensity={2.2} color="#e8e8f0" />
        <pointLight position={[-4, -2, 3]} intensity={1.1} color="#a8a8b8" />
        <spotLight position={[3, 5, 6]} angle={0.35} penumbra={0.7} intensity={1.6} color="#ffffff" />
        <ScrollCameraRig scrollProgress={scrollProgress} />
        <CoreObject />
        <Particles count={2800} spread={[26, 12, 16]} color="#c8c8d4" size={0.022} drift={0.055} reactive />
        <Particles count={1800} spread={[18, 8, 22]} color="#8a8a98" size={0.014} drift={0.09} />
        <WaveGrid y={-2.8} tone="#1a1a1f" wireOpacity={0.2} />
        <WaveGrid y={-3.6} tone="#25252c" wireOpacity={0.11} />
      </Canvas>
    </div>
  );
}
