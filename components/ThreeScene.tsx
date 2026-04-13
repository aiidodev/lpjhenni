"use client";

import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { PerspectiveCamera as PerspCam } from "three";
import { useCameraAnimation } from "@/hooks/useCameraAnimation";

function seeded(i: number) {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 4 + seeded(i) * 18;
      const th = seeded(i + 1) * Math.PI * 2;
      const phv = seeded(i + 2) * Math.PI;
      pos[i * 3] = r * Math.sin(th) * Math.cos(phv);
      pos[i * 3 + 1] = (seeded(i + 3) - 0.5) * 10;
      pos[i * 3 + 2] = r * Math.cos(th) * Math.cos(phv);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.rotation.y = t * 0.035;
    ref.current.rotation.x = Math.sin(t * 0.11) * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#b8b8d4"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.78}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AbstractForms({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const g1 = useRef<THREE.Group>(null);
  const g2 = useRef<THREE.Group>(null);
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = progressRef.current;
    if (g1.current) {
      g1.current.rotation.y = t * 0.31 + p * 0.8;
      g1.current.rotation.x = Math.sin(t * 0.4) * 0.12;
      g1.current.position.y = Math.sin(t * 0.55) * 0.15;
    }
    if (g2.current) {
      g2.current.rotation.y = -t * 0.22 - p * 0.5;
      g2.current.position.x = Math.cos(t * 0.35) * 0.4;
      g2.current.position.z = -2.2 - p * 0.6;
    }
    if (mesh1.current) {
      const s = THREE.MathUtils.lerp(1.05, 1.22, 0.5 + 0.5 * Math.sin(t * 0.7));
      mesh1.current.scale.setScalar(s);
    }
    if (mesh2.current) {
      mesh2.current.rotation.z = t * 0.18;
    }
  });

  return (
    <group>
      <group ref={g1} position={[0.8, 0.1, -1.2]}>
        <mesh ref={mesh1}>
          <icosahedronGeometry args={[1.1, 5]} />
          <meshPhysicalMaterial
            color="#2a2a32"
            emissive="#4a4a62"
            emissiveIntensity={0.45}
            metalness={0.65}
            roughness={0.2}
            clearcoat={1}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>
      <group ref={g2} position={[-1.1, -0.2, -2.8]}>
        <mesh ref={mesh2}>
          <torusKnotGeometry args={[0.65, 0.2, 128, 32]} />
          <meshStandardMaterial
            color="#1e1e28"
            emissive="#3d3d55"
            emissiveIntensity={0.35}
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>
      </group>
    </group>
  );
}

function CinematicRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const camRef = useRef<PerspCam>(null);
  useCameraAnimation({ cameraRef: camRef, progressRef, damping: 4.2 });
  return <PerspectiveCamera ref={camRef} makeDefault fov={48} near={0.1} far={80} position={[0, 0, 6.2]} />;
}

function PostFX() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom luminanceThreshold={0.18} intensity={0.42} mipmapBlur radius={0.5} />
      <Vignette eskil={false} offset={0.18} darkness={0.52} />
      <Noise opacity={0.035} />
    </EffectComposer>
  );
}

function SceneContent({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor("#030305", 0);
  }, [gl]);

  const [particleCount] = useState(() => {
    if (typeof window === "undefined") return 2200;
    return window.innerWidth < 768 ? 1100 : 2600;
  });

  return (
    <>
      <color attach="background" args={["#030305"]} />
      <fog attach="fog" args={["#030305", 4, 38]} />

      <ambientLight intensity={0.22} />
      <directionalLight position={[6, 10, 4]} intensity={1.35} color="#e8e8ff" />
      <directionalLight position={[-8, -4, -2]} intensity={0.35} color="#6060a0" />
      <pointLight position={[0, 2, 5]} intensity={0.9} color="#c8c8e8" distance={24} decay={2} />

      <CinematicRig progressRef={progressRef} />
      <ParticleField count={particleCount} />
      <AbstractForms progressRef={progressRef} />

      <PostFX />
    </>
  );
}

export type ThreeSceneProps = {
  progressRef: MutableRefObject<number>;
  onReady?: () => void;
};

/** Fundo 3D fullscreen (fixed); HTML por cima com z-index maior. */
export function ThreeScene({ progressRef, onReady }: ThreeSceneProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[4]" aria-hidden data-three-background>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        onCreated={onReady}
      >
        <Suspense fallback={null}>
          <SceneContent progressRef={progressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
