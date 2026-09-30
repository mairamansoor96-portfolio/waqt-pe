"use client";

// The "save a copy" file (.waqtpe): the plan plus its photos, as JSON with
// photos in base64. It's made and read entirely in the browser.

import { getPhoto, photoIds, putPhoto } from "./photos";
import { sanitisePlan } from "./sanitise";
import type { Plan } from "./plan";

const FORMAT = "waqtpe";
const VERSION = 1;
const MAX_FILE_BYTES = 40 * 1024 * 1024;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface SavedFile {
  format: typeof FORMAT;
  version: typeof VERSION;
  savedAt: string;
  plan: Plan;
  photos: Record<string, { type: string; data: string }>;
}

function toBase64(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i += 0x8000) binary += String.fromCharCode(...view.subarray(i, i + 0x8000));
  return btoa(binary);
}

function fromBase64(text: string): Uint8Array<ArrayBuffer> {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** A file name like waqt-pe-ammi-2026-09-30.waqtpe. */
export function backupFileName(plan: Plan, now = new Date()): string {
  const slug = plan.person.name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `waqt-pe-${slug ? `${slug}-` : ""}${now.toISOString().slice(0, 10)}.waqtpe`;
}

/** Everything in one file, photos included. Photos this device lacks are left out. */
export async function exportPlan(plan: Plan): Promise<{ blob: Blob; photoCount: number }> {
  const photos: SavedFile["photos"] = {};
  for (const id of photoIds(plan)) {
    const blob = await getPhoto(id);
    if (blob) photos[id] = { type: blob.type, data: toBase64(await blob.arrayBuffer()) };
  }
  const file: SavedFile = { format: FORMAT, version: VERSION, savedAt: new Date().toISOString(), plan, photos };
  // octet-stream, so browsers keep the .waqtpe name instead of adding .json.
  return { blob: new Blob([JSON.stringify(file)], { type: "application/octet-stream" }), photoCount: Object.keys(photos).length };
}

export type ImportError = "notSaveFile" | "tooBig";

export interface ReadBackup {
  plan: Plan;
  photos: Map<string, Blob>;
}

/** Read and check a saved file. Nothing is stored until applyBackup(). */
export async function readBackup(file: Blob): Promise<ReadBackup | ImportError> {
  if (file.size > MAX_FILE_BYTES) return "tooBig";
  let data: unknown;
  try {
    data = JSON.parse(await file.text());
  } catch {
    return "notSaveFile";
  }
  if (typeof data !== "object" || data === null) return "notSaveFile";
  const o = data as Record<string, unknown>;
  if (o.format !== FORMAT || typeof o.version !== "number" || o.version > VERSION) return "notSaveFile";

  const plan = sanitisePlan(o.plan);
  const wanted = new Set(photoIds(plan));
  const photos = new Map<string, Blob>();
  const raw = typeof o.photos === "object" && o.photos !== null ? (o.photos as Record<string, unknown>) : {};
  for (const [id, value] of Object.entries(raw)) {
    if (!wanted.has(id) || typeof value !== "object" || value === null) continue;
    const { type, data: b64 } = value as Record<string, unknown>;
    if (typeof type !== "string" || !PHOTO_TYPES.includes(type) || typeof b64 !== "string") continue;
    if (b64.length > (MAX_PHOTO_BYTES * 4) / 3 + 4) continue;
    try {
      photos.set(id, new Blob([fromBase64(b64)], { type }));
    } catch {
      // Damaged photo: skip it; the plan still imports.
    }
  }
  return { plan, photos };
}

/** Store the photos from a read backup on this device. */
export async function applyBackupPhotos(backup: ReadBackup): Promise<void> {
  for (const [id, blob] of backup.photos) await putPhoto(id, blob);
}

/** Start a download of a Blob with a given name. */
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
