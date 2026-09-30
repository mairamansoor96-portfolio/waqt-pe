"use client";

import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChoiceChip } from "@/components/ChoiceChip";
import { ConfirmInline } from "@/components/ConfirmInline";
import { Notice } from "@/components/Notice";
import { QuantityStepper } from "@/components/QuantityStepper";
import { SetupScreen } from "@/components/SetupScreen";
import { TextField } from "@/components/TextField";
import { Check } from "@/components/icons";
import { fill, useFillNodes, useLang, useT, type MessageKey } from "@/lib/i18n";
import { isBlankMedicine, symbolName, withDose, withForm } from "@/lib/medicine";
import { usePlan } from "@/lib/plan-store";
import { FOODS, FORMS, SLOTS, editMedicine, type Food, type Form, type Medicine, type Slot } from "@/lib/plan";
import { slotText, slotTint } from "@/lib/slots";
import { stepPath } from "@/lib/steps";
import { FormPictogram, SymbolShape, TimeOfDay } from "@/pictograms";

const formText: Record<Form, MessageKey> = {
  tablet: "formTablet",
  capsule: "formCapsule",
  syrup: "formSyrup",
  drops: "formDrops",
  inhaler: "formInhaler",
  insulin: "formInsulin",
};

const foodText: Record<Food, MessageKey> = {
  before: "foodBefore",
  after: "foodAfter",
  with: "foodWith",
  any: "foodAny",
};

const LIST = stepPath("medicines");

// Screen 6: add or edit one medicine. Changes save to the link as they're
// made; every change resets `reviewed` (through editMedicine).
export default function MedicineEditorPage() {
  return (
    <Suspense>
      <MedicineEditor />
    </Suspense>
  );
}

function MedicineEditor() {
  const t = useT();
  const fillNodes = useFillNodes();
  const { lang } = useLang();
  const { plan, setPlan, go } = usePlan();
  const id = useSearchParams().get("m") ?? "";
  const medicine = plan.medicines.find((m) => m.id === id);
  // New or existing is decided when the editor opens, so the heading doesn't
  // switch from "Add" to "Change" while the name is being typed.
  const isNew = useRef<boolean | null>(null);
  if (medicine && isNew.current === null) isNew.current = isBlankMedicine(medicine);
  const [nameError, setNameError] = useState(false);
  const [whenError, setWhenError] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const whenHeading = useRef<HTMLHeadingElement>(null);

  const person = plan.person.name.trim();
  const medName = medicine?.name.trim() ?? "";

  const update = (fn: (m: Medicine) => Medicine) =>
    setPlan((p) => ({ ...p, medicines: p.medicines.map((m) => (m.id === id ? fn(m) : m)) }));
  const remove = () => setPlan((p) => ({ ...p, medicines: p.medicines.filter((m) => m.id !== id) }));

  if (!medicine) {
    return (
      <SetupScreen step="medicines" question={t("qMedicineNew")} backPath={LIST} continuePath={LIST} continueLabel={t("backToMedicines")}>
        <Notice tone="error">{t("medicineMissing")}</Notice>
      </SetupScreen>
    );
  }

  const sym = symbolName(medicine.symbol);

  return (
    <SetupScreen
      step="medicines"
      question={!isNew.current && medName ? fillNodes(t("qMedicineEdit"), { name: medName }) : t("qMedicineNew")}
      backPath={LIST}
      continuePath={LIST}
      continueLabel={t("saveMedicine")}
      onBack={() => {
        if (isBlankMedicine(medicine)) remove();
      }}
      onContinue={() => {
        const missingName = !medName;
        const missingWhen = medicine.doses.length === 0;
        setNameError(missingName);
        setWhenError(missingWhen);
        if (missingName) nameInput.current?.focus();
        else if (missingWhen) whenHeading.current?.scrollIntoView({ block: "center" });
        return !missingName && !missingWhen;
      }}
    >
      <TextField
        ref={nameInput}
        label={t("medNameLabel")}
        help={t("medNameHelp")}
        error={nameError && !medName ? t("medNameError") : undefined}
        value={medicine.name}
        maxLength={200}
        autoComplete="off"
        onChange={(e) => {
          const name = e.target.value;
          update((m) => editMedicine(m, { name }));
        }}
      />

      <TextField
        label={person ? fill(t("medPurposeLabelNamed"), { name: person }) : t("medPurposeLabel")}
        help={t("medPurposeHelp")}
        value={medicine.purpose}
        maxLength={200}
        autoComplete="off"
        onChange={(e) => {
          const purpose = e.target.value;
          update((m) => editMedicine(m, { purpose }));
        }}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 type-heading">{t("medFormLabel")}</legend>
        <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3">
          {FORMS.map((f) => {
            const checked = medicine.form === f;
            return (
              <label
                key={f}
                className={`flex min-h-14 cursor-pointer items-center gap-2 rounded-card bg-surface px-3 py-2 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary ${
                  checked ? "border-3 border-primary" : "frame"
                }`}
              >
                <input type="radio" name="form" checked={checked} onChange={() => update((m) => withForm(m, f))} className="sr-only" />
                <FormPictogram form={f} size={32} />
                <span className="type-body grow">{t(formText[f])}</span>
                {checked && <Check size={18} className="text-primary" />}
              </label>
            );
          })}
        </div>
      </fieldset>

      <section aria-labelledby="symbol" className="frame flex items-center gap-4 rounded-card bg-surface p-4">
        <SymbolShape shape={medicine.symbol.shape} colour={medicine.symbol.colour} size={64} className="shrink-0" />
        <div className="flex flex-col gap-1">
          <h2 id="symbol" className="type-heading">
            {t("medSymbolHeading")}
          </h2>
          <p>{fill(t("medSymbolBody"), { symbol: sym[lang] })}</p>
          <p className="type-helper text-ink-soft">{t("medPhotoLater")}</p>
        </div>
      </section>

      <section aria-labelledby="when" className="flex flex-col gap-3">
        <h2 id="when" ref={whenHeading} className="type-heading">
          {person ? fillNodes(t("medWhenHeadingNamed"), { name: person }) : t("medWhenHeading")}
        </h2>
        <p className="type-helper text-ink-soft">{t("medWhenHelp")}</p>
        {whenError && medicine.doses.length === 0 && (
          <p role="alert" className="type-helper font-bold text-error">
            {t("medWhenError")}
          </p>
        )}
        <ul className="flex flex-col gap-3">
          {SLOTS.map((slot) => (
            <li key={slot}>
              <SlotDose medicine={medicine} slot={slot} onChange={(fn) => update(fn)} />
            </li>
          ))}
        </ul>
      </section>

      <Notice tone="warning">{t("boundaryNote")}</Notice>

      <ConfirmInline
        trigger={t("removeMedicine")}
        title={medName ? fillNodes(t("removeMedicineTitleNamed"), { name: medName }) : t("removeMedicineTitle")}
        body={t("removeMedicineBody")}
        confirmLabel={t("removeMedicineYes")}
        cancelLabel={t("keepMedicine")}
        onConfirm={() => {
          remove();
          go(LIST);
        }}
      />
    </SetupScreen>
  );
}

