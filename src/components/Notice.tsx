import type { ReactNode } from "react";

type Tone = "primary" | "warning" | "error" | "success";

const bar: Record<Tone, string> = {
  primary: "border-s-primary",
  warning: "border-s-warning",
  error: "border-s-error",
  success: "border-s-success",
};

/** For privacy and safety messages: surface with a 4 px start-edge bar. */
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
    <div role={role} className={`frame rounded-card border-s-4 bg-surface px-4 py-3 ${bar[tone]}`}>
      {title && <p className="type-body font-bold">{title}</p>}
      {children && <div className="type-body text-ink-soft">{children}</div>}
    </div>
  );
}
