"use client";

import { useState } from "react";
import { Notice } from "@/components/Notice";
import { DoctorList } from "@/components/sheets/DoctorList";
import { OutputShell } from "@/components/sheets/OutputShell";
import { SheetFrame } from "@/components/sheets/SheetFrame";
import { useT } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";

export default function DoctorListScreen() {
  const t = useT();
  const { plan } = usePlan();
  const [printed, setPrinted] = useState(false);

  return (
    <OutputShell
      title={t("outputDoctor")}
      printHelp={t("doctorHelp")}
      printLabel={t("printDoctor")}
      onPrint={() => {
        window.print();
        setPrinted(true);
      }}
      controls={
        printed && (
          <Notice tone="success" role="status">
            {t("doctorReady")}
          </Notice>
        )
      }
    >
      <SheetFrame>
        <DoctorList plan={plan} date={new Date()} />
      </SheetFrame>
    </OutputShell>
  );
}
