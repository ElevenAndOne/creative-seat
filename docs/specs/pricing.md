# Pricing — build spec (`#pricing`)

- Figma: file `v6Gj8f4rdhijK9VTa99NSh`, home frame 130:5280 → Section **130:5667** (1440 × 656).
- Components: **Pricing card** set 10:3250 (`Property 1=Standard` 10:3208, `Property 1=Featured` 10:3249); **Included feature** set 131:8170 (`Default` 131:7917, `Variant2` 131:8171); **Button** 8:13431 (`Outline, Fill` 8:13307, `Inverse, Fill` 8:13338).
- Code: `src/sections/pricing.tsx`, data `src/content/sections.ts:126` (`pricingPlans`).
- Evidence: `scratchpad/sections/pricing/figma.png` (Figma 1x), `code-1440.png`, `code-834.png`, `code-390.png` (current code), `assets/check.svg` (Figma check glyph).

Overall: the current code already follows the Pricing card component closely. The remaining gaps are small: the colour of text on the featured card, how card heights align, the check glyph, which heading component the plan names use, and bottom padding.

---

## 1. Structure and layout

```
section#pricing  bg-chalk (theme/surface/sunken #e6e6e6)   pt 96 · pb 64 (section/p-md)
└ Container (1200 frame − 2×40 gutter = 1120 column, left-aligned content)
  ├ Heading.H1                         ← Figma title text 130:5662
  ├ Paragraph (intro)                  ← KEEP (code only)
  └ grid  (Figma 130:5663: grid, gap-x 32 = layout/grid-gutter, rows fit-content, mt 48 = spacing/3xl)
     └ article  "Pricing card" × 3   (justify-self stretch, align-self START)
        ├ div.panel  (inner sunken panel, 131:8562 / 131:8623)
        │  ├ Plan heading   flex row, items-center, gap 8
        │  │  ├ h3 plan name (flex-1)
        │  │  └ Popular badge (featured only)
        │  ├ Price and credits  flex col, gap 4
        │  │  ├ p  [price 36/44 ExtraBold][" / month" 14/20 Regular]
        │  │  └ p  "{n} credits"
        │  └ Button (Fill width, 40px)
        └ div  Included features  flex col, gap 4, px 4
           ├ p report line            ← KEEP (code only)
           └ ul > li × n  (Included feature row)
```

| Box | Figma | Code token |
|---|---|---|
| Section bg | `theme/surface/sunken` #e6e6e6 | `bg-chalk` |
| Section padding top | `layout/section-padding-y` 96 | `pad="bg"` (default, 96/64/48) |
| Section padding bottom | 64 | `padBottom="md"` (64/48/32), see DIFF 1 |
| Container | max 1200, gutter 40 → 1120 column | `Section` default `width="max"` |
| Heading → grid gap | `spacing/3xl` 48 | `mt-12` on grid (intro paragraph sits between: `mt-6`) |
| Grid | 2 cols in Figma, `gap-x 32` | `grid-cols-3 gap-8` (KEEP 3 plans) |
| Card alignment | `self-start` (each card keeps its own height) | `items-start` on grid, see DIFF 2 |
| Card (outer) | p 12, gap 16, radius `radius/lg` 12, overflow clip | `flex flex-col gap-4 rounded-md p-3` ✓ |
| Card bg Standard / Featured | `surface/default` #f9f9f9 / `brand/primary` #bce42d | `bg-paper` / `bg-volt` ✓ |
| Panel | p 12, gap 12, radius 12, full width | `flex flex-col gap-3 rounded-md p-3` ✓ |
| Panel bg Standard / Featured | `surface/sunken` #e6e6e6 / `brand/soft` #d7ef81 | `bg-chalk` / `bg-soft-volt` ✓ |
| Plan heading row | flex, items-center, gap 8 | `flex items-center justify-between gap-3` (gap 12 → `gap-2`, DIFF 5) |
| Price & credits | flex col, gap 4 | `mt-1` on credits ✓ |
| Included features | flex col, gap 4, px 4, no bottom padding | `flex flex-col gap-1`, wrapper `px-1` (drop `pb-1`, DIFF 6) |
| Feature row | flex, gap 8, items-center, full width | `flex gap-2` (KEEP `items-start` + `py-0.5`, see §6) |
| Check circle | 24 × 24, fully rounded, glyph 16 inset 4 | `grid size-6 place-items-center rounded-full` + `size-4` svg ✓ |

No borders and no shadows anywhere in the section, apart from the outline button's 1px stroke.

## 2. Text nodes

