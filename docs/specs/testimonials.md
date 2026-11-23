# Spec — Testimonials (`testimonials`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, Section instance **`130:5607`** (Section, Theme=Surface, 1440×600 at y 4081). The two cards are instances of the **"Testimonial card"** component **`10:1120`** (Components page `8:13265`), which has no variants (no Breakpoint property).
Evidence (`/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad/sections/testimonials/`): `figma.png` (1x, 1440×600), `code-1440.png`, `code-834.png`, `code-390.png` (current code).
Code files: `src/sections/testimonials.tsx`, `src/content/testimonials.json`. Breakpoints and token modes follow `docs/specs/foundations.md` §1 (Desktop = base, Tablet = `tablet:` ≤992, `landscape:` ≤768, Mobile = `portrait:` ≤480).

Desktop is already close: measured at 1440, section 1440×600, pad 96/96, H1 48/56 −1px, grid 1120 wide with mt 48 and gap 12, cards 554×304, pad 32, gap 48, radius 12, quote 16/24, name 14/20 bold, role 12/16. The changes are the logo size, the 4px name/role gap, and the use of the responsive spacing tokens so Tablet and Mobile step down the way Figma's variable modes do.

---

## 1. Structure

```
<Section id="testimonials" className="bg-chalk">     Section Theme=Surface: surface/sunken #e6e6e6, section-padding-y 96/64/48, 1120 column
  Heading.H1 (renders <h2>)                           "Heading" 130:5603, Display/Small
  div.grid (grid-cols-2, gap 12, mt 48)               "Frame 2" 130:5604: 2 cols minmax(0,1fr), 1 row fit-content, padding-top spacing/3xl
    article.card × 2                                  "Testimonial card" 10:1120 (justify-self stretch)
      p.quote                                         10:1112 Body/Medium
      div.attribution (flex row, items-end, gap 16)   10:1113 "Attribution"
        div.client (flex-col, gap 4, flex-1, min-w-0) 10:1114 "Client"
          h3.name                                     10:1115 Body/Small/Bold
          p.role                                      10:1116 Caption
        img.logo (32 high, auto width, shrink-0)      164:5479 "Image (Onvlee Engineering)" 93.333×32
```

