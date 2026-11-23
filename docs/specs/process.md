# Spec — Process (`process`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, section instance **`130:5601`** (1440 × 698, y = 3383). Component **"Process card"** (Components page `8:13265`): variant `State=Expanded` `10:853`, `State=Collapsed` `10:854`.
Code: `src/sections/process.tsx` (content in `src/content/sections.ts:26-51`, `processSteps`).
Evidence in `/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad/sections/process/`: `figma.png` (1x, 1440 × 698), `code-1440.png`, `code-1024.png`, `code-834.png`, `code-390.png` (current code, step 1 open).

Tokens below follow `docs/specs/foundations.md` (already in `src/index.css`): `p-xxxbg` = spacing/2xl 32/28/24, `p-xbg`/`left-xbg` = spacing/xl 24/24/20, `mt-xlg` = spacing/3xl 48/40/32, `gap-sm` = spacing/md 12. Desktop = base, Tablet = `tablet:` (≤ 992), Mobile = `portrait:` (≤ 480).

---

## 1. Structure (Figma → code)

```
<Section id="process" className="bg-paper">            Section/Default: bg background/page #f9f9f9, py section/p-bg 96, container 1200, gutter 40 → 1120 column
  <Heading.H1>Effortless from <Em>brief to launch.</Em></Heading.H1>     text node 130:5595
  <ol> "Frame 2" 130:5596 — flex row, gap spacing/md 12, items stretch, pt spacing/3xl 48, height 402
    <li> Process card State=Expanded (flex 1, 664 wide at 1440)
      card: flex col, gap spacing/3xl 48, p spacing/2xl 32, radius/lg 12, overflow clip, fill background/subtle #e6e6e6 + image fill (placeholder)
        "Step illustration" 10:847: flex row, justify-between, items-start, min-h 150, w full → [number "01"] … [art]
        "Step details" 10:850: flex col, gap spacing/md 12, max-w 340, w full → [title] [body]
    <li> ×3 Process card State=Collapsed (flex 1, max-w 140 → 140 wide at 1440, h 402)
      card: p spacing/xl 24, radius/lg 12, overflow clip, fill #e6e6e6 + image fill (placeholder)
        number "02" / "03" / "04" (top-left)
```

At 1440: heading at x 160, y +96 (56 tall); row at y +200; expanded card 0→664, collapsed cards at 676 / 828 / 980, each 140 wide; all 402 tall; section ends 96 below the row (698 total). Desktop maths: 32 + 150 + 48 + details + 32 = 402.

