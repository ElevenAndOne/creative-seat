# Spec: Expertise marquee (`expertise`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, section instance **`130:5650`** ("Section", Theme=Dark, 1440×544, y 4681). It instances **List Item** (`10:2135`, Components page) ×18 and **seat/01 … seat/18** (80×80 crops of a single chair sprite sheet) ×18.
Evidence: `/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad/sections/expertise/`. It holds `figma.png` (1x, 1440×544), `code-1440.png`, `code-834.png`, `code-390.png`, `asset/seat-sheet.png` (Figma's sprite, 1254×1254, the same image as `public/images/expertise/chairs.webp`) and `seat-check.png` (seat/13, seat/07 and seat/03 cropped from the sprite with Figma's values).

Code files in scope: `src/sections/expertise.tsx` (the only one this section uses).
`src/components/marquee/*` (`ScrollMarquee`, `MarqueeColumn`, `ExpandCursor`, `Lightbox`, `tiles.ts`) is the **portfolio** marquee. Expertise does **not** import it. **KEEP it untouched** (out of scope).

Figma has no Tablet or Mobile frame for this section. Responsive values come from the variable modes (Desktop / Tablet ≤ 992px / Mobile ≤ 480px), which `src/index.css` already implements (`docs/specs/foundations.md` §1).

---

## 1. Structure

```
<Section id="services" bleed className="overflow-hidden bg-ink text-paper">  Figma Section 130:5650 (Theme Dark → background/page #181b1e = ink)
  pad: Section default `bg` = --section-pad 96 / 64 / 48 (Figma layout/section-padding-y 96)
  <div ref=root>                                              Figma Container (max-w 1200, gutter 40) · flex-col · items-center
    <Heading.H1 data-reveal className="px-[var(--container-margin)] text-center">
      "Expertise, on demand."                                 Figma text I130:5650;10:131;130:5609 (centred, single line)
    <ul className="sr-only"> service labels </ul>             KEEP (a11y: the rows are aria-hidden decoration)
    <div data-reveal aria-hidden className="mt-xlg flex flex-col gap-xxsm">   Figma "Frame 2807": pt spacing/3xl 48, gap spacing/xs 4
      ×3 <div className="flex h-20 items-center">             Figma "marquee" rows, 80 tall, full-bleed (overflow clipped by the section)
        <div data-track className="flex w-max shrink-0 will-change-transform" style={{transform: SSR offset}}>
          ×2 copies <div className="flex shrink-0 items-center">
            items: pill · chair · pill · chair … (12 per copy, strictly alternating)
```

Layout: auto-layout flex rows, `items-center`, item spacing spacing/lg **16** (`mr-md` on every item, see §3. KEEP a margin, not `gap`, so the loop period also includes the seam gap). The rows run edge to edge across the viewport, wider than the 1120 column.

Vertical rhythm per mode (all rows are fixed px, so the height is the same on the server, after hydration, while playing and while paused):

| | Desktop | Tablet (≤992) | Mobile (≤480) |
|---|---|---|---|
| section pad top / bottom (`--section-pad`) | 96 | 64 | 48 |
| heading (`text-h1`) | 48/56 | 36/44 | 30/36 |
| heading → rows (`mt-xlg`, spacing/3xl) | 48 | 40 | 32 |
| 3 rows × 80 + 2 × 4 gap | 248 | 248 | 248 |
| **section height** | **544** (= Figma) | **460** | **412** |

## 2. Text nodes

| Node | Copy (verbatim) | Italic | Figma style | Code |
|---|---|---|---|---|
| Heading | `Expertise, on demand.` | none (Figma `not-italic`, no `<Em>`) | Display/Small 48/56, tracking −1, Instrument Serif 400, fill #f9f9f9 | `Heading.H1` (`font-serif text-h1`), colour inherited `text-paper`. ✓ |
| Pill label ×18 (List Item `10:2134`) | see §4 | no | Body/Medium 16/24, Golos 400, tracking 0, `color/on-surface` #14121a | `text-p-md` (16/24, same in all modes) + `text-ink` (foundations maps on-surface → ink) |

## 3. Sizes, spacing, colour → tokens

