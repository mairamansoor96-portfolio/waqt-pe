"use client";

// The fridge sheet screen: preview both pages exactly as they print, choose
// paper, and print. Printing is blocked until every medicine is checked, and
// a changed plan prints as the next version with the next border colour.

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/Button";
import { ChoiceChip } from "@/components/ChoiceChip";
import { Notice } from "@/components/Notice";
import { SchedulePage, TickGridPage } from "@/components/sheets/FridgeSheet";
import { OutputShell } from "@/components/sheets/OutputShell";
import { SheetFrame } from "@/components/sheets/SheetFrame";
import { fill, useT, type MessageKey } from "@/lib/i18n";
import { useDone } from "@/lib/done";
import { usePlan } from "@/lib/plan-store";
import { VERSION_BORDER_COLOURS, canPrint, type FoodVariant, type TickVariant } from "@/lib/plan";
import { changedSinceLastPrint, printDate, recordPrint, upcomingVersion } from "@/lib/sheet";

const colourName: Record<string, MessageKey> = {
  [VERSION_BORDER_COLOURS[0]]: "borderIndigo",
  [VERSION_BORDER_COLOURS[1]]: "borderTeal",
  [VERSION_BORDER_COLOURS[2]]: "borderMaroon",
  [VERSION_BORDER_COLOURS[3]]: "borderOlive",
};

type Part = "all" | "grid";

export default function FridgeSheetScreen() {
  const t = useT();
  const { plan, setPlan } = usePlan();
  const { markDone } = useDone();
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
    if (which === "all") markDone("fridge");
    setPrinted(which);
    setPart("all");
  };

  const sheet = { plan, version, date: new Date(), foodVariant, tickVariant };

  let versionNote: string;
  if (!plan.sheetVersion.printedAt) versionNote = fill(t("versionFirst"), { colour });
  else if (changedSinceLastPrint(plan))
    versionNote = fill(t("versionChanged"), { old: plan.sheetVersion.number, n: version.number, colour });
  else versionNote = fill(t("versionSame"), { n: version.number, date: printDate(new Date(plan.sheetVersion.printedAt)) });

  return (
    <OutputShell
      title={t("outputFridge")}
      printHelp={t("printHelp")}
      printLabel={t("printFridge")}
      onPrint={() => print("all")}
      controls={
        <>
          {printed && (
            <Notice tone="success" role="status">
              {printed === "grid" ? t("gridReady") : fill(t("fridgeReady"), { n: plan.sheetVersion.number, colour })}
            </Notice>
          )}
          <Notice>{versionNote}</Notice>
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
        </>
      }
      after={
        <Button variant="secondary" full onClick={() => print("grid")}>
          {t("printGrid")}
        </Button>
      }
    >
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
    </OutputShell>
  );
}
