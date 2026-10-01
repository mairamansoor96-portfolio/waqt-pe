"use client";

import type { ReactNode } from "react";
import { AppHeader, BottomBar } from "../AppHeader";
import { Button } from "../Button";
import { ChoiceChip } from "../ChoiceChip";
import { LanguageToggle } from "../LanguageToggle";
import { MissingPhotosNotice } from "../MissingPhotosNotice";
import { Notice } from "../Notice";
import { SampleNotice } from "../SampleNotice";
import { useT } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { canPrint, type Paper } from "@/lib/plan";
import { PAGE_MARGIN_MM, PAPER } from "@/lib/sheet";
import { OUTPUTS_PATH, stepPath } from "@/lib/steps";

/**
 * The screen around a printed output: back to the sheets, the lock until every
 * medicine is checked, paper size, the preview, and the print button in the
 * sticky bar. In print, only the sheets inside `children` appear.
 */
export function OutputShell({
  title,
  needsReview = true,
  controls,
  printHelp,
  children,
  after,
  printLabel,
  onPrint,
  paperChoice = true,
}: {
  title: ReactNode;
  needsReview?: boolean;
  /** Notices and choices above the preview (hidden in print). */
  controls?: ReactNode;
  printHelp?: ReactNode;
  /** The preview; its sheets are what prints. */
  children: ReactNode;
  /** Extra actions below the preview (hidden in print). */
  after?: ReactNode;
  /** Without these, there's no print button (for outputs that aren't printed). */
  printLabel?: ReactNode;
  onPrint?: () => void;
  /** False for outputs that aren't printed, like the voice-note script. */
  paperChoice?: boolean;
}) {
  const t = useT();
  const { plan, setPlan, status, go, sample, exitSample } = usePlan();
  const locked = needsReview && !canPrint(plan);

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-4 print:block print:max-w-none print:p-0">
      <style>{`@page { size: ${PAPER[plan.settings.paper].css} portrait; margin: ${PAGE_MARGIN_MM}mm; }`}</style>
      <AppHeader className="print:hidden" onBack={() => go(OUTPUTS_PATH)} onHome={() => (sample ? exitSample("/") : go("/"))} end={<LanguageToggle />} />

      {status === "loading" ? (
        <p role="status" className="grow py-8 text-ink-soft">
          {t("loading")}
        </p>
      ) : locked ? (
        <main className="flex grow flex-col gap-6 pb-12 pt-4 print:hidden">
          <h1 className="type-question">{title}</h1>
          <Notice tone="warning" title={t("outputsLockedTitle")}>
            <div className="flex flex-col gap-3">
              <p>{plan.medicines.length ? t("outputsLockedBody") : t("outputsNoMedicines")}</p>
              <Button variant="secondary" onClick={() => go(stepPath(plan.medicines.length ? "review" : "medicines"))}>
                {t(plan.medicines.length ? "goReview" : "goMedicines")}
              </Button>
            </div>
          </Notice>
        </main>
      ) : (
        <>
          <main className="flex grow flex-col gap-6 pb-12 pt-4 print:block print:p-0">
            <div className="flex flex-col gap-4 print:hidden">
              <h1 className="type-question">{title}</h1>
              <SampleNotice />
              <MissingPhotosNotice />
              {controls}
              {paperChoice && (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 type-heading">{t("paperLabel")}</legend>
                <div className="flex flex-wrap gap-2">
                  {(["A4", "Letter"] as Paper[]).map((p) => (
                    <ChoiceChip
                      key={p}
                      type="radio"
                      name="paper"
                      label={t(p === "A4" ? "paperA4" : "paperLetter")}
                      checked={plan.settings.paper === p}
                      onChange={() => setPlan((pl) => ({ ...pl, settings: { ...pl.settings, paper: p } }))}
                    />
                  ))}
                </div>
                <p className="type-helper text-ink-soft">{printHelp}</p>
              </fieldset>
              )}
            </div>
            {children}
            {after && <div className="flex flex-col gap-3 print:hidden">{after}</div>}
          </main>
          {onPrint && (
            <BottomBar className="print:hidden">
              <Button full onClick={onPrint}>
                {printLabel}
              </Button>
            </BottomBar>
          )}
        </>
      )}
    </div>
  );
}
