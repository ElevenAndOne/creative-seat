# Spec — Shared foundations (`foundations`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh` — Components page `8:13265` (Button set `8:13431`, Section set `10:1334`, local text styles, variable collections Base / Theme / Size / Layout / Typography) and home frame `130:5280`.
Evidence: `scratchpad/sections/foundations/` — `figma.png` (home, 1x, 1440×8946), `figma-button-set.png`, `code-1440.png`, `code-834.png`, `code-390.png`, `compiled.css` (dev-server Tailwind output).

Code files in scope: `src/index.css` (tokens, base, utilities — not `.cs-quantity`), `src/components/pill.ts`, `link-button.tsx`, `heading.tsx`, `paragraph.tsx`, `em.tsx`, `container.tsx`, `base/section.tsx`, `src/utils/cn.tsx`.

**Hard rule: token NAMES stay as they are** (`text-display`, `text-h1`…, `--spacing-*`, `rounded-sm/md/card/panel`, `--section-pad*`, `--container-*`, `pillClass` variant keys). Only values change, and new names are added.

---

## 1. How Figma modes map to code breakpoints

Figma's Size, Layout and Typography collections each have three modes: **Desktop** (page/width 1440), **Tablet** (834) and **Mobile** (390). Layout `container/content/max-width` is 1200 / 960 / 480, which lines up with the code's own breakpoints:

| Figma mode | Applies in code | Media query (plain CSS, overriding `:root` vars) | Tailwind variant |
|---|---|---|---|
| Desktop | base (no query) | — | unprefixed |
| Tablet | ≤ 992px | `@media (max-width: 62rem)` | `tablet:` |
| Mobile | ≤ 480px | `@media (max-width: 30rem)` | `portrait:` |

Between 481 and 768px (the `landscape:` range) the Tablet values apply. Use **stepped** values (the Figma modes are discrete), not fluid `clamp()`. Tailwind v4 compiles `text-*`, `p-*`, `gap-*` and `rounded-*` to `var(--token)` (checked in `compiled.css`, e.g. `.text-display { font-size: var(--text-display); line-height: var(--tw-leading, var(--text-display--line-height)) }`). So **redefining the variables on `:root` inside the two media queries is enough**. Put the overrides **outside** `@theme`, because `@theme` cannot hold `@media`. They are unlayered, so they beat Tailwind's `@layer theme` `:root`.

Measured now (from code). Desktop matches Figma; Tablet and Mobile do not:

| Token | 1440 (code = Figma) | 834 code → Figma Tablet | 390 code → Figma Mobile |
|---|---|---|---|
| text-display | 60/64 | 53.2/56.7 → **48/56** | 45.3/48.3 → **36/40** |
| text-h1 | 48/56 | 41.5/48.4 → **36/44** | 36.7/42.9 → **30/36** |
| text-h2 | 36/44 | 32.8/40.0 → **30/40** | 30.4/37.1 → **30/36** |
| text-h3 | 24/32 | 21.8/29.1 → **24/32** | 20.3/27.0 → **20/28** |
| page gutter | 40 | 29 → **24** | 21.5 → **16** |
| section pad (p-bg) | 96 | 82.4 → **64** | 66.5 → **48** |
| pill height | 40 | 40 → **44** | 40 → **44** |

---

## 2. Variables → code tokens

### 2.1 Base colours (collection "Base", one mode)

| Figma variable | Value | Code token | Status |
|---|---|---|---|
| color/neutral/400 | #181b1e | `ink` (`--color-ink`) | ✓ |
| color/neutral/100 | #f9f9f9 | `paper` | ✓ |
| color/neutral/200 | #e6e6e6 | `chalk` and `line` | ✓ |
| color/neutral/300 | #5b655f | `muted` | ✓ |
| color/forest/400 | #212c26 | `forest` | ✓ |
| color/lime/200 | #bce42d | `volt` | ✓ |
| color/lime/100 | #d7ef81 | `soft-volt` | ✓ |
| color/static/white #ffffff, color/static/black #000000 | — | none (Tailwind white/black are dropped on purpose) | KEEP (brand guide: no off-palette colours; on the home page white is only used inside vector logos/icons, which ship as assets) |
| color/lime/400 #405309, lime/300 #7fa20f, forest/300 #2a4434, forest/200 #426b51, forest/100 #d9e8de | — | none | KEEP absent (none of them is used anywhere on the home frame; brand guide forbids extra tints) |
| `color/on-surface` #14121a (from a library outside this file, 18 Expertise pill labels) | — | `ink` | Map to `text-ink` (ΔE is tiny; no new token) |
| raw #d7ef81 on List Item fills | — | `soft-volt` | ✓ |
| `--color-flare` #f2691d | (calculator Figma, not a variable) | `flare` | KEEP (calculator over-budget warning only) |

