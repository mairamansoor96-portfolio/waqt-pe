import type { ReactNode } from "react";

type Tone = "primary" | "warning" | "error" | "success";

const look: Record<Tone, string> = {
  primary: "border-primary text-primary",
  warning: "border-warning text-warning",
  error: "border-error text-error",
  success: "border-success text-success",
};

/** Tone marks: not directional, so they never flip. */
function ToneIcon({ tone }: { tone: Tone }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      {tone === "success" ? (
        <path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : tone === "primary" ? (
        <path d="M12 11v6M12 7.5v.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="M12 7v6M12 16.5v.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

/**
 * For privacy and safety messages: a surface panel with a 2 px border all
 * round and a mark at the start, both in the notice's tone.
 */
export function Notice({
  tone = "primary",
  title,
  children,
  role,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <div role={role} className={`flex items-start gap-3 rounded-card border-2 bg-surface px-4 py-3 ${look[tone]}`}>
      <ToneIcon tone={tone} />
      <div className="flex min-w-0 grow flex-col">
        {title && <p className="type-body font-bold text-ink">{title}</p>}
        {children && <div className="type-body text-ink-soft">{children}</div>}
      </div>
    </div>
  );
}
