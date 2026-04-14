"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer, ScrollTrigger } from "gsap/all";
import {
  CasesSection,
  CTASection,
  ProblemSection,
  ProcessSection,
  ROISection,
  SolutionSection,
  TechSection,
  type PortfolioCaseItem,
} from "@/components/landing/sections";
import { PortfolioCaseModal } from "@/components/landing/PortfolioCaseModal";
import { ExperienceLoader } from "@/components/landing/ExperienceLoader";
import { WHATSAPP_URL } from "@/lib/contact";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";
import { useLenisScrollTrigger } from "@/hooks/useLenisScrollTrigger";
import { useMasterScrollTimeline } from "@/hooks/useMasterScrollTimeline";
import { HeroVideoScrub } from "@/components/landing/HeroVideoScrub";
import { ThreeScene } from "@/components/ThreeScene";
import { BackgroundMusic } from "@/components/landing/BackgroundMusic";
import { useJosephScrollOrchestration } from "@/hooks/useJosephScrollOrchestration";
import { useScrollSync } from "@/hooks/useScrollSync";

gsap.registerPlugin(ScrollTrigger, Observer);

function setupSplitText(selector: string) {
  const elements = gsap.utils.toArray<HTMLElement>(selector);
  elements.forEach((element) => {
    const text = element.innerText;
    const hasGradient = element.classList.contains("gradient-title");
    element.innerHTML = text
      .split("")
      .map((char) =>
        hasGradient
          ? `<span class="inline-block split-char split-gradient-char">${char === " " ? "&nbsp;" : char}</span>`
          : `<span class="inline-block split-char">${char === " " ? "&nbsp;" : char}</span>`,
      )
      .join("");
  });
  return gsap.utils.toArray<HTMLElement>(`${selector} .split-char`);
}

