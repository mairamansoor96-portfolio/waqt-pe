"use client";

import { ChoiceChip } from "@/components/ChoiceChip";
import { ListEditor } from "@/components/ListEditor";
import { SetupScreen, useNamed } from "@/components/SetupScreen";
import { messages, useLang, useT, type MessageKey } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { BLOOD_GROUPS, type Plan } from "@/lib/plan";

// Common conditions that change treatment. Stored in English, the language
// doctors and the emergency card read; shown in the interface language.
const SUGGESTED: MessageKey[] = [
  "condDiabetes",
  "condBloodThinner",
  "condHeart",
  "condBloodPressure",
  "condAsthma",
  "condEpilepsy",
  "condKidney",
];
const SUGGESTED_EN = SUGGESTED.map((k) => messages[k].en);

export default function HealthStep() {
  const t = useT();
  const { lang } = useLang();
  const named = useNamed();
  const { plan, setPlan } = usePlan();
  const setPerson = (changes: Partial<Plan["person"]>) => setPlan((p) => ({ ...p, person: { ...p.person, ...changes } }));
  const { conditions, allergies, bloodGroup } = plan.person;

  return (
    <SetupScreen step="health" question={named("qHealthNamed", "qHealth")} help={t("healthHelp")}>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 type-heading">{t("bloodGroupLabel")}</legend>
        <div className="flex flex-wrap gap-2">
          {BLOOD_GROUPS.map((g) => (
            <ChoiceChip
              key={g}
              type="radio"
              name="bloodGroup"
              label={g}
              lang="en"
              checked={bloodGroup === g}
              onChange={() => setPerson({ bloodGroup: g })}
            />
          ))}
          <ChoiceChip
            type="radio"
            name="bloodGroup"
            label={t("bloodGroupUnknown")}
            checked={!bloodGroup}
            onChange={() => setPerson({ bloodGroup: undefined })}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 type-heading">{t("conditionsLabel")}</legend>
        <p className="type-helper text-ink-soft">{t("conditionsHelp")}</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.map((key, i) => {
            const en = SUGGESTED_EN[i];
            return (
              <ChoiceChip
                key={key}
                type="checkbox"
                name="conditions"
                label={messages[key][lang]}
                lang={lang}
                checked={conditions.includes(en)}
                onChange={(on) =>
                  setPerson({ conditions: on ? [...conditions, en] : conditions.filter((c) => c !== en) })
                }
              />
            );
          })}
        </div>
        <ListEditor
          items={conditions}
          hidden={SUGGESTED_EN}
          onChange={(next) => setPerson({ conditions: next })}
          inputLabel={t("addConditionLabel")}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 type-heading">{t("allergiesLabel")}</legend>
        <p className="type-helper text-ink-soft">{t("allergiesHelp")}</p>
        <ListEditor items={allergies} onChange={(next) => setPerson({ allergies: next })} inputLabel={t("addAllergyLabel")} />
      </fieldset>
    </SetupScreen>
  );
}
