# Spec: FAQ (`faq`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`. The section is instance **`130:5732`** (Section component `10:1334`, Theme=Default) at y 7543, 1440 × 533.
It instances the **FAQ row** component `8:13370` five times (layer name "FAQ row — collapsed"). The component lives on the Playground page (`1:19`, at x 9185 y 9537, 808 × 68), not on Components. Its description: *"Reusable collapsed FAQ row. Question is editable; dimensions inherit responsive modes."*
**There is no expanded/open variant anywhere in the file.** I searched Components `8:13265` and Playground `1:19` for "FAQ", "expand", "answer" and "minus". The only FAQ rows are collapsed instances, so the open state keeps the code's design (see §6).
No Tablet/Mobile frames exist for this section, so responsive values come from the Figma variable modes (foundations §1).

Code: `src/sections/faq.tsx` (`<Section id="resources">`), `src/components/accordion.tsx`, `public/images/icons/plus.svg` (used only by the accordion), and `faqItems` in `src/content/sections.ts:53-74`.
Evidence: everything is in `/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad/sections/faq/`:
- `figma.png` (1x, 1440 × 533) and `plus.svg` (the Figma icon export).
- `code-1440.png`, `code-834.png`, `code-390.png` and `code-1440-open.png`: the live render on :3001.

Shared tokens: `docs/specs/foundations.md`.

---

## 1. Structure

```
Section 130:5732 (Theme=Default, bg theme/background/page #f9f9f9)          → <Section id="resources">  (pad default "bg"; body bg-paper)
└─ Container slot: max-w 1200 incl. gutters 40 → 1120 column, py 96          → inner <Container width="max">
   └─ "Questions and answers" 130:5722: grid, 3 × minmax(0,1fr), gap-x 32 / gap-y 32, 1 row fit-content, w-full
      ├─ "FAQ heading" 130:5723 (col 1, self-start): flex-col, items-start, w 360 (overflows the 352 column; no visual effect)
      │  └─ Heading 130:5724 "FAQ": Display/Large                                 → <Heading.Display>FAQ</Heading.Display> (h2)
      └─ "Frequently asked questions" 130:5725 (col-span 2, self-start, justify-self stretch): flex-col, items-start, x 384, w 736
         ├─ FAQ row × 5 (130:5726–130:5730): each 736 × 68, w-full              → <Accordion> items
         └─ Divider 130:5731: 736 × 1, fill theme/border-subtle #e6e6e6        → Accordion root `border-b border-line`
```

FAQ row (`8:13370`): a horizontal flex with `items-center`, gap spacing/xl 24, padding-y spacing/xl 24, padding-x 0, a top stroke of 1px theme/border-subtle (inside, so it adds no height) and overflow clip.
- Question text 8:12296: `flex: 1 0 0`, min-w 1px, UI/FAQ Question.
- `plus` icon 8:13158: 20 × 20, shrink-0.

Desktop geometry at 1440:
- Heading box x 160–520, y = section top + 96.
- List x 544–1280. Row k top = 96 + 68·(k−1). Closing divider at y 436. Section height 96 + 341 + 96 = **533**.
- Text inside a row: question at row-top + 24, icon at x 1260–1280, row-top + 24.

The code tree stays as it is (`faq.tsx:11-15`): a `grid grid-cols-3 items-start gap-8`, then `Heading.Display`, then a `col-span-2` wrapper around `<Accordion>`. ✓

## 2. Text nodes (verbatim)

| Node | Copy | Figma style | Code |
|---|---|---|---|
| 130:5724 | "FAQ" (no italic) | Display/Large: Instrument Serif 400, 60/64, tracking −1px (Tablet 48/56, Mobile 36/40) | `<Heading.Display>` → `font-serif text-display font-normal`, renders `<h2>` ✓ (measured 60/64 −1px, 48/56 at 834, 36/40 at 390) |
| Row 1 | "How does Creative Seat work day-to-day?" | UI/FAQ Question: Golos Text 700, 14/20, tracking 0 | `text-ui font-bold` ✓ |
| Row 2 | "Who will I be working with?" | same | ✓ |
| Row 3 | "How quickly can projects be delivered?" | same | ✓ |
| Row 4 | "Can Creative Seat work with our existing marketing team?" | same | ✓ |
| Row 5 | "How is Creative Seat different from hiring or a traditional agency?" | same | ✓ |
| Answers | not in Figma | — | KEEP (real site copy in `faqItems[].answer`) as `<p className="… text-p-sm text-muted">` |