| Element | Figma | Code token |
|---|---|---|
| Section background | background/page Dark #181b1e | `bg-ink` ✓ (not a night gradient: owner keeps those only on hero, performance and benefits) |
| Heading colour | #f9f9f9 | `text-paper` ✓ |
| Rows wrapper top padding | spacing/3xl 48/40/32 | `mt-xlg` |
| Row gap | spacing/xs 4 | `gap-xxsm` |
| Row height | 80 (chair height) | `h-20` |
| Item spacing | spacing/lg 16 | `mr-md` on each pill and chair slot |
| Pill (List Item) | fill #d7ef81, padding x spacing/xl 24 (Mobile 20), y spacing/sm 8, radius full, hug, height 40 | `rounded-full bg-soft-volt px-xbg py-xsm text-p-md text-ink whitespace-nowrap shrink-0` (gives 40 tall: 24 line + 2×8) |
| Pill contrast | ink on soft-volt | 13.6:1, passes AA ✓ |
| Chair slot | 80×80, `overflow-clip`, inner crop box by per-seat inset, sprite `absolute` with %-size/offset | `size-20 shrink-0 flex items-center justify-center`, inner box fitted by the crop's proportions (see §5) |
| Borders, shadows | none | none |

Desktop already measures exactly as Figma (section 544, heading 96→152, rows at 200/284/368, pill 40 tall with 8/24 padding, chairs 80). The drift is on Tablet and Mobile. The code scales every row measure fluidly in em (`clamp(13px…16px)`), so pills shrink to 37px/33px and chairs to 74px/66px. Figma's modes keep Body/Medium at 16/24, chairs at 80 and pill height at 40 in every mode. Only pill side padding (24→20 on Mobile) and the heading gap (48/40/32) step.

## 4. Rows: items in Figma order (one loop copy each)

The chair crop is `[inset T R B L %] sheet W×H % at left/top %`, verbatim from Figma (all seats crop the same sprite `/images/expertise/chairs.webp`).

**Row 1** (`130:5611`, drifts left): Brand development · seat/18 · Ad creative · seat/17 · Social assets · seat/16 · Video production · seat/15 · Photography · seat/14 · Apps + software · **seat/13**

**Row 2** (`130:5624`, drifts right): Email design · seat/12 · Copywriting · seat/11 · Motion graphics · seat/10 · Presentations · seat/09 · Web + UI design · seat/08 · Illustration · **seat/07**

**Row 3** (`130:5637`, drifts left): **Video production · seat/06 · Apps + software · seat/05 · Brand development · seat/04 · Email design · seat/03 · Copywriting · seat/02 · Social assets · seat/01** (pill first, each chair *after* its pill)

| Seat | Figma inset (T R B L) | sheet W / H | left / top | code `chair(w, h, sheetW, sheetH, left, top)` |
|---|---|---|---|---|
| 18 | 1 7 0 7 | 523.26 / 454.55 | −8.14 / −323.23 | ✓ current |
| 17 | 0 8 0 8 | 535.71 / 445.54 | −111.9 / −114.85 | ✓ |
| 16 | 1 0 1 0 | 494.51 / 505.62 | −102.33 / −251.7 | ✓ |
| 15 | 1 5 0 5 | 511.36 / 459.18 | −5.68 / −120.41 | ✓ |
| 14 | 1 6 0 6 | 500 / 441.18 | −300 / −12.75 | ✓ |
| **13** | **−1 0 −1 0** | **454.55 / 445.54** | **−175.76 / −11.88** | **`chair(80, 81.6, 454.55, 445.54, -175.76, -11.88)`** (yellow shaggy armchair. Code reuses seat/03 here) |
| 12 | 0 0 0 0 | 489.13 / 489.13 | −389.13 / −21.74 | ✓ |
| 11 | 1 8 0 8 | 523.26 / 441.18 | −8.14 / −213.73 | ✓ |
| 10 | 0 8 0 8 | 548.78 / 454.55 | −114.63 / −11.11 | ✓ |
| 09 | 0 9 0 9 | 511.36 / 424.53 | 0 / −9.43 | ✓ |
| 08 | 0 0 0 0 | 454.55 / 454.55 | −175.76 / −121.21 | ✓ |
| **07** | **1 13 0 13** | **576.92 / 432.69** | **−358.97 / −306.73** | **`chair(59.2, 79.2, 576.92, 432.69, -358.97, -306.73)`** (pink folding chair. Code reuses seat/04 here) |
| 06 | 0 5 0 5 | 500 / 454.55 | −300 / −121.21 | ✓ |
| 05 | 0 4 0 4 | 489.13 / 454.55 | −389.13 / −220.2 | ✓ |
| 04 | 1 5 0 5 | 500 / 450 | −300 / −219 | ✓ |
| 03 | 1 4 0 4 | 468.75 / 436.89 | −191.67 / −308.74 | ✓ |
| 02 | 1 7 0 7 | 489.13 / 424.53 | −389.13 / −105.66 | ✓ |
| 01 | −1 0 −1 0 | 489.13 / 478.72 | −386.96 / −342.55 | ✓ |

