"use client";

import { Check, ImageIcon } from "./icons";
import { PhotoThumb } from "./Photo";
import { Perforation } from "./Trim";
import { fill, useLang, useT, type MessageKey } from "@/lib/i18n";
import { quantityText } from "@/lib/medicine";
import { slotText, slotTint } from "@/lib/slots";
import type { Dose, Form, Medicine, Plan } from "@/lib/plan";
import { SymbolShape, TimeOfDay } from "@/pictograms";

/**
 * A capsule in the time-of-day tint with a 1.5 px ink border: time icon, the
 * slot name in bold, then the detail ("Morning 1 tablet, after food").
 */
export function DoseChip({ dose, form }: { dose: Dose; form: Form }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <span
      className={`inline-flex min-h-10 max-w-full items-center gap-x-2 rounded-chip border-[1.5px] border-ink py-0.5 ps-1 pe-3 ${slotTint[dose.slot]}`}
    >
      <TimeOfDay slot={dose.slot} size={28} className="shrink-0" />
      <span className="min-w-0 type-helper text-ink">
        <span className="font-bold">{t(slotText[dose.slot])}</span>{" "}
        {quantityText(form, dose.quantity)[lang]}, {t(doseFood[dose.food])}
      </span>
    </span>
  );
}

/**
 * Surface, 26 px radius, 2 px line border. Top row: the box photo (a dashed
 * empty pocket when there isn't one), name, purpose in the family's words,
 * and the symbol; then a perforation and the dose chips. Tapping opens the editor.
 */
export function MedicineCard({ medicine, onOpen }: { medicine: Medicine; onOpen: () => void }) {
  const t = useT();
  const name = medicine.name.trim();
  return (
    <button
      type="button"
      onClick={onOpen}
      data-symbol={`${medicine.symbol.colour} ${medicine.symbol.shape}`}
      className="frame flex w-full flex-col gap-3 rounded-card bg-surface p-4 text-start"
    >
      <span className="flex w-full items-start gap-3">
        {medicine.photoId ? (
          <PhotoThumb id={medicine.photoId} alt={name ? fill(t("boxPhotoAltNamed"), { name }) : t("boxPhotoAlt")} size={64} />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-16 shrink-0 items-center justify-center rounded-thumb border-2 border-dashed border-perforation text-perforation"
          >
            <ImageIcon size={26} />
          </span>
        )}
        <span className="flex min-w-0 grow flex-col">
          <span dir="auto" className="text-page-start type-title break-words">
            {name || t("unnamedMedicine")}
          </span>
          {medicine.purpose.trim() && (
            <span dir="auto" className="text-page-start type-helper break-words text-ink-soft">
              {medicine.purpose.trim()}
            </span>
          )}
          {medicine.reviewed && (
            <span className="flex items-center gap-1 pt-1 type-helper font-bold text-success">
              <Check size={18} className="shrink-0" />
              {t("cardChecked")}
            </span>
          )}
        </span>
        <SymbolShape shape={medicine.symbol.shape} colour={medicine.symbol.colour} size={34} className="shrink-0" />
      </span>
      <Perforation />
      <span className="flex flex-wrap gap-2">
        {medicine.doses.length ? (
          medicine.doses.map((d) => <DoseChip key={d.slot} dose={d} form={medicine.form} />)
        ) : (
          <span className="type-helper font-bold text-warning">{t("noDosesYet")}</span>
        )}
      </span>
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
        <li key={d.slot} className={`flex items-center gap-2 rounded-card border-[1.5px] border-ink py-1 ps-1 pe-4 ${slotTint[d.slot]}`}>
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
