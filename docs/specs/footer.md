# Footer — build spec

Figma: file `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, instance **`130:5745` "Footer"** (1440 × 343.7) of component **`37:1992` "Footer"** on the Components page (one variant only, no Tablet/Mobile variants, no component properties).
Code: `src/sections/footer.tsx` (+ `src/components/wordmark.tsx`, `public/images/icons/{facebook,instagram}.svg`).
Evidence: Figma 1x `…/scratchpad/sections/footer/figma.png`; current code `…/scratchpad/sections/footer/code-1440.png`, `code-820.png`, `code-390.png`; Figma assets `…/scratchpad/sections/footer/assets/` (`a3b8f.svg` Facebook, `8cd69.svg` Instagram, `032c8.svg` 11&1, `union.svg` big wordmark).
(scratchpad = `/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad`)

Measured at 1440: Figma footer is **343.7px** tall; the code footer is **427px**. The extra 83px comes from the top row (64 instead of 56) and the big wordmark (uncropped 146px plus 32px bottom padding, where Figma crops it to 102.7px and adds no bottom padding).

---

## 1. Structure (Figma → code)

```
footer  bg-ink text-paper, padding-top var(--section-pad) [Figma size/spacing/5xl 96]
└─ Container (1120 column; Figma Container max-w 1200, px page/gutter 40)
   ├─ Row A  flex, items-center, justify-between, height 56 (py 20 around a 16px line; with code's 24px icons → py-4)
   │   ├─ LEFT   Figma: template copyright "© 2026 saypien GmbH · Berlin & Frankfurt"  → KEEP code: Wordmark home link w-[120px] (16px tall)
   │   └─ RIGHT  flex items-center gap 24 (layout/content-stack-gap)
   │        ├─ nav  flex items-center gap 16 (layout/content-inline-gap), height 16
   │        │     links text 12/16, Paper
   │        ├─ divider  1 × 24, fill theme/border/default = Paper @ 30%
   │        └─ socials  flex gap 16, two 24×24 icons (Facebook, Instagram)
   ├─ Row B  border-top 1px theme/border/default (Paper @30%), pt 16 (size/spacing/lg), pb 24 (size/spacing/xl), flex justify-between items-center
   │   ├─ LEFT  flex items-center gap 12 (size/spacing/md): 11&1 logo 39.5×15 + text 12/16
   │   └─ RIGHT copyright text 12/16
└─ Container (wordmark band) pt 32 (size/spacing/2xl), pb 0
   └─ Logo box  width 1120, height 102.7 (aspect 1025/94), overflow clip, layer opacity 15%
        └─ Union (wordmark) width 1120, height 136.36, top 0, cropped at the bottom by the box (bottom −32.76%)
             fill: linear gradient top→bottom, Paper @80% → Ink; stroke 2px INSIDE, Paper
```

Footer total height = 96 + 56 + 57 (1 + 16 + 16 + 24) + 32 + 102.7 = **343.7** ✓.

## 2. Text nodes

All text: Figma Inter Regular 12 / 16, tracking 0, `theme/text/primary` #f9f9f9 → code **`text-p-xs` (Golos 12/16) `text-paper`**. No italics anywhere in the footer.

| Figma node | Figma copy | Code copy | Decision |
|---|---|---|---|
| 37:1903 | "© 2026 saypien GmbH · Berlin & Frankfurt" | (Wordmark link instead) | **KEEP code** (template leftover, owner: don't copy template text; the Wordmark link home fills the slot) |
| 37:1907 | Services | Services | ✓ |
| — | — | Our work | **KEEP** (real section link; foundations/audit decision) |
| 37:1909 | Resources | FAQs | **KEEP "FAQs"** (no Resources page; `/#resources` is the FAQ section — audit decision) |
| 37:1911 | Pricing | Pricing | ✓ |
| 37:1913 | Book a demo | Book a demo | ✓ |
| 37:1994 | Cookie settings | Cookie settings (button) | ✓ |
| 37:1951 | "A product of  11&1 · Built to GDPR requirements" | "A product of 11&1" | **KEEP code** (GDPR clause is template text; owner) |
| 37:1999 | "© 2026 Creative Seat. All rights reserved." | `© {year} Creative Seat. All rights reserved.` | ✓ (dynamic year KEEP) |

Font family: **KEEP Golos** (`font-sans`), owner rejected Inter.

## 3. Tokens: every value

| Property | Figma (variable) | Code token |
|---|---|---|
| Footer background | theme/background/page #181b1e (Dark) | `bg-ink` ✓ |
| Footer top padding | size/spacing/5xl 96 | `style={{paddingTop:'var(--section-pad)'}}` ✓ (96/64/48 by breakpoint) |
| Column | Container max 1200, px page/gutter 40 → 1120 | `<Container>` ✓ |
| Row A height | 56 (py size/spacing/xl 20 around 16px text) | `py-4` (16 + 24px social box + 16 = 56) |
| Row A right cluster gap | layout/content-stack-gap 24 | `gap-x-6` ✓ |
| Nav gap | layout/content-inline-gap 16 | `gap-x-4` ✓ |
| Vertical divider | 1×24, theme/border/default `#f9f9f94d` (Paper 30%) | `h-6 w-px bg-paper/30` |
| Social gap | 16 | `gap-4` ✓ |
| Social icon | 24×24, fill #F9F9F9 | `size-6`, Figma asset (see §6) |
| Row B border | size/border/default 1, theme/border/default Paper 30% | `border-t border-paper/30` |
| Row B padding | pt size/spacing/lg 16, pb size/spacing/xl 24 | `pt-4 pb-6` ✓ |
| 11&1 → text gap | size/spacing/md 12 | `gap-3` ✓ |
| 11&1 logo | 39.52 × 15 | `h-4 w-auto` (renders 39 × 16) — **KEEP** (brand-supplied asset; 1px difference) |
| Wordmark band | pt size/spacing/2xl 32, pb 0 | `pt-8` (no pb) |
| Wordmark crop box | 1120 × 102.71, aspect 1025/94, clip | `relative aspect-[1025/94] overflow-hidden` |
| Wordmark layer opacity | 15% | `opacity-15` on the crop box |
| Wordmark fill | linear gradient (vertical, glyph bbox) stop 0 `#F9F9F9` @ 0.8, stop 1 `#181B1E` | gradient stops `var(--color-paper)` opacity .8 → `var(--color-ink)` |
| Wordmark stroke | 2px, inside, `#F9F9F9` | inner stroke `currentColor` (= Paper), 2px inside |
| Radii / shadows | none | none |

## 4. Components / variants

- Figma `Footer` component (37:1992): single variant, Theme = Dark. No Code Connect.
- Instances inside: `Facebook` (37:2007) and `Instagram` (37:2010) 24px icon components.
- Code components: `Container` (width `max`), `Wordmark` (gets a new `fade` variant, §5 change 5). No Heading/Paragraph/LinkButton used (12px links are plain anchors with the `LINK` hit-area class).

## 5. Big wordmark — exact build

Figma's Union is the wordmark glyphs' tight bounding box (aspect 140 / 17.0446 = 8.214). The code `Wordmark` viewBox `80 80 1004 131` carries ~5 units of padding on every side (glyph bbox is x 85.478→1078.71, y 85.311→206.233), so at `w-full` it renders 146px tall with glyphs inset ~6px. The fade variant must use the **tight viewBox `85.478 85.311 993.232 120.922`** → at 1120 wide it is 136.36 tall, exactly Figma's Union.

`src/components/wordmark.tsx` — add an optional `fade?: boolean` prop:

```tsx
export default function Wordmark({ className, fade = false }: { className?: string; fade?: boolean }) {
  const id = useId()
  if (!fade) return (/* unchanged solid svg */)
  return (
    <svg viewBox="85.478 85.311 993.232 120.922" aria-hidden className={cn('block h-auto', className)}>
      <defs>
        {/* Figma: Paper @80% at the top of the glyphs → Ink at the bottom */}
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--color-paper)', stopOpacity: 0.8 }} />
          <stop offset="1" style={{ stopColor: 'var(--color-ink)' }} />
        </linearGradient>
        <clipPath id={`${id}c`}><path d={PATH} /></clipPath>
      </defs>
      <path d={PATH} fill={`url(#${id}g)`} />
      {/* 2px inside stroke: a 4px stroke clipped to the glyphs */}
      <path d={PATH} fill="none" stroke="currentColor" strokeWidth={4} vectorEffect="non-scaling-stroke" clipPath={`url(#${id}c)`} />
    </svg>
  )
}
```
(`gradientUnits` default objectBoundingBox = glyph bbox, matching Figma's gradient y 0 → 124.79 over the full Union height, not the cropped box.)

Footer markup (replaces L71-73):

```tsx
<div aria-hidden className="pt-8">
  <div className="relative aspect-[1025/94] overflow-hidden text-paper opacity-15">
    <Wordmark fade className="absolute inset-x-0 top-0 w-full" />
  </div>
