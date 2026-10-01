"use client";

// The sticker sheet: one sticker per medicine, the symbol on a round sticker
// of exactly the chosen diameter (30 mm by default), the medicine name in
// small text beneath, and a dashed cut guide around each. SPEC.md → Sticker
// sheet. A 50 mm line lets the family check the printer didn't shrink it.

import { En, INK, PrintPage, SOFT, Ur } from "./print";
import { messages } from "@/lib/i18n";
import type { Plan } from "@/lib/plan";
import { mm, type StickerSize } from "@/lib/sheet";
import { SymbolShape } from "@/pictograms";

export function StickerSheet({ plan, size }: { plan: Plan; size: StickerSize }) {
  return (
    <PrintPage plan={plan} label={messages.outputStickers.en} fill={false}>
      <header style={{ display: "flex", gap: "3mm", alignItems: "baseline", flexWrap: "wrap" }}>
        <En size={14} bold>
          {plan.person.name}
        </En>
        <En size={12}>{messages.stickerCut.en}</En>
        <Ur size={14}>{messages.stickerCut.ur}</Ur>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "3mm" }}>
        {plan.medicines.map((m) => (
          <div
            key={m.id}
            data-sticker
            style={{
              width: `${size + 12}mm`,
              padding: "3mm",
              border: `0.3mm dashed ${SOFT}`,
              borderRadius: "3mm",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5mm",
              breakInside: "avoid",
            }}
          >
            {/* The sticker itself: a disc of exactly `size` mm, border included. */}
            <div
              data-sticker-disc
              style={{
                width: `${size}mm`,
                height: `${size}mm`,
                boxSizing: "border-box",
                border: `0.4mm solid ${INK}`,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SymbolShape shape={m.symbol.shape} colour={m.symbol.colour} size={mm(size * 0.9)} />
            </div>
            <span
              lang="en"
              dir="auto"
              style={{ fontSize: "9pt", lineHeight: 1.2, textAlign: "center", overflowWrap: "anywhere", maxWidth: "100%" }}
            >
              {m.name}
            </span>
          </div>
        ))}
      </div>

      <div data-calibration style={{ display: "flex", flexDirection: "column", gap: "1mm", breakInside: "avoid", marginTop: "2mm" }}>
        {/* 50 mm from the outer edge of one end mark to the other. */}
        <svg data-calibration-line width="50mm" height="3mm" viewBox="0 0 50 3" aria-hidden="true" style={{ display: "block" }}>
          <path d="M0 0h0.4v3H0zM49.6 0h0.4v3h-0.4zM0 1.3h50v0.4H0z" fill={INK} />
        </svg>
        <En size={10}>{messages.stickerCalibration.en}</En>
        <Ur size={12}>{messages.stickerCalibration.ur}</Ur>
      </div>
    </PrintPage>
  );
}
