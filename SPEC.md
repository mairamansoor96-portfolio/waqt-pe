# Waqt Pe — Spec

*Medicine care anyone can follow.*

This file is the source of truth for the project. Part 1 is the design spec (the why). Part 2 is the build spec (what to build, milestone by milestone). Read both before making changes, and keep this file updated when decisions change.

# Part 1: Design spec

## Overview

Waqt Pe is a privacy-first family safety kit. A family describes one person's medicines and health details once, and Waqt Pe produces a fridge medicine schedule, an emergency lock-screen card, and a doctor's summary.

The core design decision: **design for the hardest reader first.** In many households the person giving medicines every day is a helper or carer who may not read any language. So pictures, colour, shape, real packaging photos, and voice carry the meaning. Text is a supporting label for people who can read, never the only channel.

If a helper who has never learned to read can give the right medicine at the right time from this sheet alone, everyone else can too. Waqt Pe needs no AI, no accounts, no database, and no running costs.

## The four readers

The same information is designed four ways, for four readers in four moments. That contrast is the heart of the case study.

| Reader | What they read | When | What they can rely on | Primary channel |
| --- | --- | --- | --- | --- |
| Helper who gives the medicines | Fridge schedule, voice note | Every day, several times | Faces, colours, shapes, packaging, numerals, WhatsApp voice notes | Pictures, stickers, voice |
| Person taking the medicines | Fridge schedule | Every day | May read, may have poor eyesight, may not read | Pictures first, large text second |
| Stranger in an emergency | Lock-screen card | Once, in seconds, under stress | Reads English or the local language | Text, strict hierarchy |
| Doctor or pharmacist | Doctor's list | At an appointment | Reads clinical terms | Precise text |

The lock screen and doctor's list stay text-led on purpose. The right design depends on the reader, not on one house style.

## Setup flow

Setup is usually done by an adult child for a parent, so the form is written around the person's name: "What does Ammi take in the morning?" rather than "Enter medication schedule."

One early question changes the defaults: **"Who usually gives the medicines?"**

| Answer | What Waqt Pe turns on |
| --- | --- |
| They take them on their own | Large-text schedule, pictograms, optional box photos |
| A family member | Standard schedule, text and pictograms balanced |
| A helper who reads | Standard schedule, helper named on the sheet |
| A helper who doesn't read | Box photos, matched stickers, voice-note script, text pushed to the background |

The family can enter the helper's name so printouts and the voice script address them directly and respectfully.

For each medicine, the form asks:

- **Name**, as written on the box.
- **What it's for, in the family's words**, like "for sugar" or "for blood pressure."
- **A photo of the actual box or strip**, taken on the family's phone.
- **Form**: tablet, half tablet, capsule, syrup, drops, inhaler, or insulin pen.
- **When, how many, and with or without food.**

Input stays manual. Extracting from prescription photos, especially handwritten ones, is too unreliable for something this safety-critical.

## Output 1: the fridge schedule

The schedule turns giving medicine into a matching task: find the box that looks like the picture, give what's drawn.

### Match the box, not the pill

Pills usually stay in strips and boxes until the moment they're taken, so helpers identify medicine by packaging. Each dose row shows the photo of the actual box or strip.

### Shared symbols on paper and boxes

Each medicine gets a unique colour-and-shape pair, such as a blue star or an orange circle. Shape keeps it usable for colour-blind readers. Waqt Pe prints a sticker sheet; the family sticks one on each box, and the same symbol appears on the schedule.

### Time of day as scenes

Four pictogram rows: sunrise, midday sun, sunset, night with moon. The family can link each to meals or prayer times, shown as small pictograms, not words.

### Food shown, not written

Showing "before" or "after" food in pictures assumes a reading direction a non-reader may not have. This is an open question for research: test a two-step sequence with a clear arrow against a full versus empty plate.

### Quantity as drawings

Two pill drawings for two pills, a half-drawn pill for a half. Syrup shows the number of spoons drawn. Drops, inhalers, and insulin pens each get their own pictogram.

### Tick grid

A weekly grid where the helper ticks each dose after giving it. Weekdays are words, so test alternatives: one sheet per week with the start day marked by the family, or colour-coded day columns. The grid is high-contrast so a photo sent over WhatsApp reads clearly.

### Faces for "who to call"

