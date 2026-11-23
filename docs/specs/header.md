# Spec: Navbar (section id `header`)

- Figma: file `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, instance **`130:5281` "Navbar"**. It is an instance of the main component **`10:6439` (Navbar / Version=02)** in the `10:6438` set on Components. Version=01 (`10:6419`: transparent, 80px tall, Paper "Get in touch" pill) is not used on the home page and is not built.
- The CTA is an instance of **Button / Appearance=Inverse, Width=Hug (`8:13354`)**, which maps to `LinkButton variant="primary"`.
- Code: `src/sections/header.tsx`, `src/content/navigation.ts`
- Evidence (in `/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad/sections/header/`): `figma.png` (Figma at 1x, 1440×72), `code-1440.png`, `code-834.png`, `code-390.png`, `code-390-menu.png` (current code)

## 1. Structure

```
Navbar 130:5281            1440 × 72, flex row, justify-center, pt spacing/xl (24)
└─ Container 10:6440       flex-1, max-w 1160, 1160 × 48, bg theme/background/page (Paper),
   │                       radius/full, p spacing/xs (4), flex row, items-center,
   │                       justify-between, overflow clip, no border, no shadow
   ├─ Frame 4 13:6480      136 × 15.32, pl spacing/lg (16): the wordmark slot
   │  └─ Frame 3 13:6479   120 × 15.32, the wordmark SVG (vertically centred, y 16.34)
   ├─ Navigation links 10:6442  flex row, gap spacing/md (12), 164 × 20, at x 498.5
   │  ├─ "Work"     35 × 20
   │  ├─ "Services" 58 × 20
   │  └─ "Pricing"  47 × 20
   └─ Button 13:6472       135 × 40, Inverse/Hug, label "Book a demo"
```

The links are centred by `justify-between`. The left slot (4 + 136 = 140) and the right slot (135 + 4 = 139) are almost equal, so the link group sits on the page centre. In Figma the group centre is x 720.5.

Code mapping:

```
<header fixed inset-x-0 top-6 z-50 pointer-events-none>       Navbar (pt 24, rendered as top offset)
  <div pill: mx-auto w-[min(calc(var(--container-width)+2.5rem),calc(100%-1.5rem))]
       flex items-center justify-between rounded-full bg-paper p-1 text-ink>   Container
    <a #header-logo pl-4 h-10 …><Wordmark w-[120px]/></a>       Frame 4 / Frame 3
    <nav aria-label="Primary navigation" text-ui …>             Navigation links
      <a #header-nav-{id} …>{label}</a> × 3
    </nav>
    <div flex gap-1>
      <LinkButton #header-get-in-touch …>Book a demo</LinkButton>   Button
      <MobileNavigation/>                                         (code-only, ≤ 992px)
    </div>
  </div>
</header>
```

## 2. Text nodes

| Node | Copy (verbatim) | Italic | Figma text style | Code token |
|---|---|---|---|---|
| 10:6444 | Work | none | UI/Navigation/Regular: Golos Text 14/20, weight 400, tracking 0, theme/text/primary #181b1e | `text-ui` (font-normal inherited), `text-ink` |
| 10:6443 | Services | none | same | same |
| 10:6446 | Pricing | none | same | same |
| 8:12318 (in Button) | Book a demo | none | UI/Button: Golos Text 14/20, weight 500, neutral-50 #f9f9f9 | `pillClass('primary')`, i.e. `text-ui font-medium text-paper` |
| wordmark | "Creative Seat" (artwork, `aria-label`) | n/a | vector | `<Wordmark>` |

Hrefs and order come from `src/content/navigation.ts` (Work `/#work`, Services `/#services`, Pricing `/#pricing`). This already matches Figma's order and copy, so nothing changes there.

## 3. Measurements and tokens

