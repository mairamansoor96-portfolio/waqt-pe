"use client";

import { Notice } from "@/components/Notice";
import { SetupScreen, useNamed } from "@/components/SetupScreen";
import { useT } from "@/lib/i18n";

// Placeholder until milestone 3 (medicines list and editor).
export default function MedicinesStep() {
  const t = useT();
  const named = useNamed();
  return (
    <SetupScreen step="medicines" question={named("qMedicinesNamed", "qMedicines")}>
      <p>{named("medicinesEmptyNamed", "medicinesEmpty")}</p>
      <Notice tone="warning" title={t("notBuiltYet")}>
        {t("medicinesLater")}
      </Notice>
    </SetupScreen>
  );
}