The bottom section shows photos of family members to call, with numbers in large numerals. Many people who can't read words can read numbers and recognise faces.

### Text as the supporting layer

English and Urdu labels remain for literate readers, smaller and secondary. Urdu uses a proper Nastaliq font such as Noto Nastaliq Urdu. Every sheet carries a print date.

## Voice-note script

Waqt Pe generates a spoken script that a family member reads aloud and sends to the helper as a WhatsApp voice note. Waqt Pe hosts no audio.

The script follows the order of the fridge sheet, for example: "Morning, after breakfast. The blue star box. One tablet." It addresses the helper by name.

Why this beats computer-generated speech:

- **A trusted voice** the helper already knows.
- **Any language** the family and helper share, including Punjabi, Sindhi, Pashto, and Saraiki, which browser speech handles poorly.
- **Zero storage and zero cost.** The helper replays it whenever they need.

## Output 2: lock-screen card

A wallpaper readable by a stranger or paramedic without unlocking the phone. It stays text-led because its reader reads.

**Order of information:**

1. "In an emergency" in the local language and English
2. Name and blood group
3. Conditions that change treatment, such as diabetes, blood thinners, or a heart condition
4. Allergies
5. Emergency contacts with relationship, for example "Maira, daughter"

**Fits around the phone.** Clocks, notifications, and camera cutouts sit in different places on different phones. The family picks a phone type and previews the card with the clock overlaid.

**Privacy prompt.** Anyone holding the phone can see the lock screen, so the family chooses what to show, and Waqt Pe discourages including a home address.

**Non-reading owner.** If the person doesn't read, a second version shows large photos of family faces with numbers, for their own use in an emergency.

Waqt Pe complements the built-in Medical ID on iPhone and Android. Many people never set it up, responders don't always check it, and support varies on budget phones.

## Output 3: doctor's list

A one-page, precise summary of current medicines, doses, conditions, and allergies. It's handed over at appointments or pharmacies. It's the least glamorous output and possibly the most used.

## Prescription changes, safety, and the boundary

A prescription change is the most dangerous moment, because an old sheet on the fridge becomes a risk and a non-reader won't see a "New" label.

**Changes a non-reader can notice:**

- Each sheet version gets a distinct border colour. The family tells the helper "the green one is the new one" and removes the old sheet.
- Changed or new medicines get a visibly different marker and a new sticker.
- Waqt Pe writes a short "what changed" voice-note script.

**Review before printing.** The helper will trust the sheet completely, and it's only as correct as the family's input. Before printing, Waqt Pe shows each medicine beside its box photo and asks the family to check it against the prescription.

**The boundary.** Waqt Pe only arranges what a doctor prescribed. No dose advice, no interaction checks. Conditional instructions such as "don't give if blood sugar is low" are too important for a pictogram, so the sheet directs the helper to call the family using the faces-and-numbers section.

## Privacy

Nothing ever reaches a server.

- **Text data** can be packed into a private link, in the part of the address browsers never send to a server. A family member can bookmark it, update it, and share it with a sibling.
- **Photos** of boxes and contacts are too large for a link, so they stay in the browser on the family's device.
- **A "save a copy" file** holds everything, photos included, for backup or sharing.

This trade-off between link sharing and photo storage is worth explaining in the case study.

## Research plan and ethics

This version depends on the pictograms being understood, so research is the core of the project.

**Learn before drawing.** Review existing medicine pictogram work: the USP pictograms, the International Pharmaceutical Federation's pictograms for low-literacy patients, and published pharmacy-pictogram studies with low-literacy communities, including in South Africa. ISO 9186 describes an established method for testing symbol comprehension.

**The key test.** Give a helper the printed sheet and a set of real, empty medicine boxes. Ask: "Show me what you'd give after lunch." Record every mistake and hesitation, then redraw between sessions.

**Participants:** 4 to 5 helpers, plus 4 to 5 families, ideally including older people and adult children.

**Questions to answer:**

- [ ] Do helpers anchor doses to meals, prayer times, or clock times?
- [ ] Which "before or after food" pictogram is understood without a reading direction?
- [ ] Which tick-grid layout works without weekday words?
- [ ] Do helpers match box photos faster than pill drawings?
- [ ] Is the voice-note script clear when read by a family member?