</div>
```
The crop box scales with the column, so the same ~75% crop holds at every width.

## 6. Assets per slot

| Slot | Figma | Code now | Required |
|---|---|---|---|
| Top-left | template copyright text | `Wordmark` w-120 link to "/" | KEEP |
| Facebook | 24px **circle "f"** logo, fill #F9F9F9 (`assets/a3b8f.svg`) | 16px-viewBox bare "f" drawn #111, inverted by CSS filter | Replace `public/images/icons/facebook.svg` with the Figma glyph (copy `assets/a3b8f.svg`, strip `preserveAspectRatio="none" overflow="visible" style="display: block;"` and the `id` attrs; keep `viewBox="0 0 24 24"` and `fill="#F9F9F9"`) |
| Instagram | 24px rounded-square glyph, #F9F9F9 (`assets/8cd69.svg`) | 16px glyph drawn dark, inverted | Replace `public/images/icons/instagram.svg` with `assets/8cd69.svg`, same cleanup |
| 11&1 | `assets/032c8.svg` 39.5×15 (incl. tiny ® mark) | `/images/brands/11and1.svg` | KEEP code asset (brand-supplied; matches within 1px) |
| Big wordmark | `assets/union.svg` (gradient + inner stroke) | `Wordmark` solid `text-paper/15` | Draw from `Wordmark fade` (§5) — do not ship the Figma SVG (keeps the single brand path source) |

`socials` in `src/content/sections.ts:205-208` keep their `icon` paths (files are overwritten in place); the unused `size: 'size-4'` field may stay.

## 7. Responsive

Figma has no Tablet/Mobile footer frames; variable modes that bind here:
- `--section-pad` 96 / 64 / 48 for the top padding — KEEP (already).
- Container gutter 40 / 24 / 16 — KEEP (already).
- content/inline-gap 16/16/12 and stack-gap 24/24/20: **KEEP 16 and 24 at all widths** in the footer (the 40px hit areas extend 8px either side of each link; tighter gaps would overlap them).
- Existing stacking stays: Row A wraps at `tablet:` (`flex-wrap`), goes `flex-col items-start` at `landscape:`, the vertical divider is hidden at `landscape:`; Row B goes `flex-col items-start` at `landscape:`. KEEP.
- Wordmark band: crop box is aspect-locked, so it scales to the column at every width.

## 8. Interactive states to keep

- Links: `-mx-2 -my-3 px-2 py-3` → 40px-tall hit area, text footprint unchanged; `hover:underline underline-offset-4`; `focus-visible:outline-2 outline-paper rounded-sm`.
- Cookie settings: `<button type="button" data-cookie-settings>` reopening the cookie banner — KEEP.
- Socials: `-m-2 size-10 p-2` (40×40 hit, 24 footprint), `hover:opacity-75`, `aria-label={name}`, `target="_blank" rel="noopener noreferrer"` — KEEP.
- Wordmark home link with focus ring — KEEP. All `id` / `data-track*` attributes — KEEP.
- Big wordmark stays `aria-hidden` (decorative).

## 9. DIFF — current code → required

1. **`src/sections/footer.tsx:22`** Row A `py-5` → `py-4` (row height 64 → 56, Figma 56; moves Row B up 8px to y 152).
2. **`src/sections/footer.tsx:39`** divider `bg-paper` → `bg-paper/30` (Figma theme/border/default = Paper @30%).
3. **`src/sections/footer.tsx:62`** `border-paper/20` → `border-paper/30` (same token).
4. **`src/sections/footer.tsx:71-73`** big wordmark: `py-8 text-paper/15` + full `Wordmark` → `pt-8` (no bottom padding) wrapping a `relative aspect-[1025/94] overflow-hidden text-paper opacity-15` crop box with `<Wordmark fade className="absolute inset-x-0 top-0 w-full" />` (§5). Footer height at 1440: 427 → ~344.
5. **`src/components/wordmark.tsx:10-16`** add the `fade` variant: tight viewBox `85.478 85.311 993.232 120.922`, vertical gradient Paper@0.8 → Ink, 2px inside stroke in `currentColor` (§5); default rendering unchanged.
6. **`public/images/icons/facebook.svg`, `public/images/icons/instagram.svg`** replace with Figma's 24px Paper glyphs (Facebook becomes the circle logo) from `scratchpad/sections/footer/assets/a3b8f.svg` / `8cd69.svg`, attributes cleaned (§6).
7. **`src/sections/footer.tsx:54-55`** drop `brightness-0 invert` (icons are now drawn Paper) and update the comment; keep `size-6` and `alt=""`.

Also (non-counted): refresh the doc comment at `footer.tsx:11-16` to describe the cropped, gradient wordmark.

### KEEP list (deliberate)
- Wordmark link in Row A's left slot instead of Figma's "saypien GmbH" template copyright (owner: no template text).
- "Our work" and "FAQs" links (real site nav; Figma "Resources" has no page).
- "A product of 11&1" without "· Built to GDPR requirements" (template text).
- Golos `text-p-xs` instead of Inter (owner).
- 11&1 asset and `h-4` sizing (brand asset, within 1px).
- Dynamic copyright year.
- 16/24 gaps on every breakpoint (40px hit areas), existing wrap/stack behaviour.
