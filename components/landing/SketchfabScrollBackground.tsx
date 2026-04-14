"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKETCHFAB_EMBED_SRC =
  "https://sketchfab.com/models/571baf9cfcd74cc69eaa22d423678b25/embed?ui_theme=dark&autostart=1";

type SketchfabScrollBackgroundProps = {
  /** Container da landing (scroll total = animação do fundo). */
  rootRef: RefObject<HTMLElement | null>;
  onReady?: () => void;
};

/**
 * Sketchfab em fixed fullscreen; move com o scroll de todas as secções.
 * Camada separada de blur escuro deixa o texto à frente nitidamente legível.
 */
export function SketchfabScrollBackground({ rootRef, onReady }: SketchfabScrollBackgroundProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const failSafe = window.setTimeout(() => setIframeLoaded((v) => v || true), 6000);
    return () => clearTimeout(failSafe);
  }, []);

  useEffect(() => {
    if (!iframeLoaded) return;
    const root = rootRef.current;
    const el = parallaxRef.current;
    if (!root || !el) return;

    gsap.set(el, { yPercent: 0, scale: 1, xPercent: 0 });

    const tween = gsap.to(el, {
      yPercent: -22,
      xPercent: 4,
      scale: 1.12,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        scroller: document.documentElement,
        invalidateOnRefresh: true,
      },
    });

    ScrollTrigger.refresh();
    requestAnimationFrame(() => {
      onReady?.();
      ScrollTrigger.refresh();
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [iframeLoaded, rootRef, onReady]);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden bg-[#0a0a0a]" aria-hidden>
        <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
          <div className="hero-sketchfab-cover">
            <iframe
              title="Tour IA"
              className="hero-sketchfab-iframe"
              src={SKETCHFAB_EMBED_SRC}
              frameBorder={0}
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>
      </div>
      {/* Blur + velatura: texto em primeiro plano fica nítido sobre fundo suavizado */}
      <div className="sketchfab-page-blur-layer pointer-events-none fixed inset-0 z-[2]" aria-hidden />
    </>
  );
}
