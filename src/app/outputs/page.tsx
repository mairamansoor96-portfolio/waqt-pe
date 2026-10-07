"use client";

// Screen 9: the outputs hub, laid out as a checklist. The outputs are grouped
// into numbered steps in the order to do them, each card saying what the
// output is, who it's for and what to do with it, with a preview drawn from
// the plan and a status row. The medicine outputs stay locked until every
// medicine is checked against the prescription (SPEC.md → Rules).

import { useState, type ReactNode } from "react";
import { AppHeader, BottomBar } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { DoctorPreview, FridgePreview, LockPreview, StickersPreview, VoicePreview } from "@/components/HubPreviews";
import { Check } from "@/components/icons";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MissingPhotosNotice } from "@/components/MissingPhotosNotice";
import { Notice } from "@/components/Notice";
import { SampleNotice } from "@/components/SampleNotice";
import { actionPath } from "@/components/sheets/OutputShell";
import { Perforation } from "@/components/Trim";
import { backupFileName, downloadBlob, exportPlan } from "@/lib/backup";
import { useDone, type OutputId } from "@/lib/done";
import { fill, useFillNodes, useLang, useT, type MessageKey } from "@/lib/i18n";
import { symbolName } from "@/lib/medicine";
import { usePlan } from "@/lib/plan-store";
import { canPrint, isHelper } from "@/lib/plan";
import { printDate } from "@/lib/sheet";
import { stepPath } from "@/lib/steps";
import { scriptText, voiceScript } from "@/lib/voice";
import { SymbolShape } from "@/pictograms";

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** "ammi" → "Ammi", for display only; the plan keeps what the family typed. */
const capitalise = (s: string) => {
  const [first = "", ...rest] = Array.from(s);
  return first.toLocaleUpperCase() + rest.join("");
};