(w/h for the two new seats = 80 × (1 − L − R) and 80 × (1 − T − B), the crop box in Figma px, matching how the existing entries are expressed.)

Copy: KEEP real site copy. The Figma labels match the code's labels one for one. Row 3 repeats services from rows 1–2 in both Figma and code, so it is not placeholder duplication to fix.

## 5. Assets per slot

- All 18 chair slots: `/images/expertise/chairs.webp` (1254² sprite). This is verified to be the same image as Figma's seat fill (`asset/seat-sheet.png`), so no new asset is needed.
- KEEP the code's "fit the crop box inside the 80×80 slot, centred" renderer (`Cell`, expertise.tsx:184-199). It differs from Figma's top-anchored inset by ≤ 0.8px vertically, and by 2% scale on the two seats with −1% insets (Figma clips 0.8px top and bottom there). That is visually identical, and simpler data.
- `alt=""`, `loading="lazy"`, `decoding="async"`, `draggable={false}`: KEEP.

## 6. Motion and interaction (KEEP all, owner decisions)

- GSAP endless loop per row over two copies, directions `DRIFT = [-1, 1, -1]` (Figma has no motion. Code rows 1 and 3 drift left, row 2 right), `LOOP_S = [60, 60, 72]`. KEEP.
- Pointer over a row eases it to 0.2× speed (0.6s), and leaving restores it. Page scroll velocity boosts every row (≤ 6×) and settles over 1.2s. The loops pause off screen. KEEP.
- `[data-reveal]` entrance (autoAlpha 0, y 40 → 0, stagger 0.12) only uses opacity and transform, so the layout is unaffected. KEEP.
- No reduced-motion gating (owner). The site's own pause toggle (`useAnimationsPaused`) stops the loops, and a paused row stands at its start offset. KEEP.
- **Height invariance:** every row measure is fixed (`h-20`, `size-20`, `text-p-md`, `py-xsm`). Server, hydrated, playing and paused renders are identical in height (544 / 460 / 412). Today this holds at 1440 (measured 544 playing and 544 paused), and must still hold after the changes.
- **New start composition (D4/D5):** each row's resting position (SSR, paused, and the loop's first frame) matches Figma at any width. The left edge of the first item of copy 0 sits at `START_PX = [32, -68, -247.5]` px from the row's left edge. These are Figma's positions at 1440: container 120 + gutter 40 + row x (−391 + 263 padding, −228, −407.5). Applying them from the viewport's left edge at every width keeps phones showing a pill at the left edge.

## 7. Responsive

Desktop = Figma. Tablet and Mobile only change through tokens: section pad and heading size come from `Section`/`text-h1`, the rows' top gap from `mt-xlg`, and pill side padding from `px-xbg` (24 → 20 on Mobile). Rows, chairs, label type and pill height stay the same in every mode. No stacking: the rows stay full-bleed horizontal marquees, clipped by `overflow-hidden`.

## 8. DIFF list (current code → required)

