# Spec — Modern marketing panel (`pitch`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`. Home instance `130:5567` (Section, Theme=Default) holds the "Modern marketing panel" instance `I130:5567;10:131;130:5566`. Its component set is `10:293` on the Components page: **Breakpoint=Desktop `10:244`, Tablet `10:294`, Mobile `10:302`**.
Evidence (`/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad/sections/pitch/`): `figma.png` (1x, 1440×672), `code-1440.png`, `code-834.png`, `code-600.png`, `code-390.png`.
Code file: `src/sections/pitch.tsx`. Breakpoints follow `docs/specs/foundations.md` §1 (Desktop = base, Tablet = `tablet:` ≤992, `landscape:` ≤768, Mobile = `portrait:` ≤480).

Desktop is already pixel-exact: measured 1440 → section 1440×672, pad 96/96, panel 1120×480, radius 24, columns 544/544, gap 32, copy pad 48, H1 48/56 −1px, body 16/24, paragraph gap 24. The changes are all in the Tablet and Mobile behaviour.

---

## 1. Structure

```
<Section id="pitch">                         Figma Section Theme=Default: bg page (Paper), section/p-bg 96/64/48 top+bottom, container 1120 column
  div.panel  (grid, 2 cols)                  "Modern marketing panel": Soft Volt, radius/2xl, overflow clip, min-h 480
    div.copy (flex-col, self-start)          "Marketing context": padding spacing/3xl, gap spacing/xl, text/primary
      Heading.H1                             Display/Small: "Designed for " + <Em>"modern marketing teams."</Em>
      Paragraph                              Body/Medium
      Paragraph                              Body/Medium
    div.media (relative, self-stretch)       "Marketing imagery": min-h 480, overflow clip
      img (absolute inset-0, cover)          "Modern marketing team" (Figma grey placeholder, min-h 320)
```

Layout per Figma:
- Panel: `grid grid-cols-2`, `column-gap 32` (raw 32, not variable-bound), one row `fit-content`, `min-h 480`, `overflow-clip`.
- Copy cell: `justify-self: stretch`, `align-self: start` (copy is top-aligned; it does NOT stretch to 480), flex column, gap 24, padding 48 on all sides.
- Media cell: `align-self: stretch` (fills the full row height), `min-h 480`; image fills it with `object-cover`.
- Mobile variant: `grid-cols-1`, two rows (copy, then media), no row gap; media row height 480 on the component canvas (see §6 for the deliberate code value).

## 2. Text nodes

| Node | Copy (verbatim) | Style | Code |
|---|---|---|---|
| `10:239` heading | "Designed for " (roman) + "modern marketing teams." (**italic**, Instrument Serif Italic) | Display/Small 48/56, tracking −1 (Tablet 36/44, Mobile 30/36) | `<Heading.H1>Designed for <Em>modern marketing teams.</Em></Heading.H1>` → `text-h1` (renders `<h2>`) ✓ |
| `10:240` | "Teams are expected to deliver more content across more channels than ever before." | Body/Medium 16/24, Golos 400 | `<Paragraph>` → `text-p-md` ✓ |
| `10:241` | "Freelancers create complexity and brand inconsistency. Traditional agencies are costly and lead to production drag. Creative Seat gives your team a faster, more effective way to produce high-end content within one simple subscription." | Body/Medium 16/24 | `<Paragraph>` ✓ |

All text `text/primary` #181b1e → `text-ink` (on Soft Volt: 14.6:1, passes AA). Copy matches code exactly; no change.

## 3. Tokens

| Property | Figma (Desktop / Tablet / Mobile) | Code token |
|---|---|---|
| Section background | theme/background/page #f9f9f9 | page Paper (Section has no bg class; body is Paper) ✓ |
| Section padding Y | layout/section-padding-y 96 / 64 / 48 | `<Section>` default `pad="bg"` ✓ |
| Container | 1200 max, page gutter 40/24/16 → 1120 column | `<Section>` default `width="max"` ✓ |
| Panel fill | base/color/lime-200 #d7ef81 | `bg-soft-volt` ✓ |
| Panel radius | size/radius-2xl 24 / 20 / 16 | `rounded-panel` ✓ (steps via `--radius-panel`) |
| Panel min height | 480 (all variants) | `min-h-[30rem]` ✓ (`landscape:min-h-0` when stacked ✓) |
| Column gap | 32 (raw) | `gap-x-8` |
| Row gap (Mobile) | 0 | none (use `gap-x-8`, so no row gap exists) |
| Copy padding | size/spacing-3xl 48 / 40 / 32 | **`p-xlg`** (3rem / 2.5rem / 2rem) |
| Copy stack gap | size/spacing-xl 24 / 24 / 20 | **`flex flex-col gap-xbg`** (1.5rem / 1.5rem / 1.25rem) |
| Text colour | theme/text-primary #181b1e | `text-ink` ✓ |
| Border / shadow | none | none ✓ |
| Image fit | `object-cover`, fills cell | `object-cover` ✓ |

## 4. Components and variants

