# Spec — High impact creative (`performance`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, Section instance **`130:5586`** (1440 × 532, y 2167). It is an instance of the Section component set `10:1334` (Theme = Default, Dark mode), see `foundations.md` §3.
Evidence (scratchpad `sections/performance/`): `figma.png` (1x, 1440×532), `code-1440.png`, `code-834.png`, `code-390.png` (current code, measured with playwright-cli).

Code files: `src/sections/performance.tsx`, `src/components/video-lightbox.tsx` (only caller is this section).

---

## 1. Structure

```
Section 130:5586 (Theme Default / Dark; fill background/page #181b1e)      → <Section id="performance" className="bg-night-low text-paper">  KEEP gradient (owner)
└─ Container (slot) max-w 1200, px page/gutter 40, py section/p-bg 96       → Section's inner <Container width="max"> (1120 column) + pad="bg" (default)
   └─ Grid 130:5578: 1120 wide, 2 cols minmax(0,1fr), col-gap grid/gutter 32, 1 row (fit-content), overflow clip
      ├─ "Channel introduction" 130:5579 — col 1, 544 wide, self-center (y 22 inside the 340 row), flex-col, gap spacing/xl 24, text text/primary
      │  ├─ Heading 130:5580        544 × 128 (2 lines)
      │  ├─ Description 130:5581    544 × 72  (3 lines)
      │  ├─ Description 130:5582    544 × 48  (2 lines)
      │  └─ "Button — default" 130:5583  HIDDEN in Figma → not rendered (KEEP absent)
      └─ "Frame 2" 130:5584 — col 2, 544 × 340, flex-col
         └─ "Modern marketing team" 130:5585 — rounded-rectangle 544 × 340, radius/lg 12, grey image placeholder
```

Code tree (target):

```tsx
<Section id="performance" className="bg-night-low text-paper">
  <div className="grid grid-cols-2 items-center gap-8 tablet:gap-6 landscape:grid-cols-1 landscape:gap-xbg">
    <div className="flex flex-col gap-6">            {/* gap-6 = 24 = spacing/xl (Desktop/Tablet 24; Mobile 20 → may use gap-xbg) */}
      <Heading.Display>High impact creative <Em>across every channel.</Em></Heading.Display>
      <Paragraph>…</Paragraph>
      <Paragraph>…</Paragraph>
    </div>
    <VideoLightbox … className="aspect-[8/5]" />      {/* Figma box 544 × 340 = 8:5, radius 12 */}
  </div>
</Section>
```

Layout values:

| Figma | Value (Desktop / Tablet / Mobile) | Code token | Current |
|---|---|---|---|
| section background/page | #181b1e | `bg-night-low` | ✓ KEEP (owner: Forest→Ink gradient) |
| Container max-width / gutter | 1200 / 40 · 960 / 24 · 480 / 16 | `<Container width="max">` (`--container-width`, `--container-margin`) | ✓ (1120 col at 1440, x 160) |
| section/p-bg (top & bottom) | 96 / 64 / 48 | `<Section>` default `pad="bg"` (`--section-pad`) | ✓ (96 / 64 / 48 measured) |
| Grid columns | 2 × 544 (1fr each) | `grid grid-cols-2` | ✓ |
| grid/gutter (column gap) | 32 / 24 / 16 | `gap-8 tablet:gap-6` (stacked: see §4) | ✗ always 32 |
| Grid row alignment | text column `self-center` | `items-center` on the grid | ✓ |
| content/stack-gap (text column) | 24 / 24 / 20 | `gap-6` (or `gap-xbg`, which is 24/24/20) | ✓ 24 (20 on mobile optional — use `gap-xbg` to follow the mode) |
| Media box | 544 × 340 (8:5), radius/lg 12 | `aspect-[8/5]`, `rounded-md` (12) | ✗ 544 × 306 (16:9) |

Section height check at 1440: 96 + 340 + 96 = **532** (Figma) vs **498** now; the 34px difference is the media aspect.

## 2. Text nodes

| Node | Copy (verbatim) | Style | Code | Colour |
|---|---|---|---|---|
| 130:5580 Heading | "High impact creative " + *"across every channel."* | Display/Large 60/64, tracking −1, Instrument Serif; italic run = Display/Large/Italic | `<Heading.Display>` (renders `h2`, `font-serif text-display`) + `<Em>across every channel.</Em>` | text/primary #f9f9f9 → `text-paper` (inherited from Section) |
| 130:5581 Description | "Deliver attention-grabbing campaigns across the channels your audience uses every day. Strengthen your brand with consistently strong creative designed to make an impact." | Body/Medium 16/24, Golos Regular, tracking 0 | `<Paragraph>` (`text-p-md`) | `text-paper` |
| 130:5582 Description | "Launch standout campaigns and content that perform on every platform." | Body/Medium 16/24 | `<Paragraph>` | `text-paper` |

All three match code already (copy, italic phrase, sizes 60/64 → 48/56 → 36/40 via the Tablet/Mobile `--text-display` overrides; measured 60/64, 48/56, 36/40). Contrast Paper on Ink/Forest ≫ 4.5:1 ✓.

## 3. Media slot (assets)

Figma shows a grey image placeholder ("Modern marketing team", 544 × 340, radius 12). Per the owner rule, the slot keeps the **existing `VideoLightbox` showreel**, sized and shaped to Figma's box:

