# Spec: CTA band (`cta`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, the Section instance **`130:5744`** (y 8076, 1440 × 525.47). It is the Section component (`10:5647`, Theme=Brand), and the button is the Button component `8:13266` (Appearance=Default, Width=Hug).
Evidence is in `scratchpad/sections/cta/`: `figma.png` (Figma 1x, 1440×526), `figma-collage-2x.png` (crop of the collage), and `code-1440.png`, `code-834.png`, `code-390.png` (the current dev server, `#contact`).
Code files: `src/sections/cta.tsx` and `public/images/cta/{campaign-card,poolside-drink,egg-chair}.webp`. The section is mounted in `src/pages/index.astro:55` (`<CtaBanner client:visible …/>`).

The shared foundations (type modes, `--section-pad*` values, the pill's `tablet:h-11`, the Section default `pad='bg'`) come from `docs/specs/foundations.md`. This spec depends on its D6 and D16, and must not redefine those tokens.

---

## 1. Structure and layout (Desktop 1440)

```
<section id="contact">          Section, Theme=Brand: bg volt, text ink, pad T/B 96 (section/p-bg), L/R 40 (page/gutter)
  Container (1200 incl. gutters → 1120 content)
    Grid 130:5734               2 cols, minmax(0,1fr) each = 544 | 544, column gap 32 (grid/gutter), 1 row,
                                BOTH cells self-start (top aligned)
      Col 1 "Channel introduction" 130:5735   flex-col, items-start, gap 24 (spacing/xl), width 544, height 264
        h2  Heading 130:5736        x0 y0   544×128 (2 lines)
        p   Description 130:5737    x0 y152 544×48  (2 lines)
        a   Button 130:5738         x0 y224 135×40
      Col 2 "Frame 8" 130:5739      flex-col, items-center, justify-center, width 544, height 333.47
        Collage "Frame 8" 130:5740  320 × 333.47 (max-w 320), centred in the column → x 112 within the column
          img  Sunlit Poolside… 130:5741   (painted 1st, back)
          img  image 2          130:5742   (painted 2nd)
          img  Colourful 3D Chair 130:5743 (painted 3rd, front)
```

Section height = 96 + 333.47 + 96 = **525.47**. The collage is the tallest cell, so the text column (264 tall) sits at the **top** of the row, not centred. In absolute terms at 1440: the heading starts at y = section top + 96, the collage at y = section top + 96, x 848. The heading x is 160.

Code mapping:

| Figma | Code |
|---|---|
| Section Theme=Brand, `theme/brand/primary` #bce42d | `<Section … className="bg-volt text-ink">` |
| Container p-bg 96 / page gutter 40 / max 1200 | `<Section>` **default** `pad` (`bg` = `--section-pad` 96/64/48) + `width="max"` (default) |
| Grid 2 × 1fr, gap-x 32 | `grid grid-cols-2 gap-8` (32 = grid/gutter Desktop) |
| self-start on both cells | `items-start` on the grid |
| Col 1 flex-col gap 24 items-start | `flex flex-col items-start gap-6` ✓ |
| Col 2 centred, collage 320 × 333.47 | `relative mx-auto aspect-[320/333.47] w-full max-w-80` ✓ |

## 2. Text nodes

| Node | Copy (verbatim) | Italic | Figma style | Code |
|---|---|---|---|---|
| Heading 130:5736 | `The simple way to get creative.` | none (no italic run in Figma) | Display/Large: Instrument Serif 400, 60/64, tracking −1 (`typography/display-lg`), `theme/text/primary` #181b1e, **text-wrap: pretty** | `<Heading.Display className="text-pretty">` (renders h2, `font-serif text-display`, 60/64/−1 → 48/56 Tablet → 36/40 Mobile via foundations) |
| Description 130:5737 | `Design, illustration and animation for marketing teams that need more capacity.` | — | Body/Medium: Golos Text 400, 16/24, tracking 0, #181b1e, **text-wrap: pretty** | `<Paragraph className="max-w-[34rem] text-pretty">` (`text-p-md`) |
| Button label 8:11953 | `Book a demo` | — | UI/Button: Golos 500, 14/20, `base/color/neutral-950` #181b1e | `LinkButton variant="inverse"` (`text-ui font-medium`) |

Line breaks Figma draws at 1440: heading "The simple way to / get creative."; description "Design, illustration and animation for marketing teams that need / more capacity." Both come from `text-wrap: pretty`, which refuses a one-word last line. The code currently breaks "…to get / creative." and "…need more / capacity." (see `code-1440.png`), so it needs `text-pretty`.

## 3. Sizes, spacing, colour and tokens

| Property | Figma | Code token |
|---|---|---|
| Section background | `theme/brand/primary` #bce42d | `bg-volt` |
| Text colour | `theme/text/primary` #181b1e | `text-ink` (inherited) |
| Section padding Y | `layout/section-padding-y` 96 (Tablet 64, Mobile 48) | Section default `pad` (`bg`) |
| Side gutter | `layout/page-gutter` 40 / 24 / 16 | Container (`--container-margin`) |
| Column gap | `layout/grid-gutter` 32 | `gap-8` |
| Col 1 stack gap | `size/spacing/xl` 24 | `gap-6` |
| Button | h `size/control/md` 40 (44 Tablet/Mobile), px `spacing/xl` 24, gap `spacing/md` 12, radius full, fill `base/color/neutral-50` #f9f9f9, label #181b1e | `LinkButton variant="inverse"` (`bg-paper text-ink h-10 tablet:h-11 px-6 rounded-full`) ✓ |
| Collage frame | 320 × 333.4678 | `max-w-80 aspect-[320/333.47]` ✓ |
| Shadows / borders on section | none | none |

Contrast: Ink on Volt is 13.4:1 and Ink on Paper is 16.9:1, so both pass AA. There is no deviation.

## 4. Collage: assets per slot

Each slot is positioned in percent of the 320 × 333.47 frame (Figma `inset` values). The current `COLLAGE` boxes match Figma exactly. At 1440 they were measured as poolside 127×187 at (1041, +70), card 170×247 at (848, 0), chair 190×219 at (914, +114), against Figma 127.2×186.9, 169.6×247.2 and 189.9×219.2. ✓

| Order | Figma node / box (L, T, W, H) | Figma fill | Code asset | Treatment |
|---|---|---|---|---|
| 1 (back) | 130:5741 "Sunlit Poolside Phone and Peach Drink 1": 60.24%, 21.08%, 39.76%, 56.04% | photo, object-cover, square corners, no border | `/images/cta/poolside-drink.webp` (300×450) | `object-cover`. ✓ KEEP |
| 2 | 130:5742 "image 2": 0, 0, 53.01%, 74.14% | Figma's bitmap is a **campaign card with a 4px Paper (#f9f9f9) frame and ~12px outer radius (≈8px inner)** baked in. Measured on `figma.png`: Volt to #f9f9f9 at x 848–851, image from 852; top 96–99; the corner arc spans ~12px. The content of that card is template filler ("Tag heading / Get ready for *Awesome headline*") | `/images/cta/campaign-card.webp` (400×583, Onvlee "Arcs & Bends", aspect 0.686 = slot aspect 0.686) | **KEEP the real image** (owner decision: Figma's card was filler). Reproduce Figma's frame in CSS, because our bitmap has no frame of its own: `rounded-md border-4 border-paper bg-paper object-cover` (12px outer radius; with border-box the image's inner corner becomes 8px) |
| 3 (front) | 130:5743 "Colourful 3D Chair Collection 12": 20.78%, 34.26%, 59.34%, 65.74% | crop of a chair sheet (Figma's img is offset −389%/−106%, so only one chair shows), transparent background | `/images/cta/egg-chair.webp` (380×440, transparent, already cropped to the one chair) | `object-contain`. ✓ KEEP (the pre-cropped asset gives the same visual as Figma's sheet crop) |