/** How each output's status reads once its main action has been used. */
const doneWords: Record<OutputId, { today: MessageKey; on: MessageKey }> = {
  fridge: { today: "statusPrintedToday", on: "statusPrintedOn" },
  stickers: { today: "statusPrintedToday", on: "statusPrintedOn" },
  voice: { today: "statusCopiedToday", on: "statusCopiedOn" },
  lockscreen: { today: "statusSavedToday", on: "statusSavedOn" },
  doctor: { today: "statusPrintedSavedToday", on: "statusPrintedSavedOn" },
};

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export default function Outputs() {
  const t = useT();
  const fillNodes = useFillNodes();
  const { lang } = useLang();
  const { plan, status, go, flush, sample, exitSample } = usePlan();
  const { done, markDone, undo } = useDone();
  const [scriptCopy, setScriptCopy] = useState<"idle" | "failed">("idle");

  const name = capitalise(plan.person.name.trim());
  const helper = isHelper(plan.giver.type) ? plan.giver.helperName?.trim() : undefined;
  // The voice note leads only when the helper can't read the sheet.
  const voiceFirst = plan.giver.type === "helperNoRead";
  const unlocked = canPrint(plan);
  const notChecked = plan.medicines.filter((m) => !m.reviewed).map((m) => m.name.trim()).filter(Boolean);
  const n = plan.medicines.length;
  const script = voiceScript(plan, lang);

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(scriptText(script));
      setScriptCopy("idle");
      markDone("voice");
    } catch {
      setScriptCopy("failed");
    }
  };

  const titles: Record<OutputId, MessageKey> = {
    fridge: "outputFridge",
    stickers: "getStickers",
    voice: "outputVoice",
    lockscreen: "getLock",
    doctor: "outputDoctor",
  };

  const card = (id: OutputId, props: Omit<CardProps, "id" | "title" | "locked" | "doneAt" | "onUndo">) => (
    <OutputCard
      key={id}
      id={id}
      title={t(titles[id])}
      locked={id !== "lockscreen" && !unlocked}
      doneAt={done[id]}
      onUndo={() => undo(id)}
      {...props}
    />
  );

  const fridgeStep: StepProps = {
    id: "fridge",
    heading: t("hubStepFridge"),
    help: t("hubStepFridgeHelp"),
    outputs: ["fridge", "stickers"],
    cards: [
      card("fridge", {
        big: true,
        tag: t("tagPrint2"),
        preview: <FridgePreview plan={plan} />,
        forLine: helper ? fillNodes(t("hubFridgeForNamed"), { helper }) : t("hubFridgeFor"),
        actions: (
          <>
            <Button full onClick={() => go(actionPath("/outputs/fridge/"))}>
              {t("printFridge")}
            </Button>
            <Button variant="secondary" full onClick={() => go("/outputs/fridge/")}>
              {t("hubPreview")}
              <span className="sr-only">: {t("outputFridge")}</span>
            </Button>
          </>
        ),
      }),
      card("stickers", {
        tag: t("tagPrint1"),
        preview: <StickersPreview plan={plan} />,
        forLine: t("hubStickersFor"),
        note: (
          <div className="flex flex-col gap-2">
            <h4 className="type-helper font-bold">{t("hubStickersWhich")}</h4>
            <ul className="flex flex-col gap-2">
              {plan.medicines.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <SymbolShape shape={m.symbol.shape} colour={m.symbol.colour} size={28} />
                  <span className="min-w-0 break-words">
                    {capitalise(symbolName(m.symbol)[lang])}: <bdi>{m.name.trim()}</bdi>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ),
        actions: (
          <Button full onClick={() => go(actionPath("/outputs/stickers/"))}>
            {t("hubPrintStickers")}
          </Button>
        ),
      }),
    ],
  };

  const voiceStep: StepProps = {
    id: "voice",
    heading: voiceFirst ? (helper ? fillNodes(t("hubStepHelperNamed"), { helper }) : t("hubStepHelper")) : t("hubStepVoiceOptional"),
    help: voiceFirst ? (helper ? fillNodes(t("hubStepHelperHelpNamed"), { helper }) : t("hubStepHelperHelp")) : t("hubStepVoiceOptionalHelp"),
    // Optional, it isn't counted in what's left to do.
    outputs: voiceFirst ? ["voice"] : [],
    cards: [
      card("voice", {
        tag: t("tagPhone"),
        preview: <VoicePreview />,
        forLine: helper ? fillNodes(t("hubVoiceForNamed"), { helper }) : t("hubVoiceFor"),
        note: (
          <div className="flex flex-col gap-1">
            <p className="type-helper font-bold">{t("hubVoiceStarts")}</p>
            <p data-script-start className="frame rounded-input bg-ground px-4 py-2">
              {script[0].text}
            </p>
          </div>
        ),
        actions: (
          <>
            <Button full onClick={copyScript}>
              {t("hubCopyScript")}
            </Button>
            {scriptCopy === "failed" && (
              <p role="alert" className="type-helper font-bold text-error">
                {t("hubCopyFailed")}
              </p>
            )}
            <Button variant="secondary" full onClick={() => go("/outputs/voice/")}>
              {t("hubReadHere")}
              <span className="sr-only">: {t("outputVoice")}</span>
            </Button>
          </>
        ),
      }),
    ],
  };

  const phoneStep: StepProps = {
    id: "phone",
    heading: name ? fillNodes(t("hubStepPersonNamed"), { name }) : t("hubStepPerson"),
    help: t("hubStepPersonHelp"),
    outputs: ["lockscreen"],
    cards: [
      card("lockscreen", {
        tag: t("tagPhone"),
        preview: <LockPreview plan={plan} />,
        forLine: name ? fillNodes(t("hubLockForNamed"), { name }) : t("hubLockFor"),
        actions: (
          <Button full onClick={() => go(actionPath("/outputs/lockscreen/"))}>
            {t("hubSaveWallpaper")}
          </Button>
        ),
      }),
    ],
  };

  const doctorStep: StepProps = {
    id: "doctor",
    heading: t("hubStepDoctor"),
    help: t("hubStepDoctorHelp"),
    outputs: ["doctor"],
    cards: [
      card("doctor", {
        tag: t("tagPrintPdf"),
        preview: <DoctorPreview plan={plan} />,
        forLine: t("hubDoctorFor"),
        actions: (
          <Button full onClick={() => go(actionPath("/outputs/doctor/"))}>
            {t("hubPrintOrSave")}
            <span className="sr-only">: {t("outputDoctor")}</span>
          </Button>
        ),
      }),
    ],
  };

  const steps = voiceFirst ? [fridgeStep, voiceStep, phoneStep, doctorStep] : [fridgeStep, phoneStep, doctorStep, voiceStep];
  const counted = steps.flatMap((s) => s.outputs);
  const doneCount = counted.filter((id) => done[id]).length;

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-4">
      <AppHeader
        onBack={() => (sample ? exitSample("/") : go(stepPath("review")))}
        onHome={() => (sample ? exitSample("/") : go("/"))}
        end={<LanguageToggle />}
      />

      {status === "loading" ? (
        <p role="status" className="grow py-8 text-ink-soft">
          {t("loading")}
        </p>
      ) : (
        <>
          <main className="flex grow flex-col gap-8 pb-12 pt-4">
            <div className="flex flex-col gap-3">
              <h1 className="type-question text-balance">{name ? fillNodes(t("hubTitleNamed"), { name }) : t("hubTitle")}</h1>
              <p className="text-ink-soft">
                {name
                  ? fillNodes(t(n === 1 ? "hubIntroNamedOne" : "hubIntroNamed"), { name, n: String(n) })
                  : fill(t(n === 1 ? "hubIntroOne" : "hubIntro"), { n })}
              </p>
              <Progress done={doneCount} total={counted.length} />
            </div>
            <SampleNotice />
            <MissingPhotosNotice />

            {!unlocked && (
              <Notice tone="warning" title={t("outputsLockedTitle")}>
                <div className="flex flex-col gap-3">
                  {plan.medicines.length === 0 ? (
                    <p>{t("outputsNoMedicines")}</p>
                  ) : (
                    <>
                      <p>{t("outputsLockedBody")}</p>
                      {notChecked.length > 0 && <p>{fill(t("outputsNotChecked"), { names: notChecked.join(", ") })}</p>}
                    </>
                  )}
                  <Button variant="secondary" onClick={() => go(stepPath(plan.medicines.length ? "review" : "medicines"))}>
                    {t(plan.medicines.length ? "goReview" : "goMedicines")}
                  </Button>
                </div>
              </Notice>
            )}

            {steps.map((s, i) => (
              <Step key={s.id} number={i + 1} {...s} />
            ))}

            {!sample && <KeepPlan onMore={() => go(stepPath("save"))} flush={flush} />}
          </main>
          {sample && (
            <BottomBar>
              <Button full onClick={() => exitSample(stepPath("name"))}>
                {t("startPlan")}
              </Button>
            </BottomBar>
          )}
        </>
      )}
    </div>
  );
}

