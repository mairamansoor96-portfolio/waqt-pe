"use client";

// The fridge sheet: page 1 is the schedule, page 2 the weekly tick grid.
// SPEC.md → Output specs → Fridge sheet. Sized in mm so it prints at true
// size; the screen preview scales it down (SheetFrame).

import type { CSSProperties } from "react";
import { En, INK, PrintPage, SOFT, TINT, Ur } from "./print";
import { fill, messages } from "@/lib/i18n";
import { quantityText } from "@/lib/medicine";
import { giverDefaults, isHelper, type FoodVariant, type Plan, type TickVariant } from "@/lib/plan";
import { usePhoto } from "@/lib/photos";
import { dosesBySlot, mm, printDate, tickRows, type SheetDose } from "@/lib/sheet";
import {
  AnchorPictogram,
  CallPictogram,
  FoodPictogram,
  Quantity,
  SymbolShape,
  TickBoxPictogram,
  TimeOfDay,
} from "@/pictograms";

const foodKey = { before: "doseFoodBefore", after: "doseFoodAfter", with: "doseFoodWith", any: "doseFoodAny" } as const;

export interface SheetOptions {
  plan: Plan;
  version: { number: number; borderColour: string };
  date: Date;
  foodVariant: FoodVariant;
  tickVariant: TickVariant;
}

/** A photo from this device, or the medicine's symbol when there isn't one here. */
function BoxPhoto({ dose }: { dose: SheetDose }) {
  const photo = usePhoto(dose.medicine.photoId);
  const frame: CSSProperties = { width: "30mm", height: "22.5mm", borderRadius: "2mm", flexShrink: 0 };
  if (photo.status === "ready") {
    // eslint-disable-next-line @next/next/no-img-element -- object URL from IndexedDB
    return <img src={photo.url} alt="" style={{ ...frame, objectFit: "cover", border: "0.4mm solid #999" }} />;
  }
  return (
    <span style={{ ...frame, display: "flex", alignItems: "center", justifyContent: "center", border: "0.4mm dashed #999" }}>
      <SymbolShape shape={dose.medicine.symbol.shape} colour={dose.medicine.symbol.colour} size={mm(18)} />
    </span>
  );
}

function DoseCard({ dose, plan, foodVariant }: { dose: SheetDose; plan: Plan; foodVariant: FoodVariant }) {
  const d = giverDefaults(plan.giver.type);
  const { medicine } = dose;
  const q = quantityText(medicine.form, dose.dose.quantity);
  const labelColour = d.textInBackground ? SOFT : INK;
  const en = d.largeText ? 14 : 12;
  const ur = d.largeText ? 16 : 14;
  return (
    <div
      data-dose-card
      data-dose={`${dose.dose.slot}-${medicine.id}`}
      style={{
        width: "68mm",
        padding: "2.5mm",
        border: "0.5mm solid #8A8FA8",
        borderRadius: "2.5mm",
        background: "#fff",
        breakInside: "avoid",
        display: "flex",
        flexDirection: "column",
        gap: "1.5mm",
      }}
    >
      {/* Photo, then beside it: symbol and food on one line, the quantity drawn below. */}
      <div style={{ display: "flex", gap: "2.5mm", alignItems: "flex-start" }}>
        <BoxPhoto dose={dose} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5mm", minWidth: 0 }}>
          <div style={{ display: "flex", gap: "1mm", alignItems: "center" }}>
            <SymbolShape shape={medicine.symbol.shape} colour={medicine.symbol.colour} size={mm(12)} />
            <FoodPictogram food={dose.dose.food} variant={foodVariant} size={mm(8.5)} />
          </div>
          <Quantity form={medicine.form} quantity={dose.dose.quantity} size={mm(8)} />
        </div>
      </div>
      <div style={{ color: labelColour }}>
        <En size={en} bold style={{ overflowWrap: "anywhere" }}>
          {medicine.name}
        </En>
        <En size={en}>
          {q.en}, {messages[foodKey[dose.dose.food]].en}
        </En>
        <Ur size={ur}>
          {q.ur}، {messages[foodKey[dose.dose.food]].ur}
        </Ur>
      </div>
    </div>
  );
}

