"use client";

type KineticHeadingProps = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: string;
};

/**
 * Tipografia cinética (máscara por palavra) — animada por useJosephScrollOrchestration.
 */
export function KineticHeading({ as = "h2", className = "", children }: KineticHeadingProps) {
  const Comp = as;
  const words = children.trim().split(/\s+/);
  return (
    <Comp className={`kinetic-heading ${className}`.trim()} data-kinetic-heading>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="kinetic-word inline-block overflow-hidden align-baseline pb-[0.14em]">
          <span className="kinetic-word-inner inline-block">{word}</span>
          {i < words.length - 1 ? "\u00a0" : null}
        </span>
      ))}
    </Comp>
  );
}
