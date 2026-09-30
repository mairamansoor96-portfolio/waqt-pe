// The voice-note script: fixed templates, never AI, so the wording is
// predictable (SPEC.md → Voice-note script). It follows the fridge sheet's
// order exactly: times of day top to bottom, medicines in plan order.
//
// Urdu adjectives agree with their noun, and meal words change form after a
// postposition, so the words come from lookup tables here rather than being
// pasted together. EVERY Urdu word and phrase here needs native review.

import { messages } from "./messages";
import { DEFAULT_ANCHOR_LABELS, SYMBOLS, type Form, type Plan, type Slot } from "./plan";
import { dosesBySlot } from "./sheet";

export type ScriptLang = "en" | "ur";

export interface ScriptLine {
  /** `${slot}-${medicineId}` for dose lines, matching the fridge sheet's cards. */
  key: string;
  text: string;
  slot?: Slot;
  medicineId?: string;
}

/**
 * Wrap text the family typed (names, labels) in first-strong isolates
 * (U+2068 … U+2069), so a Latin name in Urdu, or the reverse, keeps its
 * order on screen and when pasted into WhatsApp. Invisible when read.
 */
const iso = (s: string) => `⁨${s}⁩`;
/** Numerals stay left-to-right inside Urdu (U+2066 … U+2069). */
const ltr = (s: string) => `⁦${s}⁩`;

const fillTemplate = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------------------------------------------------------------------------
// Symbols: "the blue star box" / "نیلے ستارے والا ڈبہ".
// Before والا the phrase takes the oblique case: a masculine noun ending in
// -ا/-ہ becomes -ے (ستارہ → ستارے), and an inflecting adjective agrees
// (نیلا → نیلے with a masculine noun, نیلی with a feminine one).

const UR_SHAPES: Record<string, { oblique: string; feminine: boolean }> = {
  star: { oblique: "ستارے", feminine: false },
  circle: { oblique: "دائرے", feminine: false },
  leaf: { oblique: "پتے", feminine: false },
  square: { oblique: "چوکور", feminine: false },
  kite: { oblique: "پتنگ", feminine: true },
  flower: { oblique: "پھول", feminine: false },
  triangle: { oblique: "تکون", feminine: true },
  fish: { oblique: "مچھلی", feminine: true },
};

/** Inflecting colours give [masculine oblique, feminine]; others don't change. */
const UR_COLOURS: Record<string, string | [string, string]> = {
  "#0072B2": ["نیلے", "نیلی"],
  "#E69F00": "نارنجی",
  "#009E73": "سبز",
  "#D55E00": "لال",
  "#56B4E9": "آسمانی",
  "#CC79A7": "گلابی",
  "#F0E442": ["پیلے", "پیلی"],
  "#000000": ["کالے", "کالی"],
};

