"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioCaseItem } from "@/components/landing/sections";

type Props = {
  item: PortfolioCaseItem | null;
  onClose: () => void;
};

export function PortfolioCaseModal({ item, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  const node = (
    <AnimatePresence mode="wait">
      {item ? (
        <motion.div
          key={item.site}
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-6 md:p-8"
          style={{ isolation: "isolate" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            aria-label="Fechar"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 flex h-[min(92dvh,900px)] w-full max-h-[92dvh] min-h-0 max-w-5xl flex-col overflow-hidden rounded-lg border border-white/20 bg-[#111] shadow-2xl"
            initial={{ scale: 0.97, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full max-h-[min(38vh,300px)] shrink-0 overflow-hidden bg-black/50 sm:max-h-[min(42vh,360px)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverSrc}
                alt={`Preview ${item.name}`}
                className="h-full w-full object-cover object-top"
                draggable={false}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="modal-project-body flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden overscroll-y-contain p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-left [-webkit-overflow-scrolling:touch] md:gap-4 md:p-8">
              <p className="font-mono-ui shrink-0 text-[10px] uppercase tracking-[0.2em] text-neutral-400">{item.site}</p>
              <h2 id="portfolio-modal-title" className="shrink-0 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {item.name}
              </h2>
              <p className="font-mono-ui shrink-0 text-[11px] uppercase tracking-[0.16em] text-neutral-500">{item.preview}</p>
              <p className="shrink-0 text-base leading-relaxed text-neutral-300">{item.description}</p>
              {item.metrics.length > 0 ? (
                <ul className="flex shrink-0 flex-wrap gap-2">
                  {item.metrics.map((m) => (
                    <li
                      key={m}
                      className="border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono-ui text-[10px] uppercase tracking-[0.12em] text-emerald-200/90"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex shrink-0 flex-wrap gap-2">
                {item.stack.map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/20 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex shrink-0 flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end sm:pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="font-mono-ui border border-white/30 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-neutral-200 transition hover:border-white/50 hover:text-white"
                >
                  Voltar à LP
                </button>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono-ui inline-flex items-center justify-center border border-white/40 bg-white/10 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-white/15"
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

  return createPortal(node, document.body);
}
