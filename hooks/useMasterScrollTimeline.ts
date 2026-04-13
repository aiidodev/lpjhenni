"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type UseMasterScrollTimelineParams = {
  rootRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<HTMLDivElement | null>;
};

/**
 * Barra de progresso global apenas — sem esconder seções/cards (evita portfólio ilegível).
 */
export function useMasterScrollTimeline({ rootRef, progressRef }: UseMasterScrollTimelineParams) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const scroller = document.documentElement;

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { scroller, scrub: true, start: 0, end: "max" },
        });
      }
    }, rootRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [progressRef, rootRef]);
}
