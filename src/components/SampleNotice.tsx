"use client";

import { Button } from "./Button";
import { Notice } from "./Notice";
import { useT } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { stepPath } from "@/lib/steps";

/** On every screen of the demo plan, so nobody mistakes it for their own. */
export function SampleNotice() {
  const t = useT();
  const { sample, exitSample } = usePlan();
  if (!sample) return null;
  return (
    <div data-sample-notice className="print:hidden">
      <Notice title={t("sampleNotice")}>
        <Button variant="secondary" className="mt-3 w-full" onClick={() => exitSample(stepPath("name"))}>
          {t("startPlan")}
        </Button>
      </Notice>
    </div>
  );
}