Colour of every text: theme/text/primary #181b1e → `text-ink` (inherited). The questions in `src/content/sections.ts:55,59,63,67,71` match Figma character for character, so **no copy changes**.

## 3. Sizes, spacing, colour → tokens

| Property | Figma (variable) | D / T / M | Code token | Status |
|---|---|---|---|---|
| Section bg | theme/background/page | #f9f9f9 | body `bg-paper` | ✓ |
| Section padding-y | layout/section-padding-y (p-bg) | 96 / 64 / 48 | `<Section>` default `pad="bg"` | **✗ code uses `pad="md"` (64/48/32), DIFF 1** |
| Page gutter | layout/page-gutter | 40 / 24 / 16 | `<Container>` | ✓ |
| Grid | 3 cols, gap 32 (layout/grid-gutter) | 352+32+736 | `grid-cols-3 gap-8` | ✓ |
| Heading → list gap when stacked (no Figma frame) | spacing/3xl | 48 / 40 / 32 | `tablet:gap-xlg` | ✗ code `tablet:gap-12` (fixed 48), DIFF 2 |
| Row padding-y | size/spacing-xl | 24 / 24 / 20 | `pb-xbg` + `pt-[calc(var(--spacing-xbg)-1px)]` (the item's 1px `border-t` makes up the 24, so the row is 68 including the border, like Figma's inside stroke) | ✗ code `py-6` (rows 69, list 346 vs 341; fixed 24 on mobile), DIFF 3 |
| Question ↔ icon gap | size/spacing-xl | 24 / 24 / 20 | `gap-xbg` | ✗ code `gap-6`, DIFF 3 |
| Row border | theme/border-subtle 1px (size/border-default) | #e6e6e6 | `border-t border-line` on the item | ✓ |
| Closing divider | theme/border-subtle, 1px rect | #e6e6e6 | `border-b border-line` on the root | ✓ |
| Icon box | 20 × 20 | — | `size-5` | ✓ |
| Icon glyph | `plus` vector: stroke 1.5, round caps, #181B1E, arms from 4.166 to 15.834 (11.67 long) | — | `public/images/icons/plus.svg` | ✗ code glyph is stroke 1.8, #14121A, arms 3→17 (14 long, so it reads heavier). DIFF 4 |
| Radii / shadows | none | — | none | ✓ |

## 4. Responsive

There are no Figma Tablet/Mobile frames. The variable modes apply (foundations §1):

| Width | Layout |
|---|---|
| > 992 (Desktop) | 3-col grid, heading col 1 and list cols 2–3, section pad 96 |
| ≤ 992 (`tablet:`) | 1 column (`tablet:grid-cols-1`, list `tablet:col-span-1`, ✓ existing). Heading above the list, gap `xlg` (40 at Tablet). Display 48/56. Pad 64. Gutter 24 |
| ≤ 480 (`portrait:`) | same stack, gap `xlg` (32). Display 36/40. Pad 48. Gutter 16. Row padding 20 (via `xbg`). Long questions wrap. The `flex-1` question text and `shrink-0` icon already handle this (rows measured 88 tall when they wrap) ✓ |

## 5. Assets per slot

| Slot | Figma | Code |
|---|---|---|
| Row toggle icon | `plus` 20 × 20 vector (`scratchpad/sections/faq/plus.svg`) | `/images/icons/plus.svg`. Replace its path with the Figma glyph (DIFF 4). Keep it an `<img alt="" aria-hidden>`. Its stroke stays `#181B1E`, which equals `ink` |

