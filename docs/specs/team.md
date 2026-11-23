# Spec — No hiring / team (`team`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, section instance **`130:5576`** (Section component `10:1334`, Theme = Default), at x 0, y 1635, 1440 × 532.
Code: `src/sections/team.tsx` (export `NoHiring`, `<Section id="team">`).
Evidence: `/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad/sections/team/` holds `figma.png` (1x, 1440 × 532) and `code-1440.png`, `code-834.png`, `code-390.png` (current render, measured live on :3001).
Shared tokens and components: see `docs/specs/foundations.md`. This spec uses only the token names listed there.

---

## 1. Structure

```
Section 130:5576  (Section, Theme=Default)  → <Section id="team" className="overflow-x-clip">   (bg-paper from body, pad=bg)
└─ Container slot  max-w 1200 incl. 40 gutters → 1120 column, py 96          → <Container width="max"> (inside <Section>)
   └─ Grid 130:5569   grid, 2 × minmax(0,1fr), column gap 32, 1 row (fit-content), overflow clip, w-full
      ├─ Frame 2 130:5574 (col 1, row 1)  flex-col, h 340, justify-self stretch      → <Canvas /> (media slot)
      │  └─ "Modern marketing team" 130:5575  rounded-rectangle 544 × 340, radius 12, image fill (grey placeholder)
      └─ Team introduction 130:5570 (col 2, row 1)  flex-col, items-start, gap 24, self-stretch, text/primary
         ├─ Heading 130:5571      544 × 112   (y 0)
         ├─ Lead 130:5572         544 × 24    (y 136)
         └─ Description 130:5573  544 × 96    (y 184)
```

Desktop geometry at 1440: column 1120 = 544 + 32 + 544. Media x 160–704, text x 736–1280. Both columns start at the grid top (y = section top + 96). The text column is top-aligned: `items-start` on the grid and `justify-start` in the stack.

Code tree to build:

```tsx
<Section id="team" className="overflow-x-clip">
  <div className="grid grid-cols-2 items-start gap-8 tablet:gap-6 portrait:gap-4 landscape:grid-cols-1">
    <Canvas />                                   {/* col 1 */}
    <div className="flex flex-col items-start gap-xbg landscape:order-first">   {/* col 2 */}
      <Heading.H1>…</Heading.H1>
      <Paragraph className="max-w-[34rem] font-semibold">…</Paragraph>
      <Paragraph className="max-w-[34rem]">…</Paragraph>
    </div>
  </div>
</Section>
```

## 2. Text nodes (verbatim)

| Node | Copy | Figma style | Code |
|---|---|---|---|
| Heading 130:5571 | Line 1: "No hiring. No training." (Instrument Serif Regular). Line 2: "*No added complexity.*" (**italic**, Instrument Serif Italic). Two separate paragraphs, so they are always two lines. | Display/Small + Display/Small/Italic: 48/56, tracking −1px, weight 400, `typography/family/display` | `<Heading.H1>` (renders `<h2>`, `font-serif text-h1`, 48/56 → 36/44 Tablet → 30/36 Mobile, −1px). Line 1 is `<span className="block">`. Line 2 is `<Em>`. ✓ as is |
| Lead 130:5572 | "Your team of creative specialists is already in place." | Body/Medium/Semi Bold: Golos 16/24, weight 600, tracking 0 | `<Paragraph className="font-semibold">` (`text-p-md`) ✓ |
| Description 130:5573 | "Creative Seat tailors a team of experienced talent to the type of content you need. Whether you require digital, video, web, animation or brand design, simply brief your designated project manager and your specialised team gets to work." | Body/Medium: Golos 16/24, weight 400, tracking 0 | `<Paragraph>` (`text-p-md`) ✓ |

Colour of all three is `theme/text/primary` #181b1e → `text-ink` (inherited from body). ✓ Contrast is 16.9:1 on Paper.
Code copy matches Figma character for character. ✓ (The earlier "Instant access to the skills you need" eyebrow is already gone, which matches Figma.)

## 3. Sizes, spacing, colours → tokens

