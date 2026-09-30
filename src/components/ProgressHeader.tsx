"use client";

import { fill, useT } from "@/lib/i18n";
import { BackArrow } from "./icons";

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

/** The sun takes the tint of the part of the day it has reached. */
function tintAt(t: number) {
  if (t < 0.25) return "var(--color-dawn)";
  if (t < 0.6) return "var(--color-noon)";
  if (t < 0.85) return "var(--color-dusk)";
  return "var(--color-night)";
}

export function SunArc({ step, total }: { step: number; total: number }) {
  const t = total > 1 ? Math.min(1, Math.max(0, (step - 1) / (total - 1))) : 0;
  const sun = pointOnArc(t);
  return (
    // Progress runs in reading direction, so the whole arc mirrors in RTL.
    <svg viewBox="0 0 280 76" className="h-auto w-full rtl:-scale-x-100" aria-hidden="true">
      <line x1="8" y1="66" x2="272" y2="66" stroke="var(--color-line)" strokeWidth="1.5" />
      <path d={ARC} fill="none" stroke="var(--color-line)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      <path
        d={ARC}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - t}
        className="transition-[stroke-dashoffset] duration-700 ease-sun motion-reduce:transition-none"
      />
      <g
        style={{ transform: `translate(${sun.x}px, ${sun.y}px)` }}
        className="transition-transform duration-700 ease-sun motion-reduce:transition-none"
      >
        <circle r="11" fill={tintAt(t)} stroke="var(--color-ink)" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

export function ProgressHeader({ step, total, onBack }: { step: number; total: number; onBack?: () => void }) {
  const t = useT();
  return (
    <header className="flex flex-col gap-1">
      <SunArc step={step} total={total} />
      <div className="flex items-center justify-between gap-4">
        <p className="type-helper text-ink-soft">{fill(t("stepOf"), { n: step, total })}</p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="-me-3 inline-flex min-h-12 items-center gap-1 rounded-button px-3 type-body font-bold text-primary"
          >
            <BackArrow size={20} />
            {t("back")}
          </button>
        )}
      </div>
    </header>
  );
}
