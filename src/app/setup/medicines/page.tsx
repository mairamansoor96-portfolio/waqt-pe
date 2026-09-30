"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/Button";
import { MedicineCard } from "@/components/MedicineCard";
import { Notice } from "@/components/Notice";
import { SetupScreen, useNamed } from "@/components/SetupScreen";
import { useT } from "@/lib/i18n";
import { isBlankMedicine } from "@/lib/medicine";
import { usePlan } from "@/lib/plan-store";
import { SYMBOLS, createMedicine } from "@/lib/plan";
import { editorPath } from "@/lib/steps";

export default function MedicinesStep() {
  const t = useT();
  const named = useNamed();
  const { plan, setPlan, status, go } = usePlan();
  const { medicines } = plan;

  // When the list opens, tidy away a medicine that was added and then left
  // completely empty (for example with the browser's back button). Only on
  // opening: "Add medicine" itself creates an empty one on the way to the editor.
  const tidied = useRef(false);
  useEffect(() => {
    if (status === "loading" || tidied.current) return;
    tidied.current = true;
    if (medicines.some(isBlankMedicine)) {
      setPlan((p) => ({ ...p, medicines: p.medicines.filter((m) => !isBlankMedicine(m)) }));
    }
  }, [status, medicines, setPlan]);

  const add = () => {
    const medicine = createMedicine(plan.medicines);
    if (!medicine) return;
    setPlan((p) => ({ ...p, medicines: [...p.medicines, medicine] }));
    go(editorPath(medicine.id));
  };

  const shown = medicines.filter((m) => !isBlankMedicine(m));

  return (
    <SetupScreen step="medicines" question={named("qMedicinesNamed", "qMedicines")}>
      {shown.length === 0 && <p>{named("medicinesEmptyNamed", "medicinesEmpty")}</p>}

      {shown.length > 0 && (
        <ul className="flex flex-col gap-3">
          {shown.map((m) => (
            <li key={m.id}>
              <MedicineCard medicine={m} onOpen={() => go(editorPath(m.id))} />
            </li>
          ))}
        </ul>
      )}

      {medicines.length < SYMBOLS.length ? (
        <Button variant={shown.length ? "secondary" : "primary"} full onClick={add}>
          {t("addMedicine")}
        </Button>
      ) : (
        <p className="text-ink-soft">{t("medicinesFull")}</p>
      )}

      <Notice tone="warning">{t("boundaryNote")}</Notice>
    </SetupScreen>
  );
}
