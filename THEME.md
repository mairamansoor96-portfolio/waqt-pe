# Waqt Pe — Theme v2

This file supersedes the **App theme** section of SPEC.md. Where they differ, follow this file.

**Version 2: Foil, sun, and ralli trim.** This replaces the earlier indigo theme. Mockups and the logo kit live on the Waqt Pe visual directions canvas.

## Direction

The structure comes from medicine blister packs: rounded pockets, capsule buttons, and perforated dividers. Progress stays the sun moving along its arc. Ralli patchwork appears only as a thin trim strip under the header and above the bottom action bar, never behind content.

**Never use:** one-side border accents, drop shadows, gradient washes, or emoji.

## Colour tokens

| Token | Hex | Use |
| --- | --- | --- |
| `ground` | #E9EDEC | Page background (foil grey) |
| `surface` | #FFFFFF | Pockets, cards, inputs |
| `ink` | #102421 | Text and icons |
| `ink-soft` | #445A56 | Secondary text |
| `line` | #B4C3BF | Borders at rest |
| `perforation` | #93A7A2 | Dashed dividers, sun arc path |
| `primary` | #0B5D57 | Actions, selection, focus ring |
| `primary-tint` | #D9ECE8 | Selected pocket fill |
| `sun` | #F2A23A | Current step on the sun arc; logo offset |
| `ralli-1` | #C9DEDA | Trim patch, teal |
| `ralli-2` | #E6DCC6 | Trim patch, sand |
| `ralli-3` | #E2C6C2 | Trim patch, madder |
| `ralli-4` | #B9C8C5 | Trim patch, foil |
| `dawn` / `noon` / `dusk` / `night` | #FCE9D8 / #FFF6CC / #F6DCE4 / #DDE0F2 | Dose chip backgrounds |

Measured contrast: white on `primary` 7.7:1, `primary` on `ground` 6.6:1, `sun` on `primary` 3.7:1. Sun is never used as readable text; in the logo it only appears as the offset behind the teal Urdu.

## Type

Atkinson Hyperlegible for all English UI text and Noto Nastaliq Urdu for Urdu UI text, with the same scale as before (28 / 22 / 18 / 15 px). **Lalezar is used only for the logo**, never for interface text.

## Shape and borders

| Element | Radius | Border |
| --- | --- | --- |
| Choice pocket | 28 px | 2 px `line`; selected 3 px `primary` |
| Medicine card | 26 px | 2 px `line` |
| Photo thumbnail | 16 px | 2 px dashed `perforation` when empty |
| Buttons, chips, step badges | Full (capsule) | Primary filled; secondary 2 px `primary` |
| Section dividers | n/a | 2 px dashed `perforation` |

## Components

| Component | Spec |
| --- | --- |
| Header | Back button (44 px round, 2 px `line`), compact logo centred, step count at the end. Below it the existing sun arc, recoloured: dashed `perforation` path and horizon, finished steps as `primary` dots, the current step as a `sun` circle with an `ink` outline, upcoming steps white with a `line` stroke. Then the 12 px ralli trim. |
| Choice pocket | `surface`, min height 80 px, 48 px round icon well in `ground`, label 18 px bold, helper 15 px `ink-soft`, empty ring at the end. Selected: `primary-tint` fill, 3 px `primary` border, filled check. |
| Medicine card | Top row: 64 px photo thumbnail, name 19 px bold, purpose 15 px `ink-soft`, symbol 34 px. A dashed perforation divider, then dose chips. |
| Dose chip | Capsule, time-of-day tint, 1.5 px `ink` border, time icon, bold slot name, then the detail ("**Morning** 1 tablet, after food"). |
| Bottom bar | 12 px ralli trim on top, then actions. Primary capsule button 56 px tall; secondary is the outline capsule. |
| Ralli trim | 12 px tall, repeating squares: a tinted square with a `ground` triangle rising from its base, alternating with a `ground` square holding a tinted diamond. Tints cycle `ralli-1` to `ralli-4`. Build once as an inline SVG pattern component, `aria-hidden`. |

## Logo

Lalezar (Google Fonts, open licence), used only in the logo. **No background block.** The Urdu is `primary` teal with a sun-yellow offset copy printed behind it, like two-colour poster printing. The English is `ink`.

| Version | Spec |
| --- | --- |
| Offset rule | A hard copy of the Urdu in `sun`, shifted down and to the right by 5% of the Urdu font size, with no blur. Implement as a hard `text-shadow` or a second text layer. This is the only shadow allowed anywhere, and only in the logo. |
| Header lockup | About 40 px tall, no background. وقت پہ at 28 px in `primary` with a 1.5 px `sun` offset; "Waqt Pe" at 13 px in `ink`. Accessible name "Waqt Pe". |
| Primary lockup | وقت پہ at 64 px with a 3 px offset, "Waqt Pe" at 30 px, side by side. |
| Stacked lockup | Urdu above English, centred, for splash screens and printed sheets. |
| One colour | No offset: Urdu in `primary`, English in `ink`. For the fridge sheet, and all `ink` for black-and-white printing. |
| App icon and favicon | White rounded square with a 2 px `line` border, ralli strip along the top, وقت پہ in `primary` with the `sun` offset. |

## Right-to-left, copy voice, and quality floor

Unchanged from version 1: logical CSS properties only, `lang` and `dir` on all Urdu text, `<bdi>` around names and numbers, sentence case, active-verb buttons, WCAG AA text contrast, visible focus, 48 px touch targets, layout holding at 200% text, reduced motion respected, and testing on a low-end Android phone.