Code keeps its own mechanism (one `<ol>` of four `<li>` columns whose `flex-grow` animates, with the open column's copy laid out at its final width). Only the measurements change (§6).

## 2. Text nodes

| Node | Copy | Style (Figma) | Code |
|---|---|---|---|
| Heading 130:5595 | "Effortless from " + *"brief to launch."* (italic phrase = "brief to launch.") | Display/Small 48/56, Instrument Serif, −1 tracking, text/primary #181b1e | `Heading.H1` + `<Em>` ✓ (`process.tsx:54-56`) |
| Expanded number 10:848 | "01" (step index, zero-padded) | Display/Large 60/64 serif, forest/900 #212c26 | `font-serif text-display font-normal`, colour inherited `text-forest` ✓ (`:83`) |
| Expanded title 10:851 | Figma "Submit your brief." | Heading/H3/Sans Bold 24/32, Golos 700, forest #212c26 | `Heading.H3` with `{title} {subtitle}.` ✓ — copy comes from `processSteps` (Submit your brief / Activate your team / Review and refine / Approve + keep moving). KEEP (real site copy; step 1 matches Figma verbatim) |
| Expanded body 10:852 | Figma: "Tell us your priorities, timelines and requirements via the Creative Seat request system, freeing up your team to focus on the bigger picture without added pressure." | Body/Medium 16/24, text/primary #181b1e | `Paragraph` + `text-ink` ✓ — copy from `processSteps[i].body` (step 1 identical to Figma) |
| Collapsed number 10:845 | "02" / "03" / "04" | Heading/H1 36/44 serif, −1 tracking, text/primary #181b1e | `font-serif text-h2 font-normal` (code `text-h2` = Figma Heading/H1 36/44), colour `text-ink` ✓ (`:106`) |

## 3. Sizes, spacing, colour

| Property | Figma | Code token | Current | Status |
|---|---|---|---|---|
| Section bg | background/page #f9f9f9 | `bg-paper` | `bg-paper` | ✓ |
| Section padding | 96 / 64 / 48 | `<Section>` default `pad="bg"` | same | ✓ |
| Heading → row | pt spacing/3xl 48 / 40 / 32 | `mt-xlg` | `mt-12` (48 fixed) | DIFF 1 |
| Row height | 402 (card h) | `h-[25.125rem]` | `h-[clamp(24rem,calc(100svh-22rem),25.125rem)]` | DIFF 2 |
| Row gap | spacing/md 12 | `gap-3` (= `gap-sm`) | `gap-3` | ✓ |
| Collapsed width | 140 (max-w 140, flex 1) | `basis-[140px]` | `basis-[132px]` | DIFF 3 |
| Expanded width | row − 3×140 − 3×12 = row − 456 (664 at 1440) | `w-[calc(100cqw-456px)]` for the copy layer | `calc(100cqw-432px)` | DIFF 4 |
| Card radius | radius/lg 12 | `rounded-md` | `rounded-md` | ✓ |
| Card fill | background/subtle #e6e6e6 | `bg-chalk` | `bg-chalk` | ✓ |
| Card border / shadow | none / none | — | none | ✓ |
| Expanded padding | spacing/2xl 32 / 28 / 24 | `p-xxxbg` | `p-8 tablet:p-7 landscape:p-6` | DIFF 5 |
| Illustration row | min-h 150, justify-between, items-start | `min-h-[150px] justify-between items-start` | same (+ `gap-6`) | ✓ |
| Row → details gap | spacing/3xl 48 (fills to 402 exactly at desktop) | `mt-auto` + `pt-6` floor | `mt-auto pt-6` | KEEP (with the row at 402, `mt-auto` reproduces Figma's 48 when details are 4 lines; `pt-6` is the floor that keeps step 2's 5-line body inside the padding — see §7) |
| Details | flex col, gap spacing/md 12, max-w 340 | wrapper `flex flex-col gap-sm max-w-[21.25rem]` | title and body loose; `mt-3` on body; body `max-w-[400px]` | DIFF 7 |
| Collapsed padding | spacing/xl 24 / 24 / 20 | number at `left-xbg top-xbg` | `left-6 top-6 tablet:left-5` | DIFF 8 |
| Title colour | forest #212c26 | `text-forest` (open `li`) | ✓ | ✓ |
| Body colour | text/primary #181b1e | `text-ink` | ✓ | ✓ |

Contrast: forest on chalk 11.5:1, ink on chalk 13.9:1 — both pass AA.

## 4. Component variants

- **Process card / Expanded** → the open `<li>` (`isOpen`): number Display, art, H3 title, body.
- **Process card / Collapsed** → the three other `<li>`s: number (36/44) top-left at the 24 inset, image fill behind.
- The variant swap is the existing accordion: `flex-grow` 0 → 1 on `MOVE` (800 ms, cubic-bezier(0.65,0,0.35,1)), staggered `rise()` for the open parts, closed number fading. KEEP all of it.

## 5. Assets per slot

Figma has a grey **image-fill placeholder** covering every card (expanded and collapsed; `imgStateCollapsed` 0b3b6.png, `absolute inset-0 object-cover`), which renders as a centred picture icon. Code already has real media for this slot: the four ink sketches `/images/process/{submit,team,review,approve}.webp` (transparent RGBA, 720 wide, near-black strokes, shown with `.cs-blend-darker`).

- **Expanded:** KEEP the sketch in the "Step illustration" row, top-right, opposite the number (`process.tsx:86-93`). Reason: Figma's own frame 10:847 is named "Step illustration" and is a `justify-between` row built to hold the number and a picture; a full-bleed `object-cover` of a bold line drawing would crop it and run under the title and body (fails legibility). Size stays `w-[min(38%,9.375rem)]` aspect-square (150 = the row's min-h). Remove its `-mr-1 -mt-1` so the 32 inset is exact (DIFF 6).
- **Collapsed:** Figma shows the placeholder in the closed columns too, centred in the 140 × 402 box. Code shows nothing there. Add the step's sketch, centred, filling the column's padded width (DIFF 9).

