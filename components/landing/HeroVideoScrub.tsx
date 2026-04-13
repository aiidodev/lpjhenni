"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Vídeo padrão (MP4 direto). Links de páginas — ex.: gemini.google.com/share/... — não são arquivos de vídeo; hospede um .mp4 e defina NEXT_PUBLIC_HERO_VIDEO_URL. */
const HERO_VIDEO_FALLBACK =
  "https://res.cloudinary.com/dgnly766m/video/upload/v1712610214/abstract_tech_bg_on8fjs.mp4";

export const HERO_SCRUB_VIDEO_SRC =
  (typeof process.env.NEXT_PUBLIC_HERO_VIDEO_URL === "string" && process.env.NEXT_PUBLIC_HERO_VIDEO_URL.trim()) ||
  HERO_VIDEO_FALLBACK;

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
        <video
          ref={videoRef}
          className="hero-scrub-video relative z-[1]"
          src={HERO_SCRUB_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          loop={false}
          tabIndex={-1}
          aria-hidden
        />
        <div
          className="hero-scrub-gradient pointer-events-none absolute inset-0 z-[2]"
          aria-hidden
        />
        <div className="content-overlay pointer-events-none relative z-[3] flex min-h-screen flex-col justify-end px-5 pb-28 pt-32 md:px-10 md:pb-36 md:pt-40">
          <div className="pointer-events-auto mx-auto flex w-full max-w-[90rem] flex-col gap-8 md:gap-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
