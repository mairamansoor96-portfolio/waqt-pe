"use client";

import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { RalliTrim } from "./Trim";
import { BackArrow } from "./icons";
import { useT } from "@/lib/i18n";

/** 44 px round back button (2 px line border, white) inside a 48 px touch target. */
export function BackButton({ onClick }: { onClick: () => void }) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("back")}
      className="inline-flex size-12 shrink-0 items-center justify-center rounded-chip text-ink"
    >
      <span className="frame flex size-11 items-center justify-center rounded-chip bg-surface">
        <BackArrow size={22} />
      </span>
    </button>
  );
}

/**
 * The header on every screen: back button at the start, the compact logo
 * centred (it goes home), something at the end (step count or language),
 * then anything below it (the sun arc) and the ralli trim.
 */
export function AppHeader({
  onBack,
  onHome,
  end,
  logo = <Logo variant="header" />,
  children,
  className = "",
}: {
  onBack?: () => void;
  onHome?: () => void;
  end?: ReactNode;
  logo?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`-mx-4 flex flex-col ${className}`}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 pt-3 pb-2">
        <div className="flex justify-start">{onBack && <BackButton onClick={onBack} />}</div>
        {onHome ? (
          <button type="button" onClick={onHome} className="inline-flex min-h-12 items-center justify-center rounded-chip px-2">
            {logo}
          </button>
        ) : (
          <div className="flex justify-center px-2">{logo}</div>
        )}
        <div className="flex flex-wrap items-center justify-end gap-2 text-end">{end}</div>
      </div>
      {children && <div className="px-4">{children}</div>}
      <RalliTrim />
    </header>
  );
}

/** The sticky bottom action bar: ralli trim on top, then the actions. */
export function BottomBar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`sticky bottom-0 -mx-4 bg-ground ${className}`}>
      <RalliTrim />
      <div className="px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">{children}</div>
    </div>
  );
}
