"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Sketchfab — Cat door god (tema escuro no embed). */
const SKETCHFAB_EMBED_SRC =
  "https://sketchfab.com/models/738a0dfa7ce84149ad76a460d2917fae/embed?ui_theme=dark";

type HeroVideoScrubProps = {
  children: ReactNode;
  /** Camada atrás da mídia (ex.: WebGL). */
  background?: ReactNode;
  /** Chamado após o iframe Sketchfab carregar (ex.: encerrar loader). */
  onReady?: () => void;
  /** Progresso 0–1 ao longo do bloco hero (scroll scrub). */
  onScrollProgress?: (progress: number) => void;
};

/**
 * Hero com modelo Sketchfab em fullscreen (substitui o vídeo scrub).
 * Mantém altura ~130vh + sticky para continuar alinhado ao scroll / loader.
 */
export function HeroVideoScrub({ children, background, onReady, onScrollProgress }: HeroVideoScrubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  const fireReady = () => {
    if (readyRef.current) return;
    readyRef.current = true;
    onReady?.();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  useEffect(() => {
    const container = containerRef.current;
    const parallaxEl = parallaxRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      scroller: document.documentElement,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        onScrollProgress?.(self.progress);
        const p = self.progress;
        if (parallaxEl) {
          gsap.set(parallaxEl, {
            yPercent: p * 14,
            scale: 1 + p * 0.045,
          });
        }
      },
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      trigger.kill();
    };
  }, [onScrollProgress]);

  /** Fallback se o iframe bloquear — não prender o loader indefinidamente */
  useEffect(() => {
    const t = window.setTimeout(() => fireReady(), 8000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} className="video-container">
      <div className="video-container-sticky" data-hero-scrub="sketchfab-v2">
        {background ? (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
            {background}
          </div>
        ) : null}

        <div className="hero-sketchfab-root pointer-events-none absolute inset-0 z-[1] overflow-hidden bg-[#0a0a0a]">
          <div ref={parallaxRef} className="hero-sketchfab-parallax absolute inset-0 will-change-transform">
            <div className="sketchfab-embed-wrapper relative h-full w-full">
              <iframe
                title="Cat door god"
                className="hero-sketchfab-iframe"
                frameBorder={0}
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src={SKETCHFAB_EMBED_SRC}
                onLoad={fireReady}
              />
            </div>
          </div>
          {/* Blur por cima do 3D: leitura do texto sem apagar o modelo */}
          <div className="hero-sketchfab-blur pointer-events-none absolute inset-0 z-[2]" aria-hidden />
          <p className="pointer-events-auto absolute bottom-1 left-0 right-0 z-[6] px-2 py-1 text-center text-[11px] leading-snug text-neutral-400">
            <a
              href="https://sketchfab.com/3d-models/cat-door-god-738a0dfa7ce84149ad76a460d2917fae?utm_medium=embed&utm_campaign=share-popup&utm_content=738a0dfa7ce84149ad76a460d2917fae"
              target="_blank"
              rel="nofollow noreferrer"
              className="font-semibold text-sky-500/90 hover:text-sky-400"
            >
              Cat door god
            </a>
            {" by "}
            <a
              href="https://sketchfab.com/yunzhenho?utm_medium=embed&utm_campaign=share-popup&utm_content=738a0dfa7ce84149ad76a460d2917fae"
              target="_blank"
              rel="nofollow noreferrer"
              className="font-semibold text-sky-500/90 hover:text-sky-400"
            >
              Yunzhen Ho
            </a>
            {" on "}
            <a
              href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=738a0dfa7ce84149ad76a460d2917fae"
              target="_blank"
              rel="nofollow noreferrer"
              className="font-semibold text-sky-500/90 hover:text-sky-400"
            >
              Sketchfab
            </a>
          </p>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] w-full"
          style={{
            height: "min(22vh, 220px)",
            background:
              "linear-gradient(to top, rgb(10,10,10) 0%, rgba(10,10,10,0.72) 45%, rgba(10,10,10,0.15) 78%, transparent 100%)",
          }}
          aria-hidden
        />
        <div className="hero-content-layer pointer-events-none relative z-[4] flex min-h-screen flex-col justify-end px-5 pb-28 pt-32 md:px-10 md:pb-36 md:pt-40">
          <div className="hero-content-inner pointer-events-auto mx-auto flex w-full max-w-[90rem] flex-col gap-8 md:gap-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
