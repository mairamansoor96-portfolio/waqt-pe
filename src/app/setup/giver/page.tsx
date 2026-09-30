"use client";

import { ChoiceCard } from "@/components/ChoiceCard";
import { SetupScreen, useNamed } from "@/components/SetupScreen";
import { TextField } from "@/components/TextField";
import { Check } from "@/components/icons";
import { useFillNodes, useT, type MessageKey } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { GIVERS, giverDefaults, isHelper, type Giver } from "@/lib/plan";
import { GiverIcon } from "@/pictograms";

const text: Record<Giver, [MessageKey, MessageKey]> = {
  self: ["giverSelf", "giverSelfHelp"],
  family: ["giverFamily", "giverFamilyHelp"],
  helperReads: ["giverHelperReads", "giverHelperReadsHelp"],
  helperNoRead: ["giverHelperNoRead", "giverHelperNoReadHelp"],
};

export default function GiverStep() {
  const t = useT();
  const fillNodes = useFillNodes();
  const named = useNamed();
  const { plan, setPlan } = usePlan();
  const giver = plan.giver.type;
  const helperName = plan.giver.helperName?.trim();
  const d = giverDefaults(giver);

  // What the answer turns on (SPEC.md → Setup flow table).
  const changes: React.ReactNode[] = [
    d.largeText && t("onLargeText"),
    d.textInBackground ? t("onTextBackground") : !d.largeText && t("onBalanced"),
    t(d.boxPhotos === "required" ? "onPhotosRequired" : d.boxPhotos === "recommended" ? "onPhotosRecommended" : "onPhotosOptional"),
    d.stickers && t("onStickers"),
    d.helperNamedOnSheet && t("onHelperNamed"),
    d.voiceScript && (helperName ? fillNodes(t("onVoiceNamed"), { helper: helperName }) : t("onVoice")),
  ].filter(Boolean);

  return (
    <SetupScreen step="giver" question={named("qGiverNamed", "qGiver")}>
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">{named("qGiverNamed", "qGiver")}</legend>
        {GIVERS.map((g) => (
          <ChoiceCard
            key={g}
            name="giver"
            value={g}
            checked={giver === g}
            onChange={() => setPlan((p) => ({ ...p, giver: { ...p.giver, type: g } }))}
            icon={<GiverIcon giver={g} size={40} />}
            label={t(text[g][0])}
            help={t(text[g][1])}
          />
        ))}
      </fieldset>

      {isHelper(giver) && (
        <TextField
          label={`${t("helperNameLabel")} (${t("optional")})`}
          help={t("helperNameHelp")}
          value={plan.giver.helperName ?? ""}
          maxLength={80}
          autoComplete="off"
          onChange={(e) => {
            const value = e.target.value;
            setPlan((p) => ({ ...p, giver: { ...p.giver, helperName: value || undefined } }));
          }}
        />
      )}

      <section aria-labelledby="changes" className="flex flex-col gap-2">
        <h2 id="changes" className="type-heading">
          {t("giverChanges")}
        </h2>
        <ul className="flex flex-col gap-1">
          {changes.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check size={20} className="mt-1 shrink-0 text-success" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>
    </SetupScreen>
  );
}
