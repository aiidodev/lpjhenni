"use client";

import { type MutableRefObject, type RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type UseScrollSyncParams = {
  /** Container cujo scroll (via Lenis proxy) governa a jornada 0→1. */
  rootRef: RefObject<HTMLElement | null>;
  active: boolean;
};

export type ScrollSyncRefs = {
  /** Progresso global 0–1 para cena 3D / GSAP. */
  scrollProgressRef: MutableRefObject<number>;
  /** Fase visual 0–3 derivada de secções. */
  phaseRef: MutableRefObject<number>;
};

/**
 * ScrollTrigger + scrub ligado ao documento (compatível com Lenis scrollerProxy).
 * Timeline implícita: um único scrub suave; fases opcionais para micro-ritmo na cena 3D.
 */
export function useScrollSync({ rootRef, active }: UseScrollSyncParams): ScrollSyncRefs {
  const scrollProgressRef = useRef(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    if (!root) return;

    const triggers: ScrollTrigger[] = [];

    const main = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      scroller: document.documentElement,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });
    triggers.push(main);

    const sections = ["#hero", "#pioneirismo", "#portfolio", "#cta"];
    sections.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        scroller: document.documentElement,
        onEnter: () => {
          phaseRef.current = i;
        },
        onEnterBack: () => {
          phaseRef.current = i;
        },
      });
      triggers.push(st);
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [rootRef, active]);

  return { scrollProgressRef, phaseRef };
}