**Ethics:**

- Speak with helpers separately from employers, since the power dynamic shapes answers.
- Ask for consent in their own language, and pay them for their time.
- Frame Waqt Pe as supporting the helper, not monitoring them. The tick grid is for their confidence, not surveillance.

## Personality and visual system

Waqt Pe feels like a caring relative, never a hospital form. No clinical blue.

- **Pictogram set:** bold, friendly, consistent line weight. It's a portfolio artefact in its own right.
- **Colour-and-shape pairs:** strong, distinguishable, and never relying on colour alone.
- **Paper:** warm off-white, generous spacing, printed sheets and stickers that look cared for enough to keep on the fridge.
- **Time of day:** soft colours for morning, afternoon, and night.
- **Type:** Atkinson Hyperlegible for English, Noto Nastaliq Urdu for Urdu.
- **Copy:** warm, plain, respectful to the helper.

## One-week scope

Everything runs in the browser: no backend, no accounts, no running cost.

**MVP:**

- [ ] Setup flow with the "who gives the medicines?" branch
- [ ] Box photos
- [ ] Pictogram-led fridge schedule with drawn quantities and English and Urdu labels
- [ ] Sticker sheet
- [ ] Voice-note script
- [ ] Review step before printing
- [ ] Faces-and-numbers emergency section
- [ ] Lock-screen card with clock preview
- [ ] Doctor's list

**Later:** travel mode, colour-coded version borders and change scripts, multiple people per family, more languages.

**Plan:**

1. **Days 1–2:** Review existing pictogram sets. Run the "show me" test with helpers using paper sketches, redrawing between sessions.
2. **Days 3–5:** Build.
3. **Day 6:** Test printed sheets with helpers and families.
4. **Day 7:** Ship and write the case study.

## Risks and resume line

**Risks:**

- One week gives only a first round of pictogram testing. Say so in the case study; it's a strength.
- Recruiting helpers needs trust. Start arranging sessions now through people you know.
- Urdu right-to-left layout will take real time. Budget a full day.
- Medicine safety is serious. The review step and the boundary are non-negotiable.

**Resume line:**

> Designed and shipped Waqt Pe, a privacy-first medicine and emergency kit built for households where the person giving medicines may not read, using packaging photos, matched stickers, pictograms, and family voice notes.


---

# Part 2: Build spec

## How to use this spec

This part is written for building with Claude Code. Part 1 explains *why*; Part 2 says *what to build*. Where they disagree, Part 1 wins on intent and Part 2 wins on implementation.

Pictograms and final visuals don't exist yet. Build with clearly marked placeholders, and keep every pictogram a swappable SVG component so final artwork drops in without code changes.

## Stack and constraints

| Area | Decision |
| --- | --- |
| Framework | Next.js (App Router), TypeScript, static export |
| Styling | Tailwind CSS, design tokens in one file |
| Hosting | Vercel free tier, no server functions |
| Text state | Serialised, compressed (lz-string), stored in the URL hash |
| Photos | IndexedDB via idb-keyval, on-device only |
| Backup | Downloadable `.waqtpe` file: JSON with photos as base64 |
| Printing | CSS `@media print`, A4 and US Letter |
| Lock screen | HTML canvas rendered to a downloadable PNG |
| Fonts | Noto Nastaliq Urdu for Urdu; Atkinson Hyperlegible for English (see App theme) |
| Target devices | Low-end Android Chrome and iPhone Safari; desktop for printing |

## Privacy rules (non-negotiable)

- No user data is ever sent over the network. No backend, no database, no accounts.
- No analytics or third-party scripts that could read form data.
- The URL hash holds text only; photos never go into the link.
- A visible "Clear everything on this device" control deletes IndexedDB data and resets state.
- The landing page states plainly: "Nothing you enter leaves this device."

## App theme

This is the design foundation for the app itself, not the printed outputs. Set it up in milestone 1 as tokens, so every screen inherits it. Visual polish, illustrations, and the landing page come after testing.

### Direction

The product is about *time*: the name means "on time," and the whole schedule runs from dawn to night. That is where the app's personality lives. Everything else stays calm, quiet, and trustworthy, so families feel safe entering health details and the medicine symbols stand out.

**The one memorable element:** the progress header is a small sun moving along an arc from dawn to night as the family moves through setup. Nothing else on screen animates for decoration.

