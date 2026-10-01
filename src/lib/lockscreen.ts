// The emergency lock-screen card, drawn on a canvas and saved as a PNG.
// SPEC.md → Output 2 and Lock-screen card (PNG).
//
// Content keeps clear of the top ~30% (clock, notifications) and the bottom
// ~10% (shortcuts, home bar). If there's a lot to show, everything is scaled
// down a step at a time until it fits: nothing is ever cut off.

import { messages } from "./messages";
import { textDir } from "./text-direction";
import type { Plan } from "./plan";

export const PRESETS = {
  iphone: { width: 1170, height: 2532 },
  android: { width: 1080, height: 2400 },
} as const;
export type Preset = keyof typeof PRESETS;

/** Fractions of the height kept clear. A little more than the spec's ~30% / ~10%, for margin. */
export const CLEAR_TOP = 0.32;
export const CLEAR_BOTTOM = 0.12;

export type Layout = "text" | "faces";

export interface Fields {
  name: boolean;
  bloodGroup: boolean;
  conditions: boolean;
  allergies: boolean;
  contacts: boolean;
}

/** Every piece drawn, for tests and for checking the safe area. */
export interface DrawnBox {
  kind: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const BG = "#1E2340";
const FG = "#FFFFFF";
const SOFT = "#C9CCE8";
const ALERT = "#B3261E";
const EN_FONT = '"Atkinson Hyperlegible", system-ui, sans-serif';
const UR_FONT = '"Noto Nastaliq Urdu", serif';

export interface Face {
  name: string;
  relation: string;
  phone: string;
  image?: CanvasImageSource;
}

/** Make sure the bundled fonts are ready before drawing, or the canvas falls back silently. */
export async function loadFonts(): Promise<void> {
  if (!("fonts" in document)) return;
  await Promise.all([
    document.fonts.load(`700 64px ${EN_FONT}`, "In an emergency 0123"),
    document.fonts.load(`400 64px ${EN_FONT}`, "Blood group"),
    document.fonts.load(`400 64px ${UR_FONT}`, "ایمرجنسی میں"),
    document.fonts.load(`700 64px ${UR_FONT}`, "ایمرجنسی میں"),
  ]).catch(() => undefined);
}

interface Pen {
  ctx: CanvasRenderingContext2D;
  draw: boolean;
  boxes: DrawnBox[];
  left: number;
  right: number;
  y: number;
  u: number; // one unit: 1 px on a 1080 px-wide screen, at scale 1
}

function font(size: number, bold: boolean, urdu: boolean) {
  return `${bold ? 700 : 400} ${Math.round(size)}px ${urdu ? UR_FONT : EN_FONT}`;
}

/** Split text into lines that fit `max` px, breaking long words if needed. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const tryLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(tryLine).width <= max) {
      line = tryLine;
      continue;
    }
    if (line) lines.push(line);
    if (ctx.measureText(word).width <= max) {
      line = word;
      continue;
    }
    // A single word too long for the line: break it by characters.
    let part = "";
    for (const ch of word) {
      if (ctx.measureText(part + ch).width > max && part) {
        lines.push(part);
        part = ch;
      } else part += ch;
    }
    line = part;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Draw text in its own direction and advance the pen. Urdu lines sit at the
 * end (right) unless `start` is set, which keeps a name beside its number or
 * face. With `oneLine` the text never wraps (phone numbers); it shrinks to fit.
 */
function text(
  pen: Pen,
  kind: string,
  value: string,
  size: number,
  opts: { bold?: boolean; colour?: string; start?: boolean; oneLine?: boolean } = {},
) {
  const urdu = textDir(value) === "rtl";
  const { ctx } = pen;
  const max = pen.right - pen.left;
  let px = size * pen.u;
  ctx.font = font(px, !!opts.bold, urdu);
  if (opts.oneLine) {
    while (ctx.measureText(value).width > max && px > size * pen.u * 0.4) {
      px *= 0.95;
      ctx.font = font(px, !!opts.bold, urdu);
    }
  }
  const lineHeight = px * (urdu ? 1.9 : 1.2);
  const lines = opts.oneLine ? [value] : wrap(ctx, value, max);
  const atEnd = urdu && !opts.start;
  for (const line of lines) {
    const width = ctx.measureText(line).width;
    const x = atEnd ? pen.right - width : pen.left;
    if (pen.draw) {
      ctx.fillStyle = opts.colour ?? FG;
      ctx.direction = urdu ? "rtl" : "ltr";
      // The x position is computed above, so draw from the left edge either way.
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(line, x, pen.y + lineHeight / 2);
    }
    pen.boxes.push({ kind, text: line, x, y: pen.y, width, height: lineHeight });
    pen.y += lineHeight;
  }
}

/** A label row: English at the start, Urdu at the end, on one line. */
function label(pen: Pen, kind: string, key: keyof typeof messages, colour = SOFT) {
  const { ctx } = pen;
  const en = messages[key].en;
  const ur = messages[key].ur;
  const enPx = 40 * pen.u;
  const urPx = 40 * pen.u;
  const lineHeight = urPx * 1.9;
  ctx.font = font(enPx, true, false);
  const enWidth = ctx.measureText(en).width;
  ctx.font = font(urPx, false, true);
  const urWidth = ctx.measureText(ur).width;
  if (pen.draw) {
    ctx.fillStyle = colour;
    ctx.textBaseline = "middle";
    ctx.font = font(enPx, true, false);
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    ctx.fillText(en, pen.left, pen.y + lineHeight / 2);
    ctx.font = font(urPx, false, true);
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    ctx.fillText(ur, pen.right, pen.y + lineHeight / 2);
  }
  pen.boxes.push({ kind: `${kind}-label`, text: en, x: pen.left, y: pen.y, width: enWidth, height: lineHeight });
  pen.boxes.push({ kind: `${kind}-label`, text: ur, x: pen.right - urWidth, y: pen.y, width: urWidth, height: lineHeight });
  pen.y += lineHeight;
}

/** The red "In an emergency" band, English and Urdu. */
function banner(pen: Pen) {
  const { ctx } = pen;
  const h = 130 * pen.u;
  if (pen.draw) {
    ctx.fillStyle = ALERT;
    ctx.beginPath();
    ctx.roundRect(pen.left, pen.y, pen.right - pen.left, h, 28 * pen.u);
    ctx.fill();
  }
  const inner = 36 * pen.u;
  ctx.font = font(54 * pen.u, true, false);
  const en = messages.lockEmergency.en;
  const enWidth = ctx.measureText(en).width;
  ctx.font = font(50 * pen.u, true, true);
  const ur = messages.lockEmergency.ur;
  const urWidth = ctx.measureText(ur).width;
  if (pen.draw) {
    ctx.fillStyle = FG;
    ctx.textBaseline = "middle";
    ctx.font = font(54 * pen.u, true, false);
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    ctx.fillText(en, pen.left + inner, pen.y + h / 2);
    ctx.font = font(50 * pen.u, true, true);
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    ctx.fillText(ur, pen.right - inner, pen.y + h / 2);
  }
  pen.boxes.push({ kind: "banner", text: en, x: pen.left + inner, y: pen.y, width: enWidth, height: h });
  pen.boxes.push({ kind: "banner", text: ur, x: pen.right - inner - urWidth, y: pen.y, width: urWidth, height: h });
  pen.y += h;
}

function gap(pen: Pen, n = 40) {
  pen.y += n * pen.u;
}

function drawText(pen: Pen, plan: Plan, fields: Fields) {
  const { person, contacts } = plan;
  banner(pen);
  if (fields.name && person.name.trim()) {
    gap(pen, 48);
    text(pen, "name", person.name.trim(), 92, { bold: true });
  }
  if (fields.bloodGroup && person.bloodGroup) {
    gap(pen);
    label(pen, "blood", "lockBlood");
    text(pen, "blood", person.bloodGroup, 76, { bold: true });
  }
  if (fields.conditions && person.conditions.length) {
    gap(pen);
    label(pen, "conditions", "lockConditions");
    for (const c of person.conditions) text(pen, "conditions", c, 50);
  }
  if (fields.allergies && person.allergies.length) {
    gap(pen);
    label(pen, "allergies", "lockAllergies", "#FFB4A9");
    for (const a of person.allergies) text(pen, "allergies", a, 54, { bold: true });
  }
  const people = contacts.filter((c) => c.name.trim() || c.phone.trim());
  if (fields.contacts && people.length) {
    gap(pen);
    label(pen, "contacts", "lockCall");
    for (const c of people) {
      const parts = [c.name.trim(), c.relation.trim()].filter(Boolean);
      // Urdu takes its own comma.
      const who = parts.join(textDir(parts.join(" ")) === "rtl" ? "، " : ", ");
      if (who) text(pen, "contact", who, 48, { start: true });
      if (c.phone.trim()) text(pen, "phone", c.phone.trim(), 72, { bold: true, oneLine: true });
      gap(pen, 16);
    }
  }
}

function drawFaces(pen: Pen, faces: Face[]) {
  const { ctx } = pen;
  banner(pen);
  gap(pen, 48);
  label(pen, "contacts", "lockCall");
  for (const f of faces) {
    gap(pen, 28);
    const d = 260 * pen.u;
    const top = pen.y;
    const cx = pen.left + d / 2;
    const cy = top + d / 2;
    if (pen.draw) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
      ctx.closePath();
      if (f.image) {
        ctx.clip();
        // Cover the circle, cropping the photo's longer side.
        const img = f.image as { width: number; height: number };
        const s = Math.max(d / img.width, d / img.height);
        const w = img.width * s;
        const h = img.height * s;
        ctx.drawImage(f.image, cx - w / 2, cy - h / 2, w, h);
      } else {
        ctx.fillStyle = "#3A3F66";
        ctx.fill();
        ctx.fillStyle = FG;
        ctx.font = font(120 * pen.u, true, textDir(f.name) === "rtl");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.direction = "ltr";
        ctx.fillText(f.name.trim().charAt(0).toUpperCase(), cx, cy);
      }
      ctx.restore();
      ctx.lineWidth = 6 * pen.u;
      ctx.strokeStyle = FG;
      ctx.beginPath();
      ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    pen.boxes.push({ kind: "face", text: f.name, x: pen.left, y: top, width: d, height: d });
    // Name and number beside the face.
    const saved = { left: pen.left, y: pen.y };
    pen.left = pen.left + d + 36 * pen.u;
    pen.y = top + 10 * pen.u;
    if (f.name.trim()) text(pen, "contact", f.name.trim(), 52, { bold: true, start: true });
    if (f.phone.trim()) text(pen, "phone", f.phone.trim(), 76, { bold: true, oneLine: true });
    pen.left = saved.left;
    pen.y = Math.max(top + d, pen.y);
  }
}

export interface DrawResult {
  boxes: DrawnBox[];
  scale: number;
  /** The area content must stay inside, in px. */
  safe: { top: number; bottom: number; left: number; right: number };
}

/**
 * Draw the card. Measures first, shrinking until everything fits the safe
 * area, then draws it centred there.
 */
export function drawLockScreen(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  plan: Plan,
  fields: Fields,
  layout: Layout,
  faces: Face[],
): DrawResult {
  const { width, height } = PRESETS[preset];
  const margin = Math.round(width * 0.08);
  const safe = { top: Math.round(height * CLEAR_TOP), bottom: Math.round(height * (1 - CLEAR_BOTTOM)), left: margin, right: width - margin };

  const run = (scale: number, draw: boolean, startY: number) => {
    const pen: Pen = { ctx, draw, boxes: [], left: safe.left, right: safe.right, y: startY, u: (width / 1080) * scale };
    if (layout === "faces") drawFaces(pen, faces);
    else drawText(pen, plan, fields);
    return pen;
  };

  let scale = 1;
  let measured = run(scale, false, 0);
  while (measured.y > safe.bottom - safe.top && scale > 0.4) {
    scale = Math.round((scale - 0.05) * 100) / 100;
    measured = run(scale, false, 0);
  }

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, width, height);
  const startY = safe.top + Math.max(0, (safe.bottom - safe.top - measured.y) / 2);
  const drawn = run(scale, true, startY);
  return { boxes: drawn.boxes, scale, safe };
}

/** A file name like waqt-pe-emergency-ammi-1170x2532.png. */
export function lockScreenFileName(plan: Plan, preset: Preset): string {
  const slug = plan.person.name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const { width, height } = PRESETS[preset];
  return `waqt-pe-emergency-${slug ? `${slug}-` : ""}${width}x${height}.png`;
}
