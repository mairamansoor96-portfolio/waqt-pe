"use client";

// Screen 9: the outputs hub. The medicine outputs stay locked until every
// medicine is checked against the prescription (SPEC.md → Rules). The outputs
// themselves arrive in milestones 6 to 9.

import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MissingPhotosNotice } from "@/components/MissingPhotosNotice";
import { Notice } from "@/components/Notice";
import { BackArrow } from "@/components/icons";
import { fill, useFillNodes, useT, type MessageKey } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { canPrint, isHelper } from "@/lib/plan";
import { stepPath } from "@/lib/steps";

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Outputs() {
  const t = useT();
  const fillNodes = useFillNodes();
  const { plan, status, go } = usePlan();
  const name = plan.person.name.trim();
  const helper = isHelper(plan.giver.type) ? plan.giver.helperName?.trim() : undefined;
  const unlocked = canPrint(plan);
  const notChecked = plan.medicines.filter((m) => !m.reviewed).map((m) => m.name.trim()).filter(Boolean);

  const outputs: { id: string; title: MessageKey; help: ReactNode; needsReview: boolean; path?: string }[] = [
    { id: "fridge", title: "outputFridge", help: t("outputFridgeHelp"), needsReview: true, path: "/outputs/fridge/" },
    { id: "stickers", title: "outputStickers", help: t("outputStickersHelp"), needsReview: true, path: "/outputs/stickers/" },
    {
      id: "voice",
      title: "outputVoice",
      help: helper ? fillNodes(t("outputVoiceHelpNamed"), { helper }) : t("outputVoiceHelp"),
      needsReview: true,
      path: "/outputs/voice/",
    },
    { id: "doctor", title: "outputDoctor", help: t("outputDoctorHelp"), needsReview: true, path: "/outputs/doctor/" },
    // No medicines on it, so it doesn't wait for the medicine check.
    { id: "lockscreen", title: "outputLockScreen", help: t("outputLockScreenHelp"), needsReview: false, path: "/outputs/lockscreen/" },
  ];

  return (
    <div className="mx-auto flex min-h-dvh max-w-app flex-col px-4">
      <div className="flex items-center justify-between gap-4 pt-3">
        <button type="button" onClick={() => go("/")} className="min-h-12 rounded-button type-helper font-bold text-ink">
          {t("appName")}
        </button>
        <LanguageToggle />
      </div>
      <div className="pt-2">
        <button
          type="button"
          onClick={() => go(stepPath("review"))}
          className="-ms-3 inline-flex min-h-12 items-center gap-1 rounded-button px-3 type-body font-bold text-primary"
        >
          <BackArrow size={20} />
          {t("back")}
        </button>
      </div>

      {status === "loading" ? (
        <p role="status" className="grow py-8 text-ink-soft">
          {t("loading")}
        </p>
      ) : (
        <>
          <main className="flex grow flex-col gap-6 pb-12 pt-2">
            <div className="flex flex-col gap-2">
              <h1 className="type-question text-balance">{name ? fillNodes(t("outputsTitleNamed"), { name }) : t("outputsTitle")}</h1>
              <p className="text-ink-soft">{t("outputsHelp")}</p>
            </div>
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
                  <Button
                    variant="secondary"
                    onClick={() => go(stepPath(plan.medicines.length ? "review" : "medicines"))}
                  >
                    {t(plan.medicines.length ? "goReview" : "goMedicines")}
                  </Button>
                </div>
              </Notice>
            )}

            <ul className="flex flex-col gap-3">
              {outputs.map((o) => {
                const locked = o.needsReview && !unlocked;
                return (
                  <li
                    key={o.id}
                    data-output={o.id}
                    data-locked={locked}
                    className={`frame flex flex-col gap-1 rounded-card p-4 ${locked ? "bg-paper" : "bg-surface"}`}
                  >
                    <h2 className="type-heading">{t(o.title)}</h2>
                    <p className="type-helper text-ink-soft">{o.help}</p>
                    {!locked && o.path ? (
                      <Button variant="secondary" className="mt-2" onClick={() => go(o.path!)}>
                        {t("openOutput")}
                        <span className="sr-only">: {t(o.title)}</span>
                      </Button>
                    ) : (
                      <p className={`flex items-center gap-2 pt-1 type-helper font-bold ${locked ? "text-warning" : "text-ink-soft"}`}>
                        {locked && <LockIcon />}
                        {locked ? t("outputLocked") : t("outputComing")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </main>
          <div className="sticky bottom-0 -mx-4 border-t-[1.5px] border-line bg-paper px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
            <Button full onClick={() => go(stepPath("save"))}>
              {t("saveAndShare")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