**Deliberately avoided:** clinical blue, the cream-and-terracotta look common in generated design, and the generic kit of identical shadowed cards. Structure comes from borders and spacing, not shadows.

### Colour tokens

The app palette is anchored in a deep night indigo, which is distinct from all eight medicine symbol colours, so buttons never compete with symbols.

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | #FAFAF7 | Page background |
| `surface` | #FFFFFF | Inputs, cards, sheet previews |
| `ink` | #1E2340 | Body text, icons |
| `ink-soft` | #4A5070 | Secondary text (passes AA on paper) |
| `line` | #D9DBE5 | Borders, dividers |
| `primary` | #2B2D6E | Primary buttons, selected states, focus ring |
| `dawn` | #FCE9D8 | Morning slot band |
| `noon` | #FFF6CC | Midday slot band |
| `dusk` | #F6DCE4 | Evening slot band |
| `night` | #DDE0F2 | Night slot band |
| `success` | #2E7D5B | Confirmations |
| `warning` | #9A5B00 | Review reminders |
| `error` | #B3261E | Errors |

Time-of-day tints are pale backgrounds only, never text. Sheet version border colours cycle through indigo #2B2D6E, teal #1F7A7A, maroon #7A1F3D, and olive #6B6B1F, and always appear with the version number.

### Type

**English: Atkinson Hyperlegible**, designed by the Braille Institute for readers with low vision. It fits the product's purpose and gives the case study a clear reason behind the choice. **Urdu: Noto Nastaliq Urdu.** No other typefaces.

| Role | English | Urdu | Weight |
| --- | --- | --- | --- |
| Screen question | 28 px / 1.3 | 30 px / 2.0 | Bold |
| Section heading | 22 px / 1.35 | 24 px / 2.0 | Bold |
| Body and inputs | 18 px / 1.5 | 20 px / 2.1 | Regular |
| Helper text | 15 px / 1.5 | 17 px / 2.1 | Regular |

Body text starts at 18 px, larger than typical apps, because many users are older or tired. Nastaliq needs much more line height than English; never tighten it. Sentence case everywhere, no all-caps labels, no letter-spacing on Urdu.

### Layout

Mobile first, one column, max width 560 px, content aligned to the start edge (left in English, right in Urdu). One question per setup screen. The primary action sits in a sticky bottom bar, full width, within thumb reach.

```text
+--------------------------------+
|  ( sun on arc: dawn ---> night )|  progress header
|  Step 3 of 8          Back     |
|                                |
|  Who usually gives Ammi her    |  screen question, 28 px
|  medicines?                    |
|                                |
|  +--------------------------+  |
|  | [icon] She takes them    |  |  choice cards
|  |        herself           |  |
|  +--------------------------+  |
|  | [icon] A helper who      |  |
|  |        doesn't read      |  |
|  +--------------------------+  |
|                                |
|  [        Continue         ]   |  sticky bottom bar
+--------------------------------+
```

**Spacing scale:** 4, 8, 12, 16, 24, 32, 48 px. **Radius varies by hierarchy:** 10 px inputs, 14 px buttons, 16 px cards, full round for dose chips. **Borders:** 1.5 px `line`; no drop shadows.

### Core components

| Component | Spec |
| --- | --- |
| Button | Min height 56 px. Primary: `primary` fill, white text. Secondary: 2 px `primary` outline. Label says exactly what happens: "Add medicine," "Print fridge sheet." |
| Text input | Label above, never placeholder-only. 18 px text, 2 px border, 3 px `primary` focus ring with offset. |
| Choice card | Full width, icon, label, one-line explanation. Selected: 3 px `primary` border and a check mark. |
| Medicine card | Box photo thumbnail, symbol, name, purpose in the family's words, dose chips tinted by time of day. |
| Dose chip | Time-of-day tint, slot pictogram, quantity. |
| Progress header | Sun on a dawn-to-night arc, step count, back button. Respects reduced motion: the sun jumps instead of gliding. |
| Notice | For privacy and safety messages. `surface` with a 4 px start-edge bar in `primary` or `warning`. |
| Sheet preview | Paper-proportioned frame showing the output exactly as it will print. |

### Right-to-left rules (from day one)

