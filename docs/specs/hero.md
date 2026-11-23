# Spec — Hero (`hero`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, Section instance **`130:5564`** (1440 × 963, Theme=Default in Dark mode). Button instance → component `8:13266` (Button, Appearance=Default, Width=Hug).
Evidence (`/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad/sections/hero/`): `figma.png` (1x, 1440×963), `code-1440.png`, `code-834.png`, `code-390.png` (current code), `sheet.png` (contact sheet of `public/images/work`), `tiles-preview.png` (the chosen five tiles cropped to 280×303).

Code files: `src/sections/hero.tsx`, `src/components/hero-stack.tsx`. Small supporting edits: `src/content/sections.ts`, `src/content/index.ts`, `src/index.css` (`.cs-marquee`, used only by the hero).

Foundations (`docs/specs/foundations.md`) are already in `src/index.css`: the Tablet (≤ 62rem) and Mobile (≤ 30rem) `:root` overrides step `--text-display`, `--container-margin`, `--section-pad-sm` and the `--spacing-*` tokens. This spec only uses those tokens.

---

## 1. Figma structure (measured)

```
Section 130:5564 — 1440 × 963, fill theme/background/page (#181b1e), vertical, items centre
└─ Container (slot) — max-w 1200, px page/gutter 40, py section/p-sm 32 (`layout/section-padding-y`)  → content column 1120
   ├─ Grid 130:5284 — 1120 × 468, 2 cols (minmax(0,1fr) ×2), column gap grid/gutter 32, pt spacing/6xl 128, pb 0
   │  ├─ "Channel introduction" 130:5285 — col 1, 544 × 264, vertical, gap spacing/xl 24, self-centre (y 166 = 128 + (340−264)/2)
   │  │  ├─ Heading 130:5286 — Display/Large, 2 lines, 544w
   │  │  ├─ Description 130:5287 — Body/Medium, 544w (2 lines)
   │  │  └─ Button — default 130:5288 — 135 × 40 (Appearance=Default, Hug)
   │  └─ "Frame 2" 130:5289 — col 2, 544 × 340, self-centre, EMPTY (media slot)
   ├─ "Frame 5" 130:5290 — 1120 × 335, horizontal, gap spacing/md 12, justify centre, pt spacing/2xl 32, pb 0
   │  └─ 5 × "Benefit illustration" 280 × 303, radius/md 8, image fill object-cover (grey placeholder)
   │     x = −164, 128, 420, 712, 1004 (row is 1448 wide, centred on the 1120 column → bleeds 164 each side, i.e. to x −4…1444 on the page)
   └─ "Logos" 130:5296 — 1120 × 96, horizontal, gap spacing/4xl 64, py spacing/2xl 32, justify centre, masked
      ├─ Mask: linear gradient L→R, alpha 0 → 1 at 16.35% → 1 at 82.69% → 0 at 100%
      └─ 2 identical runs ("Container"), each 8 logos 93.3 × 32, gap 64 (the marquee's two runs)
```

Total height: 32 + 468 + 335 + 96 + 32 = **963**. The Navbar (`header.tsx`, fixed, 24 top + 48 pill = 72) floats over the top of the section; Figma's 32 + 128 = 160 px puts the grid (and the media frame) 88 px under it.

No tablet or mobile frame exists for the hero. Responsive values below come from the Figma Size/Layout/Typography **variable modes** (Desktop / Tablet / Mobile), as mapped in foundations §1.

## 2. Text nodes

