import { messages } from "@/lib/messages";

type Variant = "header" | "primary" | "stacked";

// Sizes from THEME.md → Logo. The logo is a logotype, so it keeps its own
// pixel sizes rather than following the text-size setting.
const sizes: Record<Variant, { ur: number; en: number }> = {
  header: { ur: 28, en: 13 },
  primary: { ur: 64, en: 30 },
  stacked: { ur: 56, en: 26 },
};

/**
 * وقت پہ in Lalezar, logo red, with the hard sun (cinnamon buff) offset behind it;
 * "Waqt Pe" in ink. No background block. Read out as "Waqt Pe".
 * The printed one-colour version lives with the sheets (print.tsx → PrintLogo).
 */
export function Logo({ variant = "header", className = "" }: { variant?: Variant; className?: string }) {
  const size = sizes[variant];
  const stacked = variant === "stacked";
  return (
    <span
      role="img"
      aria-label={messages.appName.en}
      // The lockup reads the same in both layouts.
      dir="ltr"
      className={`inline-flex font-logo ${stacked ? "flex-col items-center" : "items-baseline gap-2"} ${className}`}
    >
      <span lang="ur" dir="rtl" className="logo-offset font-logo text-logo" style={{ fontSize: size.ur, lineHeight: 1.4 }}>
        {messages.appName.ur}
      </span>
      <span lang="en" className="font-logo text-ink" style={{ fontSize: size.en, lineHeight: 1.1 }}>
        {messages.appName.en}
      </span>
    </span>
  );
}