- Use logical CSS only: Tailwind `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, never `left`/`right` spacing.
- Set `lang="ur"` and `dir="rtl"` on every Urdu text container, even inside English layouts.
- Wrap names and phone numbers in `<bdi>` so mixed-direction text stays in order.
- Directional icons, such as back arrows and chevrons, flip in right-to-left; pictograms and symbols never flip.
- Phone numbers use Western digits for now; test with families whether Urdu digits read better.

### Copy voice

Warm, plain, and specific, like a capable relative. Use the person's name throughout. Buttons use active verbs, and an action keeps its name through the flow: "Print fridge sheet" leads to "Fridge sheet ready." Errors say what happened and how to fix it, without apologising. Empty states invite the next step: "Gather Ammi's medicine boxes and the prescription, then add the first one."

### Quality floor

- All text meets WCAG AA contrast.
- Visible keyboard focus on every interactive element.
- Touch targets at least 48 px.
- Layout holds at 200% text size.
- Reduced-motion preference respected.
- Tested on a low-end Android phone before each milestone is called done.

## Data model

One `Plan` object describes one person. It serialises to the URL hash without photos; photos are referenced by id and kept in IndexedDB.

```typescript
type Slot = "morning" | "midday" | "evening" | "night";
type Food = "before" | "after" | "with" | "any";
type Form = "tablet" | "capsule" | "syrup" | "drops" | "inhaler" | "insulin";
type Giver = "self" | "family" | "helperReads" | "helperNoRead";
type AnchorMode = "meals" | "prayers" | "clock";

interface Plan {
  schemaVersion: 1;
  person: {
    name: string;            // "Ammi"
    bloodGroup?: string;
    conditions: string[];    // treatment-relevant only
    allergies: string[];
  };
  giver: { type: Giver; helperName?: string };
  anchors: { mode: AnchorMode; labels: Record<Slot, { en: string; ur: string }> };
  medicines: Medicine[];
  contacts: Contact[];
  sheetVersion: { number: number; borderColour: string; printedAt: string };
  settings: { paper: "A4" | "Letter"; foodVariant: "sequence" | "plate"; tickVariant: "weekSheet" | "colourColumns" };
}

interface Medicine {
  id: string;
  name: string;              // as written on the box
  purpose: string;           // family's words: "for sugar"
  form: Form;
  photoId?: string;          // IndexedDB key
  symbol: { colour: string; shape: string };
  doses: { slot: Slot; quantity: number; food: Food }[]; // quantity in 0.5 steps for tablets
  reviewed: boolean;         // set only in the review step
}