| Node | Copy (verbatim) | Italic | Figma style | Code |
|---|---|---|---|---|
| Heading 130:5286 | "Increase your" ⏎ "brand’s creative capability." (two paragraphs, curly ’) | none (roman) | Display/Large 60/64, tracking −1px, Instrument Serif 400; Tablet 48/56, Mobile 36/40 | `<Heading.Display as="h1">` (`font-serif text-display font-normal`, tracking from `--text-display--letter-spacing`) ✓. First line stays `<span className="block">Increase your</span>`, so the break is fixed ✓ |
| Description 130:5287 | "Scale your brand’s content production through a simple subscription to your very own specialised creative team." | — | Body/Medium 16/24, Golos 400 (all modes) | `<Paragraph>` (`text-p-md`) inside `max-w-[34rem]` (544) ✓ |
| Button label 130:5288;8:11953 | "Book a demo" | — | UI/Button 14/20 Medium | `LinkButton variant="inverse"` (`text-ui font-medium`) ✓ |
| (code only) sr-only h2 in `#clients` | "Creative partner to worldwide brands" | — | — | **KEEP** (a11y: names the logo list for screen readers; not visible) |
| (code only) MotionToggle | "Pause animations" / "Resume animations" / "Reduced motion on" | — | — | **KEEP** (accessible pause control for the auto-moving marquee and fan; WCAG 2.2.2) — restyled to be unobtrusive (§4.5) |

Text colour: theme/text/primary #f9f9f9 → `text-paper` (inherited from the section) ✓.

## 3. Tokens per element