All three images: `alt=""`, `loading="lazy"`, `decoding="async"`, inside a wrapper with `aria-hidden`. They are decorative, because the heading carries the message. ✓ KEEP.

## 5. Components and variants

- `Section` (`src/components/base/section.tsx`), Theme=Brand → `className="bg-volt text-ink"`, default `pad`.
- `Heading.Display` (Display/Large).
- `Paragraph` (Body/Medium).
- `LinkButton variant="inverse"` = Figma Button Appearance=Default (Paper fill), Width=Hug. Keep `id="cta-book-demo"`, `data-track="book_demo_click"`, `data-track-location="cta"` and `href={demoPage}`.

## 6. Responsive

Figma has only the Desktop frame for this section. The Tablet and Mobile values come from the variable modes (applied globally by foundations): text-display 48/56 → 36/40, section pad 64 → 48, gutter 24 → 16, pill 44.

| Range | Layout |
|---|---|
| > 992 (base) | 2 columns as §1, `items-start` |
| ≤ 992 (`tablet:`) | `tablet:grid-cols-1`: the text stacks above the collage. Row gap `tablet:gap-12` (48). The collage is centred (`mx-auto`) and capped at `tablet:max-w-72` (288). **KEEP** (the stacking is sensible; the 48 gap separates the action from the artwork) |
| ≤ 480 (`portrait:`) | Same stack. The collage stays 288 wide or narrower, so it fits 390 − 2·16 = 358 |

