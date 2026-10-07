"use client";

// The emergency lock-screen card (SPEC.md → Output 2): the family picks the
// phone shape, who it's for and what to show, previews it with a pretend
// clock, and downloads a PNG to set as the lock screen. It holds no medicines,
// so it doesn't wait for the medicine check.

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { ChoiceChip } from "@/components/ChoiceChip";
import { Notice } from "@/components/Notice";
import { OutputShell } from "@/components/sheets/OutputShell";
import { downloadBlob } from "@/lib/backup";
import { fill, useT, type MessageKey } from "@/lib/i18n";
import {
  PRESETS,
  drawLockScreen,
  loadFonts,
  lockScreenFileName,
  type DrawResult,
  type Face,
  type Fields,
  type Layout,
  type Preset,
} from "@/lib/lockscreen";
import { getPhoto } from "@/lib/photos";
import { useDone } from "@/lib/done";
import { usePlan } from "@/lib/plan-store";
import type { Plan } from "@/lib/plan";
import { stepPath } from "@/lib/steps";

const FIELD_TEXT: Record<keyof Fields, MessageKey> = {
  name: "lockFieldName",
  bloodGroup: "lockFieldBlood",
  conditions: "lockFieldConditions",
  allergies: "lockFieldAllergies",
  contacts: "lockFieldContacts",
};

/** Fields there's something to show for. */
function available(plan: Plan): Record<keyof Fields, boolean> {
  return {
    name: !!plan.person.name.trim(),
    bloodGroup: !!plan.person.bloodGroup,
    conditions: plan.person.conditions.length > 0,
    allergies: plan.person.allergies.length > 0,
    contacts: plan.contacts.some((c) => c.name.trim() || c.phone.trim()),
  };
}

async function loadFaces(plan: Plan): Promise<Face[]> {
  return Promise.all(
    plan.contacts
      .filter((c) => c.name.trim() || c.phone.trim())
      .map(async (c) => {
        let image: CanvasImageSource | undefined;
        const blob = c.photoId ? await getPhoto(c.photoId) : undefined;
        if (blob) image = await createImageBitmap(blob).catch(() => undefined);
        return { name: c.name, relation: c.relation, phone: c.phone, image };
      }),
  );
}

