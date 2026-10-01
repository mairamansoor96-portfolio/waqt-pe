"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";
import { CameraIcon, ImageIcon } from "./icons";
import { useT } from "@/lib/i18n";
import { PhotoError, addPhoto, usePhoto } from "@/lib/photos";

type Shape = "box" | "face";

/** A stored photo, or a quiet placeholder when there isn't one on this device. */
export function PhotoThumb({ id, alt, size, shape = "box" }: { id?: string; alt: string; size: number; shape?: Shape }) {
  const photo = usePhoto(id);
  const t = useT();
  const round = shape === "face" ? "rounded-chip" : "rounded-thumb";
  if (photo.status === "ready") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- object URLs from IndexedDB, not optimisable
      <img src={photo.url} alt={alt} width={size} height={size} className={`${round} shrink-0 border-2 border-line bg-white object-cover`} style={{ width: size, height: size }} />
    );
  }
  if (photo.status === "missing") {
    return (
      <span
        role="img"
        aria-label={t("photoMissing")}
        className={`${round} flex shrink-0 items-center justify-center border-2 border-dashed border-warning bg-surface text-warning`}
        style={{ width: size, height: size }}
      >
        <ImageIcon size={Math.min(28, size / 2)} />
      </span>
    );
  }
  return null;
}

/**
 * Take or choose a photo. The photo is shrunk and stored on this device;
 * onChange gets its new id (or undefined when removed). The caller deletes
 * the old photo once the plan points at the new one.
 */
export function PhotoPicker({
  photoId,
  onChange,
  alt,
  heading,
  help,
  note,
  shape = "box",
}: {
  photoId?: string;
  onChange: (id: string | undefined) => void;
  alt: string;
  heading: ReactNode;
  help: ReactNode;
  note?: ReactNode;
  shape?: Shape;
}) {
  const t = useT();
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<"unreadable" | "storage" | null>(null);
  const photo = usePhoto(photoId);

  const take = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await addPhoto(file));
    } catch (e) {
      setError(e instanceof PhotoError ? e.reason : "unreadable");
    } finally {
      setBusy(false);
      if (camera.current) camera.current.value = "";
      if (gallery.current) gallery.current.value = "";
    }
  };

  const hasPhoto = photo.status === "ready";
  const size = shape === "face" ? 96 : 160;

  return (
    <section className="flex flex-col gap-3" data-photo={photo.status}>
      <div className="flex flex-col gap-1">
        {/* A face photo sits inside a contact card, so its heading matches the field labels there. */}
        <h2 className={shape === "face" ? "type-body font-bold" : "type-heading"}>{heading}</h2>
        <p className="type-helper text-ink-soft">{help}</p>
        {note && <p className="type-helper font-bold text-warning">{note}</p>}
      </div>

      {photoId && <PhotoThumb id={photoId} alt={alt} size={size} shape={shape} />}
      {photo.status === "missing" && <p className="type-helper text-warning">{t("photoMissing")}</p>}

      <input ref={camera} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => take(e.target.files?.[0])} />
      <input ref={gallery} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => take(e.target.files?.[0])} />

      <div className="flex flex-wrap gap-2">
        {/* Secondary: the screen's one primary action lives in the sticky bottom bar. */}
        <Button variant="secondary" disabled={busy} onClick={() => camera.current?.click()} className="grow">
          <CameraIcon />
          {hasPhoto ? t("photoRetake") : t("photoTake")}
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => gallery.current?.click()} className="grow">
          <ImageIcon />
          {t("photoChoose")}
        </Button>
      </div>
      {photoId && (
        <Button variant="secondary" disabled={busy} onClick={() => onChange(undefined)}>
          {t("photoRemove")}
        </Button>
      )}
      {busy && (
        <p role="status" className="type-helper text-ink-soft">
          {t("photoSaving")}
        </p>
      )}
      {error && (
        <p role="alert" className="type-helper font-bold text-error">
          {t(error === "storage" ? "photoStorage" : "photoUnreadable")}
        </p>
      )}
    </section>
  );
}
