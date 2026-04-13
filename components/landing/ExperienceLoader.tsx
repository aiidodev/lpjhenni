"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type ExperienceLoaderProps = {
  visible: boolean;
};

const STATUS_LINES = [
  "[ CORE ] init → WebGL context + three.js layer",
  "[ SYNC ] binding Lenis ↔ ScrollTrigger scrub",
  "[ VIDEO ] decoding hero stream / frame sync",
  "[ GSAP ] timeline priming · master scroll rail",
  "[ UI ] cursor rig · magnetic targets armed",
];

function splitHeadline(text: string, className: string) {
  return text.split("").map((char, i) => (
    <span key={`${char}-${i}`} className={className}>
      {char === " " ? "\u00a0" : char}
    </span>
  ));
}

export function ExperienceLoader({ visible }: ExperienceLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressInnerRef = useRef<HTMLDivElement>(null);
  const progressGlowRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const statusIndexRef = useRef(0);

  useEffect(() => {
    if (!visible || !loaderRef.current) return;

    const root = loaderRef.current;
    const progressInner = progressInnerRef.current;
    const progressGlow = progressGlowRef.current;
    const statusEl = statusRef.current;
    const scanEl = scanRef.current;
    const counterEl = counterRef.current;

    let statusIntervalId = 0;
    let hexIntervalId = 0;

    const ctx = gsap.context(() => {
      const headlineChars = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".loader-head-char"));
      const kicker = root.querySelector(".loader-kicker");
      const track = root.querySelector(".loader-progress-track");
      const pct = root.querySelector(".loader-pct");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(kicker, { opacity: 0, y: 10, letterSpacing: "0.35em" }, { opacity: 1, y: 0, letterSpacing: "0.22em", duration: 0.75 }, 0)
        .fromTo(
          headlineChars,
          { opacity: 0, y: 22, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", stagger: { each: 0.028, from: "start" }, duration: 0.55 },
          0.12,
        )
        .fromTo(statusEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, 0.35)
        .fromTo(track, { opacity: 0, scaleX: 0.92 }, { opacity: 1, scaleX: 1, duration: 0.6, transformOrigin: "50% 50%" }, 0.28)
        .fromTo(pct, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.5);

      if (progressInner) {
        gsap.set(progressInner, { transformOrigin: "left center", scaleX: 0 });
        gsap.to(progressInner, {
          scaleX: 0.94,
          duration: 2.85,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      if (progressGlow) {
        gsap.fromTo(
          progressGlow,
          { xPercent: -120, opacity: 0.4 },
          { xPercent: 120, opacity: 0.85, duration: 1.8, ease: "none", repeat: -1 },
        );
      }

      if (scanEl) {
        gsap.to(scanEl, { y: "115%", duration: 2.2, ease: "none", repeat: -1 });
      }

      if (counterEl) {
        hexIntervalId = window.setInterval(() => {
          const n = Math.floor(Math.random() * 0xffff);
          counterEl.textContent = `0x${n.toString(16).toUpperCase().padStart(4, "0")}`;
        }, 110);
      }

      const advanceStatus = () => {
        if (!statusEl) return;
        statusIndexRef.current = (statusIndexRef.current + 1) % STATUS_LINES.length;
        const line = STATUS_LINES[statusIndexRef.current];
        gsap.to(statusEl, {
          opacity: 0,
          x: -5,
          duration: 0.16,
          ease: "power2.in",
          onComplete: () => {
            statusEl.textContent = line;
            gsap.fromTo(
              statusEl,
              { opacity: 0, x: 8 },
              { opacity: 1, x: 0, duration: 0.32, ease: "power3.out" },
            );
          },
        });
      };

      statusIntervalId = window.setInterval(advanceStatus, 1700);
    }, loaderRef);

    return () => {
      window.clearInterval(statusIntervalId);
      window.clearInterval(hexIntervalId);
      ctx.revert();
    };
  }, [visible]);

  return (
    <div
      ref={loaderRef}
      aria-busy={visible}
      aria-hidden={!visible}
      aria-label="Carregando interface"
      className={`loader-shell fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050505] text-[#e8e8e8] transition-[opacity,visibility] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
      }`}
    >
      <div className="loader-scan pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          ref={scanRef}
          className="loader-scanline absolute -top-1/2 left-0 h-[45%] w-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent"
        />
      </div>

      <div className="relative z-[1] flex w-full max-w-[min(92vw,480px)] flex-col px-6">
        <div className="flex items-center justify-between gap-4">
          <p className="loader-kicker font-mono-ui text-[10px] uppercase tracking-[0.22em] text-neutral-600 md:text-[11px]">
            [ boot_sequence · v2 ]
          </p>
          <span ref={counterRef} className="font-mono-ui text-[10px] text-neutral-600 tabular-nums md:text-[11px]">
            0x0000
          </span>
        </div>

        <h2 className="loader-title mt-6 text-left text-[clamp(1.15rem,4.2vw,1.65rem)] font-semibold leading-[1.15] tracking-[-0.04em] text-neutral-100">
          {splitHeadline("Neural interface · sync", "loader-head-char inline-block")}
        </h2>

        <p
          ref={statusRef}
          className="loader-status font-mono-ui mt-5 min-h-[2.75rem] text-[11px] leading-relaxed tracking-[0.04em] text-neutral-500 md:text-xs md:leading-relaxed"
        >
          {STATUS_LINES[0]}
        </p>

        <div className="loader-progress-track mt-8">
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-neutral-800/90">
            <div
              ref={progressInnerRef}
              className="loader-progress-fill absolute inset-y-0 left-0 w-full bg-gradient-to-r from-neutral-600 via-neutral-100 to-neutral-400"
            />
            <div
              ref={progressGlowRef}
              className="pointer-events-none absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>
          <div className="mt-3 flex justify-between font-mono-ui text-[9px] uppercase tracking-[0.2em] text-neutral-600">
            <span>stream_buffer</span>
            <span className="loader-pct opacity-0">hydrating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