- `src` = R2 showreel `11&1_Creative Showreel_2026_il_Final_2.mp4` (KEEP), `poster` = `/images/sections/performance-showreel.avif` (KEEP), `title`, `cta="Watch the 2026 showreel"`, `id="performance-showreel"`, `trackLocation="performance"` (KEEP, GTM tracking).
- Box: full column width (544 at 1440), **aspect 8:5** (→ 340 tall at 544), `rounded-md` (12) + `overflow-hidden` (already on the trigger), `bg-ink` while loading.
- Video inside fills the box with `object-cover` (crops ~5% left/right of the 16:9 reel in the inline preview only; the lightbox plays the full 16:9 film).
- KEEP (real media affordance, not in the Figma placeholder): bottom gradient scrim `from-ink/70 via-ink/10`, Volt 56px play disc (48 on portrait) + "Watch the 2026 showreel" label in `text-p-sm font-semibold text-paper`, `p-xbg` inset. Reason: the trigger needs a visible call to action and accessible name; the play disc is ≥40px.

## 4. Responsive

Figma has no Tablet/Mobile frame for this section; values come from the variable modes (Layout grid/gutter 32/24/16, spacing/xl 24/24/20, Display/Large 60/48/36, page gutter 40/24/16, p-bg 96/64/48).

| Range | Layout |
|---|---|
| > 992 (Desktop) | 2 columns, gap 32, media 8:5 |
| 769–992 (Tablet mode) | 2 columns, gap **24** (`tablet:gap-6`), heading 48/56, media 8:5 of its column (e.g. 381 × 238 at 834) |
| ≤ 768 (`landscape:`) | KEEP stacking to 1 column (`landscape:grid-cols-1`; two 350px columns are too narrow for a 48px display heading). Text first, media below (DOM order). Stack gap = content/stack-gap → `landscape:gap-xbg` (24, 20 at ≤480). Media full width, 8:5 |
| ≤ 480 (Mobile mode) | as above; heading 36/40, gutter 16, section pad 48 — all from tokens already |

## 5. Interactive states to keep (VideoLightbox)

- Trigger is a Base UI `Dialog.Trigger` `<button>`: hover scales the video 1.03 (900ms `ease-glide`) and the play disc 1.05; `focus-visible:outline-2 outline-offset-[3px] outline-paper`.
- Inline preview: muted, looping, inline, plays only while on screen and pauses while the lightbox is open (`useAmbientVideo`).
- Click → player morphs out of the preview box (translate + uniform scale, 0.62s), backdrop `bg-ink/90 backdrop-blur-[3px]` fades in (0.4s); close (button, Escape, backdrop click) morphs back (0.5s) or fades if the preview has scrolled off screen. `VideoPlayer` with sound/controls, `Dialog.Close` 44px "Close video".
- `data-track="play_showreel"` + `data-track-location`.
- No reduced-motion gating is to be added (owner decision). The existing `useReducedMotion()` in the lightbox is out of scope here; leave it as is.

Morph note: the preview becomes 8:5 while the player stays 16:9, so "both boxes are 16:9" no longer holds. Scale the player to **fit** the preview (`Math.min` of width and height ratios). For 8:5 that is the width ratio, i.e. identical to today's maths: the player starts/ends 544 × 306 centred on the 544 × 340 box. Nothing is stretched, and the 17px bands are covered by the fading backdrop.

## 6. DIFF — current code → required

1. **`src/sections/performance.tsx:14`** — `className="grid grid-cols-2 items-center gap-8 landscape:grid-cols-1"` → `"grid grid-cols-2 items-center gap-8 tablet:gap-6 landscape:grid-cols-1 landscape:gap-xbg"` (grid/gutter 32/24; stacked gap content/stack-gap 24/20). Optionally update the comment on line 13 to "Two equal columns (grid/gutter 32/24), copy centred against the 8:5 showreel."
2. **`src/sections/performance.tsx:24-31`** — add `className="aspect-[8/5]"` to `<VideoLightbox>` (Figma media 544 × 340, radius 12 → `rounded-md`, already the trigger default).
3. **`src/components/video-lightbox.tsx:117-118`** — trigger classes: add a default `aspect-video` (so the component still defaults to 16:9 and the caller's `aspect-[8/5]` overrides it via tailwind-merge): `'group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-md bg-ink outline-none focus-visible:…'`. Update the prop doc on line 30 to "Classes for the trigger — it sizes itself to them (16:9 unless an `aspect-*` class overrides; the preview covers it)."
4. **`src/components/video-lightbox.tsx:127`** — video: `'block aspect-video w-full object-cover …'` → `'absolute inset-0 block size-full object-cover transition-transform duration-[900ms] ease-glide group-hover:scale-[1.03]'` so it fills whatever aspect the trigger has (the trigger is already `relative`; the scrim and caption spans are already absolute and stay on top by DOM order).
5. **`src/components/video-lightbox.tsx:76`** — morph scale: `scale: box.width / popup.offsetWidth` → `scale: Math.min(box.width / popup.offsetWidth, box.height / popup.offsetHeight)` (fit, never overflow the preview when its aspect differs from the 16:9 player). Update the docblock on lines 48-50 to say the player fits inside the preview box (same aspect → exact morph; different aspect → fitted, centred).

KEEP (no change):
- `bg-night-low` on the section (owner decision; foundations §3 lists `bg-night` for row 4, but the section brief says keep `bg-night-low`, which is what code has).
- Heading/Paragraph components, copy, `<Em>` phrase, `text-paper` (all match Figma).
- Hidden Figma "Button — default" → no button in code.
- Play disc, CTA label, gradient scrim, hover zoom, lightbox player behaviour (real media affordance + accessibility).
- Showreel source, poster and GTM ids.

Required changes: **5**.
