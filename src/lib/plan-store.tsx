"use client";

// The plan, shared by every screen. It lives in the URL hash: loaded from it
// on first open, and written back on every change. replaceState keeps typing
// out of the back button's history; the write is debounced because Safari
// throws if replaceState runs too often.
//
// Sample mode: a `#sample` link shows the demo plan from memory. Nothing is
// written to the link or to IndexedDB while it's open, and the family's own
// plan rides along untouched in the link (`#sample&p=…`) until they leave.

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createEmptyPlan, type Plan } from "./plan";
import { decodePlan, encodePlan, parseSampleHash, sampleHash } from "./hash";
import { demoPlan } from "./sample";

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
  /** True while the demo plan is showing (a `#sample` link). */
  sample: boolean;
  /** Open the demo plan at this path, keeping the family's own plan aside. */
  enterSample: (path: string) => void;
  /** Leave the demo plan for this path, back to the family's own plan. */
  exitSample: (path: string) => void;
}

/** Sample mode is only for looking at the outputs. */
const SAMPLE_ROOT = "/outputs/";

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
  const sampleRef = useRef<{ back: string } | null>(null);
  const [sample, setSample] = useState(false);

  const showSample = useCallback((back: string) => {
    window.clearTimeout(timer.current);
    const demo = demoPlan();
    sampleRef.current = { back };
    planRef.current = demo;
    touched.current = false;
    dirty.current = false;
    lastWritten.current = sampleHash(back);
    setPlanState(demo);
    setSample(true);
    setStatus("restored");
  }, []);

  const load = useCallback(() => {
    const hash = window.location.hash;
    const s = parseSampleHash(hash);
    if (s) {
      if (!(sampleRef.current && hash.slice(1) === lastWritten.current)) showSample(s.back);
      return;
    }
    const wasSample = !!sampleRef.current;
    sampleRef.current = null;
    setSample(false);
    if (!wasSample && hash && hash.slice(1) === lastWritten.current) return; // our own write
    const result = decodePlan(hash);
    const next = result.status === "ok" ? result.plan : createEmptyPlan();
    planRef.current = next;
    touched.current = result.status === "ok";
    lastWritten.current = hash.slice(1);
    setPlanState(next);
    setStatus(result.status === "ok" ? "restored" : result.status === "invalid" ? "invalid" : "new");
  }, [showSample]);

  useEffect(() => {
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, [load]);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    if (sampleRef.current || !dirty.current || !touched.current) return;
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
    if (status === "loading") return;
    // The back button can cross between the sample and the family's own plan.
    if (!!parseSampleHash(window.location.hash) !== !!sampleRef.current) return load();
    if (sampleRef.current) {
      if (!pathname.startsWith(SAMPLE_ROOT)) router.replace(`${SAMPLE_ROOT}#${sampleHash(sampleRef.current.back)}`);
      return;
    }
    if (!touched.current) return;
    dirty.current = true;
    flush();
  }, [pathname, status, flush, load, router]);

  const setPlan = useCallback<PlanStore["setPlan"]>(
    (update) => {
      const next = typeof update === "function" ? update(planRef.current) : update;
      planRef.current = next;
      if (sampleRef.current) return setPlanState(next); // memory only
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
      if (sampleRef.current) {
        const url = `${path}#${sampleHash(sampleRef.current.back)}`;
        if (options?.replace) router.replace(url);
        else router.push(url);
        return;
      }
      const encoded = touched.current ? encodePlan(planRef.current) : "";
      lastWritten.current = encoded;
      dirty.current = false;
      const url = encoded ? `${path}#${encoded}` : path;
      if (options?.replace) router.replace(url);
      else router.push(url);
    },
    [router],
  );

  const enterSample = useCallback(
    (path: string) => {
      const back = sampleRef.current ? sampleRef.current.back : touched.current ? encodePlan(planRef.current) : "";
      showSample(back);
      router.push(`${path}#${sampleHash(back)}`);
    },
    [router, showSample],
  );

  const exitSample = useCallback(
    (path: string) => {
      const back = sampleRef.current?.back ?? "";
      sampleRef.current = null;
      setSample(false);
      const result = decodePlan(back);
      const next = result.status === "ok" ? result.plan : createEmptyPlan();
      planRef.current = next;
      touched.current = result.status === "ok";
      dirty.current = false;
      lastWritten.current = back;
      setPlanState(next);
      setStatus(result.status === "ok" ? "restored" : "new");
      router.push(back ? `${path}#${back}` : path);
    },
    [router],
  );

  return (
    <PlanContext.Provider value={{ plan, setPlan, resetPlan, go, status, flush, sample, enterSample, exitSample }}>
      {children}
    </PlanContext.Provider>
  );
}
