// "Clear everything on this device" (SPEC.md → Privacy rules).
// Deletes IndexedDB data (photos, and the hub's done states) and local preferences.

import { clear } from "idb-keyval";
import { clearDone } from "./done";

export async function clearDevice(): Promise<void> {
  try {
    await clear();
  } catch {
    // IndexedDB unavailable (private mode on some browsers): nothing stored there.
  }
  await clearDone(); // the hub's done states, kept in memory too
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {
    // Storage blocked: nothing stored there either.
  }
}
