"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { ConfirmInline } from "@/components/ConfirmInline";
import { Notice } from "@/components/Notice";
import { SetupScreen, useNamed } from "@/components/SetupScreen";
import { clearDevice } from "@/lib/device";
import { useT, type MessageKey } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { stepPath, type StepId } from "@/lib/steps";
import type { AnchorMode, Giver } from "@/lib/plan";

const giverKey: Record<Giver, MessageKey> = {
  self: "giverSelf",
  family: "giverFamily",
  helperReads: "giverHelperReads",
  helperNoRead: "giverHelperNoRead",
};
const anchorKey: Record<AnchorMode, MessageKey> = { meals: "anchorMeals", prayers: "anchorPrayers", clock: "anchorClock" };

// Screen 10 in SPEC.md. Milestone 2 has the link and clearing; the
// .waqtpe file export and import come in milestone 4.
export default function SaveStep() {
  const t = useT();
  const named = useNamed();
  const { plan, flush, go, resetPlan } = usePlan();
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  const [cleared, setCleared] = useState(false);
  const { person, giver, anchors, contacts } = plan;

  const copyLink = async () => {
    flush();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  };

  const health = [person.bloodGroup, ...person.conditions, ...person.allergies].filter(Boolean).join(", ");
  const rows: { label: MessageKey; value: ReactNode; step: StepId }[] = [
    { label: "summaryName", value: person.name.trim() ? <bdi>{person.name.trim()}</bdi> : t("summaryNone"), step: "name" },
    { label: "summaryHealth", value: health ? <bdi>{health}</bdi> : t("summaryNone"), step: "health" },
    {
      label: "summaryGiver",
      value: (
        <>
          {t(giverKey[giver.type])}
          {giver.helperName && (
            <>
              {" · "}
              <bdi>{giver.helperName}</bdi>
            </>
          )}
        </>
      ),
      step: "giver",
    },
    { label: "summaryAnchors", value: t(anchorKey[anchors.mode]), step: "anchors" },
    {
      label: "summaryContacts",
      value: contacts.length ? (
        <ul>
          {contacts.map((c) => (
            <li key={c.id}>
              <bdi>{c.name || "—"}</bdi>
              {c.relation && (
                <>
                  {", "}
                  <bdi>{c.relation}</bdi>
                </>
              )}
              {c.phone && (
                <>
                  {" · "}
                  <bdi dir="ltr">{c.phone}</bdi>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        t("summaryNone")
      ),
      step: "contacts",
    },
  ];

  return (
    <SetupScreen
      step="save"
      question={named("qSaveNamed", "qSave")}
      help={t("saveBody")}
      bottomBar={
        <div className="flex flex-col gap-2">
          {copy === "failed" && (
            <p role="alert" className="type-helper text-error">
              {t("copyFailed")}
            </p>
          )}
          <Button full onClick={copyLink}>
            {copy === "copied" ? t("linkCopied") : t("copyLink")}
          </Button>
        </div>
      }
    >
      {cleared && (
        <Notice tone="success" role="status">
          {t("cleared")}
        </Notice>
      )}
      <Notice title={t("privacyTitle")}>{t("saveFileLater")}</Notice>

      <section aria-labelledby="summary" className="flex flex-col gap-3">
        <h2 id="summary" className="type-heading">
          {t("summaryHeading")}
        </h2>
        <dl className="frame flex flex-col rounded-card bg-surface">
          {rows.map((r, i) => (
            <div key={r.label} className={`flex items-start justify-between gap-4 px-4 py-3 ${i ? "border-t-[1.5px] border-line" : ""}`}>
              <div className="flex min-w-0 flex-col">
                <dt className="type-helper text-ink-soft">{t(r.label)}</dt>
                <dd className="break-words">{r.value}</dd>
              </div>
              <button
                type="button"
                onClick={() => go(stepPath(r.step))}
                className="-me-2 min-h-12 shrink-0 rounded-button px-2 font-bold text-primary"
              >
                {t("change")}
                <span className="sr-only">: {t(r.label)}</span>
              </button>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="clear" className="flex flex-col gap-3">
        <h2 id="clear" className="type-heading">
          {t("clearHeading")}
        </h2>
        <p className="text-ink-soft">{t("clearBody")}</p>
        <ConfirmInline
          trigger={t("clearHeading")}
          title={t("clearConfirmTitle")}
          body={t("clearConfirmBody")}
          confirmLabel={t("clearYes")}
          cancelLabel={t("keepEverything")}
          onConfirm={async () => {
            await clearDevice();
            resetPlan();
            setCopy("idle");
            setCleared(true);
          }}
        />
      </section>
    </SetupScreen>
  );
}
