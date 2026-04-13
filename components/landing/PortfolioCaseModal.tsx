"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioCaseItem } from "@/components/landing/sections";

type Props = {
  item: PortfolioCaseItem | null;
  onClose: () => void;
};

export function PortfolioCaseModal({ item, onClose }: Props) {
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/88 backdrop-blur-sm"
            aria-label="Fechar"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-white/15 bg-[#0f0f0f] shadow-2xl"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-black/40">
              <img
                src={item.coverSrc}
                alt=""
                className="h-full w-full object-cover object-top"
                draggable={false}
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6 md:p-8">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-neutral-400">{item.site}</p>
              <h2 id="portfolio-modal-title" className="text-2xl font-semibold tracking-tight text-neutral-100 md:text-3xl">
                {item.name}
              </h2>
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-neutral-500">{item.preview}</p>
              <p className="text-base leading-relaxed text-neutral-300">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.stack.map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/15 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="font-mono-ui border border-white/25 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-neutral-200 transition hover:border-white/45 hover:text-white"
                >
                  Voltar à LP
                </button>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono-ui inline-flex items-center justify-center border border-white/35 bg-white/[0.06] px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition hover:border-white/55 hover:bg-white/10"
                >
                  Visitar site
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
