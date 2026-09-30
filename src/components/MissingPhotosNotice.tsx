"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Notice } from "./Notice";
import { useT } from "@/lib/i18n";
import { missingPhotos, photoIds, useVersion } from "@/lib/photos";
import { usePlan } from "@/lib/plan-store";
import { stepPath } from "@/lib/steps";

/**
 * Shown when the plan names photos this device doesn't have, as happens when
 * the link is opened on another phone. SPEC.md → Global behaviour.
 */
export function MissingPhotosNotice({ showAction = true }: { showAction?: boolean }) {
  const t = useT();
  const { plan, status, go } = usePlan();
  const version = useVersion();
  const [missing, setMissing] = useState(0);
  const ids = photoIds(plan).join(",");

  useEffect(() => {
    if (status === "loading" || !ids) {
      setMissing(0);
      return;
    }
    let live = true;
    missingPhotos(ids.split(",")).then((m) => live && setMissing(m.length));
    return () => {
      live = false;
    };
  }, [ids, status, version]);

  if (!missing) return null;
  return (
    <Notice tone="warning" title={t("photosMissingTitle")}>
      <div className="flex flex-col gap-3">
        <p>{t("photosMissingBody")}</p>
        {showAction && (
          <Button variant="secondary" onClick={() => go(`${stepPath("save")}`)}>
            {t("photosMissingAction")}
          </Button>
        )}
      </div>
    </Notice>
  );
}
