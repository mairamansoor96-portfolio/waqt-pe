import type { ReactNode } from "react";
import { Check } from "./icons";

/**
 * A choice pocket: surface, 28 px radius, 2 px line border, at least 80 px
 * tall, a 48 px round icon well in ground, the label and a one-line helper,
 * and an empty ring at the end. Selected: primary-tint fill, 3 px primary
 * border and a filled check. A real radio input underneath, so keyboards and
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
      // A container: with large text the pocket stacks (icon and check on top,
      // words below) instead of squeezing the words into a narrow column.
      // Padding makes up the border difference so the content doesn't jump.
      className={`@container flex min-h-20 cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 rounded-pocket has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary ${
        checked ? "border-3 border-primary bg-primary-tint px-4 py-3" : "frame bg-surface px-[17px] py-[13px]"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {icon && <span className="flex size-12 shrink-0 items-center justify-center rounded-chip bg-ground text-ink">{icon}</span>}
      <span className="flex min-w-0 grow flex-col @max-[18rem]:order-last @max-[18rem]:basis-full">
        <span className="type-body font-bold">{label}</span>
        {help && <span className="type-helper text-ink-soft">{help}</span>}
      </span>
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-chip @max-[18rem]:ms-auto ${
          checked ? "bg-primary text-white" : "border-2 border-ink-soft bg-surface"
        }`}
        aria-hidden="true"
      >
        {checked && <Check size={20} />}
      </span>
    </label>
  );
}
