// Small, simplified pictures of each output for the landing page, drawn from
// the theme tokens (not screenshots). Decorative: the card text says what
// each one is, so every picture is aria-hidden. They never flip in RTL.

import { SYMBOLS } from "@/lib/plan";

export type OutputKind = "fridge" | "stickers" | "voice" | "doctor" | "lock";

const BLUE = SYMBOLS[0].colour;
const ORANGE = SYMBOLS[1].colour;
const GREEN = SYMBOLS[2].colour;
const PINK = SYMBOLS[5].colour;

const INK = "var(--color-ink)";
const LINE = "var(--color-line)";
const WHITE = "var(--color-white)";

function star(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const d = i % 2 ? r * 0.45 : r;
    return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`;
  });
  return <polygon points={pts.join(" ")} fill={BLUE} stroke={INK} strokeWidth="1" strokeLinejoin="round" />;
}

function Fridge() {
  const rows = [
    { y: 22, tint: "var(--color-dawn)", mark: star(36, 29, 5) },
    { y: 40, tint: "var(--color-noon)", mark: <circle cx="36" cy="47" r="4.5" fill={ORANGE} stroke={INK} strokeWidth="1" /> },
    { y: 58, tint: "var(--color-night)", mark: <path d="M36 60c4 3 4 8 0 11c-4-3-4-8 0-11z" fill={GREEN} stroke={INK} strokeWidth="1" /> },
  ];
  return (
    <>
      <rect x="20" y="10" width="56" height="76" rx="4" fill={WHITE} stroke="var(--color-primary)" strokeWidth="3" />
      <rect x="26" y="15" width="22" height="3" rx="1.5" fill={INK} />
      {rows.map((r) => (
        <g key={r.y}>
          <rect x="26" y={r.y} width="44" height="14" rx="3" fill={r.tint} />
          <rect x="29" y={r.y + 2} width="14" height="10" rx="2" fill={WHITE} stroke={LINE} />
          {r.mark}
          <rect x="47" y={r.y + 5} width="18" height="2.5" rx="1.25" fill={INK} opacity="0.55" />
        </g>
      ))}
      <path d="M26 78h44" stroke="var(--color-perforation)" strokeWidth="1.5" strokeDasharray="3 2" />
    </>
  );
}

function Stickers() {
  const marks = [
    star(36, 34, 8),
    <circle key="o" cx="60" cy="34" r="8" fill={ORANGE} stroke={INK} strokeWidth="1" />,
    <path key="g" d="M36 52c6 4 6 13 0 17c-6-4-6-13 0-17z" fill={GREEN} stroke={INK} strokeWidth="1" />,
    <circle key="p" cx="60" cy="61" r="8" fill={PINK} stroke={INK} strokeWidth="1" />,
  ];
  return (
    <>
      <rect x="18" y="14" width="60" height="68" rx="4" fill={WHITE} stroke={LINE} strokeWidth="2" />
      {[24, 48].flatMap((x) =>
        [22, 49].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="24" height="24" rx="5" fill="none" stroke="var(--color-perforation)" strokeWidth="1.2" strokeDasharray="2.5 2" />
        )),
      )}
      {marks}
    </>
  );
}

function Voice() {
  return (
    <>
      <rect x="28" y="8" width="40" height="80" rx="8" fill={WHITE} stroke={INK} strokeWidth="2.5" />
      <rect x="42" y="13" width="12" height="2.5" rx="1.25" fill={INK} />
      <rect x="32" y="34" width="32" height="20" rx="10" fill="var(--color-primary-tint)" stroke="var(--color-primary)" strokeWidth="1.5" />
      <path d="M37 39.5v9l7-4.5z" fill="var(--color-primary)" />
      {[4, 8, 5, 9, 6, 3].map((h, i) => (
        <rect key={i} x={47 + i * 2.6} y={44 - h / 2} width="1.6" height={h} rx="0.8" fill="var(--color-primary)" />
      ))}
      <rect x="34" y="60" width="20" height="2.5" rx="1.25" fill={LINE} />
      <rect x="34" y="66" width="14" height="2.5" rx="1.25" fill={LINE} />
    </>
  );
}

function Doctor() {
  return (
    <>
      <rect x="20" y="10" width="56" height="76" rx="3" fill={WHITE} stroke={LINE} strokeWidth="2" />
      <rect x="26" y="16" width="30" height="4" rx="2" fill={INK} />
      <rect x="26" y="26" width="44" height="7" fill="var(--color-ground)" stroke={INK} strokeWidth="0.8" />
      {[33, 41, 49, 57].map((y, i) => (
        <g key={y}>
          <rect x="26" y={y} width="44" height="8" fill="none" stroke={INK} strokeWidth="0.8" />
          <circle cx="30" cy={y + 4} r="2" fill={[BLUE, ORANGE, ORANGE, GREEN][i]} />
          <rect x="34" y={y + 3} width="16" height="2" rx="1" fill={INK} opacity="0.55" />
          <rect x="54" y={y + 3} width="12" height="2" rx="1" fill={INK} opacity="0.35" />
        </g>
      ))}
      <rect x="26" y="70" width="34" height="2.5" rx="1.25" fill={INK} opacity="0.4" />
      <rect x="26" y="76" width="24" height="2.5" rx="1.25" fill={INK} opacity="0.4" />
    </>
  );
}

function Lock() {
  return (
    <>
      <rect x="28" y="8" width="40" height="80" rx="8" fill={INK} stroke={INK} strokeWidth="2.5" />
      <rect x="43" y="12" width="10" height="3" rx="1.5" fill="var(--color-ground)" />
      <rect x="38" y="20" width="20" height="6" rx="2" fill={WHITE} opacity="0.85" />
      <rect x="32" y="36" width="32" height="8" rx="2" fill="var(--color-error)" />
      <rect x="35" y="39" width="18" height="2" rx="1" fill={WHITE} />
      <rect x="32" y="49" width="24" height="3" rx="1.5" fill={WHITE} />
      <rect x="32" y="56" width="30" height="2.5" rx="1.25" fill={WHITE} opacity="0.7" />
      <rect x="32" y="62" width="20" height="2.5" rx="1.25" fill={WHITE} opacity="0.7" />
      <rect x="40" y="81" width="16" height="2" rx="1" fill={WHITE} opacity="0.7" />
    </>
  );
}

const pictures: Record<OutputKind, () => React.ReactElement> = { fridge: Fridge, stickers: Stickers, voice: Voice, doctor: Doctor, lock: Lock };

/** A 96 px ground-coloured well holding a small picture of the output. */
export function OutputPreview({ kind }: { kind: OutputKind }) {
  const Picture = pictures[kind];
  return (
    <span aria-hidden="true" className="flex size-24 shrink-0 items-center justify-center rounded-input bg-ground">
      <svg width="96" height="96" viewBox="0 0 96 96" focusable="false">
        <Picture />
      </svg>
    </span>
  );
}
