# Waqt Pe — Theme v3

This file supersedes the **App theme** section of SPEC.md. Where they differ, follow this file.

**Version 3: All six.** The structure from version 2 stays (Foil pockets, the sun arc, the ralli trim, the Lalezar logo). Only the colours change, to a palette built from six colours: Etruscan red, cinnamon buff, pistachio green, pinkish cinnamon, olive buff, and blue violet.

## Direction

The structure comes from medicine blister packs: rounded pockets, capsule buttons, and perforated dividers. Progress stays the sun moving along its arc. Ralli patchwork appears only as a thin trim strip under the header and above the bottom action bar, never behind content.

**Never use:** one-side border accents, drop shadows, gradient washes, or emoji.

## Colour tokens

| Token | Hex | Use |
| --- | --- | --- |
| `ground` | #FFF4E4 | Page background (a pale cinnamon buff) |
| `surface` | #FFFFFF | Pockets, cards, inputs |
| `ink` | #2A2140 | Text and icons |
| `ink-soft` | #5E5468 | Secondary text |
| `line` | #E3CDB0 | Borders at rest |
| `perforation` | #BC9C78 | Dashed dividers, sun arc path |
| `primary` | #6450A1 | Actions, selection, focus ring (blue violet) |
| `primary-tint` | #E7E2F5 | Selected pocket fill |
| `sun` | #FDC57E | Current step on the sun arc; logo offset (cinnamon buff) |
| `logo` | #A83E33 | Logo Urdu (Etruscan red, deepened for contrast) |
| `ralli-1` | #C55347 | Trim patch, Etruscan red |
| `ralli-2` | #648F7B | Trim patch, pistachio green |
| `ralli-3` | #EEB480 | Trim patch, pinkish cinnamon |
| `ralli-4` | #C1C494 | Trim patch, olive buff |
| `ralli-5` | #6450A1 | Trim patch, blue violet |
| `dawn` / `noon` / `dusk` / `night` | #FCE9D8 / #FFF6CC / #F6DCE4 / #DDE0F2 | Dose chip backgrounds |

Measured contrast: `ink` on `ground` 13.9:1, `ink-soft` on `ground` 6.6:1, white on `primary` 6.6:1, `primary` on `ground` 6.0:1, `logo` on `ground` 5.7:1. The lighter palette colours (cinnamon buff, pinkish cinnamon, olive buff, pistachio, and the original Etruscan red) are fills, trim, and accents only, never text. Blue violet was chosen for actions because none of the eight medicine symbol colours are violet, so buttons never compete with symbols.

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
| Ralli trim | 12 px tall, repeating squares: a full-strength coloured square with a `ground` triangle rising from its base, alternating with a `ground` square holding a coloured diamond. Colours cycle `ralli-1` to `ralli-5`. Build once as an inline SVG pattern component, `aria-hidden`. |

## Logo

Lalezar (Google Fonts, open licence), used only in the logo. **No background block.** The Urdu is `logo` red with a cinnamon-buff (`sun`) offset copy printed behind it, like two-colour poster printing. The English is `ink`.

| Version | Spec |
| --- | --- |
| Offset rule | A hard copy of the Urdu in `sun`, shifted down and to the right by 5% of the Urdu font size, with no blur. Implement as a hard `text-shadow` or a second text layer. This is the only shadow allowed anywhere, and only in the logo. |
| Header lockup | About 40 px tall, no background. وقت پہ at 28 px in `logo` with a 1.5 px `sun` offset; "Waqt Pe" at 13 px in `ink`. Accessible name "Waqt Pe". |
| Primary lockup | وقت پہ at 64 px with a 3 px offset, "Waqt Pe" at 30 px, side by side. |
| Stacked lockup | Urdu above English, centred, for splash screens and printed sheets. |
| One colour | No offset: Urdu in `logo`, English in `ink`. For the fridge sheet, and all `ink` for black-and-white printing. |
| App icon and favicon | White rounded square with a 2 px `line` border, ralli strip along the top, وقت پہ in `logo` with the `sun` offset. |

## Right-to-left, copy voice, and quality floor

Unchanged from version 1: logical CSS properties only, `lang` and `dir` on all Urdu text, `<bdi>` around names and numbers, sentence case, active-verb buttons, WCAG AA text contrast, visible focus, 48 px touch targets, layout holding at 200% text, reduced motion respected, and testing on a low-end Android phone.
