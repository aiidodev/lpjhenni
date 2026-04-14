"use client";

import { RefObject } from "react";
import { useEffect } from "react";
import gsap from "gsap";

type UseHeroAnimationParams = {
  rootRef: RefObject<HTMLElement | null>;
};

/**
 * Anima o hero sem SplitText por caractere — evita espaços fantasma (“sistema s”, “c oncorrência”)
 * e letras cortadas (“Eu” → “u”) causados por spans inline-block + tracking.
 */
export function useHeroAnimation({ rootRef }: UseHeroAnimationParams) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);

      gsap.fromTo(
        q(".hero-headline"),
        { opacity: 0, y: 36, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.15, ease: "power3.out" },
      );

      const heroIntroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroIntroTl
        .fromTo(q(".hero-badge"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(q(".hero-sub"), { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.45")
        .fromTo(q(".hero-kpi"), { opacity: 0, y: 34 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7 }, "-=0.45");
    }, rootRef);

    return () => ctx.revert();
  }, [rootRef]);
}
