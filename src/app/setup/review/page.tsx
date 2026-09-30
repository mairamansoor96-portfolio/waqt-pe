"use client";

import { Button } from "@/components/Button";
import { DoseLines } from "@/components/MedicineCard";
import { Notice } from "@/components/Notice";
import { PhotoThumb } from "@/components/Photo";
import { SetupScreen } from "@/components/SetupScreen";
import { Check } from "@/components/icons";
import { fill, useFillNodes, useT } from "@/lib/i18n";
import { markReviewed } from "@/lib/medicine";
import { usePlan } from "@/lib/plan-store";
import { canPrint, giverDefaults, type Medicine } from "@/lib/plan";
import { OUTPUTS_PATH, editorPath, stepPath } from "@/lib/steps";
import { SymbolShape } from "@/pictograms";

// Screen 8: each medicine beside its box photo; the family ticks "Matches the
// prescription" for each. This is the only place `reviewed` is set to true.
export default function ReviewStep() {
  const t = useT();
  const { plan, setPlan, go } = usePlan();
  const { medicines } = plan;
  const checked = medicines.filter((m) => m.reviewed).length;
  const photoNeeded = giverDefaults(plan.giver.type).boxPhotos === "required";

  const setReviewed = (id: string, reviewed: boolean) =>
    setPlan((p) => ({ ...p, medicines: p.medicines.map((m) => (m.id === id ? markReviewed(m, reviewed) : m)) }));

  return (
    <SetupScreen
      step="review"
      question={t("qReview")}
      help={medicines.length ? t("reviewHelp") : undefined}
      continuePath={OUTPUTS_PATH}
      continueLabel={t("seeSheets")}
    >
      {medicines.length === 0 ? (
        <>
          <p>{t("reviewEmpty")}</p>
          <Button variant="secondary" full onClick={() => go(stepPath("medicines"))}>
            {t("goMedicines")}
          </Button>
        </>
      ) : (
        <>
          <p role="status" className="type-heading">
            {fill(t("reviewCount"), { n: checked, total: medicines.length })}
          </p>
          <ul className="flex flex-col gap-4">
            {medicines.map((m) => (
              <li key={m.id}>
                <ReviewItem
                  medicine={m}
                  anchors={plan.anchors}
                  photoNeeded={photoNeeded}
                  onReviewed={(r) => setReviewed(m.id, r)}
                  onChange={() => go(editorPath(m.id))}
                />
              </li>
            ))}
          </ul>
          {canPrint(plan) && (
            <Notice tone="success" role="status">
              {t("reviewAllDone")}
            </Notice>
          )}
        </>
      )}
    </SetupScreen>
  );
}

function ReviewItem({
  medicine,
  anchors,
  photoNeeded,
  onReviewed,
  onChange,
}: {
  medicine: Medicine;
  anchors: Parameters<typeof DoseLines>[0]["anchors"];
  photoNeeded: boolean;
  onReviewed: (reviewed: boolean) => void;
  onChange: () => void;
}) {
  const t = useT();
  const fillNodes = useFillNodes();
  const name = medicine.name.trim();
  const ok = medicine.reviewed;

  return (
    <article
      data-review={medicine.id}
      className={`flex flex-col gap-3 rounded-card bg-surface p-4 ${ok ? "border-3 border-success" : "frame"}`}
    >
      <div className="flex items-start gap-3">
        {medicine.photoId ? (
          <PhotoThumb id={medicine.photoId} alt={name ? fill(t("boxPhotoAltNamed"), { name }) : t("boxPhotoAlt")} size={112} />
        ) : (
          <span className="flex size-28 shrink-0 items-center justify-center rounded-input border-2 border-dashed border-line p-2 text-center type-helper text-ink-soft">
            {t("reviewNoPhoto")}
          </span>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <SymbolShape shape={medicine.symbol.shape} colour={medicine.symbol.colour} size={40} />
          <h2 dir="auto" className="type-heading break-words">
            {name}
          </h2>
          {medicine.purpose.trim() && (
            <p dir="auto" className="type-helper break-words text-ink-soft">
              {medicine.purpose.trim()}
            </p>
          )}
        </div>
      </div>
      {!medicine.photoId && photoNeeded && <p className="type-helper font-bold text-warning">{t("reviewPhotoNeeded")}</p>}

      <DoseLines medicine={medicine} anchors={anchors} />

      <label
        className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-input px-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary ${
          ok ? "bg-success text-white" : "border-2 border-primary text-primary"
        }`}
      >
        <input type="checkbox" checked={ok} onChange={(e) => onReviewed(e.target.checked)} className="sr-only" />
        <span
          aria-hidden="true"
          className={`flex size-8 shrink-0 items-center justify-center rounded-input ${ok ? "bg-white text-success" : "border-2 border-primary bg-surface"}`}
        >
          {ok && <Check size={22} />}
        </span>
        <span className="type-body font-bold">
          {t("reviewMatches")}
          {/* Each tick says which medicine it's for. */}
          {name && <span className="sr-only">: {name}</span>}
        </span>
      </label>

      <Button variant="secondary" onClick={onChange}>
        {name ? fillNodes(t("editMedicineNamed"), { name }) : t("change")}
      </Button>
    </article>
  );
}
