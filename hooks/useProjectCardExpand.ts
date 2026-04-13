"use client";

import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";

const DURATION = 1.2;
const EASE = "expo.inOut";

/**
 * Expansão estilo Joseph San: clique em `.project-card` → clone de `.project-card-image` em `position:fixed`,
 * anima para cobrir a viewport; `onComplete` → redirecionar (sem esconder o restante da página).
 *
 * Exemplo mínimo (HTML + CSS + GSAP):
 *
 * HTML:
 * <div data-page-shell id="shell">
 *   <article class="project-card" data-project-url="https://exemplo.com">
 *     <div class="thumb"><img class="project-card-image" src="cover.jpg" alt="" /></div>
 *     <h2>Projeto</h2>
 *   </article>
 * </div>
 *
 * CSS:
 * .project-card { cursor: pointer; }
 * .thumb { aspect-ratio: 16/10; overflow: hidden; border-radius: 12px; }
 * .project-card-image { width: 100%; height: 100%; object-fit: cover; display: block; }
 *
 * JS (trecho): animar só o clone em fullscreen; onComplete → window.location.assign(url).
 *
 * Clique em `.project-card` (delegação): clona a `.project-card-image`, expande para 100vw×100vh.
 * No fim, chama onNavigate(url) — use para `window.location.assign`.
 */
export function useProjectCardExpand(
  rootRef: RefObject<HTMLElement | null>,
  onNavigate: (url: string) => void,
) {
  const busyRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handler = (event: MouseEvent) => {
      if (busyRef.current) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const card = target.closest<HTMLElement>(".project-card");
      if (!card || !root.contains(card)) return;

      const url = card.dataset.projectUrl?.trim();
      const img = card.querySelector<HTMLImageElement>(".project-card-image");
      if (!url || !img) {
        if (url) onNavigate(url);
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      busyRef.current = true;

      const rect = img.getBoundingClientRect();
      const shell = document.querySelector<HTMLElement>("[data-page-shell]");
      if (!shell) {
        onNavigate(url);
        return;
      }

      gsap.set(shell, { clearProps: "opacity" });

      document.body.style.overflow = "hidden";

      const layer = document.createElement("div");
      layer.className = "project-expand-layer";
      layer.setAttribute("aria-hidden", "true");
      layer.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:10000",
        "pointer-events:none",
      ].join(";");

      const box = document.createElement("div");
      box.className = "project-expand-clone";
      Object.assign(box.style, {
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex: "10001",
        overflow: "hidden",
        borderRadius: "12px",
        pointerEvents: "none",
        willChange: "transform, width, height, top, left, border-radius",
      });

      const clone = img.cloneNode(true) as HTMLImageElement;
      clone.removeAttribute("loading");
      Object.assign(clone.style, {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        pointerEvents: "none",
      });

      box.appendChild(clone);
      layer.appendChild(box);
      document.body.appendChild(layer);

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const tl = gsap.timeline({
        defaults: { duration: DURATION, ease: EASE },
        onComplete: () => {
          onNavigate(url);
        },
      });

      tl.to(
        box,
        {
          top: 0,
          left: 0,
          width: vw,
          height: vh,
          borderRadius: 0,
          duration: DURATION,
          ease: EASE,
        },
        0,
      );
    };

    root.addEventListener("click", handler, true);
    return () => root.removeEventListener("click", handler, true);
  }, [onNavigate, rootRef]);
}