interface Contact {
  id: string;
  name: string;
  relation: string;          // "daughter"
  phone: string;
  photoId?: string;
}
```

**Rules:**

- Any edit to a medicine sets `reviewed` back to `false`.
- Printing is blocked until every medicine has `reviewed: true`.
- Printing a changed plan increments `sheetVersion.number` and assigns the next border colour.
- Quantity units follow form: tablets or capsules, spoons for syrup, drops, puffs, or units for insulin.

## Screens and flow

Setup is a linear, one-question-per-screen flow on mobile, with a progress indicator and a back button on every step. Copy uses the person's name throughout.

| # | Screen | What it does | Done when |
| --- | --- | --- | --- |
| 1 | Landing | Explains Waqt Pe in one line, shows a sample fridge sheet, states the privacy promise | A first-time visitor can start setup in one tap |
| 2 | Person | Name, blood group, treatment-relevant conditions, allergies | Name is the only required field |
| 3 | Who gives the medicines | Four choices from the data model; helper name if a helper | Choice changes defaults per the Design spec table |
| 4 | Daily anchors | Meals, prayers, or clock; editable labels per slot in English and Urdu | Sensible defaults for each mode |
| 5 | Medicines list | Cards for each medicine; add, edit, delete | Empty state explains what to gather: the boxes and the prescription |
| 6 | Add or edit medicine | Name, purpose, form, box photo, doses per slot with quantity and food | Photo capture works from the phone camera; symbol assigned automatically |
| 7 | Contacts | Up to 3 contacts with name, relation, phone, optional photo | Numbers validated loosely; never blocks saving |
| 8 | Review | Each medicine beside its box photo; family ticks "matches the prescription" for each | Outputs stay locked until every medicine is ticked |
| 9 | Outputs hub | Links to fridge sheet, stickers, voice script, doctor's list, lock screen | Each output opens as a print or download preview |
| 10 | Save | Copy private link, download `.waqtpe` file, import a file, clear device data | Import restores text and photos exactly |

**Build decisions (milestone 2):**

- The progress header counts 8 steps: name, health details, who gives the medicines, daily anchors, medicines, contacts, review, save. Person (screen 2) is split into a name screen and a health screen to keep one question per screen, which puts "who gives" at step 3 as in the layout sketch.
- Each setup screen is its own route (`/setup/<step>/`), and the plan travels between them in the link, so the browser back button works and a copied link reopens the same screen.
- Suggested treatment-relevant conditions are stored in English (the language of the doctor's list and emergency card) and shown in the interface language. Anything typed is stored as typed.
- Confirmations for hard-to-undo actions happen in the page, never in a browser dialog.

**Build decisions (milestone 3):**

- The medicine editor is a sub-screen of step 5 at `/setup/medicine/?m=<id>`. Edits save to the link as they're made (every edit resets `reviewed`); "Save medicine" checks there's a name and at least one time of day, then returns to the list.
- "Add medicine" creates the medicine, and its symbol, straight away. One left completely empty is removed when you go back.
- A removed medicine's symbol is free for the next one. The removal confirmation reminds the family to take its sticker off the box. Open question: should a freed symbol wait before being reused, so an old box with that sticker can't be confused with a new medicine?
- Tablets count in halves; other forms in whole units. Above 6, the quantity is drawn as one pictogram and a numeral (for insulin units and drops).

**Global behaviour:**

- Progress autosaves to the URL hash and IndexedDB on every change.
- Reopening the link on the same device restores everything, including photos.
- Opening the link on another device restores text and shows "photos are on the original device; import the saved file to bring them."
- Every screen works at 200% text size and with a screen reader.

## Output specs

All sizes are starting points to verify in print tests.

### Fridge sheet (portrait, 2 pages)

**Page 1, the schedule:**

- Four rows, one per slot, each led by its time-of-day scene pictogram and anchor pictogram.
- Each dose is a card: box photo (min 30 mm wide), symbol (min 12 mm), quantity drawn as repeated form pictograms (min 8 mm each; half tablets drawn as halves), food pictogram, then small English and Urdu labels.
- Empty slots are omitted, not shown blank.
- Footer: contact photos with names and large numerals, print date, and version number.
- Border in the current version colour.

**Page 2, the tick grid:** printed separately so it can be replaced weekly without reprinting the schedule. One row per dose, seven columns, following `tickVariant`.

**Minimum type:** English 12 pt, Urdu 14 pt with generous line height.

### Sticker sheet

- One sticker per medicine: symbol at 30 mm diameter by default (20 mm and 40 mm options), medicine name in small text beneath.
- Cut guides around each sticker. Works on plain paper with tape or on label paper.

### Voice-note script

Built from fixed templates, never AI, so wording is predictable. Shown on screen with a copy button, in English and Urdu.

| Part | English template | Urdu template |
| --- | --- | --- |
| Opening | {helper}, here's how {person}'s medicines go. | {helper}، یہ {person} کی دوائیوں کا طریقہ ہے۔ |
| Per dose | {anchor}. The {colour} {shape} box. {quantity} {unit}. | {anchor}۔ {colour} {shape} والا ڈبہ۔ {quantity} {unit}۔ |
| Closing | If anything is unclear, call me. | کچھ سمجھ نہ آئے تو مجھے فون کریں۔ |

Example: "Morning, after breakfast. The blue star box. One tablet." / "صبح، ناشتے کے بعد۔ نیلے ستارے والا ڈبہ۔ ایک گولی۔"

Urdu adjectives change form with the noun, so colour and shape words need their own lookup table. Have a native speaker review every template before launch.

### Doctor's list (portrait, 1 page)

A plain, clinical table: medicine name, form, dose and timing, purpose, food instruction. Below it: conditions, allergies, blood group, contacts, print date.

### Lock-screen card (PNG)

- Presets for common tall phone ratios (e.g. 1170×2532 and 1080×2400).
- Content avoids the top ~30% (clock) and bottom ~10% (shortcuts and home bar); preview shows a fake clock overlay. Verify on real devices.
- Order: "In an emergency" in English and Urdu, name, blood group, key conditions, allergies, contacts.
- A toggle list controls which fields appear; address is never offered.
- For a person who doesn't read: an alternate layout of large contact photos with numbers.

## Symbol system

Each medicine gets one colour and one shape, both unique within the plan, so no two medicines differ by colour alone. Colours come from the Okabe–Ito palette, which is designed to stay distinguishable for colour-blind readers.

Shapes are chosen to be easy to *say* in a voice note, not just easy to see. "The kite box" is easier to remember than "the hexagon box."

| # | Colour | Hex | Urdu colour | Shape | Urdu shape |
| --- | --- | --- | --- | --- | --- |
| 1 | Blue | #0072B2 | نیلا | Star | ستارہ |
| 2 | Orange | #E69F00 | نارنجی | Circle | دائرہ |
| 3 | Green | #009E73 | سبز | Leaf | پتا |
| 4 | Red | #D55E00 | لال | Square | چوکور |
| 5 | Sky blue | #56B4E9 | آسمانی | Kite | پتنگ |
| 6 | Pink | #CC79A7 | گلابی | Flower | پھول |
| 7 | Yellow | #F0E442 | پیلا | Triangle | تکون |
| 8 | Black | #000000 | کالا | Fish | مچھلی |

Avoid shapes that carry meaning elsewhere in the system: no hearts (cardiac), drops (eye drops), sun or moon (time of day), or crosses (negation). Yellow needs a dark outline to print clearly. Urdu words need native review.

## Pictogram asset list

Build with placeholders; replace with final SVGs from Figma. Every asset is a React component with a consistent `size` prop.

- [ ] **Time of day (4):** sunrise, midday sun, sunset, night with moon
- [ ] **Meal anchors (4):** breakfast, lunch, dinner, bedtime
- [ ] **Prayer anchors (4):** use time-of-day scenes with a mosque silhouette, not praying figures; review with families
- [ ] **Forms (7):** tablet, half tablet, capsule, spoon, drop, inhaler puff, insulin pen
- [ ] **Food, variant A (3):** sequence with arrow for before, after, with
- [ ] **Food, variant B (3):** full plate vs empty plate for before, after, with
- [ ] **Utility (3):** call, tick box, "any time"
- [ ] **Symbols (8):** the shapes above

## Research toggles

Open questions are built as switchable variants, not guessed.

- `settings.foodVariant`: `sequence` or `plate`
- `settings.tickVariant`: `weekSheet` or `colourColumns`
- Adding `?research=1` to the URL shows a small panel on output previews to flip variants during a test session, without touching the family's setup.

## Build milestones

Each milestone is roughly one Claude Code session. Deploy to Vercel after each and test the live link on a real phone.

| # | Milestone | Done when |
| --- | --- | --- |
| 1 | Scaffold, design tokens, data model, URL-hash state | A plan survives a page reload from the link alone |
| 2 | Setup screens 1–4 and 7 | Person, giver, anchors, and contacts can be entered on a phone |
| 3 | Medicines list and editor, with symbol auto-assignment | Adding 8 medicines gives 8 unique colour-shape pairs |
| 4 | Photo capture, compression, IndexedDB, `.waqtpe` export and import | Photos survive reload; export on one device imports fully on another |
| 5 | Review step and output lock | Editing any medicine re-locks outputs |
| 6 | Fridge sheet print, both pages, placeholder pictograms, research toggles | Prints cleanly on A4 and Letter with no clipped content |
| 7 | Sticker sheet and doctor's list | Printed stickers measure within 1 mm of spec |
| 8 | Voice-note script, English and Urdu | Script matches sheet order; Urdu renders correctly right-to-left |
| 9 | Lock-screen card with presets and clock preview | PNG sets as wallpaper with nothing hidden on two real phones |
| 10 | Urdu layout polish, accessibility pass, final pictograms swapped in | Passes 200% text and screen-reader checks |

## Out of scope for the MVP

- Travel mode and languages beyond English and Urdu
- More than one person per plan
- Reminders or notifications
- Weekly pill-organiser filling guide and lid stickers (strong next feature)
- Change-highlighting and "what changed" voice scripts beyond the version colour
- Any drug information, dose advice, or interaction checking, permanently
