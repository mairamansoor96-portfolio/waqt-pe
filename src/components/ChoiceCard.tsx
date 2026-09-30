import type { ReactNode } from "react";
import { Check } from "./icons";

/**
 * Full width, icon, label, one-line explanation. Selected: 3 px primary
 * border and a check mark. A real radio input underneath, so keyboards and
 * screen readers treat a group of these as one question.
 */
export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  icon,
  label,
  help,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  icon?: ReactNode;
  label: ReactNode;
  help?: ReactNode;
}) {
  return (
    <label
      className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-card bg-surface px-4 py-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary ${
        checked ? "border-3 border-primary" : "frame"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {icon && <span className="shrink-0 text-ink">{icon}</span>}
      <span className="flex grow flex-col">
        <span className="type-body font-bold">{label}</span>
        {help && <span className="type-helper text-ink-soft">{help}</span>}
      </span>
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-chip ${checked ? "bg-primary text-white" : "frame bg-surface"}`}
        aria-hidden="true"
      >
        {checked && <Check size={20} />}
      </span>
    </label>
  );
}
