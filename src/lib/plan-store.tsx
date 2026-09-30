"use client";

// The plan, shared by every screen. It lives in the URL hash: loaded from it
// on first open, and written back on every change. replaceState keeps typing
// out of the back button's history; the write is debounced because Safari
// throws if replaceState runs too often.

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createEmptyPlan, type Plan } from "./plan";
import { decodePlan, encodePlan } from "./hash";

const SAVE_DELAY_MS = 250;

export type LoadStatus = "loading" | "new" | "restored" | "invalid";

interface PlanStore {
  plan: Plan;
  setPlan: (update: Plan | ((current: Plan) => Plan)) => void;
  /** Forget the plan: empty state and a bare URL. */
  resetPlan: () => void;
  /** Go to another screen, carrying the plan in the link. */
  go: (path: string, options?: { replace?: boolean }) => void;
  status: LoadStatus;
  /** Write any pending change to the link now. */
  flush: () => void;
}

const PlanContext = createContext<PlanStore | null>(null);

export function usePlan(): PlanStore {
  const store = useContext(PlanContext);
  if (!store) throw new Error("usePlan must be used inside PlanProvider");
  return store;
}

function writeHash(encoded: string) {
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, "", `${pathname}${search}${encoded ? `#${encoded}` : ""}`);
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [plan, setPlanState] = useState<Plan>(createEmptyPlan);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const planRef = useRef(plan);
  const touched = useRef(false); // has this plan ever been edited or loaded?
  const lastWritten = useRef("");
  const timer = useRef<number | undefined>(undefined);
  const dirty = useRef(false);

  const load = useCallback(() => {
    const hash = window.location.hash;
    if (hash && hash.slice(1) === lastWritten.current) return; // our own write
    const result = decodePlan(hash);
    const next = result.status === "ok" ? result.plan : createEmptyPlan();
    planRef.current = next;
    touched.current = result.status === "ok";
    lastWritten.current = hash.slice(1);
    setPlanState(next);
    setStatus(result.status === "ok" ? "restored" : result.status === "invalid" ? "invalid" : "new");
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, [load]);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    if (!dirty.current || !touched.current) return;
    const encoded = encodePlan(planRef.current);
    try {
      writeHash(encoded);
      lastWritten.current = encoded;
      dirty.current = false;
    } catch {
      // Rate-limited by the browser; the next change will write again.
    }
  }, []);

  // Save before the page goes away so a quick reload never loses the last edit.
  useEffect(() => {
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [flush]);

  // After moving between screens (including the browser's back button, which
  // restores an older link), make the link match the plan again.
  useEffect(() => {
    if (status === "loading" || !touched.current) return;
    dirty.current = true;
    flush();
  }, [pathname, status, flush]);

  const setPlan = useCallback<PlanStore["setPlan"]>(
    (update) => {
      const next = typeof update === "function" ? update(planRef.current) : update;
      planRef.current = next;
      touched.current = true;
      dirty.current = true;
      setPlanState(next);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, SAVE_DELAY_MS);
    },
    [flush],
  );

  const resetPlan = useCallback(() => {
    window.clearTimeout(timer.current);
    const empty = createEmptyPlan();
    planRef.current = empty;
    touched.current = false;
    dirty.current = false;
    lastWritten.current = "";
    writeHash("");
    setPlanState(empty);
    setStatus("new");
  }, []);

  const go = useCallback(
    (path: string, options?: { replace?: boolean }) => {
      window.clearTimeout(timer.current);
      const encoded = touched.current ? encodePlan(planRef.current) : "";
      lastWritten.current = encoded;
      dirty.current = false;
      const url = encoded ? `${path}#${encoded}` : path;
      if (options?.replace) router.replace(url);
      else router.push(url);
    },
    [router],
  );

  return (
    <PlanContext.Provider value={{ plan, setPlan, resetPlan, go, status, flush }}>{children}</PlanContext.Provider>
  );
}