| Property | Figma | Value D / T / M | Code token |
|---|---|---|---|
| Section background | theme/background/page | #f9f9f9 | body `bg-paper` (no class) ✓ |
| Section padding Y | layout/section-padding-y (p-bg) | 96 / 64 / 48 | `<Section>` default `pad="bg"` ✓ |
| Page gutter | layout/page-gutter | 40 / 24 / 16 | `<Container>` `--container-margin` ✓ |
| Content column | container max 1200 incl. gutters | 1120 | `width="max"` (`--container-width`) ✓ |
| Grid columns | 2 × minmax(0,1fr) | 544 + 544 at 1440 | `grid-cols-2` ✓ |
| Grid gap (column) | grid/gutter (`--layout-grid-gutter`) | 32 / 24 / 16 | `gap-8 tablet:gap-6 portrait:gap-4` (foundations §2.4). Today it is a fixed `gap-8` → **D1** |
| Text stack gap | spacing/xl (content/stack-gap) | 24 / 24 / 20 | `flex flex-col gap-xbg`. Today it is `mt-6` ×2 (fixed 24) → **D2–D4** |
| Text column width | w-full of column | 544 | column width. Paragraphs keep `max-w-[34rem]` (= 544): **KEEP** (identical at desktop; on the stacked ≤768 layout it holds a readable measure instead of running 700+ px) |
| Media box | Frame 2 h 340, fill column | 544 × 340 | see §5 (deviation) |
| Media radius | size/radius/lg | 12 | `rounded-md` (0.75rem) on the artboard. Today it is `rounded-[2.8cqw]` (15.2px at 544) → **D5** |
| Borders / shadows | none | — | none ✓ |

## 4. Components and variants used

- **Section** (`10:1334`), Theme=Default → `<Section>` with default `pad="bg"` and `width="max"`. ✓
- No Button, Pill, Eyebrow or card instances in this section.
- Text styles: Display/Small (+Italic), Body/Medium/Semi Bold, Body/Medium → `Heading.H1` + `Em`, `Paragraph` (+`font-semibold`), `Paragraph`.

## 5. Media slot — the animated Canvas (KEEP the existing asset)

Figma shows a grey image placeholder ("Modern marketing team", 544 × 340, radius 12). Per the owner rule, the slot keeps the existing **animated multiplayer Canvas** (`Canvas()` in `team.tsx`: the Sassy Locks artboard, four crew cursors, drag-to-tug pieces, the `character-craig` alpha video).

**Can it fit 544 × 340 (1.6:1)? No.** The canvas is a 505 × 596 (0.85:1) frame. Every piece, slot, cursor `home`/`rest` point and the artboard itself is positioned in **% of both axes**, while type, radii and rules are sized in **container-width units (cqw)**. Forcing a 1.6:1 box shrinks every vertical % by ~1.9× while cqw sizes stay put, so:
- the logo (4.4cqw ≈ 24px type) would overflow its 4.6%-high slot (≈ 16px);
- the copy block ("The difference is the detail.", 7cqw serif across 2–3 lines) would overflow its 24% slot (≈ 82px);
- the model video's box is tuned to the character's 0.81 framing and would crop the figure;
- the scatter positions (`from`) and crew paths would collide.

Shrinking the whole 0.85:1 canvas to fit inside 340px height would make it 288px wide (half the column), which is unreadable.

**Required behaviour (DEVIATION, recorded):** keep the canvas aspect `aspect-[505/596]` at full column width (544 × 642 at 1440). Align its frame top with Figma's media-box top, i.e. the grid top (`items-start`; already the case: canvas y = text y = grid top). The section therefore renders ~834px tall at 1440 instead of Figma's 532. Keep the existing height cap `max-w-[calc((100svh-8rem)*505/596)]` so the canvas never exceeds the viewport. The 12px radius goes on the visible **artboard** (the lilac panel), not the outer frame, because the outer frame is transparent and the cursors and scattered pieces are designed to spill past the artboard (D5).

Assets per slot (all existing, no new downloads):
| Slot | Asset |
|---|---|
| Media / model piece | `/videos/character-craig.mov` (HEVC alpha, Safari), `/videos/character-craig.webm` (VP9 alpha), poster `/images/sections/character-craig.webp` ✓ |
| Artboard, pieces, cursors | Drawn in DOM/SVG in `team.tsx`. Client palette `CLIENT` (lilac/plum/pink/mist): KEEP (it depicts a client's brand, not Creative Seat's) |

The Figma placeholder image (`imgModernMarketingTeam`) is **not** downloaded or used.

## 6. Responsive behaviour

The file has no Tablet/Mobile frames for this section, so use the variable modes (foundations §1) plus sensible stacking:

| Range | Layout |
|---|---|
| > 992 (Desktop) | 2 columns, canvas left / text right, gap 32, H1 48/56, stack gap 24, pad 96 |
| 769–992 (Tablet mode) | still 2 columns, gap **24**, H1 36/44, stack gap 24, pad 64, gutter 24 (at 834 each column is ~381) |
| 481–768 (`landscape:`, Tablet values) | 1 column, **text first** (`landscape:order-first`), canvas below at full width (still height-capped), row gap 24 |
| ≤ 480 (`portrait:`, Mobile mode) | 1 column, text first, row gap **16**, H1 30/36, stack gap **20**, pad 48, gutter 16 |

