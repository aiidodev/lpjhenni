"use client";

import { ReactNode } from "react";

type HeroVideoScrubProps = {
  children: ReactNode;
};

/**
 * Bloco do hero: só layout e conteúdo; o fundo Sketchfab + blur são globais na landing.
 */
export function HeroVideoScrub({ children }: HeroVideoScrubProps) {
  return (
    <div className="video-container">
      <div className="video-container-sticky video-container-hero-only">
        <div className="content-overlay pointer-events-none relative z-[6] flex min-h-screen flex-col justify-end px-5 pb-32 pt-32 md:px-10 md:pb-40 md:pt-40">
          <div className="pointer-events-auto mx-auto flex w-full max-w-[90rem] flex-col gap-8 md:gap-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
