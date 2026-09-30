"use client";

import { Check, Chevron } from "./icons";
import { PhotoThumb } from "./Photo";
import { fill, useLang, useT, type MessageKey } from "@/lib/i18n";
import { quantityText } from "@/lib/medicine";
import { slotText, slotTint } from "@/lib/slots";
import type { Dose, Form, Medicine, Plan } from "@/lib/plan";
import { SymbolShape, TimeOfDay } from "@/pictograms";

/** Time-of-day tint, slot pictogram, quantity. */
export function DoseChip({ dose, form }: { dose: Dose; form: Form }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <span className={`inline-flex min-h-10 items-center gap-1 rounded-chip ps-1 pe-3 ${slotTint[dose.slot]}`}>
      <TimeOfDay slot={dose.slot} size={28} />
      <span className="sr-only">{t(slotText[dose.slot])}: </span>
      <span className="type-helper font-bold text-ink">{quantityText(form, dose.quantity)[lang]}</span>
    </span>
  );
}

/**
 * Box photo thumbnail (from milestone 4), symbol, name, purpose in the
 * family's words, and dose chips tinted by time of day. Tapping opens the editor.
 */
export function MedicineCard({ medicine, onOpen }: { medicine: Medicine; onOpen: () => void }) {
  const t = useT();
  const name = medicine.name.trim();
  return (
    <button
      type="button"
      onClick={onOpen}
      data-symbol={`${medicine.symbol.colour} ${medicine.symbol.shape}`}
      className="frame flex w-full items-start gap-3 rounded-card bg-surface p-3 text-start"
    >
      {medicine.photoId && (
        <PhotoThumb id={medicine.photoId} alt={name ? fill(t("boxPhotoAltNamed"), { name }) : t("boxPhotoAlt")} size={64} />
      )}
      <SymbolShape shape={medicine.symbol.shape} colour={medicine.symbol.colour} size={48} className="shrink-0" />
      <span className="flex min-w-0 grow flex-col gap-1">
        <span dir="auto" className="type-body break-words font-bold">
          {name || t("unnamedMedicine")}
        </span>
        {medicine.purpose.trim() && (
          <span dir="auto" className="type-helper break-words text-ink-soft">
            {medicine.purpose.trim()}
          </span>
        )}
        <span className="flex flex-wrap gap-2 pt-1">
          {medicine.doses.length ? (
            medicine.doses.map((d) => <DoseChip key={d.slot} dose={d} form={medicine.form} />)
          ) : (
            <span className="type-helper text-warning">{t("noDosesYet")}</span>
          )}
        </span>
        {medicine.reviewed && (
          <span className="flex items-center gap-1 type-helper font-bold text-success">
            <Check size={18} />
            {t("cardChecked")}
          </span>
        )}
      </span>
      <Chevron size={20} className="mt-3 shrink-0 text-ink-soft" />
    </button>
  );
}

const doseFood: Record<Dose["food"], MessageKey> = {
  before: "doseFoodBefore",
  after: "doseFoodAfter",
  with: "doseFoodWith",
  any: "doseFoodAny",
};

/** Every dose written out, for checking against the prescription. */
export function DoseLines({ medicine, anchors }: { medicine: Medicine; anchors: Plan["anchors"] }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <ul className="flex flex-col gap-2">
      {medicine.doses.map((d) => (
        <li key={d.slot} className={`flex items-center gap-2 rounded-input px-2 py-1 ${slotTint[d.slot]}`}>
          <TimeOfDay slot={d.slot} size={32} className="shrink-0" />
          <span className="type-body">
            {fill(t("doseLine"), {
              anchor: anchors.labels[d.slot][lang] || t(slotText[d.slot]),
              quantity: quantityText(medicine.form, d.quantity)[lang],
              food: t(doseFood[d.food]),
            })}
          </span>
        </li>
      ))}
    </ul>
  );
}
