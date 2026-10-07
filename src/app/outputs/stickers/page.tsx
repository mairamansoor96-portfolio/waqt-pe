"use client";

import { useState } from "react";
import { ChoiceChip } from "@/components/ChoiceChip";
import { Notice } from "@/components/Notice";
import { OutputShell } from "@/components/sheets/OutputShell";
import { SheetFrame } from "@/components/sheets/SheetFrame";
import { StickerSheet } from "@/components/sheets/StickerSheet";
import { useT, type MessageKey } from "@/lib/i18n";
import { useDone } from "@/lib/done";
import { usePlan } from "@/lib/plan-store";
import { DEFAULT_STICKER_SIZE, STICKER_SIZES, type StickerSize } from "@/lib/sheet";

const sizeText: Record<StickerSize, MessageKey> = { 20: "stickerSmall", 30: "stickerMedium", 40: "stickerLarge" };

// The sticker sheet screen. The size is a choice for this print, not part of
// the plan (the data model has no field for it).
export default function StickersScreen() {
  const t = useT();
  const { plan } = usePlan();
  const { markDone } = useDone();
  const [size, setSize] = useState<StickerSize>(DEFAULT_STICKER_SIZE);
  const [printed, setPrinted] = useState(false);

  return (
    <OutputShell
      title={t("outputStickers")}
      printHelp={t("actualSizeHelp")}
      printLabel={t("printStickers")}
      onPrint={() => {
        window.print();
        markDone("stickers");
        setPrinted(true);
      }}
      controls={
        <>
          {printed && (
            <Notice tone="success" role="status">
              {t("stickersReady")}
            </Notice>
          )}
          <p className="text-ink-soft">{t("stickersHelp")}</p>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 type-heading">{t("stickerSizeLabel")}</legend>
            <div className="flex flex-wrap gap-2">
              {STICKER_SIZES.map((s) => (
                <ChoiceChip key={s} type="radio" name="sticker-size" label={t(sizeText[s])} checked={size === s} onChange={() => setSize(s)} />
              ))}
            </div>
          </fieldset>
        </>
      }
    >
      <SheetFrame>
        <StickerSheet plan={plan} size={size} />
      </SheetFrame>
    </OutputShell>
  );
}