| Element | Figma value (D / T / M) | Code token |
|---|---|---|
| Section background | theme/background/page #181b1e | **KEEP `bg-night`** (owner decision: Forest→Ink radial) |
| Section padding Y | section/p-sm 32 / 24 / 16 | `py-[var(--section-pad-sm)]` |
| Content column | 1200 container − 2 × gutter 40 / 24 / 16 = 1120 | `mx-auto w-full max-w-[var(--container-width)]` ✓ |
| Grid columns | 2 × 544, gap grid/gutter 32 | `grid-cols-2 gap-x-8` ✓ |
| Grid top padding | spacing/6xl 128 / 96 / 64 | `pt-xhg` (128 / 96 / 64 via foundations) and `portrait:pt-20` (80, DEVIATION D-1) |
| Intro stack gap | spacing/xl 24 / 24 / 20 | `gap-xbg` |
| Intro alignment | self-centre against the 340 media box | grid `items-center` ✓ |
| Button | 40 h (control/md 40 / 44 / 44), px 24, gap 12, radius full, Paper fill, Ink label | `pillClass('inverse')` ✓ (h-10 tablet:h-11) |
| Media slot ("Frame 2") | 544 × 340 (aspect 1.6) | `HeroStack` at `aspect-[544/340]` |
| Tile row top padding | spacing/2xl 32 / 28 / 24 | `pt-xxxbg` |
| Tile gap | spacing/md 12 (all modes) | `gap-3` |
| Tile size | 280 × 303 | `w-[17.5rem] aspect-[280/303]`; Tablet `tablet:w-[13.75rem]` (220 × 238), Mobile `portrait:w-40` (160 × 173) — no Figma mode for this, scaled for sensible bleed (D-2) |
| Tile radius | radius/md 8 | `rounded-sm` (0.5rem = Figma md) |
| Logos row padding | spacing/2xl 32 / 28 / 24 | `py-xxxbg` |
| Logo gap | spacing/4xl 64 / 48 / 40 | `gap-x-xxlg` + run end padding `pr-xxlg` |
| Logo height | 32 (all modes) | `h-8 landscape:h-8` (overrides BrandLogo's `landscape:h-6`) ✓ |
| Logo colour | vector fill #E6E6E6 (theme/icon/secondary) at group opacity 0.85 | `brightness-0 invert-[0.9]` (black → rgb 230 = #e6e6e6 = chalk) + BrandLogo's `opacity-85` ✓ |
| Marquee edge fade | 0 → 16.35% → 82.69% → 0 | `.cs-marquee` mask stops `#000 16%, #000 83%` |
| Shadows / borders | none in Figma | none added. HeroStack's card shadow `shadow-2xl shadow-ink/30` and `rounded-[1.3rem]` **KEEP** (they belong to the fan animation that replaces the empty frame) |

## 4. Required build

### 4.1 Element tree (target)

```tsx
<section id="hero" className="relative isolate overflow-hidden bg-night py-[var(--section-pad-sm)] text-paper">
  {/* Grid: intro + fan */}
  <div className="mx-auto grid w-full max-w-[var(--container-width)] grid-cols-2 items-center gap-x-8 pt-xhg tablet:grid-cols-1 tablet:gap-y-xlg portrait:pt-20">
    <div className="flex flex-col items-start gap-xbg"> … h1 / p / LinkButton (unchanged, with rise()) … </div>
    <div className="relative w-full tablet:mx-auto tablet:max-w-[38rem]"><HeroStack /></div>
  </div>

  {/* Tiles: five work stills, centred on the page, bleeding off both edges */}
  <motion.div {...rise(0.4)} aria-hidden className="flex w-full justify-center gap-3 pt-xxxbg">
    {heroTiles.map((src) => (
      <img key={src} src={src} alt="" width={280} height={303} loading="eager" decoding="async" draggable={false}
        className="aspect-[280/303] h-auto w-[17.5rem] shrink-0 rounded-sm bg-forest object-cover tablet:w-[13.75rem] portrait:w-40" />
    ))}
  </motion.div>

  {/* Logos: full-width marquee; pause control parked in the bottom padding */}
  <motion.div {...rise(0.5)} id="clients" className="relative mx-auto w-full max-w-[var(--container-width)] py-xxxbg">
    <h2 className="sr-only">Creative partner to worldwide brands</h2>
    <div className="cs-marquee overflow-hidden"> … two runs, each `flex shrink-0 items-center gap-x-xxlg pr-xxlg` … </div>
    <MotionToggle className="absolute bottom-[calc(var(--section-pad-sm)*-1)] right-0 text-paper/60 hover:text-paper" />
  </motion.div>
</section>
```

- `justify-center` on an overflowing flex row overflows equally on both sides (unsafe centring, the CSS default), which reproduces Figma's −164 / +164 bleed. The section's `overflow-hidden` clips it, so there is no horizontal page scroll.
- The tile row is page-wide (not inside the 1120 column) but its centre is the column's centre, so it matches Figma exactly at 1440 and stays centred at every width.

### 4.2 Assets per slot

| Slot | Asset |
|---|---|
| Frame 2 (544 × 340 media) | existing `HeroStack` card fan (`heroCards`, `/images/hero/*.avif`). **KEEP** (owner: real animation in place of the grey placeholder) |
| Tile 1 (left, mostly off-canvas) | `/images/work/trueafrica-04.avif` (591 × 609, Okavango reeds) |
| Tile 2 | `/images/work/dfsa-08.avif` (1024 × 1166, "Dried apricots" jumper) |
| Tile 3 (centre) | `/images/work/cherry-07.avif` (460 × 576, Black Forest cheesecakes) |
| Tile 4 | `/images/work/onvlee-12.avif` (574 × 574, "Gecko grip. Engineered." phone) |
| Tile 5 (right, mostly off-canvas) | `/images/work/holiday-04.avif` (505 × 575, peach iced tea) |
| Logos | `logos` from `src/content/logos.json` (11 real logos). **KEEP** the code's 11 (Figma shows 8; the 3 golf brands are real clients) |

The five tiles are one per client, none repeats a hero-fan image, and they alternate warm and cool so neighbours contrast. They crop cleanly at 280 × 303 with `object-cover` centred (checked in `tiles-preview.png`). Add them as data:

```ts
// src/content/sections.ts, after heroCards
/** Hero tile row (Figma "Benefit illustration" ×5, 280 × 303): one still per client, cropped by object-cover. */
export const heroTiles = [
  '/images/work/trueafrica-04.avif',
  '/images/work/dfsa-08.avif',
  '/images/work/cherry-07.avif',
  '/images/work/onvlee-12.avif',
  '/images/work/holiday-04.avif',
]
```

### 4.3 Responsive behaviour

| Width | Layout |
|---|---|
| > 992 (Desktop) | 2 columns as in Figma. Section is content height (963 at 1440), **not** `min-h-dvh` (Figma's tile row makes the hero taller than a laptop screen, so the viewport-fit sizing is dropped). Fan 544 × 340. |
| ≤ 992 (Tablet, `tablet:`) | One column: intro, then fan centred at `max-w-[38rem]` (608 × 380), row gap `gap-y-xlg` (40). Grid pt 96, section py 24, gutter 24, Display 48/56, button 44. Tiles 220 × 238, row pt 28. Logo gap 48, row py 28. |
| ≤ 480 (Mobile, `portrait:`) | As Tablet. Grid pt 80 (D-1), section py 16, gutter 16, Display 36/40, intro gap 20, row gap 32. Fan full column width (358 × 224 at 390). Tiles 160 × 173: the centre one is whole, its neighbours bleed off. Logo gap 40, row py 24. |

At no width may the page scroll sideways (the section's `overflow-hidden` clips the tile row and the fan's outer cards).

### 4.4 Interactive states to keep

- `LinkButton` `id="hero-book-demo"`, `data-track="book_demo_click"`, `data-track-location="hero"`, `href={demoPage}`; the `inverse` hover (`bg-soft-volt`), `active:scale-[0.98]`, two-tone focus ring (Paper outline + Ink band).
- `rise()` entrance (opacity/y, EASE, staggered delays), honouring `useAnimationsPaused()` (instant when paused). No reduced-motion gating to add (owner decision).
- `HeroStack`: auto-advance every 3.2 s while in view and the tab is visible; pan/drag with throw (`cursor-grab` / `active:cursor-grabbing`, `touch-pan-y`); fan-out on load; stops when animations are paused; `aria-hidden` (decorative).
- Marquee: 45 s loop, pauses on hover, second run `aria-hidden`; logo `alt` = brand name; the CSS animation must stop when MotionToggle pauses animations (existing global mechanism; check it still applies after the class changes).
- MotionToggle: `aria-pressed`, `min-h-11` (44px tap target), underline, focus outline, disabled label when reduced motion is on.

### 4.5 MotionToggle placement (unobtrusive)

In Figma the marquee runs the full 1120 column. Today the toggle sits inside the row, which shortens the marquee by about 126 px. Take it out of the flex flow. Position it absolutely at the right end of `#clients`, **in the section's bottom padding**: `absolute right-0 bottom-[calc(var(--section-pad-sm)*-1)]`. Its 44 px box then ends at the section's bottom edge and clears the 32 px logo band on desktop (box top 84 vs logos ending at 64 within the 96 row). On Mobile it may overlap the faded-out right end of the band by about 4 px, which is acceptable. Colour `text-paper/60` (≈ 7:1 on Ink, AA), with `hover:text-paper`. It keeps its underline, its focus ring and `text-p-xs`.

## 5. Deviations (deliberate)

- **D-1** Grid top padding on Mobile is `portrait:pt-20` (80) instead of spacing/6xl Mobile 64. With 64, the headline would start 80 px from the top, only 8 px under the fixed 72 px navbar. 16 + 80 = 96 gives 24 px of clearance.
- **D-2** Tile size steps (220 Tablet, 160 Mobile) are not in Figma. There is no Tablet/Mobile frame or variable for them, and a fixed 280 would show only one and a half tiles on a phone.
- **KEEP** `bg-night` (owner), HeroStack fan in the empty media frame (owner), 11 real logos, sr-only h2, MotionToggle, the fan card's radius and shadow.

## 6. DIFF — current code → required

1. **`src/sections/hero.tsx:14-15`**: delete the `HEADER` constant (no longer used).
2. **`src/sections/hero.tsx:17-27`**: rewrite the doc comment. The hero is now content height on `bg-night`: two columns (Display headline, support line and CTA on the left, the card fan in Figma's 544 × 340 media frame on the right), then a row of five work stills bleeding off both edges, then the client-logo marquee. It is no longer "one viewport tall", and the fan is no longer sized off the viewport height.
3. **`src/sections/hero.tsx:38`**: `className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-night text-paper"` → `className="relative isolate overflow-hidden bg-night py-[var(--section-pad-sm)] text-paper"`.
4. **`src/sections/hero.tsx:40-41`**: grid. Replace the classes with `mx-auto grid w-full max-w-[var(--container-width)] grid-cols-2 items-center gap-x-8 pt-xhg tablet:grid-cols-1 tablet:gap-y-xlg portrait:pt-20` (drop `flex-1`, `gap-y-14` and `pb-[clamp(2rem,5dvh,3.5rem)]`) and **delete the inline `style={{ paddingTop: … }}`**.
5. **`src/sections/hero.tsx:43`**: intro stack `gap-6` → `gap-xbg` (24 / 24 / 20).
6. **`src/sections/hero.tsx:61-63`**: fan wrapper. Change the comment to "Figma 'Frame 2': 544 × 340" and the classes to `relative w-full tablet:mx-auto tablet:max-w-[38rem]` (drop the `100dvh` max-width calc, `justify-self-end` and `tablet:justify-self-center`).
7. **`src/components/hero-stack.tsx:135`**: `aspect-[554.6/391]` → `aspect-[544/340]` (Figma media frame. Cards stay `h-full w-[68cqw] left-[16cqw]`, i.e. 370 × 340 at desktop). Also update `hero.tsx:62`, which mentions "554.6 × 391".
8. **`src/sections/hero.tsx` after line 66 (new)**: insert the tile row from §4.1 (`motion.div {...rise(0.4)} aria-hidden`, `flex w-full justify-center gap-3 pt-xxxbg`, five `<img>` at `aspect-[280/303] w-[17.5rem] tablet:w-[13.75rem] portrait:w-40 shrink-0 rounded-sm object-cover bg-forest`, `alt=""`, `width={280} height={303}`, `loading="eager"`, `decoding="async"`, `draggable={false}`). Import `heroTiles` from `../content`.
9. **`src/content/sections.ts:109` (after `heroCards`)**: add `export const heroTiles = [...]` (§4.2). **`src/content/index.ts:23`**: add `heroTiles` to the re-export list.
10. **`src/sections/hero.tsx:70`**: logos row. `rise(0.45)` → `rise(0.5)`. Classes `mx-auto flex w-full max-w-[var(--container-width)] items-center gap-6 py-8` → `relative mx-auto w-full max-w-[var(--container-width)] py-xxxbg`.
11. **`src/sections/hero.tsx:72`**: marquee `cs-marquee min-w-0 flex-1 overflow-hidden` → `cs-marquee overflow-hidden` (it now spans the full 1120).
12. **`src/sections/hero.tsx:78`**: run `gap-x-16 pr-16` → `gap-x-xxlg pr-xxlg` (64 / 48 / 40).
13. **`src/sections/hero.tsx:80`**: logo `invert` → `invert-[0.9]` (Figma fill #E6E6E6 = chalk; BrandLogo's `opacity-85` already matches Figma's 0.85).
14. **`src/sections/hero.tsx:86`**: `<MotionToggle className="shrink-0 text-paper/70 hover:text-paper" />` → `<MotionToggle className="absolute bottom-[calc(var(--section-pad-sm)*-1)] right-0 text-paper/60 hover:text-paper" />` (§4.5).
15. **`src/index.css:309-310`**: `.cs-marquee` mask stops `#000 12%, #000 88%` → `#000 16%, #000 83%` (Figma Logos mask 16.35% / 82.69%; the class is only used by the hero).

## 7. Verification (implementer)

| Probe at 1440 × 963 | Expected |
|---|---|
| `#hero` height | 963 ± 2 |
| `#hero h1` top / left | ≈ 198 / 160; font 60/64, letter-spacing −1px |
| `#hero p` width | 544 |
| `#hero-book-demo` | 135 × 40 at x 160 |
| HeroStack box | x 736, y 160, 544 × 340 |
| Tile row | 5 imgs 280 × 303, radius 8, gap 12; first left ≈ −4, last right ≈ 1444; top ≈ 532 |
| `#clients` | x 160, w 1120, h 96; marquee width 1120; logo imgs 32 tall; computed filter `brightness(0) invert(0.9)` |
| MotionToggle | 44 tall, bottom edge = section bottom, right edge 1280; focusable; toggles pause for the fan and marquee |
| 834 and 390 | single column, no horizontal scroll (`scrollWidth === innerWidth`), tiles 220 / 160 wide, h1 clears the navbar by ≥ 24 px |
| `npx tsc --noEmit -p .` clean; `npx eslint src/sections/hero.tsx src/components/hero-stack.tsx src/content/sections.ts src/content/index.ts` | no new errors |
