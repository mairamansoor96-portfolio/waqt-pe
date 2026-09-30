"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "./Button";
import { LanguageToggle } from "./LanguageToggle";
import { ProgressHeader } from "./ProgressHeader";
import { useFillNodes, useT, type MessageKey } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { STEPS, nextStep, prevStep, stepNumber, stepPath, type StepId } from "@/lib/steps";

/**
 * One setup screen: progress header, one question, the answer controls, and
 * the primary action in a sticky bottom bar within thumb reach.
 */
export function SetupScreen({
  step,
  question,
  help,
  children,
  onContinue,
  bottomBar,
}: {
  step: StepId;
  question: ReactNode;
  help?: ReactNode;
  children?: ReactNode;
  /** Return false to stay on this screen (for example, to show an error). */
  onContinue?: () => boolean;
  /** Replaces the Continue button, for the last screen. */
  bottomBar?: ReactNode;
}) {
  const t = useT();
  const { status, go } = usePlan();
  const heading = useRef<HTMLHeadingElement>(null);

  // Move focus to the question on each screen, so screen readers announce it.
  useEffect(() => {
    if (status !== "loading") heading.current?.focus({ preventScroll: true });
  }, [status, step]);

  const prev = prevStep(step);
  const next = nextStep(step);

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-4">
      <div className="flex items-center justify-between gap-4 pt-3">
        <button type="button" onClick={() => go("/")} className="min-h-12 rounded-button type-helper font-bold text-ink">
          {t("appName")}
        </button>
        <LanguageToggle />
      </div>
      <ProgressHeader step={stepNumber(step)} total={STEPS.length} onBack={() => go(prev ? stepPath(prev) : "/")} />

      {status === "loading" ? (
        <p role="status" className="grow py-8 text-ink-soft">
          {t("loading")}
        </p>
      ) : (
        <>
          <main className="flex grow flex-col gap-6 pb-12 pt-4">
            <div className="flex flex-col gap-2">
              <h1 ref={heading} tabIndex={-1} className="type-question text-balance outline-none">
                {question}
              </h1>
              {help && <p className="text-ink-soft">{help}</p>}
            </div>
            {children}
          </main>
          <div className="sticky bottom-0 -mx-4 border-t-[1.5px] border-line bg-paper px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
            {bottomBar ?? (
              <Button
                full
                onClick={() => {
                  if (onContinue && !onContinue()) return;
                  if (next) go(stepPath(next));
                }}
              >
                {t("continue")}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Text that uses the person's name when there is one, falling back to a
 * version without it. The name is wrapped in <bdi> to keep mixed scripts in order.
 */
export function useNamed() {
  const t = useT();
  const fillNodes = useFillNodes();
  const { plan } = usePlan();
  const name = plan.person.name.trim();
  return (named: MessageKey, plain: MessageKey): ReactNode => (name ? fillNodes(t(named), { name }) : t(plain));
}
