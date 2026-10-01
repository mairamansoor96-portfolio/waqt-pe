"use client";

import { AppHeader } from "./AppHeader";
import { fill, useT } from "@/lib/i18n";

// Sun on a dawn-to-night arc. The one memorable element in the app, and the
// only thing that animates for its own sake. With reduced motion the sun jumps.

const START = { x: 20, y: 64 };
const CONTROL = { x: 140, y: -28 };
const END = { x: 260, y: 64 };
const ARC = `M${START.x} ${START.y} Q${CONTROL.x} ${CONTROL.y} ${END.x} ${END.y}`;

function pointOnArc(t: number) {
  const u = 1 - t;
  return {
    x: u * u * START.x + 2 * u * t * CONTROL.x + t * t * END.x,
    y: u * u * START.y + 2 * u * t * CONTROL.y + t * t * END.y,
  };
}

const at = (step: number, total: number) => (total > 1 ? Math.min(1, Math.max(0, (step - 1) / (total - 1))) : 0);

/**
 * Dashed perforation path and horizon; finished steps are primary dots,
 * upcoming steps white with a line stroke, and the current step is the sun.
 */
export function SunArc({ step, total }: { step: number; total: number }) {
  const sun = pointOnArc(at(step, total));
  return (
    // Progress runs in reading direction, so the whole arc mirrors in RTL.
    <svg viewBox="0 0 280 76" className="h-auto w-full rtl:-scale-x-100" aria-hidden="true">
      <line x1="8" y1="66" x2="272" y2="66" stroke="var(--color-perforation)" strokeWidth="2" strokeDasharray="6 5" />
      <path d={ARC} fill="none" stroke="var(--color-perforation)" strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round" />
      {Array.from({ length: total }, (_, i) => i + 1)
        .filter((n) => n !== step)
        .map((n) => {
          const p = pointOnArc(at(n, total));
          return n < step ? (
            <circle key={n} data-step-dot="done" cx={p.x} cy={p.y} r="4.5" fill="var(--color-primary)" />
          ) : (
            <circle key={n} data-step-dot="upcoming" cx={p.x} cy={p.y} r="4.5" fill="var(--color-white)" stroke="var(--color-line)" strokeWidth="2" />
          );
        })}
      <g
        style={{ transform: `translate(${sun.x}px, ${sun.y}px)` }}
        className="transition-transform duration-700 ease-sun motion-reduce:transition-none"
      >
        <circle r="10" fill="var(--color-sun)" stroke="var(--color-ink)" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

/** Back button, compact logo, step count; then the sun arc and the ralli trim. */
export function ProgressHeader({ step, total, onBack, onHome }: { step: number; total: number; onBack?: () => void; onHome?: () => void }) {
  const t = useT();
  return (
    <AppHeader
      onBack={onBack}
      onHome={onHome}
      end={<p className="type-helper font-bold text-ink-soft">{fill(t("stepOf"), { n: step, total })}</p>}
    >
      <SunArc step={step} total={total} />
    </AppHeader>
  );
}
