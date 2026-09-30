"use client";

// The doctor's list: one portrait page in plain clinical English. A table of
// medicine, form, dose and timing, food and the family's note, then
// conditions, allergies, blood group, contacts and the print date.
// SPEC.md → Doctor's list.

import type { CSSProperties } from "react";
import { En, INK, PrintPage } from "./print";
import { fill, messages } from "@/lib/i18n";
import type { Plan } from "@/lib/plan";
import { doctorRows, mm, printDate } from "@/lib/sheet";
import { SymbolShape } from "@/pictograms";

const cell: CSSProperties = { border: "0.3mm solid #8A8FA8", padding: "1.2mm 2mm", verticalAlign: "top", fontSize: "11pt", lineHeight: 1.3 };
const head: CSSProperties = { ...cell, background: "#ECEDF3", fontWeight: 700, textAlign: "start" };

export function DoctorList({ plan, date }: { plan: Plan; date: Date }) {
  const rows = doctorRows(plan);
  const { person } = plan;
  const none = messages.docConditionsNone.en;

  const details: [string, string][] = [
    [messages.docConditions.en, person.conditions.length ? person.conditions.join("; ") : none],
    [messages.docAllergies.en, person.allergies.length ? person.allergies.join("; ") : messages.docNoneListed.en],
    [messages.docBloodGroup.en, person.bloodGroup || messages.docNotRecorded.en],
  ];

  return (
    <PrintPage plan={plan} label={messages.outputDoctor.en} fill={false}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "4mm", flexWrap: "wrap", borderBottom: `0.5mm solid ${INK}`, paddingBottom: "2mm" }}>
        <div>
          <En size={18} bold>
            {messages.docTitle.en}: {person.name}
          </En>
        </div>
        <En size={11}>{fill(messages.docPrinted.en, { date: printDate(date) })}</En>
      </header>

      <table style={{ borderCollapse: "collapse", width: "100%" }} lang="en">
        <thead style={{ display: "table-header-group" }}>
          <tr>
            <th style={head}>{messages.docColMedicine.en}</th>
            <th style={head}>{messages.docColForm.en}</th>
            <th style={head}>{messages.docColDose.en}</th>
            <th style={head}>{messages.docColFood.en}</th>
            <th style={head}>{messages.docColPurpose.en}</th>
          </tr>
        </thead>
        {rows.map(({ medicine, form, timing, food }) => {
          const lines = Math.max(1, timing.length);
          return (
            // One body per medicine, so a medicine's rows never split across pages.
            <tbody key={medicine.id} data-doctor-row style={{ breakInside: "avoid" }}>
              {Array.from({ length: lines }, (_, i) => (
                <tr key={i}>
                  {i === 0 && (
                    <td style={{ ...cell, fontWeight: 700, width: "32%", overflowWrap: "anywhere" }} rowSpan={lines}>
                      <span style={{ display: "flex", gap: "1.5mm", alignItems: "flex-start" }}>
                        <SymbolShape shape={medicine.symbol.shape} colour={medicine.symbol.colour} size={mm(5)} className="shrink-0" />
                        <span dir="auto">{medicine.name}</span>
                      </span>
                    </td>
                  )}
                  {i === 0 && (
                    <td style={cell} rowSpan={lines}>
                      {form}
                    </td>
                  )}
                  <td style={cell}>{timing[i] ?? "—"}</td>
                  <td style={cell}>{food[i] ?? "—"}</td>
                  {i === 0 && (
                    <td style={{ ...cell, overflowWrap: "anywhere" }} rowSpan={lines} dir="auto">
                      {medicine.purpose || "—"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          );
        })}
      </table>

      <dl style={{ display: "grid", gridTemplateColumns: "34mm 1fr", gap: "1.5mm 4mm", fontSize: "11pt", lineHeight: 1.35, breakInside: "avoid" }}>
        {details.map(([label, value]) => (
          <div key={label} style={{ display: "contents" }}>
            <dt style={{ fontWeight: 700 }}>{label}</dt>
            <dd dir="auto" style={{ overflowWrap: "anywhere" }}>
              {value}
            </dd>
          </div>
        ))}
        <dt style={{ fontWeight: 700 }}>{messages.docContacts.en}</dt>
        <dd>
          {plan.contacts.length
            ? plan.contacts.map((c) => (
                <span key={c.id} style={{ display: "block", overflowWrap: "anywhere" }}>
                  <bdi>{c.name}</bdi>
                  {c.relation && <>, {c.relation}</>} · <bdi dir="ltr">{c.phone}</bdi>
                </span>
              ))
            : messages.docNotRecorded.en}
        </dd>
      </dl>

      <footer style={{ borderTop: "0.3mm solid #8A8FA8", paddingTop: "2mm", breakInside: "avoid" }}>
        <En size={9} style={{ color: "#4A5070" }}>
          {messages.docFooter.en}
        </En>
      </footer>
    </PrintPage>
  );
}
