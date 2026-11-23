# Spec — Benefits cards (`benefits`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`. Home frame `130:5280`, section instance **`130:5593`** (y 2699, 1440×684). Component **"Benefit card" `10:743`** on the Components page (`8:13265`); section shell is the "Section" set `10:1334` (Theme=Default `10:132`).
Evidence (scratchpad `sections/benefits/`): `figma.png` (1x, 1440×684), `code-1440.png`, `code-834.png`, `code-390.png`.
Code in scope: `src/sections/benefits.tsx`, `src/components/benefit-card.tsx`, `src/content/sections.ts` (`benefitCards`, lines 6–24).

Overall: the code already matches Figma almost exactly at 1440. There are two real defects. (1) The italic serif phrase makes card 1's title line 33px tall instead of 32, so every card measures 401px where Figma has 400. (2) When titles wrap (Tablet), the stretched cards show a transparent strip under the caption band, because the card root has no fill. Figma's card root is filled Soft Volt.

---

## 1. Structure and layout

```
<Section id="benefits" className="bg-night text-paper">      Figma: Section (Theme=Default, here Dark → bg #181b1e)
  └ Container (max 1120 column; Figma Container max-w 1200, px page-gutter 40, py section-padding-y 96)
      ├ <Heading.H2> "More ideas made. " <Em>"Less waiting."</Em>     Figma text 130:5588, w-full, text-center
      └ Grid  (Figma 130:5589: grid 3 × minmax(0,1fr), column gap 12, padding-top 48, overflow clip)
          ├ BenefitCard  col 1  "More creative capacity"   (130:5591)
          ├ BenefitCard  col 2  "Streamlined workflow"     (130:5592)
          └ BenefitCard  col 3  "One simple subscription"  (130:5590)

BenefitCard (component 10:743): flex-col, items-start, overflow clip, radius md 8, fill lime/100 #d7ef81
  ├ "Benefit illustration" (10:740): h 320, w full, image object-cover (absolute inset-0)
  └ caption band (10:742): flex row, items-center, px 16, py 24, fill #d7ef81, w full
      └ title text (10:741): flex-1, Heading/H3/Sans Regular, colour forest #212c26
```

Measured Figma geometry (1440): heading at x160 y96, 1120×44. Grid top 140, padding-top 48, so cards start at y188. Each card is 365.33×400 (320 image + 80 band). The columns sit at x160 / 537.3 / 914.7. Section height = 96 + 44 + 48 + 400 + 96 = 684.

## 2. Text nodes

| Node | Copy (verbatim) | Italic | Figma style | Code |
|---|---|---|---|---|
| Section heading 130:5588 | `More ideas made. Less waiting.` | "Less waiting." (Instrument Serif Italic) | Typography heading-h1: Instrument Serif 400, 36/44, tracking -1, colour text/primary #f9f9f9, centred | `Heading.H2` (`font-serif text-h2` = 36/44/-1px) + `<Em>` around "Less waiting.". Colour `text-paper` comes from the section. `text-center`. |
| Card 1 title | `More creative capacity` | "creative capacity" (Instrument Serif Italic, 24/32) | Heading/H3/Sans Regular: Golos Text 400, 24/32, tracking 0, forest #212c26 | `<h3 className="text-h3 font-normal tracking-normal">`, italic span `font-serif italic` |
| Card 2 title | `Streamlined workflow` | none | same | same |
| Card 3 title | `One simple subscription` | none | same | same |

Note the naming offset: Figma's "heading-h1" (36/44) is code `text-h2`, and Figma "Heading/H3/Sans Regular" is `text-h3` at weight 400 (not `Heading.H3`, which is bold). The current `<h3>` with `font-normal` is correct.

## 3. Tokens

| Property | Figma | Code token | Status |
|---|---|---|---|
| Section background | theme/background/page #181b1e (flat Ink) | `bg-night` | **KEEP (owner decision: dark Forest→Ink gradient on benefits)** |
| Section padding Y | layout/section-padding-y 96 / 64 / 48 | `<Section>` default `pad="bg"` → `--section-pad` 96/64/48 | ✓ (measured 96 / 64 / 48 at 1440 / 834 / 390) |
| Column | container max 1200 − 2×40 gutter = 1120 | `Container width="max"` (`--container-width`) | ✓ |
| Heading → grid gap | spacing/3xl 48 (grid padding-top) | `mt-12` | ✓ |
| Column gap | spacing/md 12 | `gap-3` | ✓ |
| Grid columns | 3 × minmax(0,1fr) | `grid grid-cols-3` | ✓ |
| Card radius | radius/md 8 | `rounded-sm` (8) | ✓ |
| Card clip | overflow clip | `overflow-hidden` | ✓ |
| Card fill | lime/100 #d7ef81 (on the root as well as the band) | `bg-soft-volt` | **missing on root**, see DIFF 2 |
| Image height | 320 fixed | `h-80` | ✓ |
| Image placeholder fill | grey placeholder | `bg-chalk` behind the media while loading | ✓ |
| Band padding | spacing/lg 16 (x), spacing/xl 24 (y) | `px-4 py-6` | ✓ |
| Band fill | #d7ef81 | `bg-soft-volt` | ✓ |
| Title colour | forest/900 #212c26 | `text-forest` | ✓ (11.0:1 on Soft Volt, AA) |
| Title type | 24/32, 400, tracking 0 | `text-h3 font-normal tracking-normal` | ✓ |
| Italic phrase | Instrument Serif Italic 24, leading 32 | `font-serif italic`, **plus `leading-none`** | see DIFF 1 |
| Borders / shadows | none | none | ✓ |

