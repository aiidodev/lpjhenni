"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { MutableRefObject } from "react";

const DEFAULT_EMBED =
  "https://sketchfab.com/models/571baf9cfcd74cc69eaa22d423678b25/embed?autostart=1&ui_controls=0&ui_infos=0";

const EMBED_SRC =
  (typeof process.env.NEXT_PUBLIC_SKETCHFAB_EMBED_URL === "string" && process.env.NEXT_PUBLIC_SKETCHFAB_EMBED_URL.trim()) ||
  DEFAULT_EMBED;

export type SketchfabBackgroundProps = {
  progressRef: MutableRefObject<number>;
  onReady?: () => void;
};

/**
 * Fundo Sketchfab em fullscreen; escala aumenta com o progresso de scroll da LP (0→1).
 */
export function SketchfabBackground({ progressRef, onReady }: SketchfabBackgroundProps) {
  const scaleWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scaleWrapRef.current;
    if (!el) return;

    const update = () => {
      const p = progressRef.current;
      const scale = 1 + p * 0.45;
      el.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, [progressRef]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[4] overflow-hidden"
      aria-hidden
      data-sketchfab-background
    >
      <div
        ref={scaleWrapRef}
        className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] max-w-none origin-center will-change-transform"
        style={{ transform: "translate(-50%, -50%) scale(1)" }}
      >
        <iframe
          title="Tour IA — fundo"
          className="h-full w-full border-0 opacity-95"
          src={EMBED_SRC}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={onReady}
        />
      </div>
    </div>
  );
}