Measured now: 834 heading on one line, 48/56; 390 heading 36/40, pill 44 tall, collage 288×300. ✓

## 7. Interactive states to keep

- Pill `inverse`: `hover:bg-soft-volt`, `active:scale-[0.98]`, focus-visible with a Paper outline at offset 4 plus an Ink `ring-4` band. That gives ≥ 3:1 on Volt. Tap target is 40 desktop and 44 at ≤ 992.
- No hover or motion on the collage (Figma has none). Owner rule: no reduced-motion gating is added.

## 8. KEEP (deliberate)

- KEEP the Onvlee "Arcs & Bends" image in the card slot (Figma content was template filler).
- KEEP `id="contact"` on the section (anchor target) and the analytics attributes on the button.
- KEEP `Paragraph` `max-w-[34rem]`. It equals the 544 column at desktop, so it does nothing there, and once stacked it holds the description to Figma's 544 measure.
- KEEP `tablet:max-w-72` on the collage and `tablet:gap-12` (no Figma Tablet frame; sensible stacking).
- KEEP the pre-cropped `egg-chair.webp` rather than Figma's sprite-sheet crop.
- Note (out of this file's scope, no change required): `index.astro:55` hydrates `CtaBanner` with `client:visible` although the section has no client interactivity. Leave it unless the page owner wants to drop the island.

---

## 9. DIFF: current code → required

1. **`src/sections/cta.tsx:26`: section padding.** Remove `pad="md"` (64) so the Section default `pad='bg'` applies. That is `--section-pad` 96 / 64 / 48 = Figma `layout/section-padding-y`, and it gives a section height of 525.47 at 1440 (measured now: 461, padding 64). Ship this with foundations D6/D16. If foundations has not yet changed the default, pass `pad="bg"` explicitly.
2. **`src/sections/cta.tsx:26`: row alignment.** In `innerClassName`, change `items-center` → `items-start`. Figma sets both grid cells `self-start`. Today the text column is centred, so the heading sits 35px below the collage top (heading y 370 vs collage y 335). Figma has them flush.
   Resulting `innerClassName`: `"grid grid-cols-2 items-start gap-8 tablet:grid-cols-1 tablet:gap-12"`.
3. **`src/sections/cta.tsx:28`: heading wrap.** `<Heading.Display>` → `<Heading.Display className="text-pretty">`. This matches Figma's `text-pretty` break, "The simple way to / get creative.". Today the code breaks "…to get / creative.".
4. **`src/sections/cta.tsx:29`: description wrap.** `className="max-w-[34rem]"` → `className="max-w-[34rem] text-pretty"`. This gives Figma's "…that need / more capacity.".
5. **`src/sections/cta.tsx:15`: campaign-card frame.** `fit: 'object-cover rounded-sm'` → `fit: 'object-cover rounded-md border-4 border-paper bg-paper'`. That is the 4px Paper frame and 12px outer radius that Figma's card draws (inner corner 8). Update the doc comment at lines 7–12 to say the card gets Figma's Paper frame in CSS. Box geometry is unchanged.

**Required changes: 5.**

### Verification after the build agent applies them (1440 × 900, `#contact`)

- section paddingTop and paddingBottom are 96px, and the section height is about 525.
- heading top equals collage top (both at section top + 96). Heading x is 160 and collage x is 848.
- the heading renders 2 lines, the second line being "get creative.". The description renders 2 lines, the second being "more capacity.".
- the card `img` has computed `border-width: 4px`, colour rgb(249,249,249) and `border-radius: 12px`. Its box is 170×247.
- at 834 and 390: one column, paddings 64 and 48, pill 44 tall, and no horizontal scroll.
