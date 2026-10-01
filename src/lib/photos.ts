"use client";

// Photos of boxes and faces. They stay on this device, in IndexedDB; the plan
// (and so the link) only holds their ids. SPEC.md → Privacy.

import { useEffect, useState } from "react";
import { del, get, set } from "idb-keyval";
import { newId } from "./plan";
import { SAMPLE_PHOTOS, isSamplePhoto } from "./sample";

const KEY = (id: string) => `photo:${id}`;
const MAX_EDGE = 1000; // px. A 30 mm print at 300 dpi needs about 350 px.
const QUALITY = 0.8;

/** Stored as bytes plus type: some older Safari versions can't store Blobs. */
interface StoredPhoto {
  type: string;
  data: ArrayBuffer;
}

// Lets thumbnails reload when photos arrive (for example from an imported file).
let version = 0;
const listeners = new Set<() => void>();
function changed() {
  version++;
  listeners.forEach((l) => l());
}

export class PhotoError extends Error {
  constructor(public reason: "unreadable" | "storage") {
    super(reason);
  }
}

async function decode(file: Blob): Promise<{ source: CanvasImageSource; width: number; height: number; done: () => void }> {
  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, done: () => bitmap.close() };
    } catch {
      // Fall through to <img>, which handles a few more formats on some phones.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
  } catch {
    URL.revokeObjectURL(url);
    throw new PhotoError("unreadable");
  }
}

/** Shrink a camera photo so it's quick to store and small in the saved file. */
export async function compressPhoto(file: Blob): Promise<Blob> {
  const { source, width, height, done } = await decode(file);
  try {
    if (!width || !height) throw new PhotoError("unreadable");
    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new PhotoError("unreadable");
    ctx.fillStyle = "#ffffff"; // transparent PNGs become white, not black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
    if (!blob) throw new PhotoError("unreadable");
    return blob;
  } finally {
    done();
  }
}

export async function putPhoto(id: string, blob: Blob): Promise<void> {
  if (isSamplePhoto(id)) return; // bundled with the app; never stored
  try {
    await set(KEY(id), { type: blob.type || "image/jpeg", data: await blob.arrayBuffer() } satisfies StoredPhoto);
  } catch {
    throw new PhotoError("storage");
  }
  changed();
}

/** Compress and store a new photo. Returns its id for the plan. */
export async function addPhoto(file: Blob): Promise<string> {
  const blob = await compressPhoto(file);
  const id = newId();
  await putPhoto(id, blob);
  return id;
}

export async function getPhoto(id: string): Promise<Blob | undefined> {
  // The demo plan's box photos ship with the app (same origin, no user data).
  if (isSamplePhoto(id)) {
    try {
      const res = await fetch(SAMPLE_PHOTOS[id]);
      // Typed explicitly so canvases and <img> decode it whatever the server says.
      return res.ok ? new Blob([await res.arrayBuffer()], { type: "image/png" }) : undefined;
    } catch {
      return undefined;
    }
  }
  try {
    const stored = await get<StoredPhoto>(KEY(id));
    return stored ? new Blob([stored.data], { type: stored.type }) : undefined;
  } catch {
    return undefined;
  }
}

export async function deletePhoto(id: string | undefined): Promise<void> {
  if (!id || isSamplePhoto(id)) return;
  try {
    await del(KEY(id));
  } catch {
    // Nothing stored, or storage blocked; either way it's gone.
  }
  changed();
}

export type PhotoState = { status: "loading" } | { status: "none" } | { status: "missing" } | { status: "ready"; url: string };

/**
 * An object URL for a stored photo. "missing" means the plan names a photo
 * this device doesn't have (the link was opened on another device).
 */
export function usePhoto(id: string | undefined): PhotoState {
  const [state, setState] = useState<PhotoState>(id ? { status: "loading" } : { status: "none" });
  const v = useVersion();

  useEffect(() => {
    if (!id) {
      setState({ status: "none" });
      return;
    }
    let url: string | undefined;
    let live = true;
    getPhoto(id).then((blob) => {
      if (!live) return;
      if (!blob) return setState({ status: "missing" });
      url = URL.createObjectURL(blob);
      setState({ status: "ready", url });
    });
    return () => {
      live = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [id, v]);

  return state;
}

/** Which of these photo ids this device doesn't have. */
export async function missingPhotos(ids: string[]): Promise<string[]> {
  const found = await Promise.all(ids.map(async (id) => ((await getPhoto(id)) ? null : id)));
  return found.filter((x): x is string => !!x);
}

/** Every photo id a plan refers to. */
export function photoIds(plan: { medicines: { photoId?: string }[]; contacts: { photoId?: string }[] }): string[] {
  return [...plan.medicines, ...plan.contacts].map((x) => x.photoId).filter((x): x is string => !!x);
}

/** Changes whenever photos are stored or deleted on this device. */
export function useVersion() {
  const [v, setV] = useState(version);
  useEffect(() => {
    const listener = () => setV(version);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return v;
}
