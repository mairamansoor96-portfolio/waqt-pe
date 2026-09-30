// "Clear everything on this device" (SPEC.md → Privacy rules).
// Deletes IndexedDB data (photos, from milestone 4) and local preferences.

import { clear } from "idb-keyval";

export async function clearDevice(): Promise<void> {
  try {
    await clear();
  } catch {
    // IndexedDB unavailable (private mode on some browsers): nothing stored there.
  }
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {
    // Storage blocked: nothing stored there either.
  }
}
