"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { PerspectiveCamera } from "three";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

type Params = {
  cameraRef: React.RefObject<PerspectiveCamera | null>;
  progressRef: React.MutableRefObject<number>;
  damping?: number;
};

/**
 * Câmera em jornada cinematográfica (scroll): posição + lookAt + roll leve.
 */
export function useCameraAnimation({ cameraRef, progressRef, damping = 5 }: Params) {
  const smoothProgress = useRef(0);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const cam = cameraRef.current;
    if (!cam) return;

    const p = easeOutCubic(Math.min(1, Math.max(0, progressRef.current)));
    smoothProgress.current = THREE.MathUtils.damp(smoothProgress.current, p, damping, delta);

    const t = smoothProgress.current;

    const z = THREE.MathUtils.lerp(6.2, 1.75, t);
    const y = THREE.MathUtils.lerp(0, 1.55, t);
    const x = THREE.MathUtils.lerp(0, 0.35, Math.sin(t * Math.PI) * 0.5);

    cam.position.set(x, y, z);
    lookAt.set(0, 0.12 + t * 0.42, 0);
    cam.lookAt(lookAt);
    cam.rotateZ(Math.sin(t * Math.PI * 2) * 0.022);
  });
}
