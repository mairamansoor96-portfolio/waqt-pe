"use client";

// Screen 1: landing. One line on what Waqt Pe is, a sample fridge sheet, the
// privacy promise, and setup one tap away.

import { Button } from "@/components/Button";
import { ConfirmInline } from "@/components/ConfirmInline";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Notice } from "@/components/Notice";
import { SampleSheet } from "@/components/SampleSheet";
import { Ur } from "@/components/Ur";
import { messages, useFillNodes, useLang, useT } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { stepPath } from "@/lib/steps";

export default function Landing() {
  const t = useT();
  const fillNodes = useFillNodes();
  const { lang } = useLang();
  const { plan, status, go, resetPlan } = usePlan();
  const name = plan.person.name.trim();
  const hasPlan = status === "restored" || !!name;

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-4">
      <header className="flex items-center justify-between gap-4 py-4">
        <p className="type-heading">
          {lang === "en" ? (
            <>
              Waqt Pe <Ur className="type-helper text-ink-soft">{messages.appName.ur}</Ur>
            </>
          ) : (
            messages.appName.ur
          )}
        </p>
        <LanguageToggle />
      </header>

      <main className="flex grow flex-col gap-8 pb-12">
        <section className="flex flex-col gap-4 pt-4">
          <h1 className="type-question text-balance">{t("tagline")}</h1>
          <p>{t("intro")}</p>
        </section>

        {status === "invalid" && (
          <Notice tone="error" role="alert">
            {t("linkInvalid")}
          </Notice>
        )}

        <Notice title={t("privacyTitle")}>{t("privacyBody")}</Notice>

        <section aria-labelledby="sample" className="flex flex-col gap-3">
          <h2 id="sample" className="type-heading">
            {t("sampleHeading")}
          </h2>
          <SampleSheet />
        </section>

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
      </main>

      {status !== "loading" && (
        <div className="sticky bottom-0 -mx-4 border-t-[1.5px] border-line bg-paper px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
          <Button full onClick={() => go(stepPath(hasPlan ? "save" : "name"))}>
            {hasPlan ? (name ? fillNodes(t("continuePlanNamed"), { name }) : t("continuePlan")) : t("startPlan")}
          </Button>
        </div>
      )}
    </div>
  );
}
