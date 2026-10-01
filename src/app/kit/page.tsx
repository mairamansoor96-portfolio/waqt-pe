"use client";

// Component and type gallery for checking the theme (THEME.md) in both directions.
// Switch language to see the right-to-left layout. Not linked from the app.

import { useState } from "react";
import { Button } from "@/components/Button";
import { ChoiceCard } from "@/components/ChoiceCard";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Notice } from "@/components/Notice";
import { Logo } from "@/components/Logo";
import { DoseChip } from "@/components/MedicineCard";
import { ProgressHeader } from "@/components/ProgressHeader";
import { Perforation, RalliTrim } from "@/components/Trim";
import { PrintLogo } from "@/components/sheets/print";
import { TextField } from "@/components/TextField";
import { Ur } from "@/components/Ur";
import { BackArrow, Chevron } from "@/components/icons";
import { SLOTS, SYMBOLS, VERSION_BORDER_COLOURS } from "@/lib/plan";

const TOTAL = 8;

export default function Kit() {
  const [step, setStep] = useState(3);
  const [choice, setChoice] = useState("helperNoRead");

  return (
    <main className="mx-auto flex max-w-app flex-col gap-8 px-4 py-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="type-question">Kit</h1>
        <LanguageToggle />
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading">Progress header</h2>
        <div className="px-4">
          <ProgressHeader step={step} total={TOTAL} onBack={() => setStep((s) => Math.max(1, s - 1))} />
        </div>
        <Button variant="secondary" onClick={() => setStep((s) => (s % TOTAL) + 1)}>
          Next step
        </Button>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading">Logo</h2>
        <Logo variant="header" />
        <Logo variant="primary" />
        <Logo variant="stacked" className="self-center" />
        <PrintLogo />
        <h2 className="type-heading">Ralli trim and perforation</h2>
        <RalliTrim />
        <Perforation />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading">Type</h2>
        <p className="type-question">Who usually gives Ammi the medicines?</p>
        <p className="type-heading">Section heading</p>
        <p className="type-body">Body text starts at 18 px because many readers are older or tired.</p>
        <p className="type-helper text-ink-soft">Helper text, secondary.</p>
        <Ur as="p" role="question">امی کو دوائیں عام طور پر کون دیتا ہے؟</Ur>
        <Ur as="p" role="heading">حصے کا عنوان</Ur>
        <Ur as="p" role="body">صبح، ناشتے کے بعد۔ نیلے ستارے والا ڈبہ۔ ایک گولی۔</Ur>
        <Ur as="p" role="helper" className="text-ink-soft">مددگار متن</Ur>
        <p>
          Mixed direction: call <bdi>ماریہ</bdi> on <bdi dir="ltr" className="whitespace-nowrap">+92 300 1234567</bdi>.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading">Buttons and inputs</h2>
        <Button full>Add medicine</Button>
        <Button variant="secondary" full>Print fridge sheet</Button>
        <Button variant="danger" full>Clear everything on this device</Button>
        <TextField label="What's it for, in your words?" help="For example, for sugar." />
        <TextField label="Name, as written on the box" error="Add the name from the box so the family can check it." />
        <p className="flex items-center gap-4">
          Directional icons flip: <BackArrow /> <Chevron />
        </p>
      </section>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 type-heading">Choice cards</legend>
        <ChoiceCard name="k" value="self" checked={choice === "self"} onChange={setChoice} label="She takes them herself" help="Large text and pictures." />
        <ChoiceCard name="k" value="helperNoRead" checked={choice === "helperNoRead"} onChange={setChoice} label="A helper who doesn't read" help="Box photos, stickers, voice note." />
      </fieldset>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading">Notices</h2>
        <Notice title="Nothing you enter leaves this device.">Your plan lives in the link.</Notice>
        <Notice tone="warning" title="Check each medicine against the prescription">Printing unlocks when every medicine is ticked.</Notice>
        <Notice tone="error">This link was cut short. Ask for it again.</Notice>
        <Notice tone="success">Fridge sheet ready.</Notice>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading">Time of day and dose chips</h2>
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((slot, i) => (
            <DoseChip key={slot} dose={{ slot, quantity: i + 1, food: (["after", "with", "before", "any"] as const)[i] }} form="tablet" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="type-heading">Symbol colours (placeholder shapes)</h2>
        <ul className="grid grid-cols-4 gap-3">
          {SYMBOLS.map((s) => (
            <li key={s.colour} className="flex flex-col items-center gap-1">
              <span className="size-12 rounded-chip border-2 border-ink" style={{ background: s.colour }} aria-hidden="true" />
              <span className="type-helper">
                {s.colourName.en} {s.shapeName.en}
              </span>
            </li>
          ))}
        </ul>
        <h2 className="type-heading">Sheet version borders</h2>
        <ul className="flex gap-3">
          {VERSION_BORDER_COLOURS.map((c, i) => (
            <li key={c} className="flex size-14 items-center justify-center rounded-input border-4 bg-surface font-bold" style={{ borderColor: c }}>
              v{i + 1}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