- Figma: "Modern marketing panel" Breakpoint = Desktop / Tablet / Mobile; Section Theme=Default.
- Code: `Section` (defaults), `Heading.H1`, `Em`, `Paragraph` (default = Body/Medium). No buttons, no links.

## 5. Responsive behaviour

| Range | Figma variant | Required layout |
|---|---|---|
| ≥ 993 (Desktop) | Desktop | 2 cols 544/544 at 1440, gap 32, copy pad 48, gap 24, H1 48/56, radius 24, panel min-h 480 |
| 769–992 (`tablet:`) | Tablet | 2 cols (377/377 at 834), gap 32, copy pad **40**, gap 24, H1 36/44, radius 20, min-h 480 |
| 481–768 (`landscape:`) | Tablet values, stacked | 1 col: copy then image. Copy pad **40**, gap 24, H1 36/44, radius 20, image row **320** tall |
| ≤ 480 (`portrait:`) | Mobile | 1 col: copy then image. Copy pad **32**, gap **20**, H1 30/36, radius 16, image row **320** tall |

The padding, gap, radius and type steps all come from the token media blocks in `src/index.css`. The section only has to use the right token names (`p-xlg`, `gap-xbg`) and stop overriding them at `landscape:`.

KEEP stacking at `landscape:` (≤768), not only at Mobile (≤480): Figma's Tablet variant is drawn for 834. Kept two-column at 600px, the copy column would be about 140px wide inside 40px padding, which does not work.

## 6. Assets

| Slot | Figma | Code |
|---|---|---|
| "Modern marketing team" image | grey placeholder (`0b3b6.png`) | KEEP `/images/sections/pitch-marketer.avif` (1280×720, real art), `object-cover object-[68%_center]` (keeps the subject in view on narrow crops), alt text unchanged, `loading="lazy" decoding="async"` |

Stacked image height: the Mobile variant's imagery row is 480 tall, but on a 1360-wide component canvas. The image node's own `min-h` is 320. On a 358px phone column, 480 would give a 3:4 portrait crop of a 16:9 photo and lose most of the floating posts. So use the Figma minimum **320 (`h-80`)** for the stacked row. That gives 358×320 at 390 and 552×320 at 600. Today's `aspect-[4/3]` gives 269 at 390, which is below Figma's 320 minimum.

## 7. Interactive states

None. The panel is static: no hover, focus or motion. The H1 stays an `<h2>` for the outline (KEEP). The image keeps its descriptive `alt` (KEEP, accessibility).

## 8. Diff — current code → required

1. **`src/sections/pitch.tsx:12`, copy padding.** Today `p-12 landscape:p-xbg` (48 fixed, then 24/20 when stacked). Required: **`p-xlg`**, which gives 48 / 40 / 32 per Figma spacing/3xl. Drop `landscape:p-xbg`. The class becomes `self-start p-xlg`.
2. **`src/sections/pitch.tsx:12,16,19`, copy stack gap.** Today the paragraphs carry `mt-6` (24 fixed). Required: on the copy div (line 12), add **`flex flex-col gap-xbg`**, giving 24 / 24 / 20 per Figma spacing/xl. Remove `className="mt-6"` from both `<Paragraph>`s (lines 16 and 19). Final copy div: `flex flex-col gap-xbg self-start p-xlg`.
3. **`src/sections/pitch.tsx:23`, stacked image height.** Today `landscape:aspect-[4/3]` (269px tall at 390). Required: **`landscape:h-80`** (320, Figma image min-h). Class: `relative landscape:h-80`. Keep the `img` classes on line 29 unchanged.
4. *(cleanup, no visual change)* **`src/sections/pitch.tsx:11`, gap axis.** Change `gap-8 … landscape:gap-0` to `gap-x-8` (Figma only sets column-gap 32), and drop `landscape:gap-0`. Final panel class: `grid min-h-[30rem] grid-cols-2 gap-x-8 overflow-hidden rounded-panel bg-soft-volt text-ink landscape:min-h-0 landscape:grid-cols-1`.
5. *(comment)* **`src/sections/pitch.tsx:8-9`.** Update the comment to say the padding, gap and radius step per Figma Desktop/Tablet/Mobile (48/40/32, 24/24/20, 24/20/16), that the panel stacks at ≤768, and that the stacked image row is 320.

KEEP (unchanged, already matches Figma): `<Section id="pitch">` defaults; `bg-soft-volt`, `rounded-panel`, `overflow-hidden`, `text-ink`; `min-h-[30rem]` + `landscape:min-h-0`; `grid-cols-2` → `landscape:grid-cols-1`; `self-start` on the copy; Heading.H1 + Em phrase; both paragraph texts; the image source, alt, crop position and lazy loading.

Required changes: **3** (items 1–3). Items 4–5 are cleanup with no visual change.

## 9. Acceptance checks

- 1440: panel 1120×480, cols 544/544, copy pad 48, paragraph gap 24, H1 48/56 (unchanged from today).
- 834: cols 377/377, copy pad **40**, gap 24, radius 20, H1 36/44.
- 600: stacked, copy pad **40**, gap 24, image 552×**320**, radius 20.
- 390: stacked, copy pad **32**, gap **20**, image 358×**320**, radius 16, H1 30/36.
