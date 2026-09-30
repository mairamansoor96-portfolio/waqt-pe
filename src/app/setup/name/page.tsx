"use client";

import { useRef, useState } from "react";
import { SetupScreen } from "@/components/SetupScreen";
import { TextField } from "@/components/TextField";
import { useT } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";

export default function NameStep() {
  const t = useT();
  const { plan, setPlan } = usePlan();
  const [error, setError] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  return (
    <SetupScreen
      step="name"
      question={t("qName")}
      onContinue={() => {
        if (plan.person.name.trim()) return true;
        setError(true);
        input.current?.focus();
        return false;
      }}
    >
      <TextField
        ref={input}
        label={t("nameLabel")}
        help={t("nameHelp")}
        error={error ? t("nameError") : undefined}
        value={plan.person.name}
        maxLength={80}
        autoComplete="off"
        enterKeyHint="next"
        onChange={(e) => {
          if (e.target.value.trim()) setError(false);
          const name = e.target.value;
          setPlan((p) => ({ ...p, person: { ...p.person, name } }));
        }}
      />
    </SetupScreen>
  );
}