export function LandingExperience() {
  const defaultCursorLabel = "VIEW PROJECT - VIEW PROJECT - ";
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<SVGTextPathElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [videoReady, setVideoReady] = useState(false);
  const [threeReady, setThreeReady] = useState(false);
  const [minLoaderDone, setMinLoaderDone] = useState(false);
  const [portfolioCase, setPortfolioCase] = useState<PortfolioCaseItem | null>(null);
  const loaderVisible = !(videoReady && threeReady && minLoaderDone);

  const { scrollProgressRef } = useScrollSync({ rootRef, active: !loaderVisible });

  useLenisScrollTrigger();

  useHeroAnimation({
    rootRef,
    setupSplitText,
  });
  useMasterScrollTimeline({ rootRef, progressRef });
  useJosephScrollOrchestration({ rootRef, active: !loaderVisible });

  useEffect(() => {
    const t = setTimeout(() => setMinLoaderDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const failSafe = setTimeout(() => {
      setVideoReady(true);
      setThreeReady(true);
    }, 5200);
    return () => clearTimeout(failSafe);
  }, []);

  useEffect(() => {
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    const cursor = cursorRef.current;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let moveCursor: ((event: MouseEvent) => void) | null = null;
    let tickerUpdate: (() => void) | null = null;
    if (cursor) {
      const setX = gsap.quickSetter(cursor, "x", "px");
      const setY = gsap.quickSetter(cursor, "y", "px");
      moveCursor = (event: MouseEvent) => {
        targetX = event.clientX;
        targetY = event.clientY;
      };
      tickerUpdate = () => {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        setX(currentX);
        setY(currentY);
      };
      window.addEventListener("mousemove", moveCursor);
      gsap.ticker.add(tickerUpdate);
    }

    Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onDown: () => gsap.to(gsap.utils.selector(rootRef)(".cta-magnetic"), { scale: 0.98, duration: 0.2 }),
      onUp: () => gsap.to(gsap.utils.selector(rootRef)(".cta-magnetic"), { scale: 1, duration: 0.2 }),
    });
    const reactiveCards = Array.from((rootRef.current ?? document).querySelectorAll<HTMLElement>(".reactive-card"));
    const onCardMove = (event: MouseEvent) => {
      reactiveCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!inside) {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.45, ease: "power3.out" });
          return;
        }
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: px * 11, rotateX: -py * 10, transformPerspective: 900, duration: 0.25, ease: "power2.out" });
      });
    };
    window.addEventListener("mousemove", onCardMove);

    const magneticButtons = Array.from((rootRef.current ?? document).querySelectorAll<HTMLElement>(".magnetic-btn"));
    const magneticCleanups: Array<() => void> = [];
    magneticButtons.forEach((button) => {
      const onMove = (event: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const relX = event.clientX - rect.left - rect.width / 2;
        const relY = event.clientY - rect.top - rect.height / 2;
        gsap.to(button, { x: relX * 0.22, y: relY * 0.22, duration: 0.35, ease: "power3.out" });
      };
      const onLeave = () => gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.4)" });
      button.addEventListener("mousemove", onMove);
      button.addEventListener("mouseleave", onLeave);
      magneticCleanups.push(() => {
        button.removeEventListener("mousemove", onMove);
        button.removeEventListener("mouseleave", onLeave);
      });
    });

    const interactiveTargets = Array.from((rootRef.current ?? document).querySelectorAll<HTMLElement>("a, button, .project-card, [role='button']"));
    const interactiveCleanups: Array<() => void> = [];
    interactiveTargets.forEach((target) => {
      const onEnter = () => {
        if (!cursor) return;
        if (target.classList.contains("project-card")) {
          const projectLabel = target.dataset.cursorLabel?.trim();
          if (cursorLabelRef.current) {
            cursorLabelRef.current.textContent = projectLabel ? `VIEW ${projectLabel} - VIEW ${projectLabel} - ` : defaultCursorLabel;
          }
          cursor.classList.add("is-project");
          cursor.classList.remove("is-link");
          return;
        }
        cursor.classList.add("is-link");
        cursor.classList.remove("is-project");
      };
      const onLeave = () => {
        if (!cursor) return;
        cursor.classList.remove("is-link", "is-project");
        if (cursorLabelRef.current) cursorLabelRef.current.textContent = defaultCursorLabel;
      };
      target.addEventListener("mouseenter", onEnter);
      target.addEventListener("mouseleave", onLeave);
      interactiveCleanups.push(() => {
        target.removeEventListener("mouseenter", onEnter);
        target.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onCardMove);
      if (moveCursor) window.removeEventListener("mousemove", moveCursor);
      if (tickerUpdate) gsap.ticker.remove(tickerUpdate);
      magneticCleanups.forEach((cleanup) => cleanup());
      interactiveCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = loaderVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loaderVisible]);

  useEffect(() => {
    if (loaderVisible) return;
    const id = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    return () => window.cancelAnimationFrame(id);
  }, [loaderVisible]);

  return (
    <div ref={rootRef} className="relative min-h-0 w-full min-w-0 flex-1 overflow-x-hidden bg-transparent text-[var(--page-fg)]">
      <ExperienceLoader visible={loaderVisible} />
      <ThreeScene progressRef={scrollProgressRef} onReady={() => setThreeReady(true)} />
      <div data-page-shell className="page-transition-shell relative">
        <div ref={progressRef} className="top-progress scale-x-0" />
        <div className="noise-overlay" />
        <BackgroundMusic />

        <div ref={cursorRef} className="custom-cursor pointer-events-none fixed left-0 top-0 z-[90]">
          <div className="custom-cursor-core" />
          <div className="custom-cursor-link-ring" />
          <svg className="custom-cursor-project-label" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="cursor-project-path" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
            </defs>
            <text>
              <textPath ref={cursorLabelRef} href="#cursor-project-path">
                {defaultCursorLabel}
              </textPath>
            </text>
          </svg>
        </div>

        <header className="pointer-events-none fixed left-0 right-0 top-0 z-[70] flex items-start justify-between gap-6 px-5 py-6 md:px-10 md:py-8">
        <p className="font-mono-ui pointer-events-auto max-w-[min(100%,280px)] text-[11px] leading-snug tracking-[0.04em] text-neutral-300 md:max-w-md md:text-xs">
          Jhenni <span className="opacity-60">//</span> IA aplicada, automação & sistemas proprietários
        </p>
        <div className="font-mono-ui pointer-events-auto">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="interactive-target text-[var(--page-fg)] transition-opacity hover:opacity-90"
          >
            Falar com Jhenni
          </a>
        </div>
      </header>

      <main className="relative z-[30] w-full min-w-0 bg-transparent">
        <section id="hero" className="hero-layer relative isolate w-full max-w-none overflow-hidden">
          <HeroVideoScrub onReady={() => setVideoReady(true)}>
            <span className="hero-badge bracket-label w-fit border border-white/10 bg-white/[0.02] px-4 py-2">
              [ Jhenni Nascimento // Engenheira de Software ]
            </span>
            <h1 className="hero-headline gradient-title max-w-[min(100%,56rem)] text-[clamp(2.5rem,6vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.04em] md:max-w-6xl">
              Eu projeto os sistemas que tornam a sua concorrência obsoleta.
            </h1>
            <p className="hero-sub max-w-2xl text-lg font-medium leading-snug text-neutral-300 md:text-2xl md:leading-snug">
              Mente por trás da primeira IA de cobrança via Pix Automático do Brasil. Eu não entrego tecnologia; eu construo ativos digitais de alta escala para empresas que não aceitam a ineficiência.
            </p>
            <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
              {["50+ Projetos Entregues", "R$10M+ ROI Gerado", "98% Satisfação"].map((metric) => (
                <div key={metric} className="hero-kpi rounded-lg px-5 py-5 text-base font-medium md:text-lg">
                  {metric}
                </div>
              ))}
            </div>
            <div className="pointer-events-none mt-16 flex flex-col items-center gap-2 pb-10 md:mt-20">
              <p className="scroll-hint-pulse font-mono-ui text-[10px] uppercase tracking-[0.35em] text-neutral-500">[Scroll]</p>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.28em] text-neutral-500">para continuar</p>
            </div>
          </HeroVideoScrub>
        </section>

        <div className="section-separator" />
        <ProblemSection />
        <div className="section-separator" />
        <SolutionSection />
        <div className="section-separator" />
        <ProcessSection />
        <div className="section-separator" />
        <CasesSection onOpenCase={setPortfolioCase} />
        <div className="section-separator" />
        <TechSection />
        <div className="section-separator" />
        <ROISection />
        <div className="section-separator" />
        <CTASection />

        <footer className="border-t border-white/10 px-5 py-16 md:px-10 md:py-24">
          <p className="font-mono-ui max-w-3xl text-[11px] leading-relaxed text-neutral-600">
            /// {new Date().getFullYear()} · Sistemas, motion e camadas 3D desenvolvidos para sua operação. Uso não
            autorizado do material é proibido.
          </p>
          <ul className="font-mono-ui mt-10 flex flex-wrap gap-x-10 gap-y-3 text-xs text-neutral-500">
            {["Pioneirismo", "Autoridade", "Portfolio", "Verticais", "Stack", "Contato"].map((label) => (
              <li key={label}>
                <a href="#cta" className="interactive-target transition-colors hover:text-neutral-200">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono-ui mt-16 text-[10px] tracking-[0.12em] text-neutral-700">
            Projetado com precisão.
          </p>
        </footer>
      </main>

        <PortfolioCaseModal item={portfolioCase} onClose={() => setPortfolioCase(null)} />
      </div>
    </div>
  );
}
