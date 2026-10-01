"use client";

// UI language and document direction. The chosen language is a per-device
// preference (localStorage), not part of the plan, so it never goes in the link.
// Urdu strings need native review before launch.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { messages, type MessageKey } from "./messages";
import { textDir } from "./text-direction";

export { textDir };

export { messages, type MessageKey };

export type Lang = "en" | "ur";

export const LANG_STORAGE_KEY = "waqtpe.lang";

export const dirFor = (lang: Lang) => (lang === "ur" ? "rtl" : "ltr");

/**
 * Runs before first paint (inlined in <head>) so an Urdu reader never sees a
 * flash of left-to-right layout. First-party inline script, no network.
 */
export const langBootScript = `try{var l=localStorage.getItem("${LANG_STORAGE_KEY}");if(l==="ur"){document.documentElement.lang="ur";document.documentElement.dir="rtl"}}catch(e){}`;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (document.documentElement.lang === "ur") setLangState("ur");
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
    document.documentElement.dir = dirFor(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Storage blocked; the choice lasts for this visit only.
    }
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Pick the string for the current UI language. */
export function useT() {
  const { lang } = useLang();
  return useCallback((key: MessageKey) => messages[key][lang], [lang]);
}

/** Fill {placeholders}. Values are inserted as plain text. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
}

/**
 * Like fill(), for names inside sentences. A value written in the other
 * direction from the sentence (an Urdu name in English copy, or the reverse)
 * is wrapped in <bdi> so the sentence keeps its order. Same-direction values
 * stay plain text, because <bdi> adds a pause to the accessible name.
 */
export function fillNodes(template: string, values: Record<string, string>, dir: "ltr" | "rtl"): ReactNode {
  const needsIsolation = Object.values(values).some((v) => {
    const d = textDir(v);
    return d !== undefined && d !== dir;
  });
  if (!needsIsolation) return fill(template, values);
  return template.split(/(\{\w+\})/).map((part, i) => {
    const m = /^\{(\w+)\}$/.exec(part);
    return m ? <bdi key={i}>{values[m[1]]}</bdi> : part;
  });
}

/** fillNodes() for the current interface direction. */
export function useFillNodes() {
  const { lang } = useLang();
  return useCallback(
    (template: string, values: Record<string, string>) => fillNodes(template, values, dirFor(lang)),
    [lang],
  );
}
