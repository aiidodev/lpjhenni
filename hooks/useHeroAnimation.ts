"use client";

import { RefObject } from "react";
import { useEffect } from "react";
import gsap from "gsap";

type UseHeroAnimationParams = {
  rootRef: RefObject<HTMLDivElement | null>;
  setupSplitText: (selector: string) => HTMLElement[];
};

export function useHeroAnimation({ rootRef, setupSplitText }: UseHeroAnimationParams) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);

    const animateTitles = async () => {
      let splitTargets: HTMLElement[] = [];
      try {
        const splitModule = await import("gsap/SplitText");
        const SplitText = (splitModule as unknown as {
          SplitText: new (element: string | Element | Iterable<Element>, vars: { type: string }) => { chars: HTMLElement[] };
        }).SplitText;
        gsap.registerPlugin(SplitText);
        splitTargets = new SplitText(q(".hero-headline"), { type: "chars,words" }).chars;
      } catch {
        splitTargets = setupSplitText(".hero-headline");
      }
      if (!splitTargets.length) return;

      gsap.fromTo(
        splitTargets,
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.014,
          duration: 1.4,
          ease: "power3.out",
        },
      );
    };

    void animateTitles();

    const heroIntroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroIntroTl
      .fromTo(q(".hero-badge"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo(q(".hero-sub"), { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.45")
      .fromTo(q(".hero-kpi"), { opacity: 0, y: 34 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7 }, "-=0.45")
      .fromTo(q(".hero-button"), { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, "-=0.3");

    }, rootRef);

    return () => ctx.revert();
  }, [rootRef, setupSplitText]);
}
