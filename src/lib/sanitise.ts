// Turns untrusted JSON (from a link someone pasted, or an imported file) into a
// valid Plan. Unknown fields are dropped, bad values fall back to defaults,
// strings and lists are length-capped. Never throws on odd input.

import {
  ANCHOR_MODES,
  DEFAULT_ANCHOR_LABELS,
  FOODS,
  FORMS,
  GIVERS,
  MAX_CONTACTS,
  SLOTS,
  SYMBOL_COLOURS,
  SYMBOL_SHAPES,
  SYMBOLS,
  VERSION_BORDER_COLOURS,
  borderColourFor,
  createEmptyPlan,
  newId,
  nextSymbol,
  quantityStep,
  type AnchorMode,
  type Bilingual,
  type Contact,
  type Dose,
  type Medicine,
  type Plan,
  type Slot,
} from "./plan";

const MAX_TEXT = 200;
const MAX_LIST = 20;
const MAX_MEDICINES = SYMBOLS.length;
const MAX_QUANTITY = 100;

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const obj = (v: unknown): Obj => (isObj(v) ? v : {});

function text(v: unknown, max = MAX_TEXT): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function optionalText(v: unknown, max = MAX_TEXT): string | undefined {
  return text(v, max) || undefined;
}

function oneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

function textList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => text(x)).filter(Boolean).slice(0, MAX_LIST);
}

function id(v: unknown): string {
  return typeof v === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(v) ? v : newId();
}

function optionalId(v: unknown): string | undefined {
  return typeof v === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(v) ? v : undefined;
}

function bilingual(v: unknown, fallback: Bilingual): Bilingual {
  const o = obj(v);
  return { en: text(o.en, 60) || fallback.en, ur: text(o.ur, 60) || fallback.ur };
}

function dose(v: unknown, form: Medicine["form"]): Dose | undefined {
  const o = obj(v);
  const slot = oneOf<Slot | "">(o.slot, SLOTS, "");
  if (!slot) return undefined;
  const step = quantityStep(form);
  const raw = typeof o.quantity === "number" && Number.isFinite(o.quantity) ? o.quantity : step;
  const quantity = Math.min(MAX_QUANTITY, Math.max(step, Math.round(raw / step) * step));
  return { slot, quantity, food: oneOf(o.food, FOODS, "any") };
}

function medicines(v: unknown): Medicine[] {
  if (!Array.isArray(v)) return [];
  const out: Medicine[] = [];
  for (const raw of v.slice(0, MAX_MEDICINES)) {
    const o = obj(raw);
    const form = oneOf(o.form, FORMS, "tablet");
    const seenSlots = new Set<Slot>();
    const doses = (Array.isArray(o.doses) ? o.doses : [])
      .map((d) => dose(d, form))
      .filter((d): d is Dose => !!d && !seenSlots.has(d.slot) && !!seenSlots.add(d.slot));

    // Keep the stored symbol only if it's from the table and not already used;
    // otherwise assign the next free pair so colour and shape stay unique.
    const sym = obj(o.symbol);
    const colour = typeof sym.colour === "string" ? sym.colour.toUpperCase() : "";
    const shape = typeof sym.shape === "string" ? sym.shape : "";
    const valid =
      SYMBOL_COLOURS.includes(colour) &&
      SYMBOL_SHAPES.includes(shape) &&
      !out.some((m) => m.symbol.colour === colour || m.symbol.shape === shape);
    const symbol = valid ? { colour, shape } : nextSymbol(out);
    if (!symbol) break;

    out.push({
      id: id(o.id),
      name: text(o.name),
      purpose: text(o.purpose),
      form,
      photoId: optionalId(o.photoId),
      symbol,
      doses,
      reviewed: o.reviewed === true,
    });
  }
  return out;
}

function contacts(v: unknown): Contact[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, MAX_CONTACTS).map((raw) => {
    const o = obj(raw);
    return {
      id: id(o.id),
      name: text(o.name),
      relation: text(o.relation, 60),
      phone: text(o.phone, 40),
      photoId: optionalId(o.photoId),
    };
  });
}

export function sanitisePlan(input: unknown): Plan {
  const base = createEmptyPlan();
  const o = obj(input);

  const person = obj(o.person);
  const giver = obj(o.giver);
  const anchors = obj(o.anchors);
  const mode: AnchorMode = oneOf(anchors.mode, ANCHOR_MODES, base.anchors.mode);
  const labelsIn = obj(anchors.labels);
  const defaults = DEFAULT_ANCHOR_LABELS[mode];
  const labels = Object.fromEntries(SLOTS.map((s) => [s, bilingual(labelsIn[s], defaults[s])])) as Record<Slot, Bilingual>;

  const version = obj(o.sheetVersion);
  const number =
    typeof version.number === "number" && Number.isInteger(version.number) && version.number >= 1
      ? Math.min(version.number, 9999)
      : base.sheetVersion.number;
  const borderIn = typeof version.borderColour === "string" ? version.borderColour.toUpperCase() : "";
  const borderColour = (VERSION_BORDER_COLOURS as readonly string[]).includes(borderIn) ? borderIn : borderColourFor(number);
  const printedAtIn = text(version.printedAt, 40);
  const printedAt = printedAtIn && !Number.isNaN(Date.parse(printedAtIn)) ? printedAtIn : "";

  const settings = obj(o.settings);
  const giverType = oneOf(giver.type, GIVERS, base.giver.type);

  return {
    schemaVersion: 1,
    person: {
      name: text(person.name, 80),
      bloodGroup: optionalText(person.bloodGroup, 12),
      conditions: textList(person.conditions),
      allergies: textList(person.allergies),
    },
    giver: { type: giverType, helperName: optionalText(giver.helperName, 80) },
    anchors: { mode, labels },
    medicines: medicines(o.medicines),
    contacts: contacts(o.contacts),
    sheetVersion: {
      number,
      borderColour,
      printedAt,
      fingerprint: typeof version.fingerprint === "string" && /^[0-9a-f]{1,16}$/.test(version.fingerprint) ? version.fingerprint : undefined,
    },
    settings: {
      paper: oneOf(settings.paper, ["A4", "Letter"] as const, base.settings.paper),
      foodVariant: oneOf(settings.foodVariant, ["sequence", "plate"] as const, base.settings.foodVariant),
      tickVariant: oneOf(settings.tickVariant, ["weekSheet", "colourColumns"] as const, base.settings.tickVariant),
    },
  };
}
