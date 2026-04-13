"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Options = {
  rootRef: RefObject<HTMLElement | null>;
  /** Só monta triggers depois do loader (evita posições erradas). */
  active: boolean;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Orquestração estilo art-directed scroll (referência joseph-san.com):
 * — Lenis já em useLenisScrollTrigger (ScrollSmoother é Club GreenSock; Lenis dá o mesmo tipo de inércia).
 * — A) Tipografia cinética em [data-kinetic-heading] (skew + y, scrub).
 * — B) Parallax + scale em .project-card-media img (scrub).
 * — C) Transição de tema em [data-page-theme="light"] (CSS vars no html).
 */
export function useJosephScrollOrchestration({ rootRef, active }: Options) {
  useEffect(() => {
    if (!active || !rootRef.current || prefersReducedMotion()) return;

    const root = rootRef.current;
    const html = document.documentElement;

    const ctx = gsap.context(() => {
      const kineticHeadings = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-kinetic-heading]"));
      kineticHeadings.forEach((heading) => {
        const inners = heading.querySelectorAll<HTMLElement>(".kinetic-word-inner");
        if (!inners.length) return;
        gsap.set(inners, { willChange: "transform" });
        gsap.fromTo(
          inners,
          { yPercent: 108, skewY: 5, opacity: 0.96 },
          {
            yPercent: 0,
            skewY: 0,
            opacity: 1,
            ease: "power3.out",
            stagger: { each: 0.055, ease: "power2.out" },
            scrollTrigger: {
              trigger: heading,
              start: "top 90%",
              end: "top 38%",
              scrub: 1,
              scroller: document.documentElement,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      const cardMedias = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".project-card-media"));
      cardMedias.forEach((media) => {
        const img = media.querySelector<HTMLImageElement>("img.joseph-parallax-img");
        if (!img) return;
        gsap.set(img, { willChange: "transform" });
        gsap.fromTo(
          img,
          { scale: 1.28, y: 56 },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: media,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              scroller: document.documentElement,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      const lightBand = root.querySelector<HTMLElement>("[data-page-theme='light']");
      if (lightBand) {
        const darkBg = "#0a0a0a";
        const darkFg = "#e8e8e8";
        const lightBg = "#e8e4dc";
        const lightFg = "#0a0a0a";

        gsap
          .timeline({
            scrollTrigger: {
              trigger: lightBand,
              start: "top 90%",
              end: "bottom 10%",
              scrub: 0.65,
              scroller: document.documentElement,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            html,
            { "--page-bg": darkBg, "--page-fg": darkFg, "--page-muted": "#a3a3a3" },
            {
              "--page-bg": lightBg,
              "--page-fg": lightFg,
              "--page-muted": "#525252",
              duration: 0.38,
              ease: "power2.inOut",
            },
            0,
          )
          .to(
            html,
            {
              "--page-bg": darkBg,
              "--page-fg": darkFg,
              "--page-muted": "#a3a3a3",
              duration: 0.38,
              ease: "power2.inOut",
            },
            0.62,
          );
      }
    }, rootRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
    };
  }, [rootRef, active]);
}
