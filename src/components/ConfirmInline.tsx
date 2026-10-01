"use client";

import { useState, type ReactNode } from "react";
import { Button } from "./Button";

/**
 * A two-step action for anything hard to undo. The first tap shows the
 * consequence in the page (not a browser dialog), the second confirms.
 */
export function ConfirmInline({
  trigger,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  variant = "danger",
}: {
  trigger: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel: ReactNode;
  onConfirm: () => void | Promise<void>;
  variant?: "danger" | "secondary";
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Button variant={variant} full onClick={() => setOpen(true)}>
        {trigger}
      </Button>
    );
  }
  return (
    <div role="group" aria-label={typeof title === "string" ? title : undefined} className="flex flex-col gap-3 rounded-card border-2 border-warning bg-surface p-4">
      <p className="type-body font-bold">{title}</p>
      {body && <p className="text-ink-soft">{body}</p>}
      <Button
        variant={variant}
        full
        onClick={async () => {
          await onConfirm();
          setOpen(false);
        }}
      >
        {confirmLabel}
      </Button>
      <Button variant="secondary" full onClick={() => setOpen(false)} autoFocus>
        {cancelLabel}
      </Button>
    </div>
  );
}
