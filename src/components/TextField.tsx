"use client";

import { useId, type ComponentProps, type ReactNode } from "react";

const inputLook =
  "block w-full min-h-12 rounded-input border-2 border-line bg-surface px-4 py-2 type-body text-ink focus-visible:border-primary aria-[invalid=true]:border-error";

/** `warning` is advice that never blocks saving; `error` must be fixed. */
type Common = { label: string; help?: string; error?: string; warning?: string };

/**
 * Label above, never placeholder-only. dir="auto" so a name typed in Urdu
 * sits right-to-left even in the English layout.
 */
export function TextField({ label, help, error, warning, className = "", ...props }: Common & ComponentProps<"input">) {
  const id = useId();
  return (
    <Field id={id} label={label} help={help} error={error} warning={warning} className={className}>
      <input id={id} dir="auto" aria-describedby={describedBy(id, help, error ?? warning)} aria-invalid={error ? true : undefined} className={inputLook} {...props} />
    </Field>
  );
}

export function TextArea({ label, help, error, className = "", ...props }: Common & ComponentProps<"textarea">) {
  const id = useId();
  return (
    <Field id={id} label={label} help={help} error={error} className={className}>
      <textarea id={id} dir="auto" aria-describedby={describedBy(id, help, error)} aria-invalid={error ? true : undefined} className={inputLook} rows={3} {...props} />
    </Field>
  );
}

export function SelectField({
  label,
  help,
  className = "",
  children,
  ...props
}: Omit<Common, "error"> & ComponentProps<"select">) {
  const id = useId();
  return (
    <Field id={id} label={label} help={help} className={className}>
      <select id={id} dir="auto" aria-describedby={describedBy(id, help)} className={inputLook} {...props}>
        {children}
      </select>
    </Field>
  );
}

function describedBy(id: string, help?: string, error?: string) {
  return [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

function Field({
  id,
  label,
  help,
  error,
  warning,
  className,
  children,
}: Common & { id: string; className?: string; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="type-body font-bold">
        {label}
      </label>
      {help && (
        <p id={`${id}-help`} className="type-helper text-ink-soft">
          {help}
        </p>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="type-helper font-bold text-error">
          {error}
        </p>
      ) : (
        warning && (
          <p id={`${id}-error`} className="type-helper font-bold text-warning">
            {warning}
          </p>
        )
      )}
    </div>
  );
}
