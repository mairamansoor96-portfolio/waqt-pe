"use client";

import { ChoiceCard } from "@/components/ChoiceCard";
import { SetupScreen, useNamed } from "@/components/SetupScreen";
import { useT, type MessageKey } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { ANCHOR_MODES, DEFAULT_ANCHOR_LABELS, SLOTS, type AnchorMode, type Bilingual, type Slot } from "@/lib/plan";
import { slotText, slotTint } from "@/lib/slots";
import { AnchorModeIcon, TimeOfDay } from "@/pictograms";

const modeText: Record<AnchorMode, [MessageKey, MessageKey]> = {
  meals: ["anchorMeals", "anchorMealsHelp"],
  prayers: ["anchorPrayers", "anchorPrayersHelp"],
  clock: ["anchorClock", "anchorClockHelp"],
};

const labelInput =
  "block min-h-12 w-full min-w-0 rounded-input border-2 border-line bg-surface px-3 py-1 type-body text-ink focus-visible:border-primary";

export default function AnchorsStep() {
  const t = useT();
  const named = useNamed();
  const { plan, setPlan } = usePlan();
  const { mode, labels } = plan.anchors;

  const setLabel = (slot: Slot, lang: keyof Bilingual, value: string) =>
    setPlan((p) => ({
      ...p,
      anchors: { ...p.anchors, labels: { ...p.anchors.labels, [slot]: { ...p.anchors.labels[slot], [lang]: value } } },
    }));

  return (
    <SetupScreen step="anchors" question={named("qAnchorsNamed", "qAnchors")} help={t("anchorsHelp")}>
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">{named("qAnchorsNamed", "qAnchors")}</legend>
        {ANCHOR_MODES.map((m) => (
          <ChoiceCard
            key={m}
            name="anchors"
            value={m}
            checked={mode === m}
            onChange={() =>
              setPlan((p) => ({ ...p, anchors: { mode: m, labels: structuredClone(DEFAULT_ANCHOR_LABELS[m]) } }))
            }
            icon={<AnchorModeIcon mode={m} size={40} />}
            label={t(modeText[m][0])}
            help={t(modeText[m][1])}
          />
        ))}
      </fieldset>

      <section aria-labelledby="labels" className="flex flex-col gap-3">
        <h2 id="labels" className="type-heading">
          {t("labelsHeading")}
        </h2>
        <p className="type-helper text-ink-soft">{t("labelsHelp")}</p>
        <ul className="flex flex-col gap-3">
          {SLOTS.map((s) => (
            <li key={s} className={`frame flex flex-col gap-2 rounded-card p-3 ${slotTint[s]}`}>
              <div className="flex items-center gap-3">
                <TimeOfDay slot={s} size={40} />
                <span className="type-body font-bold">{t(slotText[s])}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
                <label className="flex min-w-0 flex-col gap-1">
                  <span className="type-helper">{t("labelEn")}</span>
                  <input
                    lang="en"
                    dir="ltr"
                    value={labels[s].en}
                    maxLength={60}
                    autoComplete="off"
                    onChange={(e) => setLabel(s, "en", e.target.value)}
                    className={labelInput}
                  />
                </label>
                <label className="flex min-w-0 flex-col gap-1">
                  <span className="type-helper">{t("labelUr")}</span>
                  <input
                    lang="ur"
                    dir="rtl"
                    value={labels[s].ur}
                    maxLength={60}
                    autoComplete="off"
                    onChange={(e) => setLabel(s, "ur", e.target.value)}
                    className={`${labelInput} font-urdu`}
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </SetupScreen>
  );
}
