"use client";

import { ReactNode } from "react";

type AnimatedSectionProps = {
  id: string;
  className?: string;
  children: ReactNode;
  /** Faixa clara — transição cinematográfica de fundo (useJosephScrollOrchestration). */
  pageTheme?: "light" | "dark";
};

export function AnimatedSection({ id, className, children, pageTheme }: AnimatedSectionProps) {
  return (
    <section
      id={id}
      data-page-theme={pageTheme}
      className={`landing-content-section ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
