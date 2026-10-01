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
      // A container: with large text the card stacks (icon and check on top,
      // words below) instead of squeezing the words into a narrow column.
      className={`@container flex min-h-14 cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 rounded-card bg-surface px-4 py-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary ${
        checked ? "border-3 border-primary" : "frame"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {icon && <span className="shrink-0 text-ink">{icon}</span>}
      <span className="flex min-w-0 grow flex-col @max-[20rem]:order-last @max-[20rem]:basis-full">
        <span className="type-body font-bold">{label}</span>
        {help && <span className="type-helper text-ink-soft">{help}</span>}
      </span>
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-chip @max-[20rem]:ms-auto ${checked ? "bg-primary text-white" : "frame bg-surface"}`}
        aria-hidden="true"
      >
        {checked && <Check size={20} />}
      </span>
    </label>
  );
}
