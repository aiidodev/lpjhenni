"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKETCHFAB_EMBED_SRC =
  "https://sketchfab.com/models/571baf9cfcd74cc69eaa22d423678b25/embed?ui_theme=dark&autostart=1";

type HeroVideoScrubProps = {
  children: ReactNode;
  background?: ReactNode;
  onReady?: () => void;
  onScrollProgress?: (progress: number) => void;
};

/**
 * Hero com Sketchfab em fullscreen + parallax no scroll + camada escura com blur para o texto.
 */
export function HeroVideoScrub({ children, background, onReady, onScrollProgress }: HeroVideoScrubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const notifyReady = useCallback(() => {
    setIframeLoaded(true);
  }, []);

  useEffect(() => {
    const failSafe = window.setTimeout(() => {
      setIframeLoaded((prev) => prev || true);
    }, 6000);
    return () => clearTimeout(failSafe);
  }, []);

  useEffect(() => {
    if (!iframeLoaded) return;
    const container = containerRef.current;
    const el = parallaxRef.current;
    if (!container || !el) return;

    let tween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      gsap.set(el, { yPercent: 0, scale: 1 });
      tween = gsap.to(el, {
        yPercent: -14,
        scale: 1.07,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          scroller: document.documentElement,
          invalidateOnRefresh: true,
          onUpdate: (self) => onScrollProgress?.(self.progress),
        },
      });
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        onReady?.();
        ScrollTrigger.refresh();
      });
    }, container);

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      ctx.revert();
    };
  }, [iframeLoaded, onReady, onScrollProgress]);

  return (
    <div ref={containerRef} className="video-container">
      <div className="video-container-sticky">
        {background ? (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
            {background}
          </div>
        ) : null}

        <div className="sketchfab-embed-wrapper absolute inset-0 z-[1] overflow-hidden bg-[#0a0a0a]">
          <div ref={parallaxRef} className="hero-sketchfab-parallax h-full w-full will-change-transform">
            <div className="hero-sketchfab-cover">
              <iframe
                title="Tour IA"
                className="hero-sketchfab-iframe"
                src={SKETCHFAB_EMBED_SRC}
                frameBorder={0}
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                onLoad={notifyReady}
              />
            </div>
          </div>
        </div>

        {/* Blur + escurecimento por cima do 3D — texto legível em todo o hero */}
        <div className="hero-sketchfab-text-shroud pointer-events-none absolute inset-0 z-[2]" aria-hidden />

        <div className="hero-scrub-fade-bottom pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-[min(38vh,420px)]" aria-hidden />

        <p className="hero-sketchfab-attribution pointer-events-auto absolute bottom-3 left-3 right-3 z-[5] text-center font-sans text-[10px] leading-snug text-neutral-500 md:left-8 md:text-left">
          <a
            href="https://sketchfab.com/3d-models/tour-ia-571baf9cfcd74cc69eaa22d423678b25?utm_medium=embed&utm_campaign=share-popup&utm_content=571baf9cfcd74cc69eaa22d423678b25"
            target="_blank"
            rel="nofollow noreferrer"
            className="font-semibold text-[#1CAAD9] hover:underline"
          >
            Tour IA
          </a>{" "}
          por{" "}
          <a
            href="https://sketchfab.com/diegonachon?utm_medium=embed&utm_campaign=share-popup&utm_content=571baf9cfcd74cc69eaa22d423678b25"
            target="_blank"
            rel="nofollow noreferrer"
            className="font-semibold text-[#1CAAD9] hover:underline"
          >
            Diego Nachon
          </a>{" "}
          em{" "}
          <a
            href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=571baf9cfcd74cc69eaa22d423678b25"
            target="_blank"
            rel="nofollow noreferrer"
            className="font-semibold text-[#1CAAD9] hover:underline"
          >
            Sketchfab
          </a>
        </p>

        <div className="content-overlay pointer-events-none relative z-[6] flex min-h-screen flex-col justify-end px-5 pb-32 pt-32 md:px-10 md:pb-40 md:pt-40">
          <div className="pointer-events-auto mx-auto flex w-full max-w-[90rem] flex-col gap-8 md:gap-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
