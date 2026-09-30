"use client";

// Building blocks for printed outputs. Everything is sized in mm or pt so it
// prints at true size. Printed outputs don't use the app's type roles:
// English at least 12 pt and Urdu at least 14 pt with generous line height,
// except where a spec asks for "small text" (sticker names).

import type { CSSProperties, ReactNode } from "react";
import { PAGE_MARGIN_MM, PAPER } from "@/lib/sheet";
import type { Plan, Slot } from "@/lib/plan";

export const TINT: Record<Slot, string> = { morning: "#FCE9D8", midday: "#FFF6CC", evening: "#F6DCE4", night: "#DDE0F2" };
export const INK = "#15182B";
export const SOFT = "#4A5070";

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