### 2.2 Theme (modes Light / Dark) — semantic roles. No new tokens: sections use these mappings

| Figma role | Light → code | Dark → code (hero, benefits, performance, expertise, footer) |
|---|---|---|
| background/page | `bg-paper` | `bg-ink`. **KEEP `bg-night` / `bg-night-low` on hero, performance and benefits** (owner decision) |
| background/subtle, surface/sunken | `bg-chalk` | `bg-ink` (Figma's static black is not a brand colour) |
| background/inverse | `bg-ink` | `bg-paper` |
| surface/default, surface/raised | `bg-paper` | `bg-ink` / `bg-forest` |
| surface/selected, brand/soft | `bg-soft-volt` | `bg-forest` |
| text/primary | `text-ink` | `text-paper` |
| text/secondary, text/muted | `text-forest` (#212c26 — this is what Figma uses for prices, rates and secondary labels) | `text-chalk` |
| (neutral/300 used directly, e.g. footer column labels) | `text-muted` (5.2:1 on Paper, passes AA) | — |
| text/disabled | `text-chalk` on Paper fails AA (1.2:1) → **use `text-muted`** for disabled *text* (DEVIATION, recorded) | `text-forest` on Ink also fails → `text-paper/60` |
| text/inverse | `text-paper` | `text-ink` |
| text/on-brand | `text-ink` on Volt | `text-ink` |
| text/link / link-hover | `text-forest` → `hover:text-ink` | `text-soft-volt` → `hover:text-volt` |
| border/subtle | `border-line` (#e6e6e6) | `border-forest` |
| border/default (`text/primary` @30%) | `border-ink/30` | `border-paper/30` |
| border/strong (@45%) | `border-ink/45` / `bg-ink/45` | `border-paper/45` |
| border/focus | Forest. **KEEP the code's ring** (`outline-2 offset-4` in currentColor / ink / paper): Ink on Paper is stronger than Forest and stays consistent | Volt. KEEP the Paper ring (the pills set `focus-visible:outline-paper`) |
| brand/primary | `bg-volt` | `bg-volt` |
| action/primary bg / hover / fg | `bg-volt` / `hover:bg-soft-volt` / `text-ink` → pill variant `brand` (new, §4) | same |
| action/secondary bg / hover / pressed / fg | Forest / Ink / Black / Paper. Code `primary` is Ink with a Forest hover, i.e. the same pair reversed. **KEEP** (the Button set's "Inverse" variant, which the home page actually uses, is Ink-filled) | same |
| action/disabled bg / fg | `bg-chalk` / `text-forest` (10.9:1, passes) → pill disabled state (§4) | `bg-forest` / `text-chalk` |
| selection/background / foreground | `::selection { bg soft-volt; color ink }` (new, D9) | Forest / Paper. One global rule is enough: soft-volt + ink reads on every surface |

Shadows and effect styles: **none** in the file (no effect styles, no effects on the home frame), so add no shadow tokens. Gradients: only the marquee mask (linear black 0→16%→83%→100%) = `.cs-marquee` mask ✓, and one decorative "Union" vector (Paper→Ink) that ships as an asset.

### 2.3 Size (Desktop / Tablet / Mobile)

**Spacing.** Figma name → code token (names differ; keep the code names). The value columns are Desktop / Tablet / Mobile in px.

| Figma | D / T / M | Code token today | Required |
|---|---|---|---|
| spacing/none | 0 | `0` | ✓ |
| spacing/2xs | 2 | `xxxsm` 0.125rem | ✓ |
| spacing/xs | 4 | `xxsm` 0.25rem | ✓ |
| spacing/sm | 8 | `xsm` 0.5rem | ✓ |
| spacing/md | 12 | `sm` 0.75rem | ✓ |
| spacing/lg | 16 | `md` 1rem | ✓ |
| spacing/xl | 24 / 24 / 20 | `xbg` clamp(22→24) | **1.5rem / 1.5rem / 1.25rem** (D7) |
| spacing/2xl | 32 / 28 / 24 | `xxxbg` clamp(28→32) | **2rem / 1.75rem / 1.5rem** (D7) |
| spacing/3xl | 48 / 40 / 32 | `xlg` clamp(40→48) | **3rem / 2.5rem / 2rem** (D7) |
| spacing/4xl | 64 / 48 / 40 | `xxlg` clamp(56→64) | **4rem / 3rem / 2.5rem** (D7) |
| spacing/5xl | 96 / 64 / 48 | `hg` clamp(80→96) | **6rem / 4rem / 3rem** (D7) |
| spacing/6xl | 128 / 96 / 64 | `xhg` clamp(104→128) | **8rem / 6rem / 4rem** (D7) |
| (no Figma equivalent) | — | `bg`, `xxbg`, `lg`, `xxxlg`, `xxhg`, `xxxhg` | KEEP as they are (in use by sections; not Figma tokens) |

Tailwind's default `--spacing: 0.25rem` stays, so numeric classes (`gap-3`, `px-6`, `h-10`) still work. Sections may use either the named or the numeric form. Figma's raw gap of 10 (16 "Frame 1" nodes) = `gap-2.5`.

**Radii.** Figma → code (the code's names are one step off Figma's; KEEP the names):

| Figma | D / T / M | Code |
|---|---|---|
| radius/xs 2, radius/sm 4 | 2 / 4 | Not used on the home frame, so add nothing (`rounded-sm` already means Figma md 8: KEEP) |
| radius/md | 8 | `rounded-sm` (0.5rem) ✓ — used on 40 nodes (benefit illustrations, tiles) |
| radius/lg | 12 | `rounded-md` (0.75rem) ✓ |
| radius/xl | 16 | `rounded-card` (1rem) ✓ — credit planner |
| radius/2xl | **24 / 20 / 16** | `rounded-panel` 1.5rem fixed → **1.5rem / 1.25rem / 1rem** (D8) |
| radius/full | 9999 | `rounded-full` / `rounded-round` ✓ |
| `--radius-planner`, `--radius-frame` (1.5rem) | — | KEEP (planner isn't referenced; `rounded-frame` is the booking page frame) |

**Borders:** border/hairline and border/default = 1px (`border`); border/strong = 2px (`border-2`). ✓ No tokens needed.
**Icons:** 16 / 20 / 24 / 32 → `size-4 / size-5 / size-6 / size-8`. ✓
**Controls:** control/sm 32 (`h-8`); **control/md 40 / 44 / 44** → pill height (D12); control/lg 48 (`h-12`); control/touch-minimum 44, which matches the ≥40px tap-target rule ✓.
**Avatars:** 24/32/40/48/64 → `size-6/8/10/12/16`.

### 2.4 Layout (Desktop / Tablet / Mobile)

| Figma | D / T / M | Code | Required |
|---|---|---|---|
| container/content/max-width | 1200 / 960 / 480 (incl. gutters) | `--container-max-width: 70rem` (1120 content) + `--container-margin` | Desktop ✓. KEEP fluid width below desktop: the 960/480 caps never bind at the 834/390 frames, and capping to 480 at 481–768px would waste space |
| container/wide/max-width | 1440 / 1024 / 480 | `--container-wide-width` 70rem | KEEP (no wide container on the home frame) |
| container/narrow/max-width | 720 / 640 / 320 | `--paragraph-max-width` 48rem | KEEP (not used on the home frame) |
| page/gutter | **40 / 24 / 16** | `--container-margin` clamp(20→40) | **2.5rem / 1.5rem / 1rem** (D5) |
| section/p-bg | **96 / 64 / 48** | `--section-pad` clamp(64→96), and `-bg`, `-md`, `-sm` all alias it | `--section-pad` and `--section-pad-bg` = **6rem / 4rem / 3rem** (D6) |
| section/p-md | **64 / 48 / 32** | (aliased to 96) | `--section-pad-md` = **4rem / 3rem / 2rem** (D6) |
| section/p-sm | **32 / 24 / 16** | (aliased to 96) | `--section-pad-sm` = **2rem / 1.5rem / 1rem** (D6) |
| grid/gutter | 32 / 24 / 16 | — | No token; sections write `gap-8 tablet:gap-6 portrait:gap-4` |
| grid/columns | 12 / 8 / 4 | — | No token (sections use explicit `grid-cols-*`) |
| content/stack-gap | 24 / 24 / 20 | — | `gap-xbg` (after D7 it is exactly 24/24/20) |
| content/inline-gap | 16 / 16 / 12 | — | `gap-4 portrait:gap-3` |
| nav/height, nav/padding-x, nav/item-gap | 80/72/64 · 40/24/16 · 24/20/16 | header.tsx | Header section's concern (listed for reference) |
| footer/padding-y, column-gap, row-gap | 80/64/48 · 48/32/24 · 32/24/24 | footer.tsx uses `var(--section-pad)` | Footer section's concern |
| breakpoint/sm…2xl | 640 / 768 / 1024 / 1280 / 1536 | code breakpoints 992 / 768 / 480 | KEEP the code's desktop-first set (§1 mapping) |

### 2.5 Typography (Desktop / Tablet / Mobile), text styles → code

Families: `family/display` = Instrument Serif → `font-serif` ✓; `family/body` = Golos Text → `font-sans` ✓; `family/code` = IBM Plex Mono, used by no text node on the home frame → add nothing. Weights 400/500/600/700/800 → `font-regular|normal / medium / semibold / bold / extrabold` ✓.

Every value below is size/line-height in px. Tracking is −1px wherever Figma says `tracking/tight`, at **all** modes (it is a fixed px value, not em).

| Figma text style (home usage count) | Desktop | Tablet | Mobile | Code token / component | Required |
|---|---|---|---|---|---|
| Display/Large (+ /Italic) (3 + 2 mixed + CTA raw) | 60/64 −1 | 48/56 | 36/40 | `text-display` · `Heading.Display` | D1, D3, D4 |
| Display/Small (+ /Italic) (2 + 6 mixed) | 48/56 −1 | 36/44 | 30/36 | `text-h1` · `Heading.H1` / `Heading` | D1, D3, D4 |
| Heading/H1 (+ /Italic) (3 + 1 mixed; step numbers 02–04, "More ideas made. *Less waiting.*") | 36/44 −1 | 30/40 | 30/36 | `text-h2` · `Heading.H2` | D1, D3, D4 |
| Heading/H1/Sans Extra Bold (prices "$2,400") | 36/44 −1 | 30/40 | 30/36 | `text-h2 font-sans font-extrabold` | inherits D1/D3/D4 |
| Heading/H2 (serif 30/40) | 30/40 | 30/36 | 24/32 | — | Not on the home frame → no token. KEEP |
| Heading/H3 (serif) (3: "Half seat", "Full seat", "Your monthly seat") | 24/32 | 24/32 | 20/28 | `text-h3 font-serif font-normal` (today `Heading.H3 className="font-serif font-normal"`) | D1, D4 (OPTIONAL O1: `Heading.H3Serif`) |
| Heading/H3/Sans Bold · Sans Regular · /Italic (1 + 2 + 1 mixed) | 24/32 | 24/32 | 20/28 | `Heading.H3` (Golos bold) / `+ font-normal`; the italic part = `<Em className="font-serif">` | D1, D4 |
| Heading/H3/Sans Extra Bold | 24/32 | 24/32 | 20/28 | `text-h3 font-extrabold` | — |
| Heading/H4 (serif 20/28) | 20/28 | 20/28 | 18/24 | — | Not on the home frame. KEEP `text-h4` = Body/Large/Bold |
| Body/Large/Bold (6: project card titles) | 18/28 | 18/28 | 16/24 | `text-h4` · `Heading.H4` | D4 |
| Body/Large | 18/28 | 18/28 | 16/24 | `text-p-lg` · `Paragraph.Big` | D4 |
| Body/Medium (28), Body/Medium/Semi Bold (12) | 16/24 | 16/24 | 16/24 | `text-p-md` · `Paragraph` (`+ font-semibold`) | ✓ |
| Body/Small (18), /Medium (12), /Bold (2) | 14/20 | same | same | `text-p-sm` · `Paragraph.Small` (`+ font-medium` / `font-bold`) | ✓ |
| Caption (20) | 12/16 | same | same | `text-p-xs` · `Paragraph.Caption` | ✓ |
| UI/Button (6) | 14/20 Medium | same | same | `text-ui font-medium` (in `pillClass`) | ✓ |
| UI/Label (6) | 14/20 SemiBold | same | same | `text-ui font-semibold` | ✓ |
| UI/Navigation · /Regular (3) | 14/20 500 · 400 | same | same | `text-ui font-medium` · `text-ui` | ✓ |
| UI/FAQ Question (5) | 14/20 Bold | same | same | `text-ui font-bold` | ✓ |
| Overline | 12/16 SemiBold +1px UPPER | same | same | — (not on the home frame) | KEEP `text-eyebrow` 10px for the booking page |
| Monospace | 14/24 IBM Plex Mono | — | — | — | Not used. Add nothing |
| raw Golos ExtraBold 88 "50/60" (calculator) | — | — | — | calculator section's concern | — |
| raw Inter 12 (footer) | — | — | — | Golos `text-p-xs` | KEEP Golos (owner: no Inter) |

Italic: `Display/Large/Italic`, `Display/Small/Italic`, `Heading/H1/Italic` and `Heading/H3/Italic` are the closing phrase → `<Em>` (Instrument Serif italic is inherited from the serif heading). ✓ `em.tsx` needs no change. Inside a sans `Heading.H3`, pass `className="font-serif font-normal"` to `<Em>`.

---

## 3. Section component (Figma `10:1334`) → `<Section>`

```
Section (COMPONENT_SET, Theme = Default | Surface | Brand)
└─ frame: fill = background/page | surface/sunken | brand/primary, vertical auto-layout, width fixed (1440 on the page), height hug
   └─ Container (SLOT): max-width container/content/max-width (1200), fill width, centred,
      padding T/B = section/p-bg (96), L/R = page/gutter (40)
```

| Figma | Code |
|---|---|
| Theme=Default | `<Section className="bg-paper">` (default body bg). On a Dark-mode instance: `bg-ink text-paper`, or `bg-night` / `bg-night-low` where the owner keeps it |
| Theme=Surface | `className="bg-chalk"` |
| Theme=Brand | `className="bg-volt text-ink"` |
| Container slot | inner `<Container width="max">` = `min(100% − 2·gutter, 70rem)` ✓ |
| padding p-bg default | `pad` default must be **`bg`** (today `md`; D16) |

Home-frame section paddings (Figma → Section props, for the section agents):

| # | Section (first text) | Theme / mode | Pad T / B (Figma var) | Code |
|---|---|---|---|---|
| 1 | Hero "Increase your brand's…" | Default / Dark | 32 / 32 (p-sm) | hero.tsx (custom layout) |
| 2 | Pitch "Designed for *modern marketing teams.*" | Default | 96 / 96 (p-bg) | default |
| 3 | Team "No hiring… *No added complexity.*" | Default | p-bg | default |
| 4 | Performance "High impact creative *across every channel.*" | Default / Dark | p-bg | default + `bg-night` (KEEP) |
| 5 | Benefits "More ideas made. *Less waiting.*" | Default / Dark | p-bg | default + `bg-night-low` (KEEP) |
| 6 | Process | Default | p-bg | default |
| 7 | Testimonials | Surface | p-bg | `bg-chalk` |
| 8 | Expertise "Expertise, on demand." | Default / Dark | p-bg | `bg-ink` |
| 9 | Projects "Trusted by market leaders…" | Default | p-bg | default |
| 10 | Pricing | Surface | 96 / **64 (p-md)**, gap 48 | `padBottom="md"` |
| 11 | Credit calculator "Your next project, *in credits.*" | Surface | **64 (p-md)** / 96, gap 48 | `padTop="md"` |
| 12 | FAQ | Default | 96 / 96 (p-bg) | default (drop `pad="md"`) |
| 13 | CTA "The simple way to get creative." | Brand | 96 / 96 (p-bg) | default (drop `pad="md"`) |
| — | Footer | Dark | footer/padding-y 80 / 64 / 48 | footer.tsx |

---

## 4. Button component (Figma `8:13431`) → `pillClass` / `<LinkButton>`

Shared anatomy (every variant): auto-layout horizontal, **height control/md = 40 (Tablet/Mobile 44)**, padding-x spacing/xl = 24, gap spacing/md = 12, radius/full, label = UI/Button (Golos 14/20 Medium), an "Action icon" (32px Volt circle + 16px arrow-up-right) that is **hidden in every variant** (so no icon in code ✓). Width=Hug → content width (135 for "Book a demo"); Width=Fill → `full` (`flex w-full`, label centred: Figma's space-between with a single visible child renders centred in the set). Neither the set nor the Theme collection defines hover, pressed or disabled *variants*; Theme has `action/*` hover, pressed and disabled colours (§2.2).

| Figma variant | Fill | Stroke | Label | Used on home | `pillClass` variant | Status |
|---|---|---|---|---|---|---|
| Appearance=Default (Hug) | Paper | — | Ink | Hero "Book a demo" (on Dark), CTA "Book a demo" (on Volt) | `inverse` (`bg-paper text-ink hover:bg-soft-volt`) | ✓ (code naming is reversed from Figma's: KEEP the code names) |
| Appearance=Inverse (Hug / Fill) | Ink | — | Paper | Navbar "Book a demo" (Hug); Pricing Full seat "Book a demo" (Fill, 496w); Calculator "Discuss your creative mix" (Fill, 333w) | `primary` (`bg-ink text-paper hover:bg-forest`) | ✓ |
| Appearance=Outline (Fill) | Paper | 1px **Ink** (component) / **neutral-300 #5b655f** (the home-page instance override) | Ink | Pricing Half seat "Book a demo" (Fill) | `outline` (`border border-muted bg-paper text-ink`, hover inverts to Ink) | ✓ KEEP `border-muted`: it matches the instance the page actually uses |
| Appearance=Branded, Width=Hug | Volt (brand/primary) | — | Ink (text/on-brand) | not on home | **missing** → add `brand`: `bg-volt text-ink hover:bg-soft-volt focus-visible:outline-ink` (D14). Volt+Ink 12.6:1 ✓ |
| Appearance=Branded, Width=Fill | Paper | 1px Volt | **Volt on Paper** | not on home | DEVIATION: not implemented. Volt text on Paper is 1.5:1, which fails AA and breaks the brand rule "Volt is never text on a light background". Use `brand` + `full` instead |
| — (code only) | transparent | Paper/60 | Paper | outline on Ink/Forest (no Figma counterpart) | `outline-inverse` | KEEP (needed on dark surfaces, used by sections) |

States the code must keep or add:
- hover: as above (KEEP; Figma's action/secondary hover Forest↔Ink is the same pair). Transition `transform, background-color, border-color, color` 200ms ease-out. KEEP.
- pressed: `active:scale-[0.98]`. KEEP (Figma action/*/pressed = base or black; the scale is the code's press feedback).
- focus-visible: 2px outline, 4px offset, Ink on light / Paper on dark. KEEP.
- **disabled** (new, D13): action/disabled → `disabled:` **and** `aria-disabled:` → `cursor-not-allowed bg-chalk text-forest border-transparent`, with hover and active neutralised (`disabled:hover:bg-chalk disabled:hover:text-forest disabled:active:scale-100`, the same for `aria-disabled:`). Forest on Chalk 10.9:1 ✓. Do not use `enabled:hover:`: `<a>` never matches `:enabled`, so it would kill hover on every LinkButton.
- **tap target**: `h-10 tablet:h-11` (40 → 44, D12) matches control/md Tablet/Mobile and control/touch-minimum.

---

## 5. Page structure (home frame `130:5280`, for reference)

```
Home (1440 × 8945, vertical auto-layout, gap 0)
├─ Navbar (instance Navbar/Version=02, 72h, absolutely over the hero)  → sections/header.tsx
├─ Main (vertical, 13 × Section instances, see §3 table)                → src/pages/index.astro
└─ Footer (instance, Theme=Dark, 344h)                                   → sections/footer.tsx
```
The foundations themselves have no copy. Every text node belongs to a section spec.

---

## 6. Assets

None for foundations. The pill's hidden "Action icon" (arrow-up-right) is not rendered in any variant, so it ships no asset.

---

## 7. DIFF list — current code → required

All `index.css` line numbers refer to the current file (419 lines). Apply D1–D11 together (one `index.css` edit), then D12–D17.

1. **`src/index.css:67-81` — typography base values (Desktop mode), fixed px tracking.** Replace the five fluid `clamp()` sizes with the Desktop values and give each an explicit line-height and a fixed −1px tracking where Figma says tight:
   - `--text-display: 3.75rem; --text-display--line-height: 4rem; --text-display--letter-spacing: -0.0625rem;`
   - `--text-h1: 3rem; --text-h1--line-height: 3.5rem; --text-h1--letter-spacing: -0.0625rem;`
   - `--text-h2: 2.25rem; --text-h2--line-height: 2.75rem; --text-h2--letter-spacing: -0.0625rem;`
   - `--text-h3: 1.5rem; --text-h3--line-height: 2rem; --text-h3--letter-spacing: 0em;`
   - `--text-h4: 1.125rem; --text-h4--line-height: 1.75rem;` (letter-spacing 0 unchanged)
   - Update the comment block at 59-66 to say "stepped per Figma Desktop/Tablet/Mobile modes (see the media blocks below)".
   (At 1440 the result is identical to today: 60/64, 48/56, 36/44, 24/32, 18/28, −1px.)
2. **`src/index.css:84-85` — `--text-p-lg--line-height: 1.75rem`** (28px absolute, so the Mobile override in D4 can set 1.5rem cleanly). `p-md`, `p-sm`, `p-xs` and `ui` are unchanged across modes. KEEP them.
3. **`src/index.css` after line 174 (after the `:root` layout block) — add the Tablet overrides** (Figma Tablet mode):
   ```css
   @media (max-width: 62rem) {
     :root {
       --text-display: 3rem;    --text-display--line-height: 3.5rem;   /* 48/56 */
       --text-h1: 2.25rem;      --text-h1--line-height: 2.75rem;       /* 36/44 */
       --text-h2: 1.875rem;     --text-h2--line-height: 2.5rem;        /* 30/40 */
       /* h3 24/32, h4 & p-lg 18/28 — unchanged at Tablet */
       --container-margin: 1.5rem;                                     /* page/gutter 24 */
       --section-pad: 4rem; --section-pad-md: 3rem; --section-pad-sm: 1.5rem;
       --radius-panel: 1.25rem;                                        /* radius/2xl 20 */
       --spacing-xxxbg: 1.75rem; --spacing-xlg: 2.5rem; --spacing-xxlg: 3rem;
       --spacing-hg: 4rem; --spacing-xhg: 6rem;                        /* xbg stays 1.5rem */
     }
   }
   ```
4. **`src/index.css` directly after D3 — add the Mobile overrides** (Figma Mobile mode):
   ```css
   @media (max-width: 30rem) {
     :root {
       --text-display: 2.25rem; --text-display--line-height: 2.5rem;   /* 36/40 */
       --text-h1: 1.875rem;     --text-h1--line-height: 2.25rem;       /* 30/36 */
       --text-h2: 1.875rem;     --text-h2--line-height: 2.25rem;       /* 30/36 */
       --text-h3: 1.25rem;      --text-h3--line-height: 1.75rem;       /* 20/28 */
       --text-h4: 1rem;         --text-h4--line-height: 1.5rem;        /* Body/Large/Bold 16/24 */
       --text-p-lg: 1rem;       --text-p-lg--line-height: 1.5rem;      /* Body/Large 16/24 */
       --container-margin: 1rem;                                       /* page/gutter 16 */
       --section-pad: 3rem; --section-pad-md: 2rem; --section-pad-sm: 1rem;
       --radius-panel: 1rem;                                           /* radius/2xl 16 */
       --spacing-xbg: 1.25rem; --spacing-xxxbg: 1.5rem; --spacing-xlg: 2rem;
       --spacing-xxlg: 2.5rem; --spacing-hg: 3rem; --spacing-xhg: 4rem;
     }
   }
   ```
   `--section-pad-bg` aliases `--section-pad` (D6), so it follows automatically. The `--container-width` and `--container-wide` `min()` expressions read `--container-margin` and so follow too.
5. **`src/index.css:160` — `--container-margin: 2.5rem;`** (Desktop page/gutter 40; was `clamp(1.25rem, … , 2.5rem)`). The steps come from D3/D4.
6. **`src/index.css:170-173` — section padding tokens get their own Figma values:**
   `--section-pad: 6rem;` (p-bg 96) · `--section-pad-bg: var(--section-pad);` · `--section-pad-md: 4rem;` (p-md 64) · `--section-pad-sm: 2rem;` (p-sm 32). Update the comment at 169 accordingly. **Must ship together with D16 and D17**, otherwise FAQ and CTA (now `pad="md"`) shrink from 96 to 64.
7. **`src/index.css:47,49,51,52,54,55` — spacing tokens that are Figma responsive spacing, Desktop values fixed:** `--spacing-xbg: 1.5rem` (xl), `--spacing-xxxbg: 2rem` (2xl), `--spacing-xlg: 3rem` (3xl), `--spacing-xxlg: 4rem` (4xl), `--spacing-hg: 6rem` (5xl), `--spacing-xhg: 8rem` (6xl). The steps come from D3/D4. Leave `bg`, `xxbg`, `lg`, `xxxlg`, `xxhg` and `xxxhg` as they are (KEEP: not Figma tokens). Add a one-line comment per token naming its Figma equivalent.
8. **`src/index.css:105` — `--radius-panel: 1.5rem`** stays as the Desktop value. Add the comment "Figma radius/2xl 24 / 20 / 16". The steps come from D3/D4. Lines 102-104 comments are already correct (✓).
9. **`src/index.css:205-210` (`@layer base`) — add the selection colour** (Theme selection/*):
   ```css
   ::selection { background-color: var(--color-soft-volt); color: var(--color-ink); }
   ```
10. **`src/index.css:241-249` — delete the `@media (prefers-reduced-motion: reduce) { … }` block** (owner decision: no reduced-motion gating). KEEP the `html[data-animations-paused='true']` rules at 230-239: that is the user's own pause toggle, not a media gate.
11. **`src/index.css:152-158` — fix the stale comment.** Delete the "1520px frame with 40px gutters, so content runs 1440px wide; the `wide` width (1520px)…" sentences. Keep only: "Figma: a 1200px container with page/gutter 40 / 24 / 16 (Desktop/Tablet/Mobile), so content runs 1120px wide; sections pad section/p-bg 96 / 64 / 48."
12. **`src/components/pill.ts:7` — tap target per control/md:** `h-10` → `h-10 tablet:h-11` (40 desktop, 44 at ≤ 992px). Update the doc comment at line 5: "40px tall (44 below desktop), 24px sides, 12 gap, UI/Button 14/20 Medium".
13. **`src/components/pill.ts:7` — disabled state** (Theme action/disabled), appended to `PILL`:
    `disabled:cursor-not-allowed disabled:border-transparent disabled:bg-chalk disabled:text-forest disabled:hover:bg-chalk disabled:hover:text-forest disabled:active:scale-100 aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-chalk aria-disabled:text-forest aria-disabled:hover:bg-chalk aria-disabled:hover:text-forest aria-disabled:active:scale-100`.
    (book-demo.tsx:84 adds `disabled:opacity-70` on top. That is the section's call; flag it to the book-demo owner, no change here.)
14. **`src/components/pill.ts:3,9-14` — add the Figma "Branded" (Hug) variant:** `export type PillVariant = 'primary' | 'outline' | 'inverse' | 'outline-inverse' | 'brand'` and `brand: 'bg-volt text-ink hover:bg-soft-volt focus-visible:outline-ink'`. Add a comment above `VARIANTS` mapping the names: `primary` = Figma Inverse, `inverse` = Figma Default, `outline` = Figma Outline (home instance uses neutral-300 stroke), `brand` = Figma Branded/Hug, `outline-inverse` = code-only. Figma Branded/Fill (Volt text on Paper) is deliberately not built (fails AA).
15. **`src/components/link-button.tsx:7-14` — doc comment:** add the `brand` bullet ("Volt fill, Ink label: a main action on Paper or Chalk where the campaign colour should lead") and the Figma-name mapping from D14.
16. **`src/components/base/section.tsx:42` — default `pad = 'md'` → `pad = 'bg'`** (Figma Section Container = section/p-bg). Also fix the stale comments: `section.tsx:25` "max (90rem) · wide (95rem)" → "max (70rem column) · wide (70rem) · mid (64rem) · full", and `container.tsx:7-8` "90rem"/"95rem" → "70rem — the 1120px content column" / "70rem — panels share the column". No behavioural change in container.tsx.
17. **Coordinated call-site updates (ship with D6/D16 so nothing changes size unintentionally):**
    - `src/sections/cta.tsx:26` remove `pad="md"` (Figma CTA = p-bg 96).
    - `src/sections/faq.tsx:10` remove `pad="md"` (Figma FAQ = p-bg 96).
    - `src/sections/demo-agenda.tsx:20` remove `pad="md"` (booking page; keeps today's 96).
    - `src/sections/book-demo.tsx:32` `pb-[var(--section-pad-md)]` → `pb-[var(--section-pad-bg)]` (keeps today's 96 on the booking page).
    - `src/sections/pricing.tsx:34` `padBottom="none" … innerClassName="pb-16"` → `padBottom="md"` and drop `pb-16` (Figma 64 / 48 / 32).
    - `src/sections/credit-calculator.tsx:512` `padTop="none" … innerClassName="pt-16"` → `padTop="md"` and drop `pt-16` (Figma 64 / 48 / 32).
    If the pricing or calculator section agents own those files in this run, they apply the last two. Tell them.

**OPTIONAL (not counted):**
- O1 `src/components/heading.tsx:28` — add `H3Serif: styledText('font-serif text-h3 font-normal', 'h3', 'Heading.H3Serif')` for Figma Heading/H3 (serif). That replaces the two existing `Heading.H3 className="font-serif font-normal"` call sites (pricing.tsx:54, credit-calculator.tsx:594). Purely additive.

**No change (KEEP):**
- `src/utils/cn.tsx`: no new token names are introduced (`brand` is a pill key, not a Tailwind token), so the tailwind-merge registration stays complete.
- `paragraph.tsx`, `em.tsx`: they map 1:1 to Body/Large/Medium/Small/Caption and to the italic styles.
- `heading.tsx` mapping (Display = Display/Large, H1 = Display/Small, H2 = Heading/H1, H3 = Heading/H3/Sans Bold, H4 = Body/Large/Bold) is correct.
- `bg-night` / `bg-night-low` (owner).
- Body base `bg-paper font-sans text-ink antialiased`.
- The focus ring.
- The skip link.

---

## 8. Verification checklist (for the implementer, in the Browser pane / playwright at 1440, 834 and 390)

| Probe | 1440 | 834 | 390 |
|---|---|---|---|
| hero `h1` (text-display) font-size/line-height/letter-spacing | 60/64/−1 | 48/56/−1 | 36/40/−1 |
| any `.text-h1` (e.g. testimonials title) | 48/56 | 36/44 | 30/36 |
| `.text-h2` (benefits title) | 36/44 | 30/40 | 30/36 |
| `.text-h3` | 24/32 | 24/32 | 20/28 |
| `.text-p-lg` / `.text-h4` | 18/28 | 18/28 | 16/24 |
| `#pitch` padding-top | 96 | 64 | 48 |
| `#pricing` padding-bottom / `#credit-calculator` padding-top | 64 | 48 | 32 |
| `#resources` (FAQ), `#contact` (CTA) padding | 96 | 64 | 48 |
| content column side gutter ((innerWidth − container)/2) | ≥ 40 (160 at 1440 because of the 1120 cap) | 24 | 16 |
| `#hero-book-demo` height | 40 | 44 | 44 |
| `rounded-panel` (pitch panel) radius | 24 | 20 | 16 |
| `::selection` | soft-volt / ink | — | — |
| No horizontal scroll at 390; `npx tsc --noEmit -p .` clean; `npx eslint` on the touched files at the 10-error baseline | | | |
