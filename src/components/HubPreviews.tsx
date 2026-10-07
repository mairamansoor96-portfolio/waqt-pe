"use client";

// Small pictures of each output on the outputs hub, drawn from the family's
// own plan: their times of day, their medicines' symbols, their contacts.
// Decorative: the card text says what each one is, so every picture is
// aria-hidden. Symbols and pictograms never flip in RTL.

import { TINT } from "./sheets/print";
import { usePhoto } from "@/lib/photos";
import type { Contact, Plan } from "@/lib/plan";
import { dosesBySlot } from "@/lib/sheet";
import { SymbolShape, TimeOfDay } from "@/pictograms";

/** The fridge sheet in miniature: a row per time of day with its doses' symbols, then the faces to call. */
export function FridgePreview({ plan }: { plan: Plan }) {
  const rows = dosesBySlot(plan);
  return (
    <div aria-hidden="true" className="rounded-input bg-ground p-3">
      <div className="flex flex-col gap-2 rounded-thumb border-3 border-primary bg-white p-3">
        {rows.map(({ slot, doses }) => (
          <div key={slot} className="flex items-center gap-3 rounded-input p-2" style={{ background: TINT[slot] }}>
            <TimeOfDay slot={slot} size={32} />
            <div className="flex min-w-0 flex-wrap gap-2">
              {doses.map(({ medicine }) => (
                <span key={medicine.id} className="flex size-10 items-center justify-center rounded-input border-2 border-line bg-white">
                  <SymbolShape shape={medicine.symbol.shape} colour={medicine.symbol.colour} size={28} />
                </span>
              ))}
            </div>
          </div>
        ))}
        {plan.contacts.length > 0 && (
          <div className="perforation-top flex gap-2 pt-3">
            {plan.contacts.map((c) => (
              <Face key={c.id} contact={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Face({ contact }: { contact: Contact }) {
  const photo = usePhoto(contact.photoId);
  if (photo.status === "ready") {
    // eslint-disable-next-line @next/next/no-img-element -- object URL from IndexedDB
    return <img src={photo.url} alt="" className="size-10 shrink-0 rounded-chip border-2 border-line object-cover" />;
  }
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-chip border-2 border-perforation bg-white font-bold text-ink">
      {Array.from(contact.name.trim())[0]?.toLocaleUpperCase() ?? ""}
    </span>
  );
}

/** A 96 px ground-coloured well, for the smaller cards. */
function Well({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" className="flex size-24 shrink-0 items-center justify-center rounded-input bg-ground">
      {children}
    </span>
  );
}

/** Each medicine's sticker, cut guides and all. */
export function StickersPreview({ plan }: { plan: Plan }) {
  const shown = plan.medicines.slice(0, 4);
  return (
    <Well>
      <span className="grid grid-cols-2 gap-1">
        {shown.map((m) => (
          <span key={m.id} className="flex size-10 items-center justify-center rounded-chip border-2 border-dashed border-perforation bg-white">
            <SymbolShape shape={m.symbol.shape} colour={m.symbol.colour} size={26} />
          </span>
        ))}
      </span>
    </Well>
  );
}

/** A voice-note message bubble. */
export function VoicePreview() {
  return (
    <Well>
      <svg width="80" height="40" viewBox="0 0 80 40" focusable="false">
        <rect x="1" y="1" width="78" height="38" rx="19" fill="var(--color-primary-tint)" stroke="var(--color-primary)" strokeWidth="2" />
        <circle cx="20" cy="20" r="11" fill="var(--color-primary)" />
        <path d="M17 14.5v11l9-5.5z" fill="var(--color-white)" />
        {[6, 12, 8, 16, 10, 14, 7, 11, 5].map((h, i) => (
          <rect key={i} x={37 + i * 4} y={20 - h / 2} width="2.2" height={h} rx="1.1" fill="var(--color-primary)" />
        ))}
      </svg>
    </Well>
  );
}

/** A phone with the emergency card on its lock screen: a line per detail the plan has. */
export function LockPreview({ plan }: { plan: Plan }) {
  const { person, contacts } = plan;
  const lines = [person.bloodGroup, person.conditions.length, person.allergies.length].filter(Boolean).length;
  return (
    <Well>
      <svg width="48" height="88" viewBox="0 0 48 88" focusable="false">
        <rect x="2" y="2" width="44" height="84" rx="8" fill="var(--color-ink)" />
        <rect x="18" y="6" width="12" height="3" rx="1.5" fill="var(--color-ground)" />
        <rect x="14" y="14" width="20" height="6" rx="2" fill="var(--color-white)" opacity="0.85" />
        <rect x="6" y="28" width="36" height="8" rx="2" fill="var(--color-error)" />
        <rect x="9" y="31" width="20" height="2" rx="1" fill="var(--color-white)" />
        <rect x="6" y="40" width="26" height="3" rx="1.5" fill="var(--color-white)" />
        {Array.from({ length: lines }, (_, i) => (
          <rect key={i} x="6" y={47 + i * 5} width={30 - i * 4} height="2.5" rx="1.25" fill="var(--color-white)" opacity="0.7" />
        ))}
        {contacts.slice(0, 3).map((c, i) => (
          <circle key={c.id} cx={10 + i * 10} cy={66} r="4" fill="var(--color-sun)" />
        ))}
        <rect x="16" y="79" width="16" height="2" rx="1" fill="var(--color-white)" opacity="0.7" />
      </svg>
    </Well>
  );
}

/** A page with one table row per medicine, each with its symbol's colour. */
export function DoctorPreview({ plan }: { plan: Plan }) {
  const rows = plan.medicines.slice(0, 6);
  return (
    <Well>
      <svg width="64" height="84" viewBox="0 0 64 84" focusable="false">
        <rect x="1" y="1" width="62" height="82" rx="3" fill="var(--color-white)" stroke="var(--color-line)" strokeWidth="2" />
        <rect x="7" y="7" width="30" height="4" rx="2" fill="var(--color-ink)" />
        <rect x="7" y="16" width="50" height="7" fill="var(--color-ground)" stroke="var(--color-ink)" strokeWidth="0.8" />
        {rows.map((m, i) => (
          <g key={m.id}>
            <rect x="7" y={23 + i * 8} width="50" height="8" fill="none" stroke="var(--color-ink)" strokeWidth="0.8" />
            <circle cx="11" cy={27 + i * 8} r="2" fill={m.symbol.colour} />
            <rect x="15" y={26 + i * 8} width="18" height="2" rx="1" fill="var(--color-ink)" opacity="0.55" />
            <rect x="37" y={26 + i * 8} width="14" height="2" rx="1" fill="var(--color-ink)" opacity="0.35" />
          </g>
        ))}
        <rect x="7" y="74" width="30" height="2.5" rx="1.25" fill="var(--color-ink)" opacity="0.4" />
      </svg>
    </Well>
  );
}
