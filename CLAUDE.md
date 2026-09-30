# Waqt Pe

**Before doing anything else in a session, read `SPEC.md` in full.** It is the source of truth: Part 1 is the design spec (the why), Part 2 is the build spec (what to build, milestone by milestone). Where they disagree, Part 1 wins on intent and Part 2 wins on implementation. When a decision changes, update `SPEC.md` in the same change.

## What this is

Waqt Pe ("on time") is a privacy-first family medicine and emergency kit. A family describes one person's medicines and health details once, and the app produces a fridge medicine schedule, sticker sheet, voice-note script, emergency lock-screen card, and doctor's list. It is designed for the hardest reader first: a helper who may not read, so pictures, colour-and-shape symbols, box photos, numerals and voice carry the meaning, and text is a supporting layer.

Everything runs in the browser. No backend, no accounts, no database, no running costs.

## Non-negotiables (see SPEC.md → "Privacy rules" and "App theme")

- **Privacy rules**: no user data ever goes over the network; no analytics or third-party scripts; the URL hash holds text only, photos never go into the link (they live in IndexedDB on the device); a visible "Clear everything on this device" control; the landing page says "Nothing you enter leaves this device." Fonts are self-hosted via `@fontsource`, never loaded from a CDN at runtime.
- **App theme**: use only the tokens in `src/styles/tokens.css` (colours, type roles, radii, spacing scale 4/8/12/16/24/32/48). No clinical blue, no drop shadows (structure comes from 1.5 px borders and spacing), Atkinson Hyperlegible for English and Noto Nastaliq Urdu for Urdu only, 18 px body text minimum, sentence case, touch targets ≥ 48 px, visible focus, reduced motion respected. The only decorative animation is the sun on the progress arc.
- **Right-to-left from day one**: logical CSS only (`ms-/me-/ps-/pe-/start-/end-`, `text-start`), never left/right. Every Urdu text container gets `lang="ur" dir="rtl"` (use the `<Ur>` component). Wrap names and phone numbers in `<bdi>`. Directional icons flip (`rtl:-scale-x-100`); pictograms and medicine symbols never flip. Never tighten Nastaliq line height or letter-space Urdu.
- **Safety boundary**: Waqt Pe only arranges what a doctor prescribed. No dose advice, no interaction checks, no drug information, ever. Editing a medicine resets `reviewed`; printing stays blocked until every medicine is reviewed.
- **Pictograms** are placeholders until final art exists; each is a swappable SVG React component with a `size` prop.

## Stack

Next.js (App Router) as a static export (`output: "export"`, builds to `out/`), TypeScript, Tailwind CSS v4 (theme tokens via `@theme` in `src/styles/tokens.css`), lz-string for the URL hash, idb-keyval for photos. Hosted on Vercel free tier with no server functions.

## Layout of the code

- `src/lib/plan.ts` — the `Plan` data model from SPEC.md, defaults, symbol table, and rules (review reset, print lock, sheet versions, units).
- `src/lib/sanitise.ts` — turns untrusted JSON (from a link or file) into a valid `Plan`.
- `src/lib/hash.ts` — `Plan` ⇄ compressed URL hash (`#p=…`).
- `src/lib/plan-store.tsx` — `PlanProvider` and `usePlan()`: loads the plan from the hash once, autosaves every change back to it, and `go(path)` moves between screens carrying the plan in the link. Mounted in the root layout so every screen shares one plan.
- `src/lib/steps.ts` — the setup flow order (8 steps, one question per screen).
- `src/lib/messages.ts` — all interface copy in English and Urdu (Urdu needs native review). `src/lib/i18n.tsx` — UI language, document direction, `useT()`, and `useFillNodes()` for names inside sentences (isolates a name only when its direction differs from the sentence's).
- `src/lib/medicine.ts` — medicine helpers: symbol names for the voice note, drawn/written quantities, `withDose`/`withForm` (edits go through `editMedicine`, so `reviewed` resets).
- `src/lib/photos.ts` — photos on this device: compress (long edge 1000 px, JPEG), store in IndexedDB as bytes + type, `usePhoto(id)` for display, `missingPhotos()` for links opened on another device. Delete a photo when its medicine or contact is removed or it's replaced.
- `src/lib/backup.ts` — the `.waqtpe` saved file: plan plus referenced photos as base64. `readBackup()` checks and sanitises before anything is stored.
- `src/lib/device.ts` — "Clear everything on this device".
- `src/components/` — core components from the App theme (Button, TextField, ChoiceCard, ChoiceChip, ListEditor, ConfirmInline, Notice, ProgressHeader, SetupScreen, Ur, icons). Use `ConfirmInline`, never `window.confirm`.
- `src/pictograms/` — placeholder pictograms and medicine symbols, each a swappable SVG component with a `size` prop.
- `src/app/setup/<step>/` — one route per setup screen. `src/app/outputs/` — the outputs hub (screen 9); medicine outputs stay locked until `canPrint(plan)`. `reviewed` is set true only in the review step, via `markReviewed()`. `src/app/kit/` — component and type gallery for checking the theme in both directions.

## Commands

- `npm run dev` — local dev server
- `npm run build` — static export to `out/`
- `npm run lint` — type check
- `npm test` — unit tests (Vitest)
- `node tests/reload.e2e.mjs [screenshotDir]` — after a build: serves `out/` and walks the setup flow on a phone-sized touch screen, checking the plan survives a reload from the link alone (uses the preinstalled Chromium)

## Milestones

Tracked in SPEC.md → "Build milestones". Status:

- [x] 1. Scaffold, design tokens, data model, URL-hash state
- [x] 2. Setup screens 1–4 and 7
- [x] 3. Medicines list and editor, with symbol auto-assignment
- [x] 4. Photo capture, compression, IndexedDB, `.waqtpe` export and import
- [x] 5. Review step and output lock
- [ ] 6. Fridge sheet print, both pages, placeholder pictograms, research toggles
