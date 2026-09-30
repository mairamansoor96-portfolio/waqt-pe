// PLACEHOLDER PICTOGRAMS. Final artwork comes from Figma after testing with
// helpers (SPEC.md → Pictogram asset list). Every pictogram is a component
// with a `size` prop, so final SVGs drop in here without code changes
// elsewhere. Pictograms and symbols never flip in right-to-left.
//
// Drawing rules for the placeholders: 48×48 grid, 2.5 ink stroke, round joins.

import type { ReactNode } from "react";
import type { AnchorMode, Form, Giver, Slot } from "@/lib/plan";

const INK = "var(--color-ink)";

export interface PictogramProps {
  size?: number;
  className?: string;
  /** Accessible name. Omit when a visible label says the same thing. */
  title?: string;
}

function Svg({ size = 48, className = "", title, children }: PictogramProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      data-placeholder="pictogram"
      fill="none"
      stroke={INK}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Medicine symbols: one shape per medicine, filled with its colour.
// Every shape has a dark outline so yellow prints clearly.

const shapePaths: Record<string, ReactNode> = {
  star: <path d="M24 5l5.6 11.9 13 1.6-9.6 9 2.5 12.9L24 34l-11.5 6.4L15 27.5l-9.6-9 13-1.6z" />,
  circle: <circle cx="24" cy="24" r="18" />,
  leaf: (
    <>
      <path d="M24 5c13 6 17 22 0 38C7 27 11 11 24 5z" />
      <path d="M24 14v26" fill="none" />
    </>
  ),
  square: <rect x="7" y="7" width="34" height="34" rx="3" />,
  kite: <path d="M24 4l15 16-15 24L9 20z" />,
  flower: (
    <>
      <circle cx="24" cy="12" r="7.5" />
      <circle cx="35.4" cy="20.3" r="7.5" />
      <circle cx="31" cy="33.7" r="7.5" />
      <circle cx="17" cy="33.7" r="7.5" />
      <circle cx="12.6" cy="20.3" r="7.5" />
      <circle cx="24" cy="24" r="5.5" fill="var(--color-surface)" />
    </>
  ),
  triangle: <path d="M24 5l19 36H5z" />,
  fish: (
    <>
      <path d="M4 24c7-11 22-13 32 0-10 13-25 11-32 0z" />
      <path d="M35 24l9-9v18z" />
      <circle cx="13" cy="22" r="1.5" fill={INK} stroke="none" />
    </>
  ),
};

export function SymbolShape({ shape, colour, ...props }: PictogramProps & { shape: string; colour: string }) {
  return (
    <Svg {...props}>
      <g fill={colour}>{shapePaths[shape] ?? shapePaths.circle}</g>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Time of day scenes: sunrise, midday sun, sunset, night with moon.

const SUN = "#F2C14E";

function Sunrise(props: PictogramProps) {
  return (
    <Svg {...props}>
      <path d="M12 34a12 12 0 0 1 24 0z" fill={SUN} />
      <path d="M4 34h40M24 12v5M10.5 17.5l3.5 3.5M37.5 17.5 34 21M8 40h32" />
    </Svg>
  );
}

function Midday(props: PictogramProps) {
  return (
    <Svg {...props}>
      <circle cx="24" cy="24" r="9" fill={SUN} />
      <path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2" />
    </Svg>
  );
}

function Sunset(props: PictogramProps) {
  return (
    <Svg {...props}>
      <path d="M14 30a10 10 0 0 1 20 0z" fill="#E8875B" />
      <path d="M4 30h40M10 36h28M16 42h16M24 10v6" />
      <path d="M20 13l4 4 4-4" />
    </Svg>
  );
}

function Night(props: PictogramProps) {
  return (
    <Svg {...props}>
      <path d="M30 6a16 16 0 1 0 12 26A14 14 0 0 1 30 6z" fill="#C9CCE8" />
      <path d="M13 9l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill={INK} strokeWidth={1.5} />
    </Svg>
  );
}

const timeScenes: Record<Slot, (p: PictogramProps) => ReactNode> = {
  morning: Sunrise,
  midday: Midday,
  evening: Sunset,
  night: Night,
};

export function TimeOfDay({ slot, ...props }: PictogramProps & { slot: Slot }) {
  const Scene = timeScenes[slot];
  return <Scene {...props} />;
}

// ---------------------------------------------------------------------------
// Anchor modes: meals, prayers (mosque silhouette, never praying figures), clock.

export function AnchorModeIcon({ mode, ...props }: PictogramProps & { mode: AnchorMode }) {
  switch (mode) {
    case "meals":
      return (
        <Svg {...props}>
          <circle cx="26" cy="26" r="15" />
          <circle cx="26" cy="26" r="9" />
          <path d="M6 8v12M4 8v6a2 2 0 0 0 4 0V8M6 20v20" />
        </Svg>
      );
    case "prayers":
      return (
        <Svg {...props}>
          <path d="M12 40V28a12 12 0 0 1 24 0v12z" />
          <path d="M24 16v-4M4 40h40M40 40V14M40 14l-2-4h4z" />
          <path d="M20 40v-6a4 4 0 0 1 8 0v6" />
        </Svg>
      );
    case "clock":
      return (
        <Svg {...props}>
          <circle cx="24" cy="24" r="18" />
          <path d="M24 13v11l7 5" />
        </Svg>
      );
  }
}

// ---------------------------------------------------------------------------
// Who gives the medicines.

function Person({ x = 24, scale = 1 }: { x?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} 0) scale(${scale}) translate(-24 0)`}>
      <circle cx="24" cy="15" r="7" />
      <path d="M11 42c0-9 6-15 13-15s13 6 13 15" />
    </g>
  );
}

export function GiverIcon({ giver, ...props }: PictogramProps & { giver: Giver }) {
  switch (giver) {
    case "self":
      return (
        <Svg {...props}>
          <Person x={20} />
          <rect x="36" y="22" width="8" height="12" rx="2" />
          <path d="M36 26h8" />
        </Svg>
      );
    case "family":
      return (
        <Svg {...props}>
          <Person x={16} scale={0.85} />
          <Person x={32} />
        </Svg>
      );
    case "helperReads":
      return (
        <Svg {...props}>
          <Person x={18} />
          <path d="M32 18h12v18H32zM35 23h6M35 27h6M35 31h4" />
        </Svg>
      );
    case "helperNoRead":
      return (
        <Svg {...props}>
          <Person x={18} />
          <path d="M34 20c3 2 3 8 0 10M38 16c6 4 6 14 0 18" />
        </Svg>
      );
  }
}

// ---------------------------------------------------------------------------
// Forms, and quantity drawn as repeated forms (half tablets drawn as halves).

type FormGlyph = Form | "halfTablet";

export function FormPictogram({ form, ...props }: PictogramProps & { form: FormGlyph }) {
  switch (form) {
    case "tablet":
      return (
        <Svg {...props}>
          <circle cx="24" cy="24" r="16" fill="var(--color-surface)" />
          <path d="M12 24h24" />
        </Svg>
      );
    case "halfTablet":
      return (
        <Svg {...props}>
          <path d="M8 24a16 16 0 0 1 32 0z" fill="var(--color-surface)" />
          <circle cx="24" cy="24" r="16" strokeDasharray="3 5" strokeWidth={1.5} />
        </Svg>
      );
    case "capsule":
      return (
        <Svg {...props}>
          <rect x="6" y="16" width="36" height="16" rx="8" fill="var(--color-surface)" />
          <path d="M24 16v16" />
          <path d="M14 16h10v16H14a8 8 0 0 1 0-16z" fill={INK} stroke="none" />
        </Svg>
      );
    case "syrup":
      return (
        <Svg {...props}>
          <ellipse cx="16" cy="24" rx="11" ry="8" fill="var(--color-surface)" />
          <path d="M27 24h17" strokeWidth={4} />
        </Svg>
      );
    case "drops":
      return (
        <Svg {...props}>
          <path d="M24 6c8 11 12 17 12 23a12 12 0 0 1-24 0c0-6 4-12 12-23z" fill="var(--color-surface)" />
        </Svg>
      );
    case "inhaler":
      return (
        <Svg {...props}>
          <path d="M14 6h12v22H14z" fill="var(--color-surface)" />
          <path d="M14 28h12l8 6v8H14z" fill="var(--color-surface)" />
          <path d="M38 34c2 1 3 2 4 4M38 40h5" strokeWidth={2} />
        </Svg>
      );
    case "insulin":
      return (
        <Svg {...props}>
          <path d="M8 34 32 10l6 6-24 24H8z" fill="var(--color-surface)" />
          <path d="M32 10l4-4M38 16l4-4M8 40l-4 4" />
        </Svg>
      );
  }
}

/**
 * Quantity drawn, not written: two pills for two, a half pill for a half.
 * Large counts (insulin units, many drops) show one pictogram and the numeral.
 */
export function Quantity({ form, quantity, size = 28 }: { form: Form; quantity: number; size?: number }) {
  const whole = Math.floor(quantity);
  const half = quantity - whole >= 0.5;
  if (whole > 6) {
    return (
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        <FormPictogram form={form} size={size} />
        <span className="font-bold tabular-nums">×{whole}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-1" aria-hidden="true">
      {Array.from({ length: whole }, (_, i) => (
        <FormPictogram key={i} form={form} size={size} />
      ))}
      {half && <FormPictogram form="halfTablet" size={size} />}
    </span>
  );
}
