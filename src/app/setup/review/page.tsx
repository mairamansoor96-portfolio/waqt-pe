"use client";

import { Notice } from "@/components/Notice";
import { SetupScreen } from "@/components/SetupScreen";
import { useT } from "@/lib/i18n";

// Placeholder until milestone 5 (review step and output lock).
export default function ReviewStep() {
  const t = useT();
  return (
    <SetupScreen step="review" question={t("qReview")}>
      <Notice tone="warning" title={t("notBuiltYet")}>
        {t("reviewLater")}
      </Notice>
    </SetupScreen>
  );
}
