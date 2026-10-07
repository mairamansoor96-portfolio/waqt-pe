// What the printed sheets show, and the rules for printing them.
// SPEC.md → Output specs → Fridge sheet, and Data model → Rules.

import { messages, type MessageKey } from "./messages";
import { quantityText } from "./medicine";
import { sanitisePlan } from "./sanitise";
import { SLOTS, nextSheetVersion, type Dose, type Form, type Medicine, type Paper, type Plan, type Slot } from "./plan";

/** Paper sizes in mm. Printed with an 8 mm margin all round. */
export const PAPER: Record<Paper, { width: number; height: number; css: string }> = {
  A4: { width: 210, height: 297, css: "A4" },
  Letter: { width: 215.9, height: 279.4, css: "letter" },
};
export const PAGE_MARGIN_MM = 8;

/** CSS px per mm. Print uses 96 px per inch, so px sizes print at true size. */
export const PX_PER_MM = 96 / 25.4;
export const mm = (n: number) => Math.round(n * PX_PER_MM * 100) / 100;

/** FNV-1a, 32-bit: enough to notice a change, not a security measure. */
function hash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/**
 * A fingerprint of everything the fridge sheet shows. Ticking "reviewed" and
 * changing print settings don't change it; any change to what's printed does.
 */
export function sheetFingerprint(plan: Plan): string {
  const shown = {
    name: plan.person.name.trim(),
    giver: plan.giver,
    anchors: plan.anchors,
    medicines: plan.medicines.map(({ reviewed: _reviewed, ...m }) => m),
    contacts: plan.contacts,
  };
  return hash(JSON.stringify(shown));
}

/**
 * A fingerprint of everything any output shows (the sheet, plus the health
 * details on the lock screen and doctor's list). Done states on the outputs
 * hub belong to one fingerprint, so any change to the plan clears them.
 * The plan goes through the sanitiser first, as it does when a link is
 * opened, so the same plan gives the same fingerprint before and after a
 * reload (same key order, same trimming).
 */
export function planFingerprint(plan: Plan): string {
  const clean = sanitisePlan(plan);
  const { name: _name, ...health } = clean.person;
  return hash(JSON.stringify({ sheet: sheetFingerprint(clean), health }));
}

/** Has the sheet changed since it was last printed? */
export function changedSinceLastPrint(plan: Plan): boolean {
  const v = plan.sheetVersion;
  if (!v.printedAt) return false; // never printed: this is version 1
  return v.fingerprint !== sheetFingerprint(plan);
}

/** The version the next print will carry, so the preview shows exactly what prints. */
export function upcomingVersion(plan: Plan): Plan["sheetVersion"] {
  const next = nextSheetVersion(plan.sheetVersion, changedSinceLastPrint(plan));
  return { ...next, printedAt: plan.sheetVersion.printedAt };
}

/** Record a print: stamp the date, and move to the next version if the sheet changed. */
export function recordPrint(plan: Plan, now: Date = new Date()): Plan {
  const next = nextSheetVersion(plan.sheetVersion, changedSinceLastPrint(plan), now);
  return { ...plan, sheetVersion: { ...next, fingerprint: sheetFingerprint(plan) } };
}

export interface SheetDose {
  medicine: Medicine;
  dose: Dose;
}

/** Doses grouped by time of day, in day order. Empty times are left out. */
export function dosesBySlot(plan: Plan): { slot: Slot; doses: SheetDose[] }[] {
  return SLOTS.map((slot) => ({
    slot,
    doses: plan.medicines.flatMap((medicine) =>
      medicine.doses.filter((d) => d.slot === slot).map((dose) => ({ medicine, dose })),
    ),
  })).filter((row) => row.doses.length > 0);
}

/** One tick-grid row per dose, in the same order as the schedule. */
export function tickRows(plan: Plan): (SheetDose & { slot: Slot })[] {
  return dosesBySlot(plan).flatMap(({ slot, doses }) => doses.map((d) => ({ ...d, slot })));
}

/** "30 Sep 2026": numerals and a short month, readable in either language. */
export function printDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Sticker sheet

/** Symbol sizes in mm: 30 by default, 20 and 40 as options (SPEC.md). */
export const STICKER_SIZES = [20, 30, 40] as const;
export type StickerSize = (typeof STICKER_SIZES)[number];
export const DEFAULT_STICKER_SIZE: StickerSize = 30;

// ---------------------------------------------------------------------------
// Doctor's list (clinical English)

const slotWord: Record<Slot, MessageKey> = {
  morning: "slotLowerMorning",
  midday: "slotLowerMidday",
  evening: "slotLowerEvening",
  night: "slotLowerNight",
};
const foodWord: Record<Dose["food"], MessageKey> = {
  before: "doseFoodBefore",
  after: "doseFoodAfter",
  with: "doseFoodWith",
  any: "doseFoodAny",
};
const formWord: Record<Form, MessageKey> = {
  tablet: "formTablet",
  capsule: "formCapsule",
  syrup: "formSyrup",
  drops: "formDrops",
  inhaler: "formInhaler",
  insulin: "formInsulin",
};

export interface DoctorRow {
  medicine: Medicine;
  form: string;
  /** One line per dose, in day order: "1½ tablets, morning (Fajr)". */
  timing: string[];
  /** The matching food instruction for each timing line. */
  food: string[];
}

/** The doctor's list table, one row per medicine, in English. */
export function doctorRows(plan: Plan): DoctorRow[] {
  return plan.medicines.map((medicine) => {
    const doses = [...medicine.doses].sort((a, b) => SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot));
    return {
      medicine,
      form: messages[formWord[medicine.form]].en,
      timing: doses.map((d) =>
        messages.docTiming.en
          .replace("{quantity}", quantityText(medicine.form, d.quantity).en)
          .replace("{slot}", messages[slotWord[d.slot]].en)
          .replace("{anchor}", plan.anchors.labels[d.slot].en),
      ),
      food: doses.map((d) => messages[foodWord[d.food]].en),
    };
  });
}
