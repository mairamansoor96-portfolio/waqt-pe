"use client";

import { useLang, useT } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  const t = useT();
  const other = lang === "en" ? "ur" : "en";
  return (
    <button
      type="button"
      onClick={() => setLang(other)}
      aria-label={t("switchLangLabel")}
      className="inline-flex min-h-12 items-center rounded-button border-2 border-primary bg-surface px-4 text-primary"
    >
      {/* The label is in the other language, so mark it as such. */}
      <span lang={other} dir={other === "ur" ? "rtl" : "ltr"} className="type-helper font-bold">
        {t("switchLang")}
      </span>
    </button>
  );
}
