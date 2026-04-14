"use client";

import { RefObject } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type UseHeroAnimationParams = {
  rootRef: RefObject<HTMLDivElement | null>;
  setupSplitText: (selector: string) => HTMLElement[];
};

/**
 * Hero: texto revelado com o scroll (scrub) — blur → nítido, em sincronia com o parallax do Sketchfab.
 */
export function useHeroAnimation({ rootRef, setupSplitText }: UseHeroAnimationParams) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);
      const heroEl = q("#hero")[0] as HTMLElement | undefined;
      if (!heroEl) return;

      const splitTargets = setupSplitText(".hero-headline");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          scrub: 1.25,
          scroller: document.documentElement,
          invalidateOnRefresh: true,
        },
      });

      if (splitTargets.length) {
        tl.fromTo(
          splitTargets,
          { opacity: 0.12, y: 56, filter: "blur(18px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.018, duration: 0.55 },
          0,
        );
      }

      tl.fromTo(
        q(".hero-badge"),
        { opacity: 0, y: 40, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.32 },
        0,
      );
      tl.fromTo(
        q(".hero-sub"),
        { opacity: 0, y: 44, filter: "blur(11px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.36 },
        0.05,
      );
      tl.fromTo(
        q(".hero-kpi"),
        { opacity: 0, y: 36, filter: "blur(9px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.07, duration: 0.3 },
        0.1,
      );
    }, rootRef);

    return () => ctx.revert();
  }, [rootRef, setupSplitText]);
}
