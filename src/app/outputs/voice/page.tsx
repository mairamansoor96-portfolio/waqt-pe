"use client";

// The voice-note script (SPEC.md → Voice-note script): shown in English and
// Urdu, each with a copy button, for a family member to read aloud and send
// as a WhatsApp voice note. Waqt Pe records and hosts no audio.

import { useState } from "react";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { OutputShell } from "@/components/sheets/OutputShell";
import { useFillNodes, useT, type MessageKey } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";
import { isHelper, type Plan } from "@/lib/plan";
import { scriptText, voiceScript, type ScriptLang } from "@/lib/voice";
import { SymbolShape, TimeOfDay } from "@/pictograms";

export default function VoiceScriptScreen() {
  const t = useT();
  const fillNodes = useFillNodes();
  const { plan } = usePlan();
  const helper = isHelper(plan.giver.type) ? plan.giver.helperName?.trim() : undefined;

  return (
    <OutputShell
      title={t("outputVoice")}
      paperChoice={false}
      controls={
        <>
          <p>{helper ? fillNodes(t("voiceHelpNamed"), { helper }) : t("voiceHelp")}</p>
          <p className="type-helper text-ink-soft">{t("voiceOwnWords")}</p>
        </>
      }
    >
      <Script plan={plan} lang="ur" heading="labelUr" copyLabel="copyScriptUr" />
      <Script plan={plan} lang="en" heading="labelEn" copyLabel="copyScriptEn" />
    </OutputShell>
  );
}

function Script({ plan, lang, heading, copyLabel }: { plan: Plan; lang: ScriptLang; heading: MessageKey; copyLabel: MessageKey }) {
  const t = useT();
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  const lines = voiceScript(plan, lang);
  const medicines = new Map(plan.medicines.map((m) => [m.id, m]));

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(scriptText(lines));
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  };

  return (
    <section aria-labelledby={`script-${lang}`} className="flex flex-col gap-3">
      <h2 id={`script-${lang}`} className="type-heading">
        {t(heading)}
      </h2>
      {/* The script itself is always in its own language and direction, whatever the interface language. */}
      <div
        data-script={lang}
        lang={lang}
        dir={lang === "ur" ? "rtl" : "ltr"}
        className="frame flex select-text flex-col gap-3 rounded-card bg-surface p-4 text-start"
      >
        {lines.map((line) => {
          const m = line.medicineId ? medicines.get(line.medicineId) : undefined;
          return (
            <p key={line.key} data-script-line={line.key} className="flex items-start gap-3 type-body">
              {m && line.slot && (
                <span aria-hidden="true" className="flex shrink-0 items-center gap-1 pt-1">
                  <TimeOfDay slot={line.slot} size={28} />
                  <SymbolShape shape={m.symbol.shape} colour={m.symbol.colour} size={28} />
                </span>
              )}
              <span className="min-w-0">{line.text}</span>
            </p>
          );
        })}
      </div>
      <Button full onClick={copyScript}>
        {t(copyLabel)}
      </Button>
      {copy === "copied" && (
        <Notice tone="success" role="status">
          {t("scriptCopied")}
        </Notice>
      )}
      {copy === "failed" && (
        <p role="alert" className="type-helper font-bold text-error">
          {t("scriptCopyFailed")}
        </p>
      )}
    </section>
  );
}
