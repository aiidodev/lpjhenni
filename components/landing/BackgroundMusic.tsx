"use client";

import { useEffect, useRef, useState } from "react";

/** https://youtu.be/x43OJXk8idI — ambiente; override com NEXT_PUBLIC_YOUTUBE_AUDIO_ID */
const DEFAULT_YOUTUBE_ID = "x43OJXk8idI";

const YOUTUBE_ID =
  (typeof process.env.NEXT_PUBLIC_YOUTUBE_AUDIO_ID === "string" && process.env.NEXT_PUBLIC_YOUTUBE_AUDIO_ID.trim()) ||
  DEFAULT_YOUTUBE_ID;

const AUDIO_SRC =
  typeof process.env.NEXT_PUBLIC_AMBIENT_AUDIO_URL === "string" && process.env.NEXT_PUBLIC_AMBIENT_AUDIO_URL.trim()
    ? process.env.NEXT_PUBLIC_AMBIENT_AUDIO_URL.trim()
    : "";

function youtubeEmbedSrc(id: string, autoplay: boolean) {
  const q = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    loop: "1",
    playlist: id,
    controls: "0",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    enablejsapi: "1",
  });
  return `https://www.youtube.com/embed/${id}?${q.toString()}`;
}

/**
 * Música ambiente sempre ligada após o primeiro toque (política de autoplay dos browsers).
 * Sem botão — o utilizador activa o áudio com qualquer clique/toque na página.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const startedRef = useRef(false);

  const useYoutube = Boolean(YOUTUBE_ID);

  useEffect(() => {
    if (useYoutube) return;
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.22;
    el.loop = true;
  }, [useYoutube]);

  useEffect(() => {
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (useYoutube) {
        setIframeSrc(youtubeEmbedSrc(YOUTUBE_ID, true));
        return;
      }
      const el = audioRef.current;
      if (el && AUDIO_SRC) {
        void el.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", start, { passive: true });
    return () => window.removeEventListener("pointerdown", start);
  }, [useYoutube]);

  return (
    <>
      {useYoutube && iframeSrc ? (
        <iframe
          title="Música ambiente"
          src={iframeSrc}
          className="pointer-events-none fixed bottom-0 right-0 z-[94] h-[1px] w-[1px] opacity-0"
          allow="autoplay; encrypted-media; fullscreen"
        />
      ) : null}

      {!useYoutube && AUDIO_SRC ? <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" /> : null}
    </>
  );
}