KEEP `landscape:grid-cols-1` and `landscape:order-first`: the headline should lead when stacked. KEEP `overflow-x-clip` on the section: the cursor labels deliberately spill past the canvas and must be clipped, not scrolled, at the screen edge.

## 7. Interactive states and behaviour to KEEP (no change)

- `role="img"` + `aria-label` on the canvas. All decorative children are `aria-hidden`. Keep the heading `<h2>` (via `Heading.H1`) for the outline.
- Crew choreography loop (scatter → build → hold 3.2s → ⌘Z scatter). It runs only while ≥30% in view (`useInView` amount 0.3) and waits while the visitor drags.
- Video plays only in view, when not paused and when the tab is visible. Muted is set before `play()`. `preload="none"`.
- "You" cursor: mouse only, uses motion values (no re-render), and `cursor-none` only under `(hover:hover)`.
- Pieces: mouse-only drag (`dragListener={false}` + `controls.start` on mouse pointerdown, so touch scrolls the page), `dragSnapToOrigin`, elastic 0.35, `whileDrag` scale 1.05.
- `useAnimationsPaused()` paused branch: lays out the finished artwork statically. KEEP. Note for the orchestrator (out of scope here): the shared hook `src/hooks/useMotionPreference.ts:11` still folds `prefers-reduced-motion` into `isPaused`, which conflicts with the owner's "no reduced-motion gates" decision. That belongs to the shared hook and its owner/agent, not this section.
- No Caveat notes (none present ✓). No gradient change (the section is Theme=Default and Paper, not a night section ✓).

## 8. DIFF — current code → required

All in `src/sections/team.tsx`.

1. **`team.tsx:15`**: grid gap. `gap-8` → `gap-8 tablet:gap-6 portrait:gap-4` (Figma grid/gutter 32 / 24 / 16). Full class: `grid grid-cols-2 items-start gap-8 tablet:gap-6 portrait:gap-4 landscape:grid-cols-1`.
2. **`team.tsx:17`**: text column. `<div className="landscape:order-first">` → `<div className="flex flex-col items-start gap-xbg landscape:order-first">` (Figma "Team introduction" auto-layout: vertical, gap spacing/xl 24 / 24 / 20).
3. **`team.tsx:21`**: lead paragraph. Remove `mt-6`: `className="mt-6 max-w-[34rem] font-semibold"` → `className="max-w-[34rem] font-semibold"`.
4. **`team.tsx:22`**: description paragraph. Remove `mt-6`: `className="mt-6 max-w-[34rem]"` → `className="max-w-[34rem]"`.
5. **`team.tsx:223`**: artboard radius. `rounded-[2.8cqw]` → `rounded-md` (Figma size/radius/lg 12, fixed at every mode). Leave the inner slot radii (`rounded-[1.4cqw]`) and the selection box as they are, since they belong to the mock client page.

KEEP (no change, with reason):
- `team.tsx:14`: `<Section id="team" className="overflow-x-clip">`. Theme Default and pad bg already match. The clip is needed for cursor labels.
- `team.tsx:18-20`: heading markup. Two lines with the italic second line in `<Em>` already matches Display/Small + Italic.
- `team.tsx:21-22` `max-w-[34rem]`: equals Figma's 544 at desktop and gives a readable measure when stacked.
- `team.tsx:220`: canvas `aspect-[505/596] w-full max-w-[calc((100svh-8rem)*505/596)]`. DEVIATION from Figma's 544 × 340 box: the % + cqw artboard can't take a 1.6:1 aspect without breaking (§5). Its top is aligned to the box top.
- `team.tsx:42-351`: all canvas internals, choreography, drag, video and pointer components (§7).

**Required changes: 5.**

## 9. Acceptance checks

- At 1440: canvas x 160, w 544, top = H2 top; text column x 736, w 544; H2 at y +0, lead at +136, description at +184 relative to the grid top (Figma 0 / 136 / 184); artboard `border-radius: 12px`.
- At 834: column gap 24, H1 36/44, lead → description gap 24.
- At 390: stacked with text first, row gap 16, lead → description gap 20, H1 30/36, no horizontal page scroll.
- Canvas animation still loops in view, the video plays, and mouse drag on a piece springs back.