function Progress({ done, total }: { done: number; total: number }) {
  const t = useT();
  const label = fill(t("hubProgress"), { done, total });
  return (
    <div className="flex flex-col gap-2">
      <p id="hub-progress" className="font-bold">
        {label}
      </p>
      <div
        role="progressbar"
        aria-labelledby="hub-progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={label}
        className="h-4 overflow-hidden rounded-chip border-2 border-ink-soft bg-surface"
      >
        <div className="h-full rounded-chip bg-primary" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </div>
    </div>
  );
}

interface StepProps {
  id: string;
  heading: ReactNode;
  help: ReactNode;
  /** The outputs counted in "{done} of {total} done". */
  outputs: OutputId[];
  cards: ReactNode[];
}

function Step({ id, number, heading, help, cards }: StepProps & { number: number }) {
  return (
    <section aria-labelledby={`step-${id}`} data-step={id} className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-px flex size-[2.125rem] shrink-0 items-center justify-center rounded-chip bg-primary type-body font-bold text-white"
        >
          {number}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id={`step-${id}`} className="type-heading">
            {heading}
          </h2>
          <p className="text-ink-soft">{help}</p>
        </div>
      </div>
      {cards}
    </section>
  );
}

interface CardProps {
  id: OutputId;
  title: string;
  tag: string;
  forLine: ReactNode;
  preview: ReactNode;
  /** The lead card: a 3 px primary border and a large preview on top. */
  big?: boolean;
  note?: ReactNode;
  actions: ReactNode;
  locked: boolean;
  doneAt?: Date;
  onUndo: () => void;
}

