"use client";

// Building blocks for printed outputs. Everything is sized in mm or pt so it
// prints at true size. Printed outputs don't use the app's type roles:
// English at least 12 pt and Urdu at least 14 pt with generous line height,
// except where a spec asks for "small text" (sticker names).

import type { CSSProperties, ReactNode } from "react";
import { messages } from "@/lib/messages";
import { PAGE_MARGIN_MM, PAPER } from "@/lib/sheet";
import type { Plan, Slot } from "@/lib/plan";

// Colours come from the app's tokens (src/styles/tokens.css), so the sheets
// follow THEME.md from the one file. The sheets render in the page, so
// CSS variables work in their inline styles.
export const TINT: Record<Slot, string> = {
  morning: "var(--color-dawn)",
  midday: "var(--color-noon)",
  evening: "var(--color-dusk)",
  night: "var(--color-night)",
};
export const INK = "var(--color-ink)";
export const SOFT = "var(--color-ink-soft)";
export const LINE = "var(--color-line)";
export const PERFORATION = "var(--color-perforation)";
export const LOGO = "var(--color-logo)";

/** Size of one printed page's content box, in mm. */
export function pageBox(plan: Plan) {
  const paper = PAPER[plan.settings.paper];
  return { width: paper.width - 2 * PAGE_MARGIN_MM, height: paper.height - 2 * PAGE_MARGIN_MM };
}

/**
 * One printed page. With a `border` colour it gets the thick sheet-version
 * frame (fridge sheet); without, it's plain paper (stickers, doctor's list).
 */
export function PrintPage({
  plan,
  border,
  children,
  breakBefore,
  label,
  fill = true,
  className = "",
}: {
  plan: Plan;
  border?: string;
  children: ReactNode;
  breakBefore?: boolean;
  label: string;
  /** Stretch to the page height, so a footer can sit at the bottom. */
  fill?: boolean;
  className?: string;
}) {
  const box = pageBox(plan);
  const style: CSSProperties = {
    width: `${box.width}mm`,
    // A little under the page: print layout rounds differently from screen.
    minHeight: fill ? `${box.height - 3}mm` : undefined,
    border: border ? `2.5mm solid ${border}` : undefined,
    borderRadius: border ? "4mm" : undefined,
    padding: border ? "4mm" : 0,
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
    breakBefore: breakBefore ? "page" : undefined,
    color: INK,
    background: "#fff",
  };
  return (
    <section data-sheet-page aria-label={label} className={`sheet flex flex-col gap-[3mm] ${className}`} style={style} dir="ltr">
      {children}
    </section>
  );
}

export function Ur({ children, size = 14, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return (
    <span lang="ur" dir="rtl" style={{ fontSize: `${size}pt`, lineHeight: 2, display: "block", ...style }}>
      {children}
    </span>
  );
}

export function En({ children, size = 12, bold, style }: { children: ReactNode; size?: number; bold?: boolean; style?: CSSProperties }) {
  return (
    <span lang="en" dir="auto" style={{ fontSize: `${size}pt`, lineHeight: 1.3, fontWeight: bold ? 700 : 400, display: "block", ...style }}>
      {children}
    </span>
  );
}

/**
 * The one-colour logo for printed sheets (THEME.md → Logo): Urdu in logo red,
 * English in ink, no sun offset.
 */
export function PrintLogo({ size = 24 }: { size?: number }) {
  return (
    <span role="img" aria-label={messages.appName.en} dir="ltr" style={{ display: "inline-flex", alignItems: "center", gap: "2mm", flexShrink: 0 }}>
      <span lang="ur" dir="rtl" style={{ fontFamily: "var(--font-logo)", fontSize: `${size}pt`, lineHeight: 1.2, color: LOGO }}>
        {messages.appName.ur}
      </span>
      <span lang="en" style={{ fontFamily: "var(--font-logo)", fontSize: `${Math.round(size / 2)}pt`, lineHeight: 1.1, color: INK }}>
        {messages.appName.en}
      </span>
    </span>
  );
}
