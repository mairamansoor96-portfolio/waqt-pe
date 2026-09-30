"use client";

// Milestone 1: landing plus a temporary one-page editor for the basics, so the
// URL-hash state can be tried end to end. The one-question-per-screen setup
// flow replaces the editor in milestone 2.

import { useState } from "react";
import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Notice } from "@/components/Notice";
import { SelectField, TextArea, TextField } from "@/components/TextField";
import { Ur } from "@/components/Ur";
import { clearDevice } from "@/lib/device";
import { fillNodes, messages, useLang, useT } from "@/lib/i18n";
import { encodePlan } from "@/lib/hash";
import {
  ANCHOR_MODES,
  BLOOD_GROUPS,
  DEFAULT_ANCHOR_LABELS,
  GIVERS,
  SLOTS,
  isHelper,
  type AnchorMode,
  type Giver,
  type Plan,
  type Slot,
} from "@/lib/plan";
import { samplePlan } from "@/lib/sample";
import { usePlan } from "@/lib/usePlan";

const giverText: Record<Giver, [keyof typeof messages, keyof typeof messages]> = {
  self: ["giverSelf", "giverSelfHelp"],
  family: ["giverFamily", "giverFamilyHelp"],
  helperReads: ["giverHelperReads", "giverHelperReadsHelp"],
  helperNoRead: ["giverHelperNoRead", "giverHelperNoReadHelp"],
};

const anchorText: Record<AnchorMode, keyof typeof messages> = {
  meals: "anchorMeals",
  prayers: "anchorPrayers",
  clock: "anchorClock",
};

const slotText: Record<Slot, keyof typeof messages> = {
  morning: "slotMorning",
  midday: "slotMidday",
  evening: "slotEvening",
  night: "slotNight",
};

const slotTint: Record<Slot, string> = {
  morning: "bg-dawn",
  midday: "bg-noon",
  evening: "bg-dusk",
  night: "bg-night",
};

const lines = (value: string) => value.split("\n").slice(0, 20);

