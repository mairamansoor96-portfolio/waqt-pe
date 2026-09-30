"use client";

import { useEffect, useId, useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { clampQuantity, formatQuantity } from "@/lib/medicine";
import { quantityStep, unitFor, type Form } from "@/lib/plan";
import { Quantity } from "@/pictograms";

/**
 * How many: − and + buttons in the form's steps (halves for tablets), a
 * number field for large counts like insulin units, and the quantity drawn.
 */
export function QuantityStepper({ form, value, onChange }: { form: Form; value: number; onChange: (q: number) => void }) {
  const t = useT();
  const { lang } = useLang();
  const id = useId();
  const step = quantityStep(form);
  const [draft, setDraft] = useState(formatQuantity(value));
  useEffect(() => setDraft(formatQuantity(value)), [value]);

  const commit = (text: string) => {
    const n = Number(text.replace("½", ".5").replace(",", "."));
    const q = clampQuantity(form, Number.isFinite(n) && text.trim() ? n : value);
    onChange(q);
    setDraft(formatQuantity(q));
  };

  const button =
    "flex size-12 shrink-0 items-center justify-center rounded-button border-2 border-primary bg-surface text-primary disabled:opacity-40";
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-helper font-bold">
        {t("howMany")}
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={button} onClick={() => onChange(clampQuantity(form, value - step))} disabled={value <= step} aria-label={t("fewer")}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
        <input
          id={id}
          inputMode="decimal"
          dir="ltr"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commit(e.currentTarget.value)}
          className="min-h-12 w-16 rounded-input border-2 border-line bg-surface text-center type-body font-bold tabular-nums focus-visible:border-primary"
        />
        <button type="button" className={button} onClick={() => onChange(clampQuantity(form, value + step))} aria-label={t("more")}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
        <span className="type-body">{unitFor(form, value)[lang]}</span>
      </div>
      <Quantity form={form} quantity={value} size={32} />
    </div>
  );
}
