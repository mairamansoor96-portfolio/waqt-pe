"use client";

import { SLOTS } from "@/lib/plan";
import { samplePlan } from "@/lib/sample";
import { slotTint } from "@/lib/slots";
import { useT } from "@/lib/i18n";
import { Perforation } from "./Trim";
import { Quantity, SymbolShape, TimeOfDay } from "@/pictograms";

const sample = samplePlan();

/**
 * A small, paper-proportioned preview of a fridge sheet built from the sample
 * plan. Placeholder pictograms; the real sheet comes in milestone 6.
 */
export function SampleSheet() {
  const t = useT();
  return (
    <figure className="flex flex-col gap-3">
      <div
        aria-hidden="true"
        className="mx-auto flex aspect-[210/297] w-full max-w-[360px] flex-col gap-2 rounded-input border-4 bg-white p-3"
        style={{ borderColor: sample.sheetVersion.borderColour }}
        dir="ltr"
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="type-heading">{sample.person.name}</span>
          <span className="type-helper font-bold">v{sample.sheetVersion.number}</span>
        </div>
        {SLOTS.map((slot) => {
          const doses = sample.medicines.flatMap((m) =>
            m.doses.filter((d) => d.slot === slot).map((d) => ({ m, d })),
          );
          if (!doses.length) return null; // empty slots are omitted
          return (
            <div key={slot} className={`flex grow items-center gap-3 rounded-input p-2 ${slotTint[slot]}`}>
              <TimeOfDay slot={slot} size={52} />
              <div className="flex flex-wrap gap-2">
                {doses.map(({ m, d }) => (
                  <div key={m.id} className="flex items-center gap-2 rounded-input border-[1.5px] border-line bg-white px-2 py-1">
                    <SymbolShape shape={m.symbol.shape} colour={m.symbol.colour} size={40} />
                    <Quantity form={m.form} quantity={d.quantity} size={30} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <Perforation className="mt-auto" />
        <div className="flex justify-around">
          {sample.contacts.map((c) => (
            <div key={c.id} className="flex flex-col items-center">
              <span className="type-helper">{c.name}</span>
              <span className="text-[13px] font-bold tabular-nums">{c.phone.replace("+92 ", "0")}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="type-helper text-ink-soft">{t("sampleCaption")}</figcaption>
    </figure>
  );
}
