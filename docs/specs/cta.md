# Spec: CTA band (`cta`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, page `130:5279`. Desktop is the Section instance **`221:1924`** in the home frame (y 8191, 1440 × 333.47). Mobile is **`221:1968`** (320 wide, beside the frame). The seats are the component set **`221:1886`** (in frame `221:1840`): 8 Types × 2 Layers.
Code: `src/sections/cta.tsx`, `src/utils/session-seat.ts`, and `public/images/cta/seats/`. The section is mounted in `src/pages/index.astro` with `client:idle`.

This replaces the earlier two-column collage on Volt (`130:5744`).

---

## 1. Structure and layout (Desktop 1440)

```
<section id="contact">         Section on theme/brand-soft #d7ef81 (bg-soft-volt), NO section padding, clips its content
  Container (1200 incl. 40 gutters → 1120)
    Grid 221:1916              5 × minmax(0,1fr), column gap 32 (198.4 per column), 1 row
      Col 1–3 "Channel introduction" 221:1917   659.2 wide, flex-col, gap spacing/xl 24, justify-center,
                                                py layout/section-padding-y = 64 (code: --section-pad-md 64/48/32)
        h2  Heading 221:1918      y 78.73, 1 line (64)
        p   Description 221:1919  y 166.73, 1 line (24), text-pretty
        a   Button 221:1920       y 214.73, 135 × 40, Appearance=Inverse (Ink fill)
      Col 4–5 "Frame 8" 221:1921  428.8 × 333.47 (aspect), the tallest cell, so it sets the row height
        Seats, Layer=Background 221:1922   square, left −13.81%, right −25.42%, top −67px, mix-blend-multiply
        Seats, Layer=Foreground 221:1923   same box, normal blend
```

Section height = the image column = **333.47**. The text column (304 of content and padding) stretches to it and centres its content, which puts the heading at y 78.73. The seat box is 597 square at x 792, y −67. The section clips it, so the top 67px and everything below 333 are hidden. The chair is cut off at the band's bottom edge.

Code mapping:

| Figma | Code |
|---|---|
| Section, brand-soft, padding 0 | `<Section pad="none" className="overflow-hidden bg-soft-volt text-ink">` |
| Grid 5 cols, gap-x 32 | `grid grid-cols-5 gap-x-8 tablet:gap-x-6` |
| Text col span 3, py 64, gap 24, centred | `col-span-3 flex flex-col items-start justify-center gap-xbg py-[var(--section-pad-md)]` |
| Image col span 2, aspect 428.8 / 333.47 | `relative col-span-2 aspect-[428.8/333.47] self-end` |
| Seat box | `absolute -top-[4.1875rem] -left-[13.81%] -right-[25.42%] aspect-square pointer-events-none` |

## 2. Text

| Node | Copy | Style | Code |
|---|---|---|---|
| Heading | `The simple way to get creative.` | Display/Large 60/64 −1 (48/56 Tablet, 36/40 Mobile) | `<Heading.Display>` (no `text-pretty`: Figma Mobile breaks "…to get / creative.") |
| Description | `Design, illustration and animation for marketing teams that need more capacity.` | Body/Medium 16/24, text-pretty | `<Paragraph className="text-pretty">` |
| Button | `Book a demo` | Button Appearance=Inverse: neutral-950 fill, neutral-50 label | `LinkButton` default `primary` variant. Keep `id="cta-book-demo"`, `data-track="book_demo_click"`, `data-track-location="cta"` |

## 3. Seats

Figma's Seats set has eight Types: Director, Manager, Copywriter, Illustrator, Designer, Animator, Strategist and Developer. Each Type has a Background layer and a Foreground layer.

- **Background**: `mix-blend-multiply`. A white studio shot of the chair (its white drops out on the band, but its floor shadow stays), with the cut-out chair over it.
- **Foreground**: the cut-out chair at normal blend, so it keeps its true colour.
- **Animator** (glass chair): both layers are at 80% opacity, as in Figma. The opacity is baked into its renders.

Assets: `public/images/cta/seats/<seat>-{background,foreground}.avif`, one 1080 × 1080 image per layer. Each is the Figma component (resized to 1080 in Figma), rendered on its own with a transparent background. Figma's plain export paints the parent frame's Soft Volt behind it, and that would hide the background layer's shadow. The background renders are flattened onto white, which looks the same under multiply. The foreground renders keep their alpha. Encoded as AVIF at quality 80 with 4:4:4 chroma: 23–52KB each, 42.8 dB PSNR against Figma's PNG. There is a single size, because the seat is drawn at 500–600 CSS px and that needs at least 1080 on any 2× screen.

**Deviation: Illustrator.** Figma places it higher than the others (top −28.77%), which puts the mannequin's head at 5% of the square. The band's top edge clips that (−67px is about 11% of the square), and on phones it would overlap the button. Both of its renders are moved down 10% (108px), so its top sits at about 15%, level with the other seats. All other seats are Figma's renders unchanged.

## 4. A new seat every session

`sessionSeat()` in `src/utils/session-seat.ts` picks the seat:

- Every new browser session (a new tab or window) gets a new seat. The seat is kept in `sessionStorage` (`cs-seat`), so reloads and navigation within the session keep it.
- Seats are dealt from a shuffled deck kept in `localStorage` (`cs-seat-deck`: `{ deck, last }`). A returning visitor sees all eight before any comes back. A fresh deck never opens on the seat the last one ended on, so no seat appears two sessions in a row. A simulation of 4,000 sessions found no back-to-back repeats, every block of eight held all eight seats, and reloads were stable.
- Where storage is blocked (private mode, site data off), it picks at random.
- The pick is cached for the page load, so `useSyncExternalStore` reads a stable value.

The page is prerendered, so a pick made at build time would be the same for everyone. The pick happens in the browser instead, through `useSyncExternalStore` with a `null` server snapshot. The server HTML has an empty seat column, so hydration matches. Once both images have loaded, the seat fades in over 500ms. The fade is set on each layer rather than on a wrapper, because a translucent wrapper would isolate the multiply and flash the white plate. The island uses `client:idle`, so the seat is picked and its images are queued before the visitor scrolls down. Without JavaScript, the band shows no chair. It is decorative (`aria-hidden`), so nothing is lost.

## 5. Responsive

| Range | Layout |
|---|---|
| > 992 | As §1 |
| ≤ 992 (`tablet:`) | Same five-column split, gap-x 24, heading 48/56 (two lines at 834). The text column can be taller than the image column. The image column then sits at the bottom of the row (`self-end`), so the chair still bleeds off the bottom edge |
| ≤ 768 (`landscape:`) | One column, the seat below the text (as Figma Mobile `221:1968`). The image column is capped at 28rem. Text padding is 48 → 32 (`--section-pad-md`), and the gap is 24 → 20 (`gap-xbg`) at ≤ 480. The seat's top 67px overlaps the text column's bottom padding, which is transparent there. `pointer-events-none` keeps the button clickable |

Measured at 1440: section 333.45, heading y 78.72, description y 166.72, button y 214.72 (134.6 × 40), column 428.8 × 333.45 at x 851.2, seat box 597 at (792, −67).
Measured at 390: one column, pill 44 tall, seat box 498, no horizontal scroll.
Every chair's visible pixels fall inside its own column horizontally: 16–81% of the square, against a column of 9.9–81.7%. So no chair is clipped at the sides or reaches into the text column.
