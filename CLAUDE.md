# Waqt Pe

**Before doing anything else in a session, read `SPEC.md` in full.** It is the source of truth: Part 1 is the design spec (the why), Part 2 is the build spec (what to build, milestone by milestone). Where they disagree, Part 1 wins on intent and Part 2 wins on implementation. When a decision changes, update `SPEC.md` in the same change.

**`THEME.md` is the source of truth for all visual decisions** (colours, type, shapes, logo, ralli trim). It replaces the App theme section of SPEC.md; where they differ, follow THEME.md.

## What this is

Waqt Pe ("on time") is a privacy-first family medicine and emergency kit. A family describes one person's medicines and health details once, and the app produces a fridge medicine schedule, sticker sheet, voice-note script, emergency lock-screen card, and doctor's list. It is designed for the hardest reader first: a helper who may not read, so pictures, colour-and-shape symbols, box photos, numerals and voice carry the meaning, and text is a supporting layer.

Everything runs in the browser. No backend, no accounts, no database, no running costs.

## Non-negotiables (see SPEC.md → "Privacy rules" and THEME.md)

- **Privacy rules**: no user data ever goes over the network; no analytics or third-party scripts; the URL hash holds text only, photos never go into the link (they live in IndexedDB on the device); a visible "Clear everything on this device" control; the landing page says "Nothing you enter leaves this device." Fonts are self-hosted via `@fontsource`, never loaded from a CDN at runtime.
- **Theme (THEME.md)**: use only the tokens in `src/styles/tokens.css`, the one file for design tokens (ground, surface, ink, ink-soft, line, perforation, primary, primary-tint, sun, ralli-1 to 4, time-of-day tints; type roles, radii, spacing scale 4/8/12/16/24/32/48). Blister-pack structure: pockets (28 px radius, 2 px `line`, selected 3 px `primary` on `primary-tint`), capsule buttons and chips, 2 px dashed `perforation` dividers (`<Perforation>` or `perforation-top`). Never one-side border accents, drop shadows, gradients or emoji; the only shadow is the logo's sun offset (`logo-offset`). Sun yellow is never readable text. The ralli trim (`<RalliTrim>`) goes directly under the header and above the bottom bar (`AppHeader`, `BottomBar`), never behind text. Atkinson Hyperlegible for English UI, Noto Nastaliq Urdu for Urdu UI, Lalezar for the logo only (`<Logo>`, `PrintLogo`); all self-hosted. 18 px body text minimum, sentence case, touch targets ≥ 48 px, visible focus in primary, reduced motion respected. The only decorative animation is the sun on the progress arc.
- **Right-to-left from day one**: logical CSS only (`ms-/me-/ps-/pe-/start-/end-`, `text-start`), never left/right. Every Urdu text container gets `lang="ur" dir="rtl"` (use the `<Ur>` component). Wrap names and phone numbers in `<bdi>`. Directional icons flip (`rtl:-scale-x-100`); pictograms and medicine symbols never flip. Never tighten Nastaliq line height or letter-space Urdu. Text the family typed gets `dir="auto"` plus `text-page-start` (aligns with the page's start edge); phone numbers get `whitespace-nowrap`. Layouts that must change with text size use container queries in `rem` (see `ChoiceCard`).
- **Safety boundary**: Waqt Pe only arranges what a doctor prescribed. No dose advice, no interaction checks, no drug information, ever. Editing a medicine resets `reviewed`; printing stays blocked until every medicine is reviewed.
- **Pictograms** are placeholders until final art exists; each is a swappable SVG React component with a `size` prop.

## Stack

Next.js (App Router) as a static export (`output: "export"`, builds to `out/`), TypeScript, Tailwind CSS v4 (theme tokens via `@theme` in `src/styles/tokens.css`), lz-string for the URL hash, idb-keyval for photos. Hosted on Vercel free tier with no server functions.

## Layout of the code

- `src/lib/plan.ts` — the `Plan` data model from SPEC.md, defaults, symbol table, and rules (review reset, print lock, sheet versions, units).
- `src/lib/sanitise.ts` — turns untrusted JSON (from a link or file) into a valid `Plan`.
- `src/lib/hash.ts` — `Plan` ⇄ compressed URL hash (`#p=…`).
- `src/lib/plan-store.tsx` — `PlanProvider` and `usePlan()`: loads the plan from the hash once, autosaves every change back to it, and `go(path)` moves between screens carrying the plan in the link. Mounted in the root layout so every screen shares one plan. Sample mode (`enterSample`/`exitSample`, a `#sample` link) shows the demo plan from memory and never writes the link or IndexedDB; the family's own plan rides along as `#sample&p=…`.
- `src/lib/sample.ts` — `samplePlan()` for tests, and `demoPlan()` for "See a sample for Ammi" with box photos bundled in `public/sample/` (`SAMPLE_PHOTOS`; `photos.ts` serves them and never stores or deletes them).
- `src/lib/steps.ts` — the setup flow order (8 steps, one question per screen).
- `src/lib/messages.ts` — all interface copy in English and Urdu (Urdu needs native review). `src/lib/i18n.tsx` — UI language, document direction, `useT()`, and `useFillNodes()` for names inside sentences (isolates a name only when its direction differs from the sentence's).
- `src/lib/medicine.ts` — medicine helpers: symbol names for the voice note, drawn/written quantities, `withDose`/`withForm` (edits go through `editMedicine`, so `reviewed` resets).
- `src/lib/photos.ts` — photos on this device: compress (long edge 1000 px, JPEG), store in IndexedDB as bytes + type, `usePhoto(id)` for display, `missingPhotos()` for links opened on another device. Delete a photo when its medicine or contact is removed or it's replaced.
- `src/lib/backup.ts` — the `.waqtpe` saved file: plan plus referenced photos as base64. `readBackup()` checks and sanitises before anything is stored.
- `src/lib/sheet.ts` — printing rules: paper sizes, mm→px, `sheetFingerprint`/`recordPrint`/`upcomingVersion` (a changed plan prints as the next version and border colour), doses grouped by time of day.
- `src/components/sheets/` — printed outputs, sized in mm at true size (`FridgeSheet`, `StickerSheet`, `DoctorList`), built from `print.tsx` (`PrintPage`, `En`, `Ur`); `SheetFrame` scales a sheet to fit the screen but not in print; `OutputShell` is the screen around every output (lock, paper size, preview, print button). Printed type: English ≥ 12 pt, Urdu ≥ 14 pt, both languages always.
- `src/lib/voice.ts` — the voice-note script: fixed templates (in `messages.ts`) plus Urdu agreement tables (colour × shape gender, meal words in the oblique case, spoken fractions ڈیڑھ/ڈھائی/ساڑھے). Same order as the fridge sheet (`dosesBySlot`). Every Urdu word here needs native review.
- `src/lib/lockscreen.ts` — the lock-screen card drawn on a canvas: presets, safe area (top 32% and bottom 12% kept clear), shrink-to-fit, text and faces layouts. Returns every drawn box so tests can check the safe area.
- `src/lib/device.ts` — "Clear everything on this device".
- `src/components/` — core components from THEME.md (Button, TextField, ChoiceCard (pocket), ChoiceChip, ListEditor, ConfirmInline, Notice, AppHeader/BottomBar/BackButton, ProgressHeader (sun arc), Logo, Trim (RalliTrim, Perforation), SetupScreen, Ur, icons). Use `ConfirmInline`, never `window.confirm`.
- `src/pictograms/` — placeholder pictograms and medicine symbols, each a swappable SVG component with a `size` prop.
- `src/app/setup/<step>/` — one route per setup screen. `src/app/outputs/` — the outputs hub (screen 9); medicine outputs stay locked until `canPrint(plan)`. `reviewed` is set true only in the review step, via `markReviewed()`. `src/app/kit/` — component and type gallery for checking the theme in both directions. `src/app/icon.svg` and `apple-icon.png` are the favicon and app icon (Urdu baked into paths).

## Commands

- `npm run dev` — local dev server
- `npm run build` — static export to `out/`
- `npm run lint` — type check
- `npm test` — unit tests (Vitest)
- `node tests/print.e2e.mjs [screenshotDir]` — after a build: prints the fridge sheet, stickers and doctor's list on A4 and Letter, checks the voice script's order and right-to-left Urdu, (typical and worst-case plans), checks nothing sticks out of a page, measures stickers against spec (within 1 mm), and makes real PDFs to check page size and count
- `node tests/lockscreen.e2e.mjs [screenshotDir]` — after a build: lock-screen PNGs for both presets and layouts; exact PNG size, every drawn piece in the safe area, no drawn pixels in the clock or button zones, fields and order
- `node tests/a11y.e2e.mjs [screenshotDir]` — after a build: every screen in English and Urdu at 100% and 200% text on a 390 px phone; axe-core (WCAG 2.1 AA + best practice), no sideways scroll, one h1 and main, Urdu right to left, 48 px touch targets, and a keyboard-only walk
- `node tests/sample.e2e.mjs [screenshotDir]` — after a build: every output reached from the landing page in two taps through the sample, the sample notice on each, the family's own link and IndexedDB left untouched (including the back button), and the landing bottom bar sticking only after the hero button scrolls away
- `node tests/reload.e2e.mjs [screenshotDir]` — after a build: serves `out/` and walks the setup flow on a phone-sized touch screen, checking the plan survives a reload from the link alone (uses the preinstalled Chromium)

## Milestones

Tracked in SPEC.md → "Build milestones". Status:

- [x] 1. Scaffold, design tokens, data model, URL-hash state
- [x] 2. Setup screens 1–4 and 7
- [x] 3. Medicines list and editor, with symbol auto-assignment
- [x] 4. Photo capture, compression, IndexedDB, `.waqtpe` export and import
- [x] 5. Review step and output lock
- [x] 6. Fridge sheet print, both pages, placeholder pictograms, research toggles
- [x] 7. Sticker sheet and doctor's list
- [x] 8. Voice-note script, English and Urdu
- [x] 9. Lock-screen card with presets and clock preview (still to verify on two real phones)
- [x] 10. Urdu layout polish and accessibility pass (final pictograms still to come: the placeholders stay until the artwork is ready)
