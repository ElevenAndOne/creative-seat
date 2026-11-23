# Spec: Credit calculator (`calculator`)

- Figma: file `v6Gj8f4rdhijK9VTa99NSh`, page "Design", home frame 130:5280 → instance **130:5720** "Section — Credit calculator (item sliders)" (1440 × 798).
- Components used (page "Components"): **Seat option** 59:2015 (State=Default 59:2002 / Selected 59:2008), **Service item** 74:2995 (State=Default 74:2947 / Selected 74:2971), **Quantity slider** 74:2946 (Value=Empty 74:2912 / Set 74:2929), **Button** Appearance=Inverse, Width=Fill 8:13338.
- Code: `src/sections/credit-calculator.tsx`, `.cs-quantity` rules in `src/index.css:405-439`.
- Evidence: Figma 1x `…/scratchpad/sections/calculator/figma.png`; current code `code-1440.png`, `code-390.png`; raw Figma SVGs in `assets/` (same folder).

Standing owner decisions applied here: real services data (13 services from `creditServices`), reducer logic, **Reset mix**, the full-height list with sticky seats band and sticky summary contents (Figma's fixed 534px planner with an inner scroll and drawn scrollbar is NOT built), 40px touch targets on sliders, AA contrast (Figma's 60%/40% opacity greys become `text-muted`), no reduced-motion gating.

---

## 1. Structure and layout (desktop, 1440)

```
<Section id="credit-calculator" bg-chalk>                       Figma surface-sunken #e6e6e6 → bg-chalk
  pt 64 / pb 96                                                 layout/section-padding-y → padTop="md" (64/48/32), padBottom default "bg" (96/64/48)
  Container 1120 (px 40 gutter)                                 Container width="max"
  ├─ Calculator heading  flex row, items-end, justify-between, gap 32 (layout-grid-gutter → gap-x-8)
  │   ├─ Pricing introduction  flex-1 → <Heading.H1>             Display/Small 48/56, -1px → text-h1 (Heading.H1)
  │   └─ Pricing explanation  w 400 (shrink-0) → <Paragraph max-w-[25rem]>   Body/Medium 16/24 → text-p-md
  │   (gap below heading row: 48 = spacing/3xl → mt-xlg)
  └─ Credit planner  grid 3 equal cols, gap 12, p 12, radius 16, bg volt   → grid-cols-3 gap-sm p-sm rounded-card bg-volt
      ├─ Service builder  col-span-2 (726.67 wide), flex-col gap 12
      │   ├─ Seat options  flex row gap 12; two Seat option, flex-1 each
      │   └─ Service list  bg paper, radius 8 (rounded-sm), flex-col gap 0
      │       ├─ Service item × N (real data: 13)
      │       └─ Custom request row ("Something else?")
      └─ Seat summary  col-span-1 (357.33), bg paper, radius 8, p 12, flex-col gap 24
          ├─ Summary heading  flex-col gap 4 (title + seat detail)       [+ Reset mix: KEEP]
          ├─ Overview  flex-1, flex-col, items-center, justify-center, gap 24
          │   ├─ Chairs  (stage)
          │   └─ Credit usage  flex-col gap 12, items-center, w-full
          │       ├─ Usage figure  flex items-baseline gap 8
          │       └─ Usage track  h 8, rounded-full, bg chalk; fill bg volt
          └─ Breakdown and action  (Button Inverse/Fill, h 40)
```

Column math (inner width 1096 after p-12): Figma `repeat(3, 1fr)` + `col-span-2` → builder 726.67, summary 357.33. Code today uses `2fr/1fr` → builder 723, summary 361 (measured). Change to the 3-col grid (DIFF 3).

