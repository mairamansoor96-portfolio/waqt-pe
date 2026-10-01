"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { ConfirmInline } from "@/components/ConfirmInline";
import { ImportControl } from "@/components/ImportControl";
import { Notice } from "@/components/Notice";
import { SetupScreen, useNamed } from "@/components/SetupScreen";
import { clearDevice } from "@/lib/device";
import { fill, useT, type MessageKey } from "@/lib/i18n";
import { backupFileName, downloadBlob, exportPlan } from "@/lib/backup";
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

// Screen 10 in SPEC.md: copy the private link, download or import the
// .waqtpe file (photos included), and clear everything on this device.
export default function SaveStep() {
  const t = useT();
  const named = useNamed();
  const { plan, flush, go, resetPlan } = usePlan();
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  const [cleared, setCleared] = useState(false);
  const [file, setFile] = useState<"idle" | "working" | "failed" | number>("idle");

  const downloadFile = async () => {
    setFile("working");
    try {
      flush();
      const { blob, photoCount } = await exportPlan(plan);
      downloadBlob(blob, backupFileName(plan));
      setFile(photoCount);
    } catch {
      setFile("failed");
    }
  };
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
            // Each contact reads in its own direction, aligned with the screen's start edge.
            <li key={c.id} dir="auto" className="text-page-start">
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
                  <bdi dir="ltr" className="whitespace-nowrap">{c.phone}</bdi>
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
      <Notice title={t("privacyTitle")} />

      <section aria-labelledby="summary" className="flex flex-col gap-3">
        <h2 id="summary" className="type-heading">
          {t("summaryHeading")}
        </h2>
        <dl className="frame flex flex-col rounded-card bg-surface">
          {rows.map((r, i) => (
            // A dl group may only hold dt and dd, so the Change button sits in its own dd.
            <div key={r.label} className={`grid grid-cols-[1fr_auto] items-start gap-x-4 px-4 py-3 ${i ? "perforation-top" : ""}`}>
              <dt className="col-start-1 row-start-1 type-helper text-ink-soft">{t(r.label)}</dt>
              <dd className="col-start-1 row-start-2 min-w-0 break-words">{r.value}</dd>
              <dd className="col-start-2 row-span-2 row-start-1">
                <button
                  type="button"
                  onClick={() => go(stepPath(r.step))}
                  className="-me-2 min-h-12 rounded-button px-2 font-bold text-primary"
                >
                  {t("change")}
                  <span className="sr-only">: {t(r.label)}</span>
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="file" className="flex flex-col gap-3">
        <h2 id="file" className="type-heading">
          {t("fileHeading")}
        </h2>
        <p className="text-ink-soft">{t("fileBody")}</p>
        <Button variant="secondary" full disabled={file === "working"} onClick={downloadFile}>
          {t("downloadFile")}
        </Button>
        {typeof file === "number" && (
          <p role="status" className="type-helper font-bold text-success">
            {fill(t("fileDownloaded"), { n: file })}
          </p>
        )}
        {file === "failed" && (
          <p role="alert" className="type-helper font-bold text-error">
            {t("fileFailed")}
          </p>
        )}
      </section>

      <section aria-labelledby="import" className="flex flex-col gap-3">
        <h2 id="import" className="type-heading">
          {t("importHeading")}
        </h2>
        <p className="text-ink-soft">{t("importBody")}</p>
        <ImportControl onImported={() => setCleared(false)} />
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