| Node | Figma copy | Code copy | Style → token | Colour |
|---|---|---|---|---|
| Section title | "Effortless from *brief to launch.*" (placeholder copied from Process) | **KEEP** "Simple pricing, *no surprises.*", with `<Em>` on "no surprises." (real copy; Figma's is a duplicated placeholder) | Display/Small 48/56, −1 tracking, Instrument Serif → `Heading.H1` (`text-h1`) | `theme/text/primary` #181b1e → `text-ink` (inherited) |
| Intro | — | **KEEP** "One monthly fee for your own specialised creative team — no per-project quotes, retainers or surprise invoices." (real copy) | Body/Medium → `Paragraph` (`text-p-md`), `max-w-[36rem]` | ink |
| Plan name | "Half seat" / "Full seat" | "Half seat" / "Full seat" / "Enterprise" (KEEP all three) | Heading/H3 24/32, Instrument Serif Regular, 0 tracking → `Heading.H3Serif` (`font-serif text-h3 font-normal`) | ink |
| Badge | "Most popular" | same | Caption 12/16 Regular → `text-p-xs` | `neutral-50` #f9f9f9 → `text-paper` on `neutral-950` → `bg-ink` |
| Price | "$2,400" / "$4,300" | `formatPrice(plan.price[currency])`, or "Custom" for Enterprise (KEEP currency logic) | Golos ExtraBold 36/44, −1px tracking → `text-[2.25rem] leading-[2.75rem] font-extrabold tracking-[-0.0278em]` (same metrics as `text-h2` but sans and 800; keep it arbitrary) | ink |
| Per month | " / month" (same text run, after a space) | "/ month" | Body/Small 14/20 Regular → `text-p-sm` | ink |
| Credits | "60 credits" / "120 credits" | `{plan.credits} credits`, invisible placeholder for Enterprise (KEEP) | UI/Label 14/20 SemiBold → `text-ui font-semibold` | ink |
| Button | "Book a demo" | same | UI/Button 14/20 Medium → `pillClass` (`text-ui font-medium`) | see §4 |
| Report line | — | **KEEP** `plan.report` (real data) | `Paragraph.Small font-medium` | ink |
| Feature | "Dedicated designer" × 6 (placeholder) | **KEEP** `plan.features` (8, 9 and 9 real items) | Body/Small 14/20 Regular → `text-p-sm` | `theme/text/primary` → **ink on every card, including the featured one** (DIFF 3) |

Italic phrase: only the `<Em>` span in the section title.

## 3. Colours

| Use | Figma variable | Hex | Token |
|---|---|---|---|
| Section bg, standard panel, standard check circle | theme/surface/sunken | #e6e6e6 | `chalk` |
| Standard card bg, outline button fill | theme/surface/default · neutral-50 | #f9f9f9 | `paper` |
| Featured card | theme/brand/primary | #bce42d | `volt` |
| Featured panel, featured check circle | theme/brand/soft | #d7ef81 | `soft-volt` |
| All text | theme/text/primary · neutral-950 | #181b1e | `ink` |
| Outline button stroke (home instance) | neutral-600 | #5b655f | `muted` (component default is neutral-950; the home override wins) |
| Inverse button fill, badge fill | neutral-950 | #181b1e | `ink` |
| Check glyph stroke | theme/brand/foreground | #212c26 | `forest` |

Contrast: ink on volt is 13.6:1, on soft-volt 15.6:1, on chalk 14.5:1, on paper 16.6:1, all of which pass AA. Forest glyph on chalk or soft-volt is ≥ 10:1. No colour deviations are needed.

## 4. Component variants

- **Pricing card `Standard`** (Half seat, Enterprise): Paper card, Chalk panel, **Button Outline/Fill**, which maps to `<LinkButton variant="outline" full>` (paper fill, 1px `border-muted`, ink label, 40px tall, px 24, fully rounded). ✓
- **Pricing card `Featured`** (Full seat, `plan.featured`): Volt card, Soft Volt panel, **Popular badge**, **Button Inverse/Fill**, which maps to `<LinkButton variant="primary" full>` (ink fill, paper label). ✓
- **Popular badge**: `rounded-full bg-ink px-3 py-1 text-p-xs text-paper`, 24px tall, `whitespace-nowrap`, `shrink-0`. ✓ (The home instance's screenshot doesn't render it, but the node exists in the instance at x 395, 101 × 24, so it is kept.)
- **Included feature `Default`** (standard cards): circle `bg-chalk`. **`Variant2`** (featured): circle `bg-soft-volt`. ✓
- Button sizing: `pillClass` gives 40px (`h-10`) at desktop and 44px (`tablet:h-11`) below 992px, so tap targets are ≥ 40px. ✓

## 5. Assets

| Slot | Asset |
|---|---|
| Check glyph (16 × 16, inside 24px circle) | Inline SVG, Figma 131:7914: `viewBox="0 0 16 16"`, `<path d="M13.3333 4L6 11.3333L2.66667 8" fill="none" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round">`, stroke Forest `#212c26` → `stroke="currentColor"` with `text-forest` on the svg. `aria-hidden`. Copy saved at `scratchpad/sections/pricing/assets/check.svg`. |

There are no images in this section.

## 6. Responsive

There is no Tablet or Mobile frame for this section. Its values come from the Figma variable modes that are already in `index.css`:

- **Desktop (> 992px)**: 3 columns, `gap-8` (32). Section pad 96 / 64.
- **Tablet (≤ 992px)**: `tablet:grid-cols-2 tablet:gap-6` (layout/grid-gutter 24 at Tablet). Enterprise wraps to row 2, left column. Section pad 64 / 48 (`--section-pad`, `--section-pad-md`). Title 36/44. Gutter 24. **KEEP** (existing behaviour).
- **Landscape (≤ 768px)**: `landscape:grid-cols-1`, one full-width column, so the prices aren't squeezed. **KEEP**.
- **Mobile (≤ 480px)**: inherits the single column. Gutter 16, section pad 48 / 32, title 30/36, plan name H3 20/28 (`--text-h3` mode step). Price stays 36/44 (Figma has no mobile step for it). Card padding is unchanged at 12.
- Cards stay top-aligned at every breakpoint (`items-start`), so a short card never grows a blank Volt tail.

Feature rows: Figma uses `items-center` on single-line placeholder rows. The real copy wraps (for example "Priority Creative Intelligence Reports (Platinum Data – real-time insights)"), so **KEEP `items-start` with `py-0.5` on the text**. Single-line rows render the same as centred (20px line in a 24px row), and wrapped rows keep the check beside the first line.

## 7. Interactive states to keep

- `LinkButton` hover, focus and active from `pillClass`: outline hovers to ink fill with paper text, primary hovers to forest. Both have a `focus-visible:outline-2 outline-offset-4` ink ring and `active:scale-[0.98]`.
- Button `id="pricing-{id}-book-demo"`, `href={demoPage}`, `data-track="book_demo_click"`, `data-track-location="pricing_{id}"`. Keep all of these.
- Price hidden (`opacity-0`, `transition-opacity duration-300`) until `useCurrency()` resolves. It keeps its space, and no other region's currency ever shows. Enterprise shows "Custom" immediately. Keep this.
- Enterprise credits line: `invisible` with `aria-hidden`, so the panels line up. Keep this.
- `article id="pricing-{id}"` anchors. Keep these.

## 8. DIFF — current code → required

1. **pricing.tsx:34**: `padBottom="none" innerClassName="pb-16"` → `padBottom="md"` (and drop the `innerClassName`). Desktop stays 64. Tablet becomes 48 and mobile 32, per the section/p-md mode, where the hard-coded 64 currently ignores the modes.
2. **pricing.tsx:43**: grid → add `items-start`. Figma cards are `self-start`, so each card hugs its own content. The current stretch gives Full seat a ~70px empty Volt tail at 1440 (see `code-1440.png`).
3. **pricing.tsx:50**: `featured ? 'bg-volt text-forest' : 'bg-paper text-ink'` → `featured ? 'bg-volt' : 'bg-paper'` with `text-ink` on both. Figma binds every text node (name, price, credits, features) to `theme/text/primary` #181b1e. Forest is only for the check glyph.
4. **pricing.tsx:54**: `<Heading.H3 className="font-serif font-normal">` → `<Heading.H3Serif>`. This is the existing Heading/H3 serif variant for plan titles; the current code overrides the sans-bold H3 instead.
5. **pricing.tsx:53**: Plan heading row `gap-3` → `gap-2` (Figma spacing/sm 8). Keep `items-center justify-between`.
6. **pricing.tsx:83**: `flex flex-col gap-3 px-1 pb-1` → `flex flex-col gap-3 px-1`. Figma's Included features frame has only px 4; the card's own 12px padding is the bottom inset. Keep `gap-3` between the KEEP report line and the list.
7. **pricing.tsx:12-18** (`Check`): path `m3.6 8.3 2.9 2.9 5.9-6.4`, stroke 1.5, currentColor (which inherits forest or ink) → Figma glyph `M13.3333 4L6 11.3333L2.66667 8`, `strokeWidth="1.33333"`, `fill="none"`, round caps and joins, `stroke="currentColor"`, with `className="size-4 text-forest"` so the glyph is Forest on both card types.
8. **pricing.tsx:59**: price row `gap-1.5` (6px) → `gap-1` (4px). Figma separates "$2,400" and "/ month" with one space in the same text run (≈ 4px at 14px Golos). Keep `items-baseline`.

### KEEP (deliberate, from code)

- Three plans including Enterprise ("Custom" price, no credit line, outline button) instead of Figma's two (real offering).
- Title "Simple pricing, *no surprises.*" instead of the placeholder "Effortless from brief to launch." (owner rule: real copy over duplicated placeholder).
- Intro paragraph (pricing.tsx:38-40) and per-plan report line (pricing.tsx:84). These are real copy not drawn in Figma.
- Real feature lists from `pricingPlans` instead of "Dedicated designer" × 6.
- Currency logic (`useCurrency`, `formatPrice`, hidden until resolved).
- `items-start` feature rows with a `py-0.5` text inset (wrapping copy).
- Tablet 2+1 and ≤ 768px single-column grid.

Required changes: **8**.