## 6. DIFF list — current code → required (`src/sections/process.tsx`)

1. **`:68` heading→row gap.** `mt-12` → `mt-xlg` (48 / 40 / 32 from spacing/3xl).
2. **`:68` row height.** `h-[clamp(24rem,calc(100svh-22rem),25.125rem)]` → `h-[25.125rem]` (Figma's 402). The clamp drops to 384 on viewports under ~758 px tall, where step 2's open column (402 of content, §7) overflows its bottom padding. Keep `landscape:h-auto landscape:flex-col`.
3. **`:76` collapsed column width.** `basis-[132px]` → `basis-[140px]`. Keep `tablet:basis-24` (no Figma tablet frame; 96 keeps the open column ≥ 400 at 834) and `landscape:basis-auto`.
4. **`:81` open copy layer width.** `w-[calc(100cqw-432px)]` → `w-[calc(100cqw-456px)]` (3 × 140 + 3 × 12). Keep `tablet:w-[calc(100cqw-324px)]` (3 × 96 + 3 × 12) and `landscape:static landscape:w-auto`. Update the comment at `:58-61` ("three 132px columns" → "three 140px columns"). The layer's width must equal the open `<li>`'s resting width at every breakpoint (measured now: 0 px difference at 1440/1280/1024/834), so the right-hand padding is never clipped.
5. **`:81` open padding.** `p-8 tablet:p-7 landscape:p-6` → `p-xxxbg landscape:p-xxxbg` (or just `p-xxxbg`; 32 / 28 / 24 by token). Note: this changes the stacked layout between 481 and 768 from 24 to 28, which is Figma's Tablet value.
6. **`:92` sketch offsets.** Drop `-mr-1 -mt-1` from the `<img>` class; keep `cs-blend-darker aspect-square w-[min(38%,9.375rem)] object-contain object-[right_top] landscape:w-[min(38%,8rem)]` and its `rise(isOpen, 'delay-[420ms]')`.
7. **`:95-99` Step details wrapper.** Wrap the title and body in one element:
   ```tsx
   <div className="mt-auto flex max-w-[21.25rem] flex-col gap-sm pt-6 landscape:pt-8">
     <Heading.H3 className={rise(isOpen, 'delay-[500ms]')}>…unchanged children…</Heading.H3>
     <Paragraph className={cn(rise(isOpen, 'delay-[580ms]'), 'text-ink')}>{step.body}</Paragraph>
   </div>
   ```
   i.e. move `mt-auto pt-6 landscape:pt-8` from the H3 to the wrapper, replace the body's `mt-3` with the wrapper's `gap-sm` (12), and replace the body's `max-w-[400px]` with the wrapper's `max-w-[21.25rem]` (340). The stagger delays stay on the two children.
8. **`:106` closed number position.** `left-6 top-6 … tablet:left-5` → `left-xbg top-xbg` (24 / 24 / 20, Figma spacing/xl). Keep `landscape:hidden`, the fade classes and `pointer-events-none`.
9. **New, after `:111` — collapsed sketch.** Add, inside each `<li>`, a decorative copy of the sketch for the closed state:
   ```tsx
   <img
     src={step.art}
     alt=""
     aria-hidden
     loading="lazy"
     decoding="async"
     draggable={false}
     className={cn(
       'cs-blend-darker pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[calc(100%-3rem)] max-w-[5.75rem] -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity tablet:w-[calc(100%-2.5rem)] landscape:hidden',
       isOpen ? 'opacity-0 duration-150' : 'opacity-100 delay-300 duration-500',
     )}
   />
   ```
   Centred in the column (Figma's placeholder sits at the card centre), width = column less its 24 insets (92 at 1440, 56 at 834), same fade timing as the closed number so it disappears as the column grows and returns once it has shrunk. It sits under the `<button>` overlay (render it before the button) so the whole column stays one click target.

**Required changes: 9.**

## 7. Responsive behaviour and the no-clipping rule

| Width | Row | Open column | Collapsed | Check |
|---|---|---|---|---|
| 1440 | 1120 × 402 | 664 (copy layer 664) | 140 × 3 | content 32+150+24+32+12+120+32 = **402** for step 2 (5-line body at 340), 378 for the others → fits |
| 1280 | 1120 × 402 | 664 | 140 × 3 | same as 1440 |
| 1024 | 944 × 402 | 488 (inner 424) | 140 × 3 | art 150, body 340 → same heights → fits |
| 993–1023 | 913–943 | 457–487 (inner ≥ 393) | 140 × 3 | title widest "Approve + keep moving." 279 < 393 → fits |
| ≤ 992 (`tablet:`) | gutter 24 | row − 324 (462 at 834) | 96 × 3 | p 28: 28+150+24+32+12+120+28 = 394 ≤ 402 → fits |
| ≤ 768 (`landscape:`) | stacked flex-col, gap 12, `h-auto` | every step open, full width, `text-forest`, padding 28 (≤ 480: 24), art `w-[min(38%,8rem)]`, `pt-8` before the title | closed number, closed sketch and button hidden | KEEP (no Figma Tablet/Mobile frame for this section; stacking is the code's existing phone layout) |

Measured body heights at 340 wide: steps 1, 3, 4 = 96 (4 lines); step 2 = 120 (5 lines). Title widths 207–279. After building, assert for each step opened in turn at 1440×900, 1280×800, 1024×768 and 834×1112: `inner.scrollHeight <= li.clientHeight` and `inner.getBoundingClientRect().right === li.getBoundingClientRect().right` (copy layer never wider than the open column), and that the body's bottom sits 32 (28 at 834) above the card's bottom or more.

## 8. Interactive states to keep

- Autoplay every `STEP_MS` 6000 while ≥ 40 % in view; pauses on pointer-enter and on focus inside the list; resumes on pointer-leave / blur out; respects `useAnimationsPaused()` (the site's Pause animations toggle). No reduced-motion gating (owner decision).
- Click on a closed column opens it (`track('process_slide', { step, method: 'click' })`).
- Full-column `<button>` with `aria-label="Show step N: Title subtitle"`, `aria-current="step"` on the open one, `focus-visible:outline-2 -outline-offset-2 outline-ink`, cursor pointer on closed / default on open. Tap target = whole column (≥ 96 × 402).
- Closed columns `hover:brightness-[0.96]`.
- All four steps' copy stays in the DOM in order (`sr-only` step number in each H3).
- Phones (≤ 768): every step shown open; buttons hidden.

## 9. Deliberately kept from code

- Section copy from `processSteps` (titles with subtitles, four bodies) — KEEP (real site copy; Figma only shows step 1, which matches).
- Expanded sketch position in the illustration row — KEEP (reason in §5).
- `tablet:basis-24` collapsed width and `tablet:w-[calc(100cqw-324px)]` — KEEP (no Figma Tablet frame; keeps the open column readable at 834).
- `mt-auto pt-6` floor between illustration row and details — KEEP (Figma's 48 gap comes out naturally at 402; the floor protects the 5-line step).
- Hover brightness, focus ring, autoplay, analytics — KEEP.
