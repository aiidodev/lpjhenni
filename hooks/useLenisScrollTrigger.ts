"use client";

import { useLayoutEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Smooth scroll art-directed (feeling joseph-san.com): Lenis + ScrollTrigger scrollerProxy.
 * ScrollSmoother é plugin GSAP pago (Club); Lenis dá inércia equivalente com scrub sincronizado.
 *
 * Lenis + ScrollTrigger precisam existir ANTES dos useEffect que criam ScrollTriggers.
 * useLayoutEffect roda antes dos useEffect dos hooks de animação.
 */
export function useLenisScrollTrigger() {
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      lerp: 0.09,
    });
    lenisRef.current = lenis;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    ScrollTrigger.defaults({ scroller: document.documentElement });

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onLenisScroll);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.defaults({ scroller: window });
    };
  }, []);

  return lenisRef;
}