function ContactFace({ id, name }: { id?: string; name: string }) {
  const photo = usePhoto(id);
  const frame: CSSProperties = { width: "18mm", height: "18mm", borderRadius: "50%", flexShrink: 0 };
  if (photo.status === "ready") {
    // eslint-disable-next-line @next/next/no-img-element -- object URL from IndexedDB
    return <img src={photo.url} alt="" style={{ ...frame, objectFit: "cover", border: "0.4mm solid #999" }} />;
  }
  return (
    <span
      style={{ ...frame, display: "flex", alignItems: "center", justifyContent: "center", border: "0.5mm solid #8A8FA8", fontSize: "16pt", fontWeight: 700 }}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function VersionMark({ version, date }: { version: SheetOptions["version"]; date: Date }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2mm" }}>
      <span style={{ width: "6mm", height: "6mm", borderRadius: "1mm", background: version.borderColour, flexShrink: 0 }} />
      <En size={12} bold>
        {fill(messages.sheetVersion.en, { n: version.number })} · {fill(messages.sheetPrinted.en, { date: printDate(date) })}
      </En>
    </div>
  );
}

/** Page 1: the schedule. */
export function SchedulePage({ plan, version, date, foodVariant, className }: SheetOptions & { className?: string }) {
  const rows = dosesBySlot(plan);
  const helper = isHelper(plan.giver.type) ? plan.giver.helperName?.trim() : undefined;
  const d = giverDefaults(plan.giver.type);
  return (
    <PrintPage plan={plan} border={version.borderColour} label={messages.page1Label.en} className={className}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "4mm", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "3mm", alignItems: "baseline", flexWrap: "wrap" }}>
          <En size={18} bold>
            {plan.person.name}
          </En>
          {helper && d.helperNamedOnSheet && (
            <>
              <En size={12}>{fill(messages.sheetFor.en, { helper })}</En>
              <Ur size={14}>{fill(messages.sheetFor.ur, { helper })}</Ur>
            </>
          )}
        </div>
        <VersionMark version={version} date={date} />
      </header>

      {rows.map(({ slot, doses }) => (
        <div
          key={slot}
          data-slot-row={slot}
          // Rows may split between cards (a row of 8 cards is taller than a page); cards never split.
          style={{ display: "flex", gap: "3mm", background: TINT[slot], borderRadius: "3mm", padding: "2.5mm", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}
        >
          <div style={{ width: "30mm", flexShrink: 0, display: "flex", flexDirection: "column", gap: "1mm" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5mm" }}>
              <TimeOfDay slot={slot} size={mm(16)} />
              <AnchorPictogram mode={plan.anchors.mode} slot={slot} size={mm(11)} />
            </div>
            <En size={12} bold style={{ overflowWrap: "anywhere" }}>
              {plan.anchors.labels[slot].en}
            </En>
            <Ur size={14}>{plan.anchors.labels[slot].ur}</Ur>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3mm", flex: 1, minWidth: 0 }}>
            {doses.map((dose) => (
              <DoseCard key={dose.medicine.id} dose={dose} plan={plan} foodVariant={foodVariant} />
            ))}
          </div>
        </div>
      ))}

      {plan.contacts.length > 0 && (
        <footer
          style={{ marginTop: "auto", borderTop: "0.5mm solid #8A8FA8", paddingTop: "3mm", breakInside: "avoid", display: "flex", gap: "4mm", alignItems: "center" }}
        >
          <div style={{ width: "30mm", flexShrink: 0, display: "flex", flexDirection: "column", gap: "1mm" }}>
            <CallPictogram size={mm(9)} />
            <En size={12} bold>
              {messages.sheetCall.en}
            </En>
            <Ur size={14}>{messages.sheetCall.ur}</Ur>
          </div>
          <div style={{ display: "flex", gap: "3mm 4mm", flexWrap: "wrap", flex: 1, minWidth: 0 }}>
            {plan.contacts.map((c) => (
              <div key={c.id} data-contact style={{ display: "flex", gap: "2.5mm", alignItems: "center", minWidth: "48mm", flex: "1 1 48mm" }}>
                <ContactFace id={c.photoId} name={c.name} />
                <div style={{ minWidth: 0 }}>
                  <En size={12} bold style={{ overflowWrap: "anywhere" }}>
                    {c.name}
                    {c.relation && <span style={{ fontWeight: 400 }}>, {c.relation}</span>}
                  </En>
                  <span
                    dir="ltr"
                    style={{ fontSize: "16pt", fontWeight: 700, fontVariantNumeric: "tabular-nums", display: "block", lineHeight: 1.2, overflowWrap: "anywhere" }}
                  >
                    {c.phone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </footer>
      )}
    </PrintPage>
  );
}

const DAYS = [
  { en: "Mon", ur: "پیر", tint: "#FBD9D9" },
  { en: "Tue", ur: "منگل", tint: "#FFEDB3" },
  { en: "Wed", ur: "بدھ", tint: "#D3F0DC" },
  { en: "Thu", ur: "جمعرات", tint: "#D6E6FA" },
  { en: "Fri", ur: "جمعہ", tint: "#EBDAF5" },
  { en: "Sat", ur: "ہفتہ", tint: "#FFDFC4" },
  { en: "Sun", ur: "اتوار", tint: "#E3E3E3" },
];

/** Page 2: the tick grid, one row per dose and seven day columns. */
export function TickGridPage({
  plan,
  version,
  date,
  tickVariant,
  className,
  breakBefore = true,
}: SheetOptions & { className?: string; /** False when the tick grid prints on its own. */ breakBefore?: boolean }) {
  const rows = tickRows(plan);
  const cell: CSSProperties = { width: "13mm", height: "13mm", border: "0.7mm solid #000", padding: 0 };
  const colour = tickVariant === "colourColumns";
  return (
    <PrintPage plan={plan} border={version.borderColour} label={messages.page2Label.en} breakBefore={breakBefore} className={className}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "4mm" }}>
        <div style={{ display: "flex", gap: "3mm", alignItems: "center" }}>
          <TickBoxPictogram size={mm(12)} />
          <div>
            <En size={16} bold>
              {plan.person.name}
            </En>
            <En size={12}>{messages.tickTitle.en}</En>
            <Ur size={14}>{messages.tickTitle.ur}</Ur>
          </div>
        </div>
        <VersionMark version={version} date={date} />
      </header>
      {!colour && (
        <div style={{ display: "flex", alignItems: "baseline", gap: "2mm", flexWrap: "wrap" }}>
          <En size={12} bold>
            {messages.weekStarting.en}
          </En>
          <Ur size={14}>{messages.weekStarting.ur}</Ur>
          <span style={{ borderBottom: "0.5mm solid #000", width: "50mm", display: "inline-block" }} />
        </div>
      )}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ display: "table-header-group" }}>
          <tr>
            <th style={{ textAlign: "start" }}>
              {/* Named for screen readers; the printed column needs no heading. */}
              <span className="sr-only">{messages.docColMedicine.en}</span>
            </th>
            {DAYS.map((day, i) => (
              <th
                key={day.en}
                style={{
                  ...cell,
                  height: "auto",
                  background: colour ? day.tint : "#fff",
                  verticalAlign: "bottom",
                  paddingBottom: "1mm",
                }}
              >
                {colour ? (
                  <>
                    <En size={12} bold>
                      {day.en}
                    </En>
                    <Ur size={12} style={{ lineHeight: 1.8 }}>
                      {day.ur}
                    </Ur>
                  </>
                ) : (
                  <span style={{ fontSize: "16pt", fontWeight: 700 }}>{i + 1}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ medicine, dose, slot }) => (
            <tr key={`${slot}-${medicine.id}`} data-tick-row style={{ breakInside: "avoid" }}>
              <td style={{ padding: "1mm 2mm 1mm 0", borderBottom: "0.3mm solid #ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5mm" }}>
                  <span style={{ background: TINT[slot], borderRadius: "1.5mm", display: "flex", padding: "0.5mm" }}>
                    <TimeOfDay slot={slot} size={mm(9)} />
                  </span>
                  <SymbolShape shape={medicine.symbol.shape} colour={medicine.symbol.colour} size={mm(9)} />
                  <Quantity form={medicine.form} quantity={dose.quantity} size={mm(6)} />
                  <En size={12} style={{ overflowWrap: "anywhere", minWidth: 0 }}>
                    {medicine.name}
                  </En>
                </div>
              </td>
              {DAYS.map((day) => (
                <td key={day.en} style={{ ...cell, background: colour ? day.tint : "#fff" }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </PrintPage>
  );
}
