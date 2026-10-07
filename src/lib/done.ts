"use client";

// Which outputs the family has already used (printed, copied or saved), for
// the outputs hub's "what's left to do". Kept in IndexedDB with a fingerprint
// of the plan: once the plan changes, every done state is void, because the
// old sheets, stickers and scripts no longer match it. Sample mode keeps them
// in memory only, like everything else in the sample.

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { del, get, set } from "idb-keyval";
import { usePlan } from "./plan-store";
import { planFingerprint } from "./sheet";

export type OutputId = "fridge" | "stickers" | "voice" | "lockscreen" | "doctor";

export interface DoneRecord {
  /** planFingerprint() of the plan these outputs were made from. */
  fingerprint: string;
  /** When each output's main action was last used (ISO date). */
  done: Partial<Record<OutputId, string>>;
}

export const DONE_KEY = "waqtpe.done";

/** The done states that still apply to this plan: none if it has changed since. */
export function doneFor(record: DoneRecord | undefined, fingerprint: string): DoneRecord["done"] {
  return record && record.fingerprint === fingerprint ? record.done : {};
}

/** Mark one output done (or not), dropping states left over from an older plan. */
export function withDone(record: DoneRecord | undefined, fingerprint: string, id: OutputId, at: Date | null): DoneRecord {
  const done = { ...doneFor(record, fingerprint) };
  if (at) done[id] = at.toISOString();
  else delete done[id];
  return { fingerprint, done };
}

// One shared copy, so the hub and the output screens agree without reloading.
let stored: DoneRecord | undefined;
let sampleRecord: DoneRecord | undefined;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

async function load() {
  if (loaded) return;
  loaded = true;
  try {
    const value = await get<DoneRecord>(DONE_KEY);
    if (value && typeof value.fingerprint === "string" && value.done && typeof value.done === "object") stored = value;
  } catch {
    // IndexedDB unavailable: done states last for this visit only.
  }
  emit();
}

/** Forget everything (after "Clear everything on this device"). */
export async function clearDone() {
  stored = undefined;
  sampleRecord = undefined;
  emit();
  try {
    await del(DONE_KEY);
  } catch {
    // Nothing stored.
  }
}

export function useDone() {
  const { plan, sample } = usePlan();
  const fingerprint = planFingerprint(plan);
  const record = useSyncExternalStore(
    subscribe,
    () => (sample ? sampleRecord : stored),
    () => undefined,
  );

  useEffect(() => {
    load();
  }, []);

  const change = useCallback(
    (id: OutputId, at: Date | null) => {
      if (sample) {
        sampleRecord = withDone(sampleRecord, fingerprint, id, at);
        emit();
        return;
      }
      stored = withDone(stored, fingerprint, id, at);
      emit();
      set(DONE_KEY, stored).catch(() => {
        // Storage blocked: it still shows for this visit.
      });
    },
    [sample, fingerprint],
  );

  const done = doneFor(record, fingerprint);
  return {
    /** When each output was done, for this version of the plan. */
    done: Object.fromEntries(Object.entries(done).map(([k, v]) => [k, new Date(v)])) as Partial<Record<OutputId, Date>>,
    markDone: useCallback((id: OutputId) => change(id, new Date()), [change]),
    undo: useCallback((id: OutputId) => change(id, null), [change]),
  };
}