### Seat option (59:2015, instance radius overridden to 8)
- `label`, flex row, items-center, h 64 (`h-16`), px 16 (`px-md`), py 12 (`py-sm`), gap 12 (`gap-sm`), radius 8 (`rounded-sm`). Note the component master uses radius-lg 12; the home instance uses 8 — follow the instance.
- Default: bg soft-volt (+1px soft-volt border, invisible — omit), text ink.
- Selected: bg ink (`surface/selected`), text paper.
- Radio 20×20: Default = 1.5px ink ring, rounded-full. Selected = volt disc (r 10) with an 8px ink dot (Figma SVG 7b835: `fill #BCE42D`, dot `r=4 fill #181B1E`). Code draws this with motion layers — matches.
- Plan details: flex-col gap 2 (`gap-xxxsm`), whitespace-nowrap.
  - Name — UI/Label 14/20 SemiBold → `text-ui font-semibold`.
  - Price — Caption 12/16 → `text-p-xs`. Figma: Default forest @60% (≈3.7:1 on soft-volt, fails AA) → **`text-muted`** (deviation, AA). Selected: chalk @60% on ink → `text-paper/60` (passes) — KEEP.
- Credits (right) — UI/Label 14/20 SemiBold → `text-ui font-semibold`, nowrap.

### Service item (74:2995)
- Row: flex/grid row, items-center, min-h 68, px 16, py 12, gap 24 (`gap-x-6`), border-b 1px border-subtle #e6e6e6 → `border-line`.
- Columns: **Service 188px** (icon 48 + gap 12 + info) | Quantity slider flex-1 | Value 64px.
- Icon: 48×48 box (`size-12`), crop of the chair sprite as Figma crops it (existing `CHAIRS` / `ICON_CROPS`).
- Info: flex-col gap 2.
  - Name — Body/Small/Medium 14/20 500, **single line, ellipsis** (`truncate`) → `text-p-sm font-medium truncate`.
  - Rate — Caption 12/16, Figma forest @60% (fails AA on paper) → `text-p-xs text-muted`. Copy: `{credits(n)} / {unit}` (real data).
- Value (w 64, items-end, text-right, flex-col gap 2):
  - Default (qty 0): `0`, Body/Medium/Semi Bold 16/24, Figma ink @60% → `text-p-md font-semibold text-muted` (KEEP, AA token).
  - Selected: qty in ink `text-p-md font-semibold text-ink`; subtotal Caption → `text-p-xs text-muted` e.g. "40 credits".
  - KEEP (motion stability): code hangs the subtotal absolutely below the number so the number stays level with the slider and doesn't jump when the subtotal appears/disappears; Figma stacks them in flow (number lifts ~9px). Visual difference is minor, interaction is better.

### Quantity slider (74:2946)
- Track: h 24, radius 8 (`rounded-sm`), bg surface-sunken → `bg-chalk`, overflow clip.
- Steps: absolute inset-0, px 6 (`px-1.5`), justify-between, max+1 dots, each 3×3 ink @30% (`bg-ink/30`, SVG 07de2 `fill-opacity 0.3`). Real data max ≤ 12 → ≤ 13 dots, as Figma's ruler rule.
- Fill: volt, radius 8, width = 15 + (qty/max)·(track − 15); flat volt on the page instance (the component's white→transparent gradient overlay is NOT used on the home page — don't add it).
- Handle: 3×14, rounded-full, ink; rides the fill's end, 6px in (`left-1.5` + translateX((100% − 15px)·f)), vertically centred (`top-[5px]`).
- Value=Empty: KEEP code (fill hidden, handle `bg-ink/45`) — matches the component's Empty variant and its description ("Selected shows the lime fill"). The home-page instances show a stale volt stub (pr 345 on a 395 track ≈ 50px) on zero rows; that is a mock override, not the intended state. Likewise Figma's set-row fill widths (pr 115 / 288) are mock values that don't follow its own formula — code computes from the formula. KEEP.
- Native `input[type=range]` overlay (`.cs-quantity`): thumb 15px wide × 24px; on `pointer: coarse` input + thumb 40px tall (8px past the track each side). KEEP unchanged (owner: 40px touch targets).

### Custom request row (130:5694)
- flex row items-center, min-h 68, px 16, py 12, gap 24, no bottom border.
- Info flex-1, flex-col gap 2, nowrap:
  - "Something else?" — Body/Small/Medium 14/20 → `text-p-sm font-medium`.
  - "Tell us what you need and we’ll price it in credits" — Caption → `text-p-xs text-muted` (Figma forest @60%, AA deviation).
