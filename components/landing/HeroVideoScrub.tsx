"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * MP4s públicos (stock / CDN). O browser usa o primeiro `<source>` compatível.
 * NEXT_PUBLIC_HERO_VIDEO_URL (opcional) fica em primeiro — use um .mp4 direto, não páginas de partilha.
 */
const HERO_VIDEO_STOCK_FALLBACKS = [
  "https://res.cloudinary.com/dgnly766m/video/upload/v1712610214/abstract_tech_bg_on8fjs.mp4",
  /** CC0 (MDN) — fallback estável se o CDN principal falhar ou bloquear hotlink. */
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
] as const;

/** Na VPS/Vercel: se o hero mostrar outro vídeo, rever `.env` — esta URL tem prioridade sobre o stock. */
const envHero = typeof process.env.NEXT_PUBLIC_HERO_VIDEO_URL === "string" ? process.env.NEXT_PUBLIC_HERO_VIDEO_URL.trim() : "";

export const HERO_VIDEO_SOURCES: string[] = envHero ? [envHero, ...HERO_VIDEO_STOCK_FALLBACKS] : [...HERO_VIDEO_STOCK_FALLBACKS];

/** Primeiro URL da lista (útil para logs / metadados). */
export const HERO_SCRUB_VIDEO_SRC = HERO_VIDEO_SOURCES[0];

type HeroVideoScrubProps = {
  children: ReactNode;
  /** Camada atrás do vídeo (ex.: WebGL). */
  background?: ReactNode;
  /** Chamado após `loadedmetadata` + ScrollTrigger montado (ex.: encerrar loader). */
  onReady?: () => void;
  /** Progresso 0–1 do scrub no hero (para acoplar câmera 3D, etc.). */
  onScrollProgress?: (progress: number) => void;
};

/**
 * Hero com vídeo controlado pelo scroll (scrubbing), estilo joseph-san.com.
 * Container ~130vh + vídeo sticky; `currentTime` mapeado ao progresso do ScrollTrigger (scrub: 1).
 */
export function HeroVideoScrub({ children, background, onReady, onScrollProgress }: HeroVideoScrubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let trigger: ScrollTrigger | null = null;

    const bindScrub = () => {
      video.pause();

      trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        scroller: document.documentElement,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          onScrollProgress?.(self.progress);
          const d = video.duration;
          if (!d || !Number.isFinite(d)) return;
          video.currentTime = self.progress * d;
        },
      });

      ScrollTrigger.refresh();
      onReady?.();
    };

    const onLoadedMetadata = () => {
      bindScrub();
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      onLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    }

    return () => {
      trigger?.kill();
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [onReady, onScrollProgress]);

  return (
    <div ref={containerRef} className="video-container">
      <div className="video-container-sticky">
        {background ? (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
            {background}
          </div>
        ) : null}
        <div className="hero-scrub-video-wrap pointer-events-none absolute inset-0 z-[1] overflow-hidden bg-[#0a0a0a]">
          <video
            ref={videoRef}
            className="hero-scrub-video"
            muted
            playsInline
            preload="auto"
            loop={false}
            tabIndex={-1}
            aria-hidden
          >
            {HERO_VIDEO_SOURCES.map((src) => (
              <source key={src} src={src} type="video/mp4" />
            ))}
          </video>
        </div>
        {/* Só escurece a zona inferior (ligação às secções) — não cobre o título */}
        <div className="hero-scrub-fade-bottom pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-[min(42vh,480px)]" aria-hidden />
        <div className="content-overlay pointer-events-none relative z-[3] flex min-h-screen flex-col justify-end px-5 pb-28 pt-32 md:px-10 md:pb-36 md:pt-40">
          <div className="pointer-events-auto mx-auto flex w-full max-w-[90rem] flex-col gap-8 md:gap-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
