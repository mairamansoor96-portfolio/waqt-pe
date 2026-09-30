"use client";

import { useId, useState } from "react";
import { Button } from "./Button";
import { fill, useT } from "@/lib/i18n";

/**
 * A short list of free-text items: each shown with a remove button, plus a
 * labelled input to add another. Enter adds too.
 */
export function ListEditor({
  items,
  onChange,
  inputLabel,
  hidden = [],
  max = 20,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  inputLabel: string;
  /** Items shown elsewhere (as chips), so not listed here. */
  hidden?: string[];
  max?: number;
}) {
  const t = useT();
  const id = useId();
  const [draft, setDraft] = useState("");
  const shown = items.filter((i) => !hidden.includes(i));

  const add = () => {
    const value = draft.trim();
    if (!value || items.length >= max) return;
    if (!items.some((i) => i.toLowerCase() === value.toLowerCase())) onChange([...items, value]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-3">
      {shown.length > 0 && (
        <ul className="flex flex-col gap-2">
          {shown.map((item) => (
            <li key={item} className="frame flex items-center justify-between gap-2 rounded-input bg-surface ps-4">
              <bdi className="min-w-0 break-words py-2">{item}</bdi>
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i !== item))}
                aria-label={fill(t("removeItem"), { item })}
                className="flex size-12 shrink-0 items-center justify-center rounded-input text-ink-soft"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="type-helper font-bold text-ink-soft">
          {inputLabel}
        </label>
        <div className="flex gap-2">
          <input
            id={id}
            dir="auto"
            value={draft}
            maxLength={200}
            autoComplete="off"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            className="block min-h-12 w-full min-w-0 rounded-input border-2 border-line bg-surface px-4 py-2 type-body text-ink focus-visible:border-primary"
          />
          <Button variant="secondary" onClick={add} className="shrink-0 px-4">
            {t("add")}
          </Button>
        </div>
      </div>
    </div>
  );
}
