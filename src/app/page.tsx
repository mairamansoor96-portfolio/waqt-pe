"use client";

// Screen 1: landing. One line on what Waqt Pe is, a sample fridge sheet, the
// privacy promise, and setup one tap away.

import { AppHeader, BottomBar } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { ConfirmInline } from "@/components/ConfirmInline";
import { ImportControl } from "@/components/ImportControl";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Notice } from "@/components/Notice";
import { Logo } from "@/components/Logo";
import { SampleSheet } from "@/components/SampleSheet";
import { useFillNodes, useT } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { stepPath } from "@/lib/steps";

export default function Landing() {
  const t = useT();
  const fillNodes = useFillNodes();
  const { plan, status, go, resetPlan } = usePlan();
  const name = plan.person.name.trim();
  const hasPlan = status === "restored" || !!name;

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-4">
      <AppHeader logo={<Logo variant="stacked" />} end={<LanguageToggle />} />

      <main className="flex grow flex-col gap-8 pb-12 pt-4">
        <section className="flex flex-col gap-4">
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

        <section aria-labelledby="open-file" className="flex flex-col gap-3">
          <h2 id="open-file" className="type-heading">
            {t("importHeading")}
          </h2>
          <p className="text-ink-soft">{t("importBody")}</p>
          <ImportControl onImported={() => go(stepPath("save"))} />
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
        <BottomBar>
          <Button full onClick={() => go(stepPath(hasPlan ? "save" : "name"))}>
            {hasPlan ? (name ? fillNodes(t("continuePlanNamed"), { name }) : t("continuePlan")) : t("startPlan")}
          </Button>
        </BottomBar>
      )}
    </div>
  );
}
