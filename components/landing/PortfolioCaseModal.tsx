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
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
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
            className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-white/20 bg-[#111] shadow-2xl"
            style={{ maxHeight: "min(92vh, 900px)" }}
            initial={{ scale: 0.97, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full shrink-0 bg-black/50" style={{ aspectRatio: "16 / 10" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverSrc}
                alt={`Preview ${item.name}`}
                className="absolute inset-0 h-full w-full object-cover object-top"
                draggable={false}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-6 text-left md:gap-4 md:p-8">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-neutral-400">{item.site}</p>
              <h2 id="portfolio-modal-title" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {item.name}
              </h2>
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-neutral-500">{item.preview}</p>
              <p className="text-base leading-relaxed text-neutral-300">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.stack.map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/20 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:justify-end">
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