export default function LockScreenScreen() {
  const t = useT();
  const { plan, go } = usePlan();
  const { markDone } = useDone();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [preset, setPreset] = useState<Preset>("iphone");
  const [layout, setLayout] = useState<Layout>("text");
  // What to show: a choice for this picture, not saved in the plan.
  const [fields, setFields] = useState<Fields>({ name: true, bloodGroup: true, conditions: true, allergies: true, contacts: true });
  const [showClock, setShowClock] = useState(true);
  const [result, setResult] = useState<DrawResult | null>(null);
  const [saved, setSaved] = useState<"idle" | "saved" | "failed">("idle");

  const has = available(plan);
  const shown: Fields = {
    name: fields.name && has.name,
    bloodGroup: fields.bloodGroup && has.bloodGroup,
    conditions: fields.conditions && has.conditions,
    allergies: fields.allergies && has.allergies,
    contacts: fields.contacts && has.contacts,
  };
  const noFaces = layout === "faces" && !has.contacts;
  const name = plan.person.name.trim();
  const { width, height } = PRESETS[preset];
  const key = JSON.stringify([preset, layout, shown, plan.person, plan.contacts]);

  useEffect(() => {
    let live = true;
    (async () => {
      await loadFonts();
      const faces = layout === "faces" ? await loadFaces(plan) : [];
      const c = canvas.current;
      const ctx = c?.getContext("2d");
      if (!live || !c || !ctx) return;
      c.width = width;
      c.height = height;
      setResult(drawLockScreen(ctx, preset, plan, shown, layout, faces));
    })();
    return () => {
      live = false;
    };
    // `key` captures everything the picture depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const download = () => {
    canvas.current?.toBlob((blob) => {
      if (!blob) return setSaved("failed");
      downloadBlob(blob, lockScreenFileName(plan, preset));
      setSaved("saved");
      markDone("lockscreen");
    }, "image/png");
  };

  const summary = [
    t("lockEmergency"),
    shown.name && name,
    shown.bloodGroup && `${t("lockBlood")} ${plan.person.bloodGroup}`,
    shown.conditions && plan.person.conditions.join(", "),
    shown.allergies && `${t("lockAllergies")} ${plan.person.allergies.join(", ")}`,
    shown.contacts && plan.contacts.map((c) => `${c.name} ${c.phone}`).join(", "),
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <OutputShell
      title={t("outputLockScreen")}
      needsReview={false}
      paperChoice={false}
      printLabel={t("lockDownload")}
      onPrint={noFaces ? undefined : download}
      ready={!!result}
      controls={
        <>
          <Notice tone="warning" title={t("lockPrivacyTitle")}>
            {name ? fill(t("lockPrivacyBodyNamed"), { name }) : t("lockPrivacyBody")}
          </Notice>
          {saved === "saved" && (
            <Notice tone="success" role="status" title={t("lockDownloaded")}>
              <ul className="flex list-disc flex-col gap-1 ps-6">
                <li>{t("lockHowIphone")}</li>
                <li>{t("lockHowAndroid")}</li>
                <li>{t("lockCheck")}</li>
              </ul>
            </Notice>
          )}
          {saved === "failed" && (
            <p role="alert" className="type-helper font-bold text-error">
              {t("lockFailed")}
            </p>
          )}

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 type-heading">{t("lockLayoutLabel")}</legend>
            <ChoiceCard name="lock-layout" value="text" checked={layout === "text"} onChange={() => setLayout("text")} label={t("lockLayoutText")} help={t("lockLayoutTextHelp")} />
            <ChoiceCard
              name="lock-layout"
              value="faces"
              checked={layout === "faces"}
              onChange={() => setLayout("faces")}
              label={name ? fill(t("lockLayoutFacesNamed"), { name }) : t("lockLayoutFaces")}
              help={t("lockLayoutFacesHelp")}
            />
          </fieldset>

          {layout === "text" && (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 type-heading">{t("lockFieldsLabel")}</legend>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FIELD_TEXT) as (keyof Fields)[])
                  .filter((f) => has[f])
                  .map((f) => (
                    <ChoiceChip
                      key={f}
                      type="checkbox"
                      name={`field-${f}`}
                      label={t(FIELD_TEXT[f])}
                      checked={fields[f]}
                      onChange={(on) => setFields((x) => ({ ...x, [f]: on }))}
                    />
                  ))}
              </div>
              <p className="type-helper text-ink-soft">{t("lockFieldsHelp")}</p>
            </fieldset>
          )}

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 type-heading">{t("lockPhoneLabel")}</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESETS) as Preset[]).map((p) => (
                <ChoiceChip
                  key={p}
                  type="radio"
                  name="phone"
                  label={t(p === "iphone" ? "lockIphone" : "lockAndroid")}
                  checked={preset === p}
                  onChange={() => setPreset(p)}
                />
              ))}
            </div>
            <p className="type-helper text-ink-soft">{t("lockPhoneHelp")}</p>
          </fieldset>
        </>
      }
      after={<p className="type-helper text-ink-soft">{t("lockMedicalId")}</p>}
    >
      {noFaces ? (
        <Notice tone="warning">
          <div className="flex flex-col gap-3">
            <p>{t("lockNoFaces")}</p>
            <Button variant="secondary" onClick={() => go(stepPath("contacts"))}>
              {t("lockAddPeople")}
            </Button>
          </div>
        </Notice>
      ) : (
        <section aria-labelledby="lock-preview" className="flex flex-col items-center gap-3">
          <h2 id="lock-preview" className="type-heading self-start">
            {t("lockPreviewLabel")}
          </h2>
          <div className="relative w-full max-w-[280px] overflow-hidden rounded-[36px] border-[6px] border-ink bg-ink" style={{ aspectRatio: `${width} / ${height}` }}>
            <canvas
              ref={canvas}
              data-lockscreen
              data-layout={result ? JSON.stringify(result) : undefined}
              role="img"
              aria-label={summary}
              className="block h-full w-full"
            />
            {showClock && <PretendLockScreen />}
          </div>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 self-start">
            <input type="checkbox" checked={showClock} onChange={(e) => setShowClock(e.target.checked)} className="size-6 accent-[var(--color-primary)]" />
            <span>{t("lockClockToggle")}</span>
          </label>
          {result && result.scale < 0.75 && <Notice tone="warning">{t("lockCrowded")}</Notice>}
          <p className="type-helper text-ink-soft">{t("lockPreviewHelp")}</p>
        </section>
      )}
    </OutputShell>
  );
}

/** A pretend clock, camera notch and buttons over the preview. Not part of the picture. */
function PretendLockScreen() {
  return (
    <div aria-hidden="true" data-pretend-clock className="pointer-events-none absolute inset-0 text-white" dir="ltr">
      <div className="absolute inset-x-0 top-[1.5%] mx-auto h-[3%] w-[30%] rounded-chip bg-black" />
      <div className="absolute inset-x-0 top-[9%] text-center text-[13px] opacity-90">Thursday 1 October</div>
      <div className="absolute inset-x-0 top-[11.5%] text-center text-[64px] font-bold leading-none">9:41</div>
      <div className="absolute inset-x-[8%] top-[23%] h-[6%] rounded-[12px] bg-white/25" />
      <div className="absolute bottom-[4%] start-[9%] aspect-square w-[13%] rounded-chip bg-white/25" />
      <div className="absolute bottom-[4%] end-[9%] aspect-square w-[13%] rounded-chip bg-white/25" />
      <div className="absolute inset-x-0 bottom-[1.2%] mx-auto h-[0.6%] w-[35%] rounded-chip bg-white/80" />
    </div>
  );
}
