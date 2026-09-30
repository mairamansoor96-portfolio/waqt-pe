"use client";

// Loads the plan from the URL hash and autosaves every change back to it.
// Uses replaceState so typing doesn't fill the back button with history, and
// debounces because Safari throws if replaceState runs too often.

import { useCallback, useEffect, useRef, useState } from "react";
import { createEmptyPlan, type Plan } from "./plan";
import { decodePlan, encodePlan } from "./hash";

const SAVE_DELAY_MS = 250;

export type LoadStatus = "loading" | "new" | "restored" | "invalid";

export function usePlan() {
  const [plan, setPlanState] = useState<Plan>(createEmptyPlan);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const lastWritten = useRef<string>("");
  const timer = useRef<number | undefined>(undefined);
  const pending = useRef<Plan | null>(null);

  const load = useCallback(() => {
    const hash = window.location.hash;
    if (hash && hash.slice(1) === lastWritten.current) return; // our own write
    const result = decodePlan(hash);
    if (result.status === "ok") {
      setPlanState(result.plan);
      setStatus("restored");
    } else {
      setPlanState(createEmptyPlan());
      setStatus(result.status === "invalid" ? "invalid" : "new");
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, [load]);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    const next = pending.current;
    if (!next) return;
    pending.current = null;
    const encoded = encodePlan(next);
    lastWritten.current = encoded;
    try {
      const { pathname, search } = window.location;
      window.history.replaceState(window.history.state, "", `${pathname}${search}#${encoded}`);
    } catch {
      // Rate-limited by the browser; the next change will write again.
      pending.current = next;
    }
  }, []);

  // Save before the page goes away so a quick reload never loses the last edit.
  useEffect(() => {
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [flush]);

  const setPlan = useCallback(
    (update: Plan | ((current: Plan) => Plan)) => {
      setPlanState((current) => {
        const next = typeof update === "function" ? update(current) : update;
        pending.current = next;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(flush, SAVE_DELAY_MS);
        return next;
      });
    },
    [flush],
  );

  /** Forget the plan: empty state and a bare URL. */
  const resetPlan = useCallback(() => {
    window.clearTimeout(timer.current);
    pending.current = null;
    lastWritten.current = "";
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, "", `${pathname}${search}`);
    setPlanState(createEmptyPlan());
    setStatus("new");
  }, []);

  return { plan, setPlan, resetPlan, status, flush };
}