function OutputCard({ id, title, tag, forLine, preview, big, note, actions, locked, doneAt, onUndo }: CardProps) {
  const t = useT();
  const words = doneWords[id];
  const today = new Date();
  return (
    <article
      aria-labelledby={`output-${id}`}
      data-output={id}
      data-locked={locked}
      data-done={!!doneAt}
      className={`flex flex-col gap-4 rounded-card bg-surface p-4 ${big ? "border-3 border-primary" : "frame"}`}
    >
      {big && preview}
      <div className="flex flex-wrap items-start gap-4">
        {!big && preview}
        <div className="flex min-w-[min(100%,12rem)] flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 id={`output-${id}`} className="type-title">
              {title}
            </h3>
            <span className="inline-flex items-center rounded-chip border-2 border-primary px-3 type-helper font-bold text-primary">{tag}</span>
          </div>
          <p className="type-helper text-ink-soft">{forLine}</p>
        </div>
      </div>
      {!locked && note}
      {!locked && <div className="flex flex-col gap-3">{actions}</div>}

      {/* Polite, so "Printed today" is announced when it appears. */}
      <div aria-live="polite" className="flex flex-col gap-3">
        <Perforation />
        {locked ? (
          <p className="flex min-h-12 items-center gap-2 type-helper font-bold text-warning">
            <LockIcon />
            {t("outputLocked")}
          </p>
        ) : doneAt ? (
          <button
            type="button"
            onClick={onUndo}
            data-status="done"
            className="flex min-h-12 w-full items-center gap-3 rounded-input text-start"
          >
            <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-chip bg-success text-white">
              <Check size={18} />
            </span>
            <span className="grow font-bold text-success">
              {sameDay(doneAt, today) ? t(words.today) : fill(t(words.on), { date: printDate(doneAt) })}
            </span>
            <span className="font-bold text-primary underline decoration-2 underline-offset-4">
              {t("statusUndo")}
              <span className="sr-only">: {fill(t("statusUndoFor"), { output: title })}</span>
            </span>
          </button>
        ) : (
          <p data-status="todo" className="flex min-h-12 items-center gap-3 text-ink-soft">
            <span aria-hidden="true" className="size-7 shrink-0 rounded-chip border-2 border-ink-soft" />
            {t("statusNotDone")}
          </p>
        )}
      </div>
    </article>
  );
}

function KeepPlan({ onMore, flush }: { onMore: () => void; flush: () => void }) {
  const t = useT();
  const { plan } = usePlan();
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  const [file, setFile] = useState<"idle" | "working" | "failed" | number>("idle");

  const copyLink = async () => {
    flush();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  };
  const saveFile = async () => {
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

  return (
    <section aria-labelledby="keep" className="flex flex-col gap-3 rounded-pocket border-2 border-primary bg-primary-tint p-4">
      <h2 id="keep" className="type-heading">
        {t("keepTitle")}
      </h2>
      <p>{t("keepBody")}</p>
      <div className="flex flex-wrap gap-3">
        <Button className="grow" onClick={copyLink}>
          {copy === "copied" ? t("linkCopied") : t("keepCopyLink")}
        </Button>
        <Button variant="secondary" className="grow" disabled={file === "working"} onClick={saveFile}>
          {t("keepSaveFile")}
        </Button>
      </div>
      {copy === "failed" && (
        <p role="alert" className="type-helper font-bold text-error">
          {t("copyFailed")}
        </p>
      )}
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
      <button
        type="button"
        onClick={onMore}
        className="inline-flex min-h-12 items-center self-start rounded-input font-bold text-primary underline decoration-2 underline-offset-4"
      >
        {t("keepMore")}
      </button>
    </section>
  );
}
