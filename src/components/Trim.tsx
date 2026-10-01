import { useId } from "react";

// Decorative strips from THEME.md. Both are aria-hidden and never sit behind text.

const TINTS = ["var(--color-ralli-1)", "var(--color-ralli-2)", "var(--color-ralli-3)", "var(--color-ralli-4)"];
const SQUARE = 12;

/**
 * Ralli trim: 12 px of patchwork squares, a tinted square with a ground
 * triangle rising from its base, then a ground square holding a tinted
 * diamond. Tints cycle ralli-1 to ralli-4. Sits under the header and above
 * the bottom action bar.
 */
export function RalliTrim({ className = "" }: { className?: string }) {
  const id = `ralli-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const s = SQUARE;
  return (
    <svg aria-hidden="true" focusable="false" width="100%" height={s} className={`block shrink-0 ${className}`}>
      <defs>
        <pattern id={id} width={s * TINTS.length} height={s} patternUnits="userSpaceOnUse">
          {TINTS.map((tint, i) => {
            const x = i * s;
            return i % 2 === 0 ? (
              <g key={i}>
                <rect x={x} width={s} height={s} fill={tint} />
                <path d={`M${x} ${s}H${x + s}L${x + s / 2} ${s / 4}Z`} fill="var(--color-ground)" />
              </g>
            ) : (
              <g key={i}>
                <rect x={x} width={s} height={s} fill="var(--color-ground)" />
                <path d={`M${x + s / 2} 2L${x + s - 2} ${s / 2}L${x + s / 2} ${s - 2}L${x + 2} ${s / 2}Z`} fill={tint} />
              </g>
            );
          })}
        </pattern>
      </defs>
      <rect width="100%" height={s} fill={`url(#${id})`} />
    </svg>
  );
}

/** Section divider: a 2 px dashed perforation line. */
export function Perforation({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" width="100%" height="2" className={`block shrink-0 ${className}`}>
      <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--color-perforation)" strokeWidth="2" strokeDasharray="6 5" />
    </svg>
  );
}
