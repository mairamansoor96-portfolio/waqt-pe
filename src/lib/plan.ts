// The Plan data model from SPEC.md → Part 2 → "Data model".
// One Plan describes one person. It serialises to the URL hash without photos;
// photos are referenced by id and kept in IndexedDB on the device.

export type Slot = "morning" | "midday" | "evening" | "night";
export type Food = "before" | "after" | "with" | "any";
export type Form = "tablet" | "capsule" | "syrup" | "drops" | "inhaler" | "insulin";
export type Giver = "self" | "family" | "helperReads" | "helperNoRead";
export type AnchorMode = "meals" | "prayers" | "clock";
export type Paper = "A4" | "Letter";
export type FoodVariant = "sequence" | "plate";
export type TickVariant = "weekSheet" | "colourColumns";

export interface Bilingual {
  en: string;
  ur: string;
}

export interface Dose {
  slot: Slot;
  quantity: number; // 0.5 steps for tablets
  food: Food;
}

export interface Medicine {
  id: string;
  name: string; // as written on the box
  purpose: string; // family's words: "for sugar"
  form: Form;
  photoId?: string; // IndexedDB key
  symbol: { colour: string; shape: string };
  doses: Dose[];
  reviewed: boolean; // set only in the review step
}

export interface Contact {
  id: string;
  name: string;
  relation: string; // "daughter"
  phone: string;
  photoId?: string;
}

export interface Plan {
  schemaVersion: 1;
  person: {
    name: string; // "Ammi"
    bloodGroup?: string;
    conditions: string[]; // treatment-relevant only
    allergies: string[];
  };
  giver: { type: Giver; helperName?: string };
  anchors: { mode: AnchorMode; labels: Record<Slot, Bilingual> };
  medicines: Medicine[];
  contacts: Contact[];
  sheetVersion: { number: number; borderColour: string; printedAt: string };
  settings: { paper: Paper; foodVariant: FoodVariant; tickVariant: TickVariant };
}

// ---------------------------------------------------------------------------
// Enumerations, in display order

export const SLOTS: readonly Slot[] = ["morning", "midday", "evening", "night"];
export const FOODS: readonly Food[] = ["before", "after", "with", "any"];
export const FORMS: readonly Form[] = ["tablet", "capsule", "syrup", "drops", "inhaler", "insulin"];
export const GIVERS: readonly Giver[] = ["self", "family", "helperReads", "helperNoRead"];
export const ANCHOR_MODES: readonly AnchorMode[] = ["meals", "prayers", "clock"];
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const MAX_CONTACTS = 3;

// ---------------------------------------------------------------------------
// Daily anchors: sensible defaults per mode. Urdu needs native review.

export const DEFAULT_ANCHOR_LABELS: Record<AnchorMode, Record<Slot, Bilingual>> = {
  meals: {
    morning: { en: "Breakfast", ur: "ناشتہ" },
    midday: { en: "Lunch", ur: "دوپہر کا کھانا" },
    evening: { en: "Dinner", ur: "رات کا کھانا" },
    night: { en: "Bedtime", ur: "سونے سے پہلے" },
  },
  prayers: {
    morning: { en: "Fajr", ur: "فجر" },
    midday: { en: "Zuhr", ur: "ظہر" },
    evening: { en: "Maghrib", ur: "مغرب" },
    night: { en: "Isha", ur: "عشاء" },
  },
  clock: {
    morning: { en: "8 am", ur: "صبح 8 بجے" },
    midday: { en: "2 pm", ur: "دوپہر 2 بجے" },
    evening: { en: "7 pm", ur: "شام 7 بجے" },
    night: { en: "10 pm", ur: "رات 10 بجے" },
  },
};

// ---------------------------------------------------------------------------
// Symbol system: Okabe–Ito colours paired with sayable shapes.
// Urdu words need native review.

export interface SymbolDef {
  colour: string; // hex, stored on Medicine.symbol.colour
  colourName: Bilingual;
  shape: string; // stored on Medicine.symbol.shape
  shapeName: Bilingual;
}

export const SYMBOLS: readonly SymbolDef[] = [
  { colour: "#0072B2", colourName: { en: "blue", ur: "نیلا" }, shape: "star", shapeName: { en: "star", ur: "ستارہ" } },
  { colour: "#E69F00", colourName: { en: "orange", ur: "نارنجی" }, shape: "circle", shapeName: { en: "circle", ur: "دائرہ" } },
  { colour: "#009E73", colourName: { en: "green", ur: "سبز" }, shape: "leaf", shapeName: { en: "leaf", ur: "پتا" } },
  { colour: "#D55E00", colourName: { en: "red", ur: "لال" }, shape: "square", shapeName: { en: "square", ur: "چوکور" } },
  { colour: "#56B4E9", colourName: { en: "sky blue", ur: "آسمانی" }, shape: "kite", shapeName: { en: "kite", ur: "پتنگ" } },
  { colour: "#CC79A7", colourName: { en: "pink", ur: "گلابی" }, shape: "flower", shapeName: { en: "flower", ur: "پھول" } },
  { colour: "#F0E442", colourName: { en: "yellow", ur: "پیلا" }, shape: "triangle", shapeName: { en: "triangle", ur: "تکون" } },
  { colour: "#000000", colourName: { en: "black", ur: "کالا" }, shape: "fish", shapeName: { en: "fish", ur: "مچھلی" } },
];

export const SYMBOL_COLOURS = SYMBOLS.map((s) => s.colour);
export const SYMBOL_SHAPES = SYMBOLS.map((s) => s.shape);