| Property | Figma (variable) | Code token / class | Status |
|---|---|---|---|
| Top offset | pt spacing/xl 24 / 24 / **20** (D / T / M) | `top-6` and **`portrait:top-5`** | Mobile step missing (DIFF 1) |
| Pill width | flex-1, max-w 1160 (1120 column + 20 each side) | `w-[min(calc(var(--container-width)+2.5rem),calc(100%-1.5rem))]`, measured 1160 at 1440 | ✓ |
| Pill padding | spacing/xs 4 | `p-1` | ✓ |
| Pill height | 48 (4 + 40 + 4) | 48 at desktop. 52 at tablet, because the pill becomes 44 | ✓ |
| Pill radius | radius/full | `rounded-full` | ✓ |
| Pill fill | theme/background/page #f9f9f9 | `bg-paper` | ✓ |
| Border / shadow | none / none | none at rest. A shadow appears once scrolled: KEEP (see §6) | ✓ |
| Wordmark slot | pl spacing/lg 16, width 120, slot 136 wide | `pl-4`, `<Wordmark className="w-[120px]">`. The current `pr-2` adds 8px that Figma doesn't have | DIFF 2 |
| Wordmark height | 15.32 (Figma artwork) | 15.66 (brand-guide artwork, viewBox 1004×131) | KEEP (the brand-guide SVG is the source; "never retyped") |
| Link label gap | spacing/md 12 between labels | currently `gap-3` plus `px-3` per link, which gives **36px** between labels | DIFF 3 and 4 |
| Link text | UI/Navigation/Regular 14/20 400 | `text-ui` (14/20) | ✓ |
| Link tap target | none (bare text) | `h-10` (40), and px-1.5 gives ≥ 46 wide | KEEP 40px height (a11y) |
| CTA | Button Inverse/Hug: h control/md 40 / 44 / 44, px spacing/xl 24, gap 12, radius full, bg neutral-950, label neutral-50 | `LinkButton` (primary): `h-10 tablet:h-11 px-6 rounded-full bg-ink text-paper text-ui font-medium`. Measured 134.6 × 40, Figma 135 × 40 | ✓ |
| Menu trigger | none in Figma (control/md is 44 at Tablet/Mobile) | `h-10` | DIFF 5 (`tablet:h-11`, to match the pill and control/touch-minimum 44) |
| Text colour | theme/text/primary #181b1e | `text-ink` | ✓ |

Positions, measured at 1440 now and expected after the DIFFs:

- "Work" label x: Figma 638.5. Now 619. After DIFFs 2 to 4, about 639.
- "Services": Figma 685.5. Now 689.7.
- "Pricing": Figma 755.5. Now 783.4.
- CTA x: Figma 1161 (140 + 1021). Now 1161.4 ✓.

## 4. Variants and components

- **Navbar** Version=02 only.
- **Button** Appearance=Inverse, Width=Hug = `LinkButton variant="primary"` (the default). There is no icon: "Action icon" is hidden in every Button variant.
- **Wordmark** = `src/components/wordmark.tsx` (`currentColor` Ink).

## 5. Responsive behaviour

Version=02 binds only Size variables. spacing/xs and spacing/lg are the same at every mode. spacing/xl is 24 / 24 / 20, and control/md is 40 / 44 / 44. Version=02 does **not** bind the Layout `nav/height`, `nav/padding-x` or `nav/item-gap` variables (80/72/64 · 40/24/16 · 24/20/16), because those belong to Version=01. Do not apply them.

| Range | Behaviour |
|---|---|
| Desktop (> 992) | As §1. Pill 1160 max, links visible, CTA visible, Menu hidden. |
| Tablet (≤ 992, `tablet:`) | Pill `calc(100% - 1.5rem)` wide (KEEP, see §6). The link group is hidden (`tablet:hidden`). Menu trigger shown, **44px tall** (DIFF 5). CTA 44px (pill handles it). Pill 52 tall. |
| Landscape (≤ 768, `landscape:`) | CTA hidden in the bar (`landscape:hidden`). It lives in the menu dialog. KEEP. |
| Mobile (≤ 480, `portrait:`) | Top offset **20px** (`portrait:top-5`, DIFF 1). Bar = wordmark + Menu. |

## 6. Behaviour to keep (code-only, not in Figma)

