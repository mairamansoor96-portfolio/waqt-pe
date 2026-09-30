import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

/**
 * Min height 56 px. The label says exactly what happens: "Add medicine",
 * "Print fridge sheet".
 */
export function Button({
  variant = "primary",
  full = false,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; full?: boolean }) {
  const look = {
    primary: "bg-primary text-white border-2 border-primary",
    secondary: "bg-surface text-primary border-2 border-primary",
    danger: "bg-surface text-error border-2 border-error",
  }[variant];
  return (
    <button
      type={type}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-button px-6 py-2 type-body font-bold ${look} disabled:opacity-50 ${full ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
}
