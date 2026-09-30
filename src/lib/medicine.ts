// Helpers for showing and editing a medicine. Every change goes through
// editMedicine(), so any edit sets `reviewed` back to false.

import {
  SLOTS,
  SYMBOLS,
  editMedicine,
  quantityStep,
  unitFor,
  type Bilingual,
  type Dose,
  type Form,
  type Medicine,
  type Slot,
} from "./plan";

/**
 * "blue star" / "نیلا ستارہ": the words used in the voice note and on screen.
 * Colour and shape are named separately, because after a medicine is removed
 * the next one can get a colour and a shape from different table rows.
 * Urdu adjectives agree with the noun; this simple form needs native review.
 */
export function symbolName(symbol: Medicine["symbol"]): Bilingual {
  const colour = SYMBOLS.find((s) => s.colour.toUpperCase() === symbol.colour.toUpperCase())?.colourName;
  const shape = SYMBOLS.find((s) => s.shape === symbol.shape)?.shapeName;
  return {
    en: [colour?.en, shape?.en].filter(Boolean).join(" "),
    ur: [colour?.ur, shape?.ur].filter(Boolean).join(" "),
  };
}

/** 0.5 → "½", 1.5 → "1½", 2 → "2". Western digits (SPEC.md → RTL rules). */
export function formatQuantity(quantity: number): string {
  const whole = Math.floor(quantity);
  const half = quantity - whole >= 0.5;
  if (!half) return String(whole);
  return whole ? `${whole}½` : "½";
}

/** "1½ tablets", "2 spoons". */
export function quantityText(form: Form, quantity: number): Bilingual {
  const unit = unitFor(form, quantity);
  const q = formatQuantity(quantity);
  return { en: `${q} ${unit.en}`, ur: `${q} ${unit.ur}` };
}

/** A medicine left completely empty, for example after tapping Add and then Back. */
export function isBlankMedicine(m: Medicine): boolean {
  return !m.name.trim() && !m.purpose.trim() && m.doses.length === 0 && !m.photoId;
}

/** Change the form, snapping quantities to what the new form allows. */
export function withForm(m: Medicine, form: Form): Medicine {
  const step = quantityStep(form);
  const doses = m.doses.map((d) => ({ ...d, quantity: Math.max(step, Math.round(d.quantity / step) * step) }));
  return editMedicine(m, { form, doses });
}

/** Set or clear the dose for one time of day, keeping doses in day order. */
export function withDose(m: Medicine, slot: Slot, dose: Omit<Dose, "slot"> | undefined): Medicine {
  const others = m.doses.filter((d) => d.slot !== slot);
  const doses = dose ? [...others, { slot, ...dose }] : others;
  doses.sort((a, b) => SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot));
  return editMedicine(m, { doses });
}

export const MAX_QUANTITY = 100;

export function clampQuantity(form: Form, quantity: number): number {
  const step = quantityStep(form);
  if (!Number.isFinite(quantity)) return step;
  return Math.min(MAX_QUANTITY, Math.max(step, Math.round(quantity / step) * step));
}