Layout per Figma:
- Grid: `grid grid-cols-2`, column and row gap **12** (raw, not a variable), padding-top **spacing/3xl** (48/40/32). In code that is the grid's margin-top.
- Card: flex column, `items-start`, gap **spacing/3xl** (48/40/32), padding **spacing/2xl** (32/28/24), radius **radius/lg** 12, fill surface/default #f9f9f9, `overflow-clip`, fixed height 304 in Figma.
- Attribution: flex row, `items-end`, gap **spacing/lg** 16, full width. Client column takes the remaining width (`flex-[1_0_0] min-w-px`), stacks name and role with gap **spacing/xs** 4. The logo sits bottom-right at its natural ratio.
- Code pins the attribution with `mt-auto` so names and logos line up across cards of unequal copy length. KEEP (Figma's fixed 304 height does the same job; real copy differs in length per card).

## 2. Text nodes

| Node | Copy | Style (Figma) | Code |
|---|---|---|---|
| `130:5603` heading | Figma: "Effortless from " + *"brief to launch."* (placeholder copied from Process). **KEEP code copy:** "Why marketing teams " + *"take a seat."* (italic, `<Em>`) | Display/Small 48/56, tracking −1, Instrument Serif; italic phrase Instrument Serif Italic. Tablet 36/44, Mobile 30/36 | `<Heading.H1>Why marketing teams <Em>take a seat.</Em></Heading.H1>` → `font-serif text-h1` ✓ |
| `10:1112` quote | Figma shows the Onvlee quote in both cards (duplicate). **KEEP code data:** both entries of `src/content/testimonials.json`, wrapped in “ ” | Body/Medium 16/24, Golos 400, text/primary | `text-p-md` ✓ |
| `10:1115` name | "Brendon Barendse" / "Ryan Le Roux" (from JSON) | Body/Small/Bold 14/20, 700 | `text-p-sm font-bold` ✓ (element `<h3>`: KEEP for the outline) |
| `10:1116` role | "National Sales Manager, Onvlee Engineering" / "Founder and CEO, Leva Foundation / Tangible" (from JSON) | Caption 12/16, 400 | `text-p-xs` ✓ |

Figma's quote text matches the JSON's first entry verbatim (with curly quotes and the ’ in "don’t"). No copy changes. All text is text/primary #181b1e → `text-ink` (on Paper 16.6:1, passes AA).

## 3. Tokens

| Property | Figma (Desktop / Tablet / Mobile) | Code token |
|---|---|---|
| Section background | theme/surface-sunken #e6e6e6 | `bg-chalk` ✓ |
| Section padding Y | layout/section-padding-y 96 / 64 / 48 | `<Section>` default `pad="bg"` ✓ (measured 96 / 64 / 48) |
| Container | 1200 max, gutter 40 / 24 / 16 → 1120 column | `<Section>` default `width="max"` ✓ |
| Heading → grid | spacing/3xl 48 / 40 / 32 | **`mt-xlg`** (now `mt-12`, fixed 48) |
| Grid gap | 12 (raw) | `gap-3` ✓ |
| Card fill | theme/surface-default #f9f9f9 | `bg-paper` ✓ |
| Card radius | size/radius-lg 12 (all modes) | `rounded-md` ✓ |
| Card padding | size/spacing-2xl 32 / 28 / 24 | **`p-xxxbg`** (now `p-8`, fixed 32) |
| Card stack gap (quote → attribution) | size/spacing-3xl 48 / 40 / 32 | **`gap-xlg`** (now `gap-12`, fixed 48) |
| Card height | 304 fixed | `min-h-[304px]` KEEP as a minimum (real copy is longer than Figma's at Tablet/Mobile; a fixed height would clip it). `landscape:min-h-0` when stacked ✓ |
| Attribution gap | size/spacing-lg 16 | `gap-4` ✓ |
| Name → role gap | size/spacing-xs 4 | **`flex flex-col gap-xxsm`** (now no gap) |
| Logo box | 93.333 × 32 | **`h-8 w-auto`** (now `h-9` = 105×36) |
| Text colour | theme/text-primary #181b1e | `text-ink` ✓ |
| Border / shadow | none | none ✓ |

## 4. Components and variants

- Figma Section, Theme=Surface (→ `<Section className="bg-chalk">`).
- "Testimonial card" `10:1120`, single variant, used twice. Code renders it inline in the map (no separate component needed; KEEP).
- Heading: `Heading.H1` + `Em`. No buttons or pills in this section.

## 5. Assets per slot

| Slot | Figma | Code | Decision |
|---|---|---|---|
| Card 1 logo (`164:5479`) | "Image (Onvlee Engineering)" SVG, 93.333×32 | `/images/brands/onvlee-engineering.svg` (82×28 viewBox, ratio 2.93 = Figma's 2.92) | Same artwork. Render at **32px high** (width follows ≈ 93.7) |
| Card 2 logo | Figma repeats Onvlee (duplicate) | `/images/brands/leva-foundation.svg` (82×28) | KEEP the real logo, same 32px height |

`alt=""` KEEP: the company is named in the role line right next to it, so the logo is decorative. Keep `object-contain object-right` and `shrink-0`. Do not download the Figma asset (the local SVG is the exact match).

## 6. Responsive behaviour

Figma has no Tablet/Mobile frame for this section or card, so use the variable modes for sizes and code's stacking for layout:

| | Desktop (base) | Tablet (≤992) | Landscape (≤768) | Mobile (≤480) |
|---|---|---|---|---|
| Columns | 2 | 2 | 1 (`landscape:grid-cols-1` ✓) | 1 |
| Heading | 48/56 | 36/44 | 36/44 | 30/36 (token-driven ✓) |
| Grid mt | 48 | 40 | 40 | 32 (via `mt-xlg`) |
| Card padding | 32 | 28 | 28 | 24 (via `p-xxxbg`) |
| Card gap | 48 | 40 | 40 | 32 (via `gap-xlg`) |
| Card min-h | 304 | 304 | none | none |
| Logo | 32 high | 32 | 32 | 32 |

The tokens already step in `src/index.css` (`--spacing-xlg` 3/2.5/2rem, `--spacing-xxxbg` 2/1.75/1.5rem). If the foundations change has not landed yet, the classes still compile and give the Desktop values.

## 7. Interactive states

None: the cards are static (no links, hover or focus). Keep them non-interactive; do not add hover lift. Keep `<article>` per card, `<h3>` names, decorative `alt=""` logos.

## 8. KEEP list (deliberate departures from Figma)

1. Heading copy "Why marketing teams *take a seat.*" (Figma placeholder from Process). Owner decision.
2. Second testimonial (Ryan Le Roux / Leva Foundation) and its logo; Figma duplicates the first. Owner decision.
3. `min-h-[304px]` instead of a fixed `h-[304px]`, plus `mt-auto` on the attribution: real copy grows at narrow widths and must not clip.
4. `<h3>` for the name (Figma uses a paragraph): keeps the document outline.
5. Stacking to one column at `landscape:` (≤768): Figma has no narrow variant.

## 9. DIFF — current code → required

1. **`src/sections/testimonials.tsx:14`** — grid top spacing `mt-12` → **`mt-xlg`** (Figma spacing/3xl 48 / 40 / 32). Result: `className="mt-xlg grid grid-cols-2 gap-3 landscape:grid-cols-1"`.
2. **`src/sections/testimonials.tsx:18`** — card padding `p-8` → **`p-xxxbg`** (spacing/2xl 32 / 28 / 24).
3. **`src/sections/testimonials.tsx:18`** — card stack gap `gap-12` → **`gap-xlg`** (spacing/3xl 48 / 40 / 32). Result: `className="flex min-h-[304px] flex-col gap-xlg rounded-md bg-paper p-xxxbg text-ink landscape:min-h-0"`.
4. **`src/sections/testimonials.tsx:23`** — client wrapper `<div>` → **`<div className="flex min-w-0 flex-1 flex-col gap-xxsm">`** (Figma "Client": flex-1, min-w-px, column, gap spacing/xs 4). Adds the 4px name/role gap and lets long roles wrap beside the logo.
5. **`src/sections/testimonials.tsx:27`** — logo `h-9 w-fit max-w-[9rem]` → **`h-8 w-auto max-w-[9rem]`** (Figma 93.333×32). Keep `shrink-0 object-contain object-right`, `alt=""`.

No changes to `src/content/testimonials.json` (copy and logo paths are right).

## 10. Verification (1440 / 834 / 390, playwright or Browser pane)

| Probe | 1440 | 834 | 390 |
|---|---|---|---|
| `#testimonials` padding-top/bottom | 96 | 64 | 48 |
| `h2` font-size/line-height/letter-spacing | 48/56/−1 | 36/44/−1 | 30/36/−1 |
| grid margin-top | 48 | 40 | 32 |
| grid columns / gap | 2 × 554, 12 | 2 × 387, 12 | 1 × 358, 12 |
| card padding / gap / radius | 32 / 48 / 12 | 28 / 40 / 12 | 24 / 32 / 12 |
| card height | 304 | ≥ 304 (content) | content |
| client column gap (name → role) | 4 | 4 | 4 |
| logo img box | ≈ 94 × 32 | ≈ 94 × 32 | ≈ 94 × 32 |
| name / role type | 14/20 700, 12/16 400 | same | same |
| bottoms of name block and logo aligned (items-end) across both cards | yes | yes | — |
