"use client";

import { useRef, useState } from "react";
import { Button } from "./Button";
import { Notice } from "./Notice";
import { applyBackupPhotos, readBackup, type ImportError, type ReadBackup } from "@/lib/backup";
import { fill, useFillNodes, useT } from "@/lib/i18n";
import { usePlan } from "@/lib/plan-store";

/**
 * "Choose a saved file": reads a .waqtpe file, shows what's in it, and only
 * replaces the current plan after the family confirms in the page.
 */
export function ImportControl({ onImported }: { onImported?: () => void }) {
  const t = useT();
  const fillNodes = useFillNodes();
  const { setPlan } = usePlan();
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ReadBackup | null>(null);
  const [error, setError] = useState<ImportError | null>(null);
  const [done, setDone] = useState<number | null>(null);

  const choose = async (file: File | undefined) => {
    if (input.current) input.current.value = "";
    if (!file) return;
    setError(null);
    setDone(null);
    const result = await readBackup(file);
    if (typeof result === "string") setError(result);
    else setPending(result);
  };

  const confirm = async () => {
    if (!pending) return;
    await applyBackupPhotos(pending);
    setPlan(pending.plan);
    setDone(pending.photos.size);
    setPending(null);
    onImported?.();
  };

  const name = pending?.plan.person.name.trim();

  return (
    <div className="flex flex-col gap-3">
      {/* No accept filter: iOS greys out unknown extensions like .waqtpe. The file is checked after choosing. */}
      <input ref={input} type="file" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => choose(e.target.files?.[0])} />
      {pending ? (
        <div role="group" className="frame flex flex-col gap-3 rounded-card border-s-4 border-s-warning bg-surface p-4">
          <p className="type-body font-bold">{name ? fillNodes(t("importConfirmNamed"), { name }) : t("importConfirm")}</p>
          <p className="text-ink-soft">
            {fill(t("importConfirmBody"), { medicines: pending.plan.medicines.length, photos: pending.photos.size })}
          </p>
          <Button full onClick={confirm}>
            {t("importYes")}
          </Button>
          <Button variant="secondary" full onClick={() => setPending(null)} autoFocus>
            {t("importCancel")}
          </Button>
        </div>
      ) : (
        <Button variant="secondary" full onClick={() => input.current?.click()}>
          {t("importChoose")}
        </Button>
      )}
      {error && (
        <p role="alert" className="type-helper font-bold text-error">
          {t(error === "tooBig" ? "importTooBig" : "importNotFile")}
        </p>
      )}
      {done !== null && (
        <Notice tone="success" role="status">
          {fill(t("imported"), { n: done })}
        </Notice>
      )}
    </div>
  );
}