export default function Home() {
  const t = useT();
  const { lang } = useLang();
  const { plan, setPlan, resetPlan, status, flush } = usePlan();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [cleared, setCleared] = useState(false);

  const update = (fn: (p: Plan) => Plan) => {
    setCopyState("idle");
    setCleared(false);
    setPlan(fn);
  };
  const setPerson = (changes: Partial<Plan["person"]>) => update((p) => ({ ...p, person: { ...p.person, ...changes } }));

  const copyLink = async () => {
    flush();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const clearEverything = async () => {
    if (!window.confirm(t("clearConfirm"))) return;
    await clearDevice();
    resetPlan();
    setCopyState("idle");
    setCleared(true);
  };

  const name = plan.person.name;
  const linkLength = status === "loading" ? 0 : encodePlan(plan).length;

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-4">
      <header className="flex items-center justify-between gap-4 py-4">
        <p className="type-heading">
          {lang === "en" ? (
            <>
              Waqt Pe <Ur className="text-ink-soft type-helper">{messages.appName.ur}</Ur>
            </>
          ) : (
            messages.appName.ur
          )}
        </p>
        <LanguageToggle />
      </header>

      <main className="flex grow flex-col gap-8 pb-12">
        <section className="flex flex-col gap-4 pt-4">
          <h1 className="type-question">{t("tagline")}</h1>
          <p>{t("intro")}</p>
          <Notice title={t("privacyTitle")}>{t("privacyBody")}</Notice>
        </section>

        {status === "loading" ? (
          <p role="status" className="text-ink-soft">
            {t("loading")}
          </p>
        ) : (
          <>
            {status === "invalid" && (
              <Notice tone="error" role="alert">
                {t("linkInvalid")}
              </Notice>
            )}
            {cleared && (
              <Notice tone="success" role="status">
                {t("cleared")}
              </Notice>
            )}
            <Notice tone="warning">{t("earlyBuild")}</Notice>

            <section className="flex flex-col gap-6" aria-labelledby="person-heading">
              <h2 id="person-heading" className="type-heading">
                {t("personHeading")}
              </h2>
              <TextField
                label={t("nameLabel")}
                help={t("nameHelp")}
                value={name}
                maxLength={80}
                autoComplete="off"
                onChange={(e) => setPerson({ name: e.target.value })}
              />
              <SelectField
                label={t("bloodGroupLabel")}
                value={plan.person.bloodGroup ?? ""}
                onChange={(e) => setPerson({ bloodGroup: e.target.value || undefined })}
              >
                <option value="">{t("bloodGroupUnknown")}</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </SelectField>
              <TextArea
                label={t("conditionsLabel")}
                help={t("conditionsHelp")}
                value={plan.person.conditions.join("\n")}
                onChange={(e) => setPerson({ conditions: lines(e.target.value) })}
              />
              <TextArea
                label={t("allergiesLabel")}
                help={t("allergiesHelp")}
                value={plan.person.allergies.join("\n")}
                onChange={(e) => setPerson({ allergies: lines(e.target.value) })}
              />
            </section>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 type-heading">
                {name.trim() ? fillNodes(t("giverQuestionNamed"), { name: name.trim() }) : t("giverQuestion")}
              </legend>
              {GIVERS.map((g) => (
                <ChoiceCard
                  key={g}
                  name="giver"
                  value={g}
                  checked={plan.giver.type === g}
                  onChange={() => update((p) => ({ ...p, giver: { ...p.giver, type: g } }))}
                  label={t(giverText[g][0])}
                  help={t(giverText[g][1])}
                />
              ))}
              {isHelper(plan.giver.type) && (
                <TextField
                  className="pt-3"
                  label={t("helperNameLabel")}
                  help={t("helperNameHelp")}
                  value={plan.giver.helperName ?? ""}
                  maxLength={80}
                  autoComplete="off"
                  onChange={(e) => update((p) => ({ ...p, giver: { ...p.giver, helperName: e.target.value || undefined } }))}
                />
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 type-heading">{t("anchorsHeading")}</legend>
              {ANCHOR_MODES.map((m) => (
                <ChoiceCard
                  key={m}
                  name="anchors"
                  value={m}
                  checked={plan.anchors.mode === m}
                  onChange={() =>
                    update((p) => ({ ...p, anchors: { mode: m, labels: structuredClone(DEFAULT_ANCHOR_LABELS[m]) } }))
                  }
                  label={t(anchorText[m])}
                />
              ))}
              <ul className="frame mt-3 overflow-hidden rounded-card bg-surface">
                {SLOTS.map((s) => (
                  <li key={s} className={`flex flex-wrap items-baseline justify-between gap-x-4 px-4 py-2 ${slotTint[s]}`}>
                    <span className="font-bold">{t(slotText[s])}</span>
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span lang="en" dir="ltr">
                        {plan.anchors.labels[s].en}
                      </span>
                      <Ur>{plan.anchors.labels[s].ur}</Ur>
                    </span>
                  </li>
                ))}
              </ul>
            </fieldset>

            <section className="flex flex-col gap-4" aria-labelledby="summary-heading">
              <h2 id="summary-heading" className="type-heading">
                {t("planSummary")}
              </h2>
              <p role="status" className="text-ink-soft">
                {status === "restored" ? t("savedRestored") : t("savedNew")}
              </p>
              <dl className="frame grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-card bg-surface px-4 py-3">
                <dt>{t("medicinesCount")}</dt>
                <dd className="font-bold">{plan.medicines.length}</dd>
                <dt>{t("contactsCount")}</dt>
                <dd className="font-bold">{plan.contacts.length}</dd>
                <dt>{t("linkLength")}</dt>
                <dd className="font-bold">
                  {linkLength} {t("characters")}
                </dd>
              </dl>
              <Button variant="secondary" full onClick={() => update(() => samplePlan())}>
                {t("loadSample")}
              </Button>
            </section>

            <section className="flex flex-col gap-4" aria-labelledby="clear-heading">
              <h2 id="clear-heading" className="type-heading">
                {t("clearHeading")}
              </h2>
              <p className="text-ink-soft">{t("clearBody")}</p>
              <Button variant="danger" full onClick={clearEverything}>
                {t("clearHeading")}
              </Button>
            </section>
          </>
        )}
      </main>

      {status !== "loading" && (
        <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t-[1.5px] border-line bg-paper px-4 py-3">
          {copyState === "failed" && (
            <p role="alert" className="type-helper text-error">
              {t("copyFailed")}
            </p>
          )}
          <Button full onClick={copyLink}>
            {copyState === "copied" ? t("linkCopied") : t("copyLink")}
          </Button>
        </div>
      )}
    </div>
  );
}