There are no image placeholders in this section.

## 6. Interactive states (KEEP all, they are not in Figma)

- **KEEP** base-ui `Accordion` semantics. Each trigger is a `<button>` inside an `<h3>` header, with `aria-expanded` and `aria-controls`, and the panel has a region role. All items start closed (Figma shows all collapsed ✓). More than one item can be open at once.
- **KEEP** keyboard support (`accordion.tsx:41-49`). ArrowDown/ArrowUp move with wrap-around, Home and End jump to the first and last trigger, and Enter/Space toggle (native button).
- **KEEP** focus: `focus-visible:outline-2 outline-offset-4 outline-ink` (foundations: keep the code's ring).
- **KEEP** the open state:
  - The trigger's bottom padding tightens to `pb-2` (`data-[panel-open]:pb-2`).
  - The panel animates height and opacity over 300ms with `cubic-bezier(0.16,1,0.3,1)`, `keepMounted`.
  - The "+" rotates 45° into a "×" over 250ms, `ease-out`.
  - No reduced-motion gating (owner decision).
- **KEEP** the answer typography: `text-p-sm text-muted` (#5b655f on Paper is 5.2:1, which passes AA), `max-w-[40rem]`, `pr-11`. Change only its bottom padding: `pb-6` → `pb-xbg`, to follow the row's responsive spacing (part of DIFF 3).
- **KEEP** analytics and ids: `idPrefix="faq-question"` (gives `#faq-question-1…5`) and `onOpen → track('faq_open', { question })`.
- **KEEP** `id="resources"` on the section (the nav anchor).
- Tap target: the trigger is the full row, 67–68px tall and 736 wide, so ≥ 40 ✓.

## 7. DIFF: current code → required

1. **`src/sections/faq.tsx:10`**: `<Section id="resources" pad="md">` → `<Section id="resources">`. The default `pad="bg"` gives 96/64/48, which is Figma p-bg (foundations D16/row 12). Measured now: 64px at 1440, so the section is 474 tall instead of 533.
2. **`src/sections/faq.tsx:11`**: `tablet:gap-12` → `tablet:gap-xlg`. Keep `gap-8`, `grid-cols-3`, `items-start` and `tablet:grid-cols-1`. This gives the stacked heading→list gap of 48 / 40 / 32 (spacing/3xl), not a fixed 48.
3. **`src/components/accordion.tsx:57`** (trigger class) and **`:67`** (answer `<p>`):
   - In the trigger, replace `gap-6 py-6` with `gap-xbg pt-[calc(var(--spacing-xbg)-1px)] pb-xbg`. Keep `data-[panel-open]:pb-2` and the `transition-[padding]`.
   - In the answer, `pb-6` → `pb-xbg`.
   - Result: each closed row is exactly 68 including its 1px top border (Figma's stroke is inside), the list is 341 at 1440, and rows use 20px padding on mobile.
4. **`public/images/icons/plus.svg`**: replace the path with Figma's `plus` glyph:
   ```svg
   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.166 10H15.834M10 4.166V15.834" stroke="#181B1E" stroke-width="1.5" stroke-linecap="round"/></svg>
   ```
   The file is used only by `accordion.tsx:59`. The 45° rotation still forms a symmetric "×".

There is nothing to change in `src/content/sections.ts`: the copy matches.

## 8. Verification targets (1440 × 900, `#resources`)

- Section height **533**. The `h2` "FAQ" sits at (160, +96), 60/64.
- List x 544, width 736. Items (border included) start at +96, +164, +232, +300 and +368 (pitch 68), and the closing border is at +436.
- The icon at x 1260, 20 × 20, with 1.5px strokes.
- At 834: pad 64, heading 48/56, gap 40 to the list. At 390: pad 48, heading 36/40, gap 32, rows with 20px vertical padding.
- Open row 1: `aria-expanded="true"`, the answer is visible in muted 14/20, and the icon is rotated 45°. Arrow, Home and End keys still move focus between triggers.