/**
 * Next free colour-and-shape pair. Colour and shape are each unique within the
 * plan, so no two medicines differ by colour alone. Returns undefined when all
 * eight are taken.
 */
export function nextSymbol(medicines: readonly Medicine[]): Medicine["symbol"] | undefined {
  const usedColours = new Set(medicines.map((m) => m.symbol.colour.toUpperCase()));
  const usedShapes = new Set(medicines.map((m) => m.symbol.shape));
  const colour = SYMBOLS.find((s) => !usedColours.has(s.colour.toUpperCase()))?.colour;
  const shape = SYMBOLS.find((s) => !usedShapes.has(s.shape))?.shape;
  return colour && shape ? { colour, shape } : undefined;
}

// ---------------------------------------------------------------------------
// Sheet versions: border colours cycle and always appear with the number.

export const VERSION_BORDER_COLOURS = ["#2B2D6E", "#1F7A7A", "#7A1F3D", "#6B6B1F"] as const;

export function borderColourFor(versionNumber: number): string {
  const i = (Math.max(1, Math.floor(versionNumber)) - 1) % VERSION_BORDER_COLOURS.length;
  return VERSION_BORDER_COLOURS[i];
}

/**
 * Called when a plan is printed. The first print only stamps the date; printing
 * a changed plan increments the version and assigns the next border colour.
 */
export function nextSheetVersion(
  current: Plan["sheetVersion"],
  changedSinceLastPrint: boolean,
  now: Date = new Date(),
): Plan["sheetVersion"] {
  const printedAt = now.toISOString();
  if (!current.printedAt || !changedSinceLastPrint) return { ...current, printedAt };
  const number = current.number + 1;
  return { number, borderColour: borderColourFor(number), printedAt };
}

// ---------------------------------------------------------------------------
// Rules

/** Any edit to a medicine sets `reviewed` back to false. */
export function editMedicine(medicine: Medicine, changes: Partial<Omit<Medicine, "id" | "reviewed">>): Medicine {
  return { ...medicine, ...changes, reviewed: false };
}

/** Printing is blocked until every medicine has been reviewed. */
export function canPrint(plan: Plan): boolean {
  return plan.medicines.length > 0 && plan.medicines.every((m) => m.reviewed);
}

/** Quantity units follow the form. Urdu needs native review. */
export function unitFor(form: Form, quantity: number): Bilingual {
  const one = quantity <= 1;
  switch (form) {
    case "tablet":
      return { en: one ? "tablet" : "tablets", ur: "گولی" };
    case "capsule":
      return { en: one ? "capsule" : "capsules", ur: "کیپسول" };
    case "syrup":
      return { en: one ? "spoon" : "spoons", ur: "چمچ" };
    case "drops":
      return { en: one ? "drop" : "drops", ur: "قطرے" };
    case "inhaler":
      return { en: one ? "puff" : "puffs", ur: "کش" };
    case "insulin":
      return { en: one ? "unit" : "units", ur: "یونٹ" };
  }
}

/** Tablets can be halved; everything else is counted in whole units. */
export function quantityStep(form: Form): number {
  return form === "tablet" ? 0.5 : 1;
}

/**
 * Defaults that the "Who usually gives the medicines?" answer turns on.
 * Derived at render time rather than stored, so changing the answer re-applies them.
 */
export interface GiverDefaults {
  largeText: boolean;
  boxPhotos: "optional" | "recommended" | "required";
  stickers: boolean;
  voiceScript: boolean;
  helperNamedOnSheet: boolean;
  textInBackground: boolean;
}

export function giverDefaults(giver: Giver): GiverDefaults {
  switch (giver) {
    case "self":
      return { largeText: true, boxPhotos: "optional", stickers: false, voiceScript: false, helperNamedOnSheet: false, textInBackground: false };
    case "family":
      return { largeText: false, boxPhotos: "recommended", stickers: false, voiceScript: false, helperNamedOnSheet: false, textInBackground: false };
    case "helperReads":
      return { largeText: false, boxPhotos: "recommended", stickers: true, voiceScript: true, helperNamedOnSheet: true, textInBackground: false };
    case "helperNoRead":
      return { largeText: false, boxPhotos: "required", stickers: true, voiceScript: true, helperNamedOnSheet: true, textInBackground: true };
  }
}

export function isHelper(giver: Giver): boolean {
  return giver === "helperReads" || giver === "helperNoRead";
}

// ---------------------------------------------------------------------------
// Construction

/** Short random id. Uses getRandomValues, which works outside secure contexts too. */
export function newId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function createEmptyPlan(): Plan {
  return {
    schemaVersion: 1,
    person: { name: "", conditions: [], allergies: [] },
    giver: { type: "family" },
    anchors: { mode: "meals", labels: structuredClone(DEFAULT_ANCHOR_LABELS.meals) },
    medicines: [],
    contacts: [],
    sheetVersion: { number: 1, borderColour: VERSION_BORDER_COLOURS[0], printedAt: "" },
    settings: { paper: "A4", foodVariant: "sequence", tickVariant: "weekSheet" },
  };
}

export function createMedicine(existing: readonly Medicine[], fields: Partial<Omit<Medicine, "id" | "symbol" | "reviewed">> = {}): Medicine | undefined {
  const symbol = nextSymbol(existing);
  if (!symbol) return undefined;
  return {
    id: newId(),
    name: "",
    purpose: "",
    form: "tablet",
    doses: [],
    ...fields,
    symbol,
    reviewed: false,
  };
}