- Ask: 28×28 (`size-7`) rounded-full bg chalk, centred 14px arrow-up-right ink (Figma SVG 9de88, stroke 1.5). Code `<Arrow />` (size-3.5 = 14px) — KEEP (shared brand arrow; its stroke renders ~1.2px vs 1.5 — acceptable). Whole row is the link (≥68px tall target) — KEEP hover rotate-45.
- Figma "Scrollbar" (4×157, ink @25%) — NOT built (owner: full-height list).

### Seat summary (130:5702)
- bg paper, radius 8 (`rounded-sm`), p 12 (`p-sm`), flex-col gap 24 (`gap-6`). Code's sticky contents + `useFillInView` — KEEP (owner).
- Summary heading (gap 4):
  - "Your monthly seat" — Heading/H3 24/32 Instrument Serif Regular → **`Heading.H3Serif`**.
  - Seat detail — Caption → `text-p-xs text-muted` (Figma forest @60%, AA deviation). Copy: `{seat.name} · {price} / month` e.g. "Half seat · $2,400 / month".
  - KEEP: "Reset mix" text button on the right of the title (owner decision), `min-h-11`, `text-p-xs underline`, disabled at 0.
- Overview: flex-1, items-center, justify-center, gap 24.
  - Chairs: Figma shows a static 4-chair pile in a 211.9 × 145 box; code uses the prototype's 368 × 145 stage (node 79:3347) with animated slots, w-full max 23rem. KEEP (real animation in the slot; the Figma box is the static mock).
  - Usage figure: items-baseline, gap 8, centred. `used` + `/cap` — Golos ExtraBold 88px, tracking -1px, leading normal → code `font-extrabold text-[length:var(--fig)]` with `--fig = min(5.5rem, …)` (88px max, shrinks to fit). `used` ink; `/cap` Figma ink @40% (≈2.6:1, fails AA) → `text-muted`. "credits" — Golos Regular 16, leading 1.1, ink @40% → `text-p-md leading-[1.1] text-muted`, 8px left gap (`ml-2`), baseline-aligned (code's `mt-[calc(var(--fig)*0.845)]`). KEEP.
  - Usage track: `mt-sm` (12), h 8 (`h-2`), rounded-full, bg chalk; fill volt (`bg-flare` when over — code-only warning state, KEEP).
- Action: Button Appearance=Inverse, Width=Fill — h 40, px 24, rounded-full, bg ink (neutral-950), label UI/Button 14/20 Medium paper, centred → `<LinkButton full>` (variant primary = Figma "Inverse"). Copy: "Discuss your creative mix". KEEP tracking attrs and `demoPage` href.

---

## 2. Text nodes (verbatim)

| Node | Copy | Style → token | Colour |
|---|---|---|---|
| 130:5672 | "Your next project, " + *"in credits."* (italic: `in credits.` via `<Em>`) | Display/Small 48/56 −1px → `Heading.H1` (`text-h1`) | ink |
| 130:5674 | "Pick a seat, add the work you have in mind and see how it fits your monthly credits." | Body/Medium 16/24 → `Paragraph` (`text-p-md`) | ink |
| 59:2012/2005 | "Half seat" / "Full seat" (real: `seat.name`) | UI/Label 14/20 600 → `text-ui font-semibold` | paper / ink |
| 59:2013/2006 | "$2,400 / month" / "$4,300 / month" (real: `formatPrice` + " / month") | Caption 12/16 → `text-p-xs` | `text-paper/60` / `text-muted` |
| 59:2014/2007 | "60 credits" / "120 credits" (real: `{seat.credits} credits`) | UI/Label → `text-ui font-semibold` | paper / ink |
| 74:2973 | service name (Figma placeholder names; use `creditServices[].name`) | Body/Small/Medium 14/20 500 → `text-p-sm font-medium truncate` | ink |
| 74:2974 | "20 credits / website" pattern → `{credits(n)} / {unit}` | Caption → `text-p-xs` | `text-muted` |
| 74:2993 | quantity | Body/Medium/Semi Bold 16/24 → `text-p-md font-semibold` | ink (set) / `text-muted` (0) |
| 74:2994 | "40 credits" pattern → `credits(qty × n)` | Caption → `text-p-xs` | `text-muted` |
| 130:5696 | "Something else?" | Body/Small/Medium → `text-p-sm font-medium` | ink |
| 130:5697 | "Tell us what you need and we’ll price it in credits" | Caption → `text-p-xs` | `text-muted` |
| 130:5704 | "Your monthly seat" | Heading/H3 24/32 serif → `Heading.H3Serif` | ink |
| 130:5705 | "Half seat · $2,400 / month" (real: seat detail) | Caption → `text-p-xs` | `text-muted` |
| 130:5714 | "50" + "/60" (real: used, `/cap`) | Golos ExtraBold 88 −1px → existing `--fig` | ink / `text-muted` |
| 130:5715 | "credits" | Golos Regular 16 lh 1.1 → `text-p-md leading-[1.1]` | `text-muted` |
| 8:12247 | "Discuss your creative mix" | UI/Button 14/20 500 → `LinkButton` (`text-ui font-medium`) | paper on ink |
| code-only (KEEP) | "Reset mix"; over-note "{n} credits over a {seat}. Try a {next}." / "Ask about Enterprise." | `text-p-xs` | ink |

## 3. Tokens (Figma variable → code)

| Figma | Value | Code |
|---|---|---|
| theme/surface-sunken | #e6e6e6 | `bg-chalk` |
| theme/surface-default | #f9f9f9 | `bg-paper` |
| theme/brand-primary | #bce42d | `bg-volt` |
| theme/brand-soft | #d7ef81 | `bg-soft-volt` |
| theme/background-inverse, neutral-950 | #181b1e | `bg-ink` |
| theme/text-primary / icon-primary | #181b1e | `text-ink` |
| theme/text-inverse, neutral-50 | #f9f9f9 | `text-paper` |
| theme/text-secondary @60% / ink @40–60% | fails AA | `text-muted` (#5b655f) — deviation |
| theme/border-subtle | #e6e6e6 | `border-line` |
| theme/border-strong | #181b1e @45% | `bg-ink/45` (empty handle) |
| spacing/2xs 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 3xl 48 | | `xxxsm` · `xxsm` · `xsm`/`ml-2` · `sm` · `md` · `6`/`xbg` · `xlg` |
| layout/grid-gutter 32 | | `gap-x-8` |
| radius md 8 · xl 16 · full | | `rounded-sm` · `rounded-card` · `rounded-full` |
| size/control-md 40 | | pill `h-10` (44 below desktop) |

No shadows in this section.

## 4. Responsive (Figma Tablet/Mobile variable modes + code stacking)

Figma has no Tablet/Mobile frames for this section; its variables step per mode and the code tokens already follow them (`text-h1` 48→36→30, `--section-pad-*`, `spacing-xlg` 48→40→32, pill 40→44). Layout below desktop — KEEP code:
- **tablet (≤992)**: planner one column (`tablet:grid-cols-1`; builder `tablet:col-span-1`); summary below the list, contents static, Overview `min-h-[21rem]`; sticky Ink tally bar at the bottom of the builder (`tablet:flex`). Heading row stacks (`tablet:flex-col tablet:items-start`).
- **landscape (≤768)**: service row becomes 2 cols — name block spans both, slider + value on row 2 (`landscape:grid-cols-[minmax(0,1fr)_4rem]`).
- **portrait (≤480)**: seats stack (`portrait:flex-col`), seats band not sticky, value col 3rem, icon 40px.

## 5. Interactive states to keep

- Seat radio group (`fieldset` + sr-only `legend`, native radios), `whileTap` scale 0.97, Ink fade 220ms, radio fill + dot spring, focus-visible outline on the label.
- Slider: native range (keyboard/pointer/touch), `aria-label` "{name}: how many", `aria-valuetext`; focus-visible outline on the track; fill clip-path + handle transform 250ms; chair bounce on first add.
- Value `Roll` animations; summary `ChairPile` springs; `Usage` roll, layout springs, over-cap shake, Flare bar, `OverNote` upgrade button; `aria-live` "{used} of {cap} credits used".
- Reset mix (disabled at 0), sticky seats band with inverse corners, `useFillInView`, tracking `data-track*` attributes, currency hide-until-known.

## 6. Assets per slot

| Slot | Figma | Code (KEEP) |
|---|---|---|
| Service icons 48×48 | `seat/NN` crops of chair sprite 17893.png; blue armchair `image 35` (74391.png) | `/images/expertise/chairs.webp` crops (`CHAIRS`), `/images/calculator/website-chair.webp` (`ICON_CROPS['fluffy-blue']`) — same art, mapped per real service |
| Summary chairs | 4 rotated crops (static) | `ChairPile` with the same crops per added service |
| Radio (selected) | SVG 7b835 | drawn with spans (volt disc + 8px ink dot) |
| Step dot | SVG 07de2 (3px ink @30%) | `span.size-[3px] bg-ink/30` |
| Ask arrow | SVG 9de88 (14px, stroke 1.5) | `components/arrow.tsx` at `size-3.5` |

No new downloads needed.

---

## 7. DIFF — current code → required

1. **credit-calculator.tsx:512** — `<Section … padTop="none" innerClassName="pt-16">` → `<Section id="credit-calculator" className="bg-chalk" padTop="md">` (drop `innerClassName="pt-16"`). Figma top pad 64 (section-padding-y); `md` = 64/48/32 so it steps with the Tablet/Mobile modes instead of a fixed 64.
2. **credit-calculator.tsx:522** — `mt-12` → `mt-xlg` (Figma spacing/3xl 48, steps 40/32).
3. **credit-calculator.tsx:522 + :524 + :590** — planner `grid-cols-[minmax(0,2fr)_minmax(0,1fr)]` → `grid-cols-3`; builder div (:524) add `col-span-2 tablet:col-span-1`; summary div (:590) unchanged (`col-span-1` implicit). Keep `tablet:grid-cols-1`. Result 726.67 / 357.33 like Figma (now 723 / 361).
4. **credit-calculator.tsx:301** — row grid `grid-cols-[12.5rem_minmax(0,1fr)_4rem]` → `grid-cols-[11.75rem_minmax(0,1fr)_4rem]` (Figma Service column 188px; measured 200 now).
5. **credit-calculator.tsx:307** — name `<p className="line-clamp-2 text-sm font-medium">` → `<p className="truncate text-p-sm font-medium" title={service.name}>` (Figma: single line, ellipsis; full name stays in the slider's `aria-label`).
6. **credit-calculator.tsx:594** — `<Heading.H3 className="font-serif font-normal">Your monthly seat</Heading.H3>` → `<Heading.H3Serif>Your monthly seat</Heading.H3Serif>` (the component made for Heading/H3 serif; same render, no override fight).
7. **Type/colour tokens (same pixels, Figma style names)** — replace Tailwind default sizes with the project ramp:
   - :236 `text-sm font-semibold` → `text-ui font-semibold`; :237 `text-xs` → `text-p-xs`; :241 `text-sm font-semibold` → `text-ui font-semibold`
   - :308 `text-xs text-muted` → `text-p-xs text-muted`
   - :320 `text-base font-semibold` → `text-p-md font-semibold`; :321 `text-xs` → `text-p-xs`
   - :387 `text-base font-normal` → `text-p-md font-normal` (keep `leading-[1.1]`)
   - :457 `text-xs` → `text-p-xs`
   - :564 `text-sm font-medium` → `text-p-sm font-medium`; :565 `text-xs` → `text-p-xs`
   - :578 `text-sm` → `text-ui`
   - :604 `text-xs` → `text-p-xs`
   - :301 `border-chalk` → `border-line` (Figma border-subtle; same hex, semantic token)

No changes to `src/index.css` `.cs-quantity` (KEEP: 15px thumb, 24px / 40px coarse hit area).

### KEEP list (deliberate deviations from Figma)
- Full-height list, sticky seats band, sticky/filled summary; no inner scroll, no drawn scrollbar (owner).
- Real services (13) and real copy/prices; Figma's 11 placeholder rows and mock fills/values ignored.
- Reset mix button (owner).
- `text-muted` for every Figma 40–60% opacity grey (AA): seat price (default), service rate, zero quantity, subtotal, custom-request detail, seat detail, `/cap`, "credits".
- Empty slider = component Value=Empty (no fill, dimmed handle), not the page's stale volt stub.
- Subtotal hangs below the count (no row jump) rather than in-flow.
- Chair pile stage 368×145 animated (prototype 79:3347) instead of the 211.9×145 static group.
- Flare over-cap state, OverNote, tablet Ink tally bar (code-only behaviour).
- Pill 44px below desktop; slider 40px coarse hit area.
