// Plan ⇄ URL hash. The hash (the part after #) is never sent to a server by
// the browser, which is what makes the private link private. Text only:
// photos are referenced by id and stay in IndexedDB.

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { sanitisePlan } from "./sanitise";
import type { Plan } from "./plan";

const PREFIX = "p=";

export type DecodeResult =
  | { status: "empty" }
  | { status: "ok"; plan: Plan }
  | { status: "invalid" };

export function encodePlan(plan: Plan): string {
  return PREFIX + compressToEncodedURIComponent(JSON.stringify(plan));
}

/** Accepts a hash with or without the leading "#". */
export function decodePlan(hash: string): DecodeResult {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return { status: "empty" };
  if (!raw.startsWith(PREFIX)) return { status: "invalid" };
  try {
    const json = decompressFromEncodedURIComponent(raw.slice(PREFIX.length));
    if (!json) return { status: "invalid" };
    return { status: "ok", plan: sanitisePlan(JSON.parse(json)) };
  } catch {
    return { status: "invalid" };
  }
}