1. **`src/sections/expertise.tsx:36`** Row 1's last chair is a duplicate of seat/03 → use Figma seat/13: `chair(80, 81.6, 454.55, 445.54, -175.76, -11.88)`.
2. **`src/sections/expertise.tsx:44`** Row 2's last chair is a duplicate of seat/04 → use Figma seat/07: `chair(59.2, 79.2, 576.92, 432.69, -358.97, -306.73)`.
3. **`src/sections/expertise.tsx:47-52`** Row 3 is chair-first, so each chair pairs with the *next* pill (e.g. the flower chair follows "Brand development") → reorder pill-first exactly as in Figma, keeping the six chair values: `'Video production', chair(75.205, 82.726, 500, 454.55, -300, -121.21), 'Apps + software', chair(76.877, 82.726, 489.13, 454.55, -389.13, -220.2), 'Brand development', chair(75.205, 83.562, 500, 450, -300, -219), 'Email design', chair(80.219, 86.068, 468.75, 436.89, -191.67, -308.74), 'Copywriting', chair(76.877, 88.575, 489.13, 424.53, -389.13, -105.66), 'Social assets', chair(76.877, 78.548, 489.13, 478.72, -386.96, -342.55)`.
4. **`src/sections/expertise.tsx:56-64`** `START = [0.12, 0.45, 0.3]` (a fraction of the loop) and `startPercent()` → replace them with `const START_PX = [32, -68, -247.5]` (Figma's resting x of each row's first item, §6), plus an SSR transform that needs no measuring: `const startTransform = (r: number) => START_PX[r] > 0 ? \`translateX(calc(${START_PX[r]}px - 50%))\` : \`translateX(${START_PX[r]}px)\``. A positive offset is shifted back by one copy (50% of the two-copy track), so copy 1 fills the left edge. Update line 160 to `style={{ transform: startTransform(r) }}`.
5. **`src/sections/expertise.tsx:95-97`** `tween.progress(START[i])` → derive the progress from the same px offset, so the first animated frame equals the SSR frame: `const copy = track.offsetWidth / 2; const s = START_PX[i] > 0 ? START_PX[i] - copy : START_PX[i]; tween.progress(DRIFT[i] < 0 ? -s / copy : (s + copy) / copy)`. Keep `x: 0` in the `fromTo` from-vars, because GSAP must drop the SSR px/calc transform, and `xPercent` alone then reproduces it via progress.
6. **`src/sections/expertise.tsx:151`** `mt-12 flex flex-col gap-[0.25em] text-[clamp(0.8125rem,0.7411rem+0.3571vw,1rem)] leading-[1.5em]` → `mt-xlg flex flex-col gap-xxsm` (Figma 3xl 48/40/32 and xs 4. No fluid type scaling). Delete the em comment at 153-154.
7. **`src/sections/expertise.tsx:156`** row `h-[5em]` → `h-20` (80px in every mode).
8. **`src/sections/expertise.tsx:179`** pill `mr-[1em] … px-[1.5em] py-[0.5em] text-ink` → `mr-md shrink-0 whitespace-nowrap rounded-full bg-soft-volt px-xbg py-xsm text-p-md text-ink` (16/24 Body/Medium, 40 tall, 24/24/20 sides).
9. **`src/sections/expertise.tsx:187`** chair slot `mr-[1em] … size-[5em]` → `mr-md flex size-20 shrink-0 items-center justify-center` (80×80 in every mode). Update the doc comment at 13-17 ("fitted into an 80×80 slot") and 24-28 so they say rows mirror Figma's order pill-first, with seat/18…seat/01.

Expected after the change: section heights of 544 (1440), 460 (834) and 412 (390), the same SSR / hydrated / paused / playing. At 1440 paused, the composition matches `figma.png` (row 1 "Brand development" at x 32, row 2 "Email design" partly off left at −68, row 3 "Video production" at −247.5).

## 9. KEEP (deliberate)

- `src/components/marquee/*`: not this section (portfolio). Untouched.
- `bg-ink` solid (Figma Dark page background). No night gradient here.
- The `sr-only` service list and `aria-hidden` rows (a11y).
- Item spacing as `mr-md` per item rather than flex `gap`, so the two-copy loop seam keeps the 16px gap.
- The crop-box-fit chair renderer (≤ 1px from Figma, §5).
- Hover slow-down, scroll boost, off-screen pause, reveal entrance, no reduced-motion gate.
- Heading side padding `px-[var(--container-margin)]` (stops the single-line title from touching the edges on phones).