export function spokenSymbol(symbol: { colour: string; shape: string }, lang: ScriptLang): string {
  if (lang === "en") {
    const colour = SYMBOLS.find((s) => s.colour.toUpperCase() === symbol.colour.toUpperCase())?.colourName.en ?? "";
    const shape = SYMBOLS.find((s) => s.shape === symbol.shape)?.shapeName.en ?? "";
    return [colour, shape].filter(Boolean).join(" ");
  }
  const shape = UR_SHAPES[symbol.shape] ?? { oblique: symbol.shape, feminine: false };
  const colour = UR_COLOURS[symbol.colour.toUpperCase()] ?? "";
  const adjective = Array.isArray(colour) ? colour[shape.feminine ? 1 : 0] : colour;
  return [adjective, shape.oblique].filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Quantities, spelled out for reading aloud: "One and a half tablets",
// "ڈیڑھ گولی". Above ten, numerals.

const EN_NUMBERS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const UR_NUMBERS = ["صفر", "ایک", "دو", "تین", "چار", "پانچ", "چھ", "سات", "آٹھ", "نو", "دس"];

const EN_UNITS: Record<Form, [string, string]> = {
  tablet: ["tablet", "tablets"],
  capsule: ["capsule", "capsules"],
  syrup: ["spoon", "spoons"],
  drops: ["drop", "drops"],
  inhaler: ["puff", "puffs"],
  insulin: ["unit", "units"],
};
/** [singular, plural]; گولی is feminine, so a half is آدھی. */
const UR_UNITS: Record<Form, [string, string]> = {
  tablet: ["گولی", "گولیاں"],
  capsule: ["کیپسول", "کیپسول"],
  syrup: ["چمچ", "چمچ"],
  drops: ["قطرہ", "قطرے"],
  inhaler: ["کش", "کش"],
  insulin: ["یونٹ", "یونٹ"],
};

export function spokenQuantity(form: Form, quantity: number, lang: ScriptLang): string {
  const whole = Math.floor(quantity);
  const half = quantity - whole >= 0.5;
  if (lang === "en") {
    const [one, many] = EN_UNITS[form];
    if (!whole && half) return `Half a ${one}`;
    const n = whole <= 10 ? EN_NUMBERS[whole] : String(whole);
    if (half) return cap(`${n} and a half ${many}`);
    return cap(`${n} ${whole === 1 ? one : many}`);
  }
  const [one, many] = UR_UNITS[form];
  if (!whole && half) return `${form === "tablet" ? "آدھی" : "آدھا"} ${one}`;
  if (half && whole === 1) return `ڈیڑھ ${one}`;
  if (half && whole === 2) return `ڈھائی ${many}`;
  const n = whole <= 10 ? UR_NUMBERS[whole] : ltr(String(whole));
  if (half) return `ساڑھے ${n} ${many}`;
  return `${n} ${whole === 1 ? one : many}`;
}

// ---------------------------------------------------------------------------
// When: "Morning, after breakfast" / "صبح، ناشتے کے بعد".
// With the default meal labels, food is said relative to the meal itself.
// Labels the family typed can't safely be inflected, so they're said as they
// are, with the food instruction after them.

const EN_SLOTS: Record<Slot, string> = { morning: "Morning", midday: "Midday", evening: "Evening", night: "Night" };
const UR_SLOTS: Record<Slot, string> = { morning: "صبح", midday: "دوپہر", evening: "شام", night: "رات" };

/** Default meal words: English lower-case, Urdu in the oblique case. Bedtime isn't a meal. */
const MEALS: Partial<Record<Slot, { en: string; ur: string }>> = {
  morning: { en: "breakfast", ur: "ناشتے" },
  midday: { en: "lunch", ur: "دوپہر کے کھانے" },
  evening: { en: "dinner", ur: "رات کے کھانے" },
};

const EN_FOOD = { before: "before food", after: "after food", with: "with food" } as const;
const UR_FOOD = { before: "کھانے سے پہلے", after: "کھانے کے بعد", with: "کھانے کے ساتھ" } as const;

export function spokenWhen(plan: Plan, slot: Slot, food: "before" | "after" | "with" | "any", lang: ScriptLang): string {
  const { mode, labels } = plan.anchors;
  const label = labels[slot][lang].trim();
  const isDefault = mode === "meals" && label === DEFAULT_ANCHOR_LABELS.meals[slot][lang];
  const meal = isDefault ? MEALS[slot] : undefined;

  if (lang === "en") {
    if (meal) {
      if (food === "any") return `${EN_SLOTS[slot]}, at ${meal.en} time`;
      return `${EN_SLOTS[slot]}, ${food} ${meal.en}`;
    }
    const anchor = isDefault ? label.toLowerCase() : iso(label);
    const foodPart = food === "any" ? "" : `, ${EN_FOOD[food]}`;
    // Clock labels already say the time, so the time of day isn't repeated.
    if (mode === "clock") return `At ${anchor}${foodPart}`;
    return `${EN_SLOTS[slot]}, at ${anchor}${foodPart}`;
  }

  if (meal) {
    const after = { before: "سے پہلے", after: "کے بعد", with: "کے ساتھ", any: "کے وقت" }[food];
    return `${UR_SLOTS[slot]}، ${meal.ur} ${after}`;
  }
  const anchor = isDefault ? label : iso(label);
  const foodPart = food === "any" ? "" : `، ${UR_FOOD[food]}`;
  if (mode === "clock") return `${anchor}${foodPart}`;
  return `${UR_SLOTS[slot]}، ${anchor}${foodPart}`;
}

// ---------------------------------------------------------------------------

/** The whole script in one language: opening, one line per dose in sheet order, closing. */
export function voiceScript(plan: Plan, lang: ScriptLang): ScriptLine[] {
  const person = iso(plan.person.name.trim());
  const helperName = plan.giver.helperName?.trim();
  const opening = helperName
    ? fillTemplate(messages.voiceOpeningNamed[lang], { helper: iso(helperName), person })
    : fillTemplate(messages.voiceOpening[lang], { person });

  const doses: ScriptLine[] = dosesBySlot(plan).flatMap(({ slot, doses }) =>
    doses.map(({ medicine, dose }) => ({
      key: `${slot}-${medicine.id}`,
      slot,
      medicineId: medicine.id,
      text: fillTemplate(messages.voiceDose[lang], {
        when: spokenWhen(plan, slot, dose.food, lang),
        symbol: spokenSymbol(medicine.symbol, lang),
        quantity: spokenQuantity(medicine.form, dose.quantity, lang),
      }),
    })),
  );

  return [{ key: "opening", text: opening }, ...doses, { key: "closing", text: messages.voiceClosing[lang] }];
}

/** Plain text for the clipboard: one line per sentence group, ready for WhatsApp. */
export function scriptText(lines: ScriptLine[]): string {
  return lines.map((l) => l.text).join("\n");
}
