"use client";

// Screen 1: landing. Says what Waqt Pe produces before anyone starts: the
// five outputs, how setup works, the privacy promise, and a sample plan for
// Ammi that opens every output without entering anything.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AppHeader, BottomBar } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { ConfirmInline } from "@/components/ConfirmInline";
import { ImportControl } from "@/components/ImportControl";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { Notice } from "@/components/Notice";
import { OutputPreview, type OutputKind } from "@/components/OutputPreviews";
import { Perforation } from "@/components/Trim";
import { useFillNodes, useT, type MessageKey } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { OUTPUTS_PATH, stepPath } from "@/lib/steps";

const OUTPUTS: { kind: OutputKind; name: MessageKey; body: MessageKey; tag: "tagPrint" | "tagPhone" }[] = [
  { kind: "fridge", name: "getFridge", body: "getFridgeBody", tag: "tagPrint" },
  { kind: "stickers", name: "getStickers", body: "getStickersBody", tag: "tagPrint" },
  { kind: "voice", name: "getVoice", body: "getVoiceBody", tag: "tagPhone" },
  { kind: "doctor", name: "getDoctor", body: "getDoctorBody", tag: "tagPrint" },
  { kind: "lock", name: "getLock", body: "getLockBody", tag: "tagPhone" },
];

const STEPS: [MessageKey, MessageKey][] = [
  ["how1Title", "how1Body"],
  ["how2Title", "how2Body"],
  ["how3Title", "how3Body"],
];

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 shrink-0">
      <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** True once the element has scrolled up out of view. */
function useScrolledPast(target: React.RefObject<HTMLElement | null>, ready: boolean) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = target.current;
    if (!el || !ready) return;
    if (!("IntersectionObserver" in window)) return setPast(true);
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [target, ready]);
  return past;
}

export default function Landing() {
  const t = useT();
  const fillNodes = useFillNodes();
  const { plan, status, go, resetPlan, enterSample } = usePlan();
  const name = plan.person.name.trim();
  const hasPlan = status === "restored" || !!name;
  const heroStart = useRef<HTMLButtonElement>(null);
  const heroGone = useScrolledPast(heroStart, status !== "loading");

  const start = () => go(stepPath(hasPlan ? "save" : "name"));
  const startLabel: ReactNode = hasPlan ? (name ? fillNodes(t("continuePlanNamed"), { name }) : t("continuePlan")) : t("startPlan");

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-4">
      <AppHeader logoAtStart logo={<Logo variant="header" />} end={<LanguageToggle />} />

      <main className="flex grow flex-col gap-12 pb-12 pt-6">
        <section aria-labelledby="hero" className="flex flex-col gap-4">
          <h1 id="hero" className="type-question text-balance">
            {t("tagline")}
          </h1>
          <p>{t("intro")}</p>
          {status === "invalid" && (
            <Notice tone="error" role="alert">
              {t("linkInvalid")}
            </Notice>
          )}
          <div className="flex flex-col gap-3 pt-2">
            <Button ref={heroStart} full onClick={start}>
              {startLabel}
            </Button>
            <Button variant="secondary" full onClick={() => enterSample(OUTPUTS_PATH)}>
              {t("seeSample")}
            </Button>
          </div>
          <p className="type-helper text-ink-soft">{t("heroHelper")}</p>
        </section>

        <section aria-labelledby="get" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="get" className="type-heading">
              {t("getHeading")}
            </h2>
            <p className="type-helper text-ink-soft">{t("getHelp")}</p>
          </div>
          <ul className="flex flex-col gap-3">
            {OUTPUTS.map((o) => (
              <li key={o.kind} data-output-card={o.kind} className="@container frame rounded-card bg-surface p-4">
                {/* With large text the picture sits above the words. */}
                <div className="flex items-start gap-4 @max-[18rem]:flex-col">
                  <OutputPreview kind={o.kind} />
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="type-body font-bold">{t(o.name)}</h3>
                      <span className="inline-flex items-center rounded-chip border-2 border-primary px-3 type-helper font-bold text-primary">
                        {t(o.tag)}
                      </span>
                    </div>
                    <p className="type-helper text-ink-soft">{t(o.body)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how" className="flex flex-col gap-4">
          <h2 id="how" className="type-heading">
            {t("howHeading")}
          </h2>
          <ol className="frame flex flex-col gap-4 rounded-card bg-surface p-4">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="flex flex-col gap-4">
                {i > 0 && <Perforation />}
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-[2.25rem] shrink-0 items-center justify-center rounded-chip bg-primary type-body font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <h3 className="type-body font-bold">{t(title)}</h3>
                    <p className="type-helper text-ink-soft">{t(body)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="privacy" className="flex items-start gap-3 rounded-card border-2 border-primary bg-primary-tint p-4 text-primary">
          <LockIcon />
          <div className="flex min-w-0 flex-col gap-1">
            <h2 id="privacy" className="type-body font-bold text-ink">
              {t("privacyTitle")}
            </h2>
            <p className="text-ink-soft">{t("privacyBody")}</p>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <ImportControl trigger="link" onImported={() => go(stepPath("save"))} />
          {hasPlan && (
            <ConfirmInline
              variant="secondary"
              trigger={t("startNew")}
              title={t("startNewConfirmTitle")}
              body={t("startNewConfirmBody")}
              confirmLabel={t("startNewYes")}
              cancelLabel={t("keepPlan")}
              onConfirm={() => {
                resetPlan();
                go(stepPath("name"));
              }}
            />
          )}
        </div>
      </main>

      {status !== "loading" && (
        // Sticks to the bottom only once the hero's button has scrolled away.
        <BottomBar sticky={heroGone}>
          <Button full onClick={start}>
            {startLabel}
          </Button>
        </BottomBar>
      )}
    </div>
  );
}