- **KEEP: `fixed` positioning.** Figma draws the navbar absolutely over the hero. The site keeps it pinned while scrolling.
- **KEEP: the scroll shadow** `shadow-[0_8px_24px_-8px_rgb(24_27_30/0.18)]` after `scrollY > 8`. It lifts the Paper pill off Paper sections. At rest it is `shadow-none`, the same as Figma.
- **KEEP: the outer `gap-6`** on the pill row. With `justify-between` it has no effect at 1440. It only stops the three items touching in the 993 to 1100 range.
- **KEEP: the mobile menu** (`MobileNavigation`, Base UI Dialog):
  - focus trap, Escape to close, focus return to `#header-menu`. Verified: it opens, focus moves inside, Escape closes it and focus returns to `header-menu`.
  - backdrop, slide-in panel, "Explore Creative Seat" title, Close button (44px), mobile links, `MotionToggle`, full-width "Book a demo".
  - it closes automatically when the viewport widens past 992px.
- **KEEP: the ids and analytics attributes.** These are `#header-logo`, `#header-nav-{id}`, `#header-get-in-touch` and `#header-menu`, plus `#header-mobile-{id}` and `#header-mobile-get-in-touch` in the dialog. Keep every `data-track="nav_click" | "get_in_touch_click"` and `data-track-location="header" | "mobile_header"`.
- **KEEP: link hover** (`hover:underline underline-offset-4`) and focus rings (`focus-visible:outline-2 outline-ink`) on the logo, links and Menu. Keep the pill's own focus style too.
- **KEEP: the `cta` prop.** It defaults to `demoPage`.
- **KEEP: the `pointer-events-none` header with a `pointer-events-auto` pill**, so the margins beside the pill don't block clicks.

## 7. Assets

| Slot | Figma | Code |
|---|---|---|
| Wordmark (Frame 3, 120 × 15.32) | `e37e1.svg` (vector wordmark) | `<Wordmark className="w-[120px]" />`: the brand-guide wordmark, same artwork, rendered 120 × 15.66. KEEP. Do not download the Figma SVG. |

No other images or icons in Figma. The Menu and Close glyphs are code-only inline SVGs. KEEP them.

## 8. DIFF: current code → required

1. **`src/sections/header.tsx:29`**: `className="pointer-events-none fixed inset-x-0 top-6 z-50"` → `className="pointer-events-none fixed inset-x-0 top-6 portrait:top-5 z-50"`. This applies spacing/xl Mobile = 20.
2. **`src/sections/header.tsx:36`**: on `#header-logo`, remove `pr-2`. The class becomes `flex h-10 items-center rounded-full pl-4 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2`. This makes Frame 4 exactly 136 wide (pl 16 + 120). The added `outline-offset-2` keeps the focus ring clear of the glyphs on the right.
3. **`src/sections/header.tsx:39`**: on `<nav>`, change `gap-3` → `gap-0`. The 12px label spacing now comes from the link padding (DIFF 4).
4. **`src/sections/header.tsx:47`**: on each nav `<a>`, change `px-3` → `px-1.5`. Each label then sits 6 + 6 = **12px** from the next (Figma spacing/md). The tap target stays 40px tall and at least 46px wide. Result at 1440: labels at about 639 / 686 / 756 (Figma 638.5 / 685.5 / 755.5).
5. **`src/sections/header.tsx:77`**: on `Dialog.Trigger#header-menu`, change `h-10` → `h-10 tablet:h-11`. This matches control/md Tablet/Mobile 44 and the CTA pill beside it (now 40 next to a 44 pill at 834).
6. **`src/sections/header.tsx:10-15`** (doc comment): change it to say the links sit 12px apart (spacing/md), the top offset is 24 (20 on mobile), and the controls are 44px tall below desktop.

No changes to `src/content/navigation.ts`. Its copy, order and hrefs already match Figma.

## 9. Acceptance checks

- At 1440×900: pill x 140, y 24, 1160 × 48. Wordmark at x 160. Label x positions within ±2px of 638.5 / 685.5 / 755.5. CTA 135 × 40 at x ≈ 1161. Compare with `figma.png`.
- At 834: pill 52 tall, Menu trigger 44 tall, CTA 44 tall, links hidden.
- At 390: pill top 20, only the wordmark and Menu visible. Menu opens the dialog, focus moves inside, Tab cycles inside, Escape closes it and focus returns to `#header-menu`.
- `npx tsc --noEmit -p .` and `npx eslint src/sections/header.tsx` show no new errors.
