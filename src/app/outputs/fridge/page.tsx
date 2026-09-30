"use client";

// The fridge sheet screen: preview both pages exactly as they print, choose
// paper, and print. Printing is blocked until every medicine is checked, and
// a changed plan prints as the next version with the next border colour.

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/Button";
import { ChoiceChip } from "@/components/ChoiceChip";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MissingPhotosNotice } from "@/components/MissingPhotosNotice";
import { Notice } from "@/components/Notice";
import { BackArrow } from "@/components/icons";
import { SchedulePage, TickGridPage } from "@/components/sheets/FridgeSheet";
import { SheetFrame } from "@/components/sheets/SheetFrame";
import { fill, useT, type MessageKey } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { VERSION_BORDER_COLOURS, canPrint, type FoodVariant, type Paper, type TickVariant } from "@/lib/plan";
import { PAGE_MARGIN_MM, PAPER, changedSinceLastPrint, printDate, recordPrint, upcomingVersion } from "@/lib/sheet";
import { OUTPUTS_PATH, stepPath } from "@/lib/steps";

const colourName: Record<string, MessageKey> = {
  [VERSION_BORDER_COLOURS[0]]: "borderIndigo",
  [VERSION_BORDER_COLOURS[1]]: "borderTeal",
  [VERSION_BORDER_COLOURS[2]]: "borderMaroon",
  [VERSION_BORDER_COLOURS[3]]: "borderOlive",
};

type Part = "all" | "grid";

export default function FridgeSheetScreen() {
  const t = useT();
  const { plan, setPlan, status, go } = usePlan();
  const [part, setPart] = useState<Part>("all");
  const [printed, setPrinted] = useState<Part | null>(null);
  const [research, setResearch] = useState(false);
  // Research overrides: local to this screen, never saved to the plan.
  const [foodOverride, setFoodOverride] = useState<FoodVariant | null>(null);
  const [tickOverride, setTickOverride] = useState<TickVariant | null>(null);

  useEffect(() => {
    setResearch(new URLSearchParams(window.location.search).get("research") === "1");
  }, []);

  const unlocked = canPrint(plan);
  const version = upcomingVersion(plan);
  const today = new Date();
  const foodVariant = foodOverride ?? plan.settings.foodVariant;
  const tickVariant = tickOverride ?? plan.settings.tickVariant;
  const colour = t(colourName[version.borderColour] ?? "borderIndigo");

  // However printing starts (button or the browser's own Print), record it
  // first, so the sheet carries the right version and date.
  useEffect(() => {
    if (!unlocked) return;
    const before = () => flushSync(() => setPlan((p) => recordPrint(p)));
    window.addEventListener("beforeprint", before);
    return () => window.removeEventListener("beforeprint", before);
  }, [unlocked, setPlan]);

  const print = (which: Part) => {
    // Record here as well as on beforeprint: not every browser fires it.
    // Recording twice is harmless (an unchanged sheet keeps its version).
    flushSync(() => {
      setPlan((p) => recordPrint(p));
      setPart(which);
    });
    window.print();
    setPrinted(which);
    setPart("all");
  };

  const paper = PAPER[plan.settings.paper];
  const sheet = { plan, version, date: today, foodVariant, tickVariant };

  let versionNote: string;
  if (!plan.sheetVersion.printedAt) versionNote = fill(t("versionFirst"), { colour });
  else if (changedSinceLastPrint(plan))
    versionNote = fill(t("versionChanged"), { old: plan.sheetVersion.number, n: version.number, colour });
  else versionNote = fill(t("versionSame"), { n: version.number, date: printDate(new Date(plan.sheetVersion.printedAt)) });

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-4 print:block print:max-w-none print:p-0">
      <style>{`@page { size: ${paper.css} portrait; margin: ${PAGE_MARGIN_MM}mm; }`}</style>
      <div className="flex items-center justify-between gap-4 pt-3 print:hidden">
        <button type="button" onClick={() => go("/")} className="min-h-12 rounded-button type-helper font-bold text-ink">
          {t("appName")}
        </button>
        <LanguageToggle />
      </div>
      <div className="pt-2 print:hidden">
        <button
          type="button"
          onClick={() => go(OUTPUTS_PATH)}
          className="-ms-3 inline-flex min-h-12 items-center gap-1 rounded-button px-3 type-body font-bold text-primary"
        >
          <BackArrow size={20} />
          {t("back")}
        </button>
      </div>

      {status === "loading" ? (
        <p role="status" className="grow py-8 text-ink-soft">
          {t("loading")}
        </p>
      ) : !unlocked ? (
        <main className="flex grow flex-col gap-6 pb-12 pt-2 print:hidden">
          <h1 className="type-question">{t("outputFridge")}</h1>
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
          <main className="flex grow flex-col gap-6 pb-12 pt-2 print:block print:p-0">
            <div className="flex flex-col gap-4 print:hidden">
              <h1 className="type-question">{t("outputFridge")}</h1>
              <MissingPhotosNotice />
              {printed && (
                <Notice tone="success" role="status">
                  {printed === "grid"
                    ? t("gridReady")
                    : fill(t("fridgeReady"), { n: plan.sheetVersion.number, colour })}
                </Notice>
              )}
              <Notice>{versionNote}</Notice>

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
                <p className="type-helper text-ink-soft">{t("printHelp")}</p>
              </fieldset>

              {research && (
                <section aria-labelledby="research" data-research className="flex flex-col gap-3 rounded-card border-2 border-dashed border-primary bg-surface p-4">
                  <h2 id="research" className="type-heading">
                    {t("researchTitle")}
                  </h2>
                  <p className="type-helper text-ink-soft">{t("researchBody")}</p>
                  <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 type-body font-bold">{t("researchFood")}</legend>
                    <div className="flex flex-wrap gap-2">
                      {(["sequence", "plate"] as FoodVariant[]).map((v) => (
                        <ChoiceChip
                          key={v}
                          type="radio"
                          name="food-variant"
                          label={t(v === "sequence" ? "foodSequence" : "foodPlate")}
                          checked={foodVariant === v}
                          onChange={() => setFoodOverride(v)}
                        />
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 type-body font-bold">{t("researchTick")}</legend>
                    <div className="flex flex-wrap gap-2">
                      {(["weekSheet", "colourColumns"] as TickVariant[]).map((v) => (
                        <ChoiceChip
                          key={v}
                          type="radio"
                          name="tick-variant"
                          label={t(v === "weekSheet" ? "tickWeekSheet" : "tickColourColumns")}
                          checked={tickVariant === v}
                          onChange={() => setTickOverride(v)}
                        />
                      ))}
                    </div>
                  </fieldset>
                </section>
              )}
            </div>

            <section className={`flex flex-col gap-2 ${part === "grid" ? "print:hidden" : ""}`}>
              <h2 className="type-heading print:hidden">{t("page1Label")}</h2>
              <SheetFrame>
                <SchedulePage {...sheet} />
              </SheetFrame>
            </section>
            <section className="flex flex-col gap-2">
              <h2 className="type-heading print:hidden">{t("page2Label")}</h2>
              <SheetFrame>
                <TickGridPage {...sheet} breakBefore={part !== "grid"} />
              </SheetFrame>
            </section>
            <Button variant="secondary" full onClick={() => print("grid")} className="print:hidden">
              {t("printGrid")}
            </Button>
          </main>
          <div className="sticky bottom-0 -mx-4 border-t-[1.5px] border-line bg-paper px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 print:hidden">
            <Button full onClick={() => print("all")}>
              {t("printFridge")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