## 4. Component variants

- "Benefit card" `10:743` has no variant properties: it is one static card. The only per-instance difference is the title text (with or without an italic run).
- Section shell: "Section" Theme=Default. The code uses `<Section>` with `bg-night text-paper`.

## 5. Responsive behaviour

The Figma Size/Layout/Typography collections have Desktop / Tablet / Mobile modes, already wired in `src/index.css` (`tablet` ≤992, `portrait` ≤480). This section needs no new tokens:

| Range | Layout | Values (from tokens) |
|---|---|---|
| > 992 (Desktop) | 3 columns, gap 12 | h2 36/44, h3 24/32, pad 96, gutter 40 |
| 769–992 (Tablet) | 3 columns, gap 12 (cards ~254 wide, titles wrap to 2 lines) | h2 30/40, h3 24/32, pad 64, gutter 24 |
| ≤ 768 (`landscape:`) | 1 column, `max-w-[28rem]` centred | same as Tablet, until ≤480 |
| ≤ 480 (Mobile) | 1 column, full width (358 at 390) | h2 30/36, h3 20/28, pad 48, gutter 16 |

KEEP (reason: Figma has no Tablet/Mobile frame for this section) the existing `landscape:mx-auto landscape:max-w-[28rem] landscape:grid-cols-1` stacking. Image stays 320 tall at every width, as in Figma's fixed height.

KEEP grid `align-items: stretch`, so cards in a row are equal height. Figma sets cards `self-start`, but at 1440 every title is one line, so it looks the same either way. At Tablet, wrapped titles would otherwise leave cards with ragged bottoms. Equal-height cards only look right when the card root carries Figma's Soft Volt fill (DIFF 2): the extra height then reads as band. The title stays top-aligned in the band.

## 6. Interactive states and behaviour to keep

- Cards are static: no link, no hover, no focus target. Figma defines none. KEEP.
- Card 2 media is an ambient loop through `useAmbientVideo` (muted, inline, loop, plays only while in view; `aria-hidden="true"`, poster = `src`). KEEP. Per the owner decision, add no reduced-motion gate.
- Images are decorative: `alt=""`, `loading="lazy"`, `decoding="async"`. KEEP.
- Semantics: the section title is an `<h2>` and card titles are `<h3>`. KEEP.

## 7. Assets per slot

Each slot holds a grey image placeholder in Figma. Use the real media the code already has, sized to Figma's box (full card width × 320, `object-cover`, `object-position` from `focus`):

| Slot | Asset | focus |
|---|---|---|
| Card 1 "More creative capacity" | `/images/benefits/capacity.webp` | `center` |
| Card 2 "Streamlined workflow" | `/videos/benefit-workflow.webm` + `.mp4`, poster `/images/benefits/workflow-poster.webp` | `center 25%` |
| Card 3 "One simple subscription" | `/images/benefits/subscription.webp` | `center 41%` |

`src/content/sections.ts` `benefitCards` (lines 6–24): the copy, order and `em` values all match Figma. No change.

---

## 8. DIFF — current code → required

1. **`src/components/benefit-card.tsx:40`**: `<em className="font-serif italic">` → `<em className="font-serif italic leading-none">`. The Instrument Serif inline box with an inherited 32px line-height sits on a different baseline from Golos and stretches the line box to 33px. The h3 measures 33 instead of 32, the band 81 instead of 80, and through grid stretch every card is 401 instead of 400 (measured at 1440). With `leading-none` the h3 measures 32 and the cards 400×3 (checked live in the browser).
2. **`src/components/benefit-card.tsx:26`**: `<article className="flex flex-col overflow-hidden rounded-sm">` → `<article className="flex flex-col overflow-hidden rounded-sm bg-soft-volt">`. This is Figma's card root fill (lime/100). At Tablet (834), card 1's title is one line and its neighbours' titles are two, so card 1 is stretched to 432 with a 32px transparent strip under its band, where the night gradient shows through (see `code-834.png`). The root fill makes that strip part of the band.

Not changing (already matches Figma): section padding, column, heading style/copy/italic, 48 gap, 12 column gap, 3-column grid, 8 radius, 320 media height, 16/24 band padding, Soft Volt band, forest 24/32 Golos 400 title, content order.
KEEP (owner decisions / a11y): `bg-night` instead of flat Ink; real media instead of placeholders; no reduced-motion gating; `landscape:` single-column stacking; grid stretch for equal card heights.

Optional, not required: the doc comment at `benefits.tsx:7-11` stays accurate after these changes.