/** One time of day: a toggle, then how many and the food instruction. */
function SlotDose({
  medicine,
  slot,
  onChange,
}: {
  medicine: Medicine;
  slot: Slot;
  onChange: (fn: (m: Medicine) => Medicine) => void;
}) {
  const t = useT();
  const fillNodes = useFillNodes();
  const { lang } = useLang();
  const { plan } = usePlan();
  const dose = medicine.doses.find((d) => d.slot === slot);
  const anchor = plan.anchors.labels[slot][lang] || t(slotText[slot]);
  const on = !!dose;

  return (
    <div className={`flex flex-col gap-3 rounded-card p-3 ${slotTint[slot]} ${on ? "border-3 border-primary" : "frame"}`}>
      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-input has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary">
        <input
          type="checkbox"
          checked={on}
          onChange={(e) =>
            onChange((m) =>
              withDose(m, slot, e.target.checked ? { quantity: 1, food: "any" } : undefined),
            )
          }
          className="sr-only"
        />
        <TimeOfDay slot={slot} size={40} className="shrink-0" />
        <span className="flex grow flex-col">
          <span className="type-body font-bold">{fillNodes(t("giveAt"), { anchor })}</span>
          <span className="type-helper text-ink-soft">{t(slotText[slot])}</span>
        </span>
        <span
          aria-hidden="true"
          className={`flex size-8 shrink-0 items-center justify-center rounded-input ${on ? "bg-primary text-white" : "border-2 border-ink-soft bg-surface"}`}
        >
          {on && <Check size={20} />}
        </span>
      </label>

      {dose && (
        <div className="flex flex-col gap-4 rounded-input bg-surface p-3">
          <QuantityStepper
            form={medicine.form}
            value={dose.quantity}
            onChange={(quantity) => onChange((m) => withDose(m, slot, { ...dose, quantity }))}
          />
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 type-helper font-bold">{t("foodLabel")}</legend>
            <div className="flex flex-wrap gap-2">
              {FOODS.map((f) => (
                <ChoiceChip
                  key={f}
                  type="radio"
                  name={`food-${slot}`}
                  label={t(foodText[f])}
                  checked={dose.food === f}
                  onChange={() => onChange((m) => withDose(m, slot, { ...dose, food: f }))}
                />
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}
