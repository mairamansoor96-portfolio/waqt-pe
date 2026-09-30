import { Check } from "./icons";

/**
 * A compact choice: a real checkbox or radio underneath, drawn as a round chip.
 * At least 48 px tall.
 */
export function ChoiceChip({
  type,
  name,
  checked,
  onChange,
  label,
  lang,
}: {
  type: "checkbox" | "radio";
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  lang?: string;
}) {
  return (
    <label
      className={`inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-chip px-4 py-1 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary ${
        checked ? "border-2 border-primary bg-primary text-white" : "border-2 border-line bg-surface text-ink"
      }`}
    >
      <input type={type} name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      {checked && <Check size={18} />}
      <span lang={lang} dir="auto" className="type-body">
        {label}
      </span>
    </label>
  );
}
