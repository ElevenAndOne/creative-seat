# Spec: Projects grid (`projects`)

Source: Figma "Creative Seat (Website)" `v6Gj8f4rdhijK9VTa99NSh`, home frame `130:5280`, section instance **`130:5660`** (Section component `10:132`, Theme = Default), at x 0, y 5225, 1440 × 864.
Card component: **Project card `10:2917`** (Components page, single variant `Version=Default`).
Code: `src/sections/projects.tsx` (export `WorkShowcase`, `<Section id="work">`).
Out of scope (do not touch): `src/components/project-viewer.tsx`, `src/components/project-media.tsx`.
Evidence: `/private/tmp/claude-501/-Users-Craig--claude-spares-spare-AVO0la/01894640-40aa-46f1-94db-e9d81e79aac6/scratchpad/sections/projects/` holds `figma.png` (1x, 1440 × 864) and `code-1440.png`, `code-834.png`, `code-390.png` (current render measured live on :3001).
Shared tokens: see `docs/specs/foundations.md` (its index.css steps for `xlg`, `text-h1`, `text-h4` and section padding are already in place).

**Summary:** at 1440 the code already matches Figma to the pixel (section 864 tall, heading top 96, grid top heading + 56 + 48, cards 352 × 268, media 352 × 204 radius 8, title 18/28 bold, tags 14/20 #5b655f). The changes are only in how the values step at Tablet and Mobile (gaps, media ratio) plus one component swap.

---

## 1. Structure

```
Section 130:5660 (Section, Theme=Default, bg theme/background/page #f9f9f9)   → <Section id="work" className="bg-paper">  (pad="bg", width="max")
└─ Container slot I130:5660;10:131  max-w 1200 incl. 40 gutters → 1120 column, py 96
   ├─ Heading 130:5652   1120 × 56   text, w-full                                   → <Heading.H1>
   └─ Frame 2 130:5653   grid 3 × minmax(0,1fr), rows fit-content, gap 32 × 32, pt 48, w-full
      ├─ Project card 130:5654 (col 1,row 1)  justify-self stretch, self-start
      ├─ Project card 130:5655 (col 2,row 1)
      ├─ Project card 130:5656 (col 3,row 1)
      ├─ Project card 130:5657 (col 1,row 2)
      ├─ Project card 130:5658 (col 2,row 2)
      └─ Project card 130:5659 (col 3,row 2)

Project card 10:2917   flex-col, items-start, gap spacing/sm 8, overflow clip, 352 wide (fills column)
├─ Project image 10:2914   w-full × h 204, radius size/radius/md 8, image fill (grey placeholder)
├─ Title 10:2915           Body/Large/Bold, theme/text/primary
└─ Tags 10:2916            Body/Small, base/color/neutral-600 #5b655f
```

Desktop geometry at 1440: column 1120 = 352 + 32 + 352 + 32 + 352. Card height 268 = 204 + 8 + 28 + 8 + 20. Grid height 48 + 268 + 32 + 268 = 616. Section 96 + 56 + 616 + 96 = 864.

Code tree to build (the card stays a `<button>`, see §6):

```tsx
<Section id="work" className="bg-paper">
  <Heading.H1>Trusted by market leaders to deliver their vision.</Heading.H1>
  <div className="mt-xlg grid grid-cols-3 gap-8 tablet:grid-cols-2 tablet:gap-6 portrait:grid-cols-1 portrait:gap-4">
    {showcasedProjects.map((project, i) => (
      <button … className="group block w-full text-left …focus classes…">
        <div data-media className="relative isolate aspect-[352/204] overflow-hidden rounded-sm bg-chalk">
          <ProjectMedia … />   {/* + hover gradient + "View project" pill, unchanged */}
        </div>
        <Heading.H4 as="h3" className="mt-2">{project.title}</Heading.H4>
        <Paragraph.Small className="mt-2 text-muted">{project.tags.join(', ')}</Paragraph.Small>
      </button>
    ))}
  </div>
  <ProjectViewer … />
</Section>
```

## 2. Text nodes

| Node | Figma copy | Figma style | Code |
|---|---|---|---|
| Heading 130:5652 | "Trusted by market leaders to deliver their vision." No italic phrase. | Display/Small: Instrument Serif 400, 48/56, tracking −1px, theme/text/primary #181b1e | `<Heading.H1>` (renders `<h2>`, `font-serif text-h1`, 48/56 → 36/44 → 30/36). ✓ copy identical |
| Title 10:2915 (×6) | "Dried Fruit South Africa" ×6 (placeholder duplicate) | Body/Large/Bold: Golos 700, 18/28, tracking 0, text-primary | `<Heading.H4 as="h3">` (`text-h4 font-bold`, 18/28 → 16/24 Mobile). ✓ KEEP real titles (owner rule: real data over duplicated placeholder): Dried Fruit South Africa, True Africa Safaris, Sojern, Holiday Beverages, Cherry Time, Onvlee Engineering |
| Tags 10:2916 (×6) | "Motion Design, Social Media Creative, Art Direction" ×6 | Body/Small: Golos 400, 14/20, tracking 0, base/color/neutral-600 #5b655f | `text-p-sm text-muted`; render via `Paragraph.Small` (D4). KEEP real `project.tags.join(', ')` |

Contrast: Ink on Paper 16.9:1; `text-muted` #5b655f on Paper 5.2:1, passes AA. No deviations needed.

## 3. Sizes, spacing, colours → tokens

| Property | Figma (token) | D / T / M | Code |
|---|---|---|---|
| Section background | theme/background/page | #f9f9f9 | `bg-paper` ✓ |
| Section padding Y | layout/section-padding-y | 96 / 64 / 48 | `<Section>` default `pad="bg"` ✓ (measured 96 / 64 / 48) |
| Page gutter | layout/page-gutter | 40 / 24 / 16 | `<Container>` ✓ |
| Content column | container max 1200 incl. gutters | 1120 | `width="max"` ✓ |
| Heading → grid | Frame 2 `pt` spacing/3xl | 48 / 40 / 32 | `mt-xlg` (3rem / 2.5rem / 2rem). Today `mt-12` fixed 48 → **D1** |
| Grid columns | 3 × minmax(0,1fr) | 3 / 2 / 1 (see §5) | `grid-cols-3 tablet:grid-cols-2 portrait:grid-cols-1` ✓ |
| Grid gap (row + column) | layout/grid-gutter | 32 / 24 / 16 | `gap-8 tablet:gap-6 portrait:gap-4`. Today `gap-8` fixed → **D2** |
| Card internal gap | spacing/sm | 8 | `mt-2` on title and tags ✓ (equivalent to flex gap 8) |
| Media box | 352 × 204, fills column | ratio 352:204 (1.725) | `aspect-[352/204]` at all widths. Today `h-[204px]` + `tablet:aspect-[340/204] tablet:h-auto` → **D3** |
| Media radius | size/radius/md | 8 | `rounded-sm` ✓ |
| Media placeholder fill | grey image placeholder | — | `bg-chalk` behind `ProjectMedia` ✓ (shows while loading) |
| Borders / shadows | none | — | none ✓ |

## 4. Components and variants

- **Section** `10:132`, Theme=Default → `<Section>` defaults. ✓
- **Project card** `10:2917`, `Version=Default` (the only variant; no hover/pressed variants in Figma) → the inline `<button>` card in `projects.tsx`. No separate component file needed.
- Text styles: Display/Small → `Heading.H1`; Body/Large/Bold → `Heading.H4`; Body/Small → `Paragraph.Small`.

## 5. Responsive behaviour

The home frame has only a Desktop layout for this section; the Size/Layout/Typography variable modes still apply:

| Width | Columns | Grid gap | Heading → grid | Heading | Title | Media |
|---|---|---|---|---|---|---|
| > 992 (Desktop) | 3 | 32 | 48 | 48/56 | 18/28 | aspect 352:204 (= 352 × 204 at 1440) |
| 481–992 (Tablet, `tablet:`) | 2 | 24 | 40 | 36/44 | 18/28 | aspect 352:204 (≈ 381 × 221 at 834) |
| ≤ 480 (Mobile, `portrait:`) | 1 | 16 | 32 | 30/36 | 16/24 | aspect 352:204 (≈ 358 × 207 at 390) |

KEEP the 3 → 2 → 1 column stepping (sensible stacking; 352-wide cards fit two-up at Tablet).

## 6. Interactive states (KEEP all, code-only, Figma has none)

- Whole card is a `<button type="button">` with `aria-label="View {title} project"`, `id="work-card-{slug}"`, ref stored for focus return. KEEP (reason: viewer open, focus return, deep links `#work-{slug}`).
- `data-media` on the media box. KEEP (reason: `insetOf()` reads it for the clip-path open/close animation). D3 changes only its sizing classes; the attribute and `relative isolate overflow-hidden` stay.
- Hover / focus-visible: media `scale-[1.045]` over 900ms `ease-glide`; Ink gradient overlay fades in (400ms); "View project" pill (`h-9`, `bg-paper`, `text-[13px]`, `Arrow`) slides up and the arrow nudges 3px. KEEP (reason: owner-built hover, not modelled in Figma; pill is decorative inside the 204px-tall button, so tap target is the whole card).
- Focus ring `focus-visible:outline-2 outline-offset-4 outline-ink`. KEEP (accessibility).
- `ProjectViewer` props, `open/navigate/close`, `setHash`, `trackView`, the `hashchange` effect. KEEP unchanged.
- No reduced-motion gating (owner rule). Do not add any.

## 7. Assets per slot

| Slot | Figma | Code |
|---|---|---|
| Project image ×6 | grey placeholder `0b3b6.png` | KEEP existing `ProjectMedia` with `project.cover` / `project.poster` (R2 videos/images) from `showcasedProjects` (`projects.slice(0, 6)`), `object-cover`, sized to the 352:204 box. Do not download the Figma placeholder. |

## 8. DIFF: current code → required

All in `src/sections/projects.tsx`.

1. **Line 91, heading → grid spacing.** `mt-12` → `mt-xlg` (Figma spacing/3xl 48 / 40 / 32; desktop unchanged at 48).
2. **Line 91, grid gutter.** `gap-8` → `gap-8 tablet:gap-6 portrait:gap-4` (layout/grid-gutter 32 / 24 / 16). Full class: `mt-xlg grid grid-cols-3 gap-8 tablet:grid-cols-2 tablet:gap-6 portrait:grid-cols-1 portrait:gap-4`.
3. **Line 102, media box sizing.** `h-[204px] … tablet:aspect-[340/204] tablet:h-auto` → `aspect-[352/204]` (no fixed height, no tablet override). Resulting class: `relative isolate aspect-[352/204] overflow-hidden rounded-sm bg-chalk`. Keeps 352 × 204 at 1440, uses Figma's ratio (not 340:204) at every other width, and stops the 993–1439px range from cropping a narrower card to a fixed 204px height.
4. **Line 116 (+ import), tags paragraph.** `<p className="mt-2 text-p-sm text-muted">` → `<Paragraph.Small className="mt-2 text-muted">` and add `import Paragraph from '../components/paragraph'` near line 3. Renders identically (Body/Small 14/20, #5b655f); uses the design-system component like the other sections.

Everything else: ✓ matches or KEEP as listed in §2 and §6. After the change, verify at 1440 that the section is still 864 tall and cards 352 × 268, at 834 that gaps are 24 and heading→grid is 40, at 390 gaps 16 and heading→grid 32, and that clicking a card still opens the viewer from the card's media box and sets `#work-{slug}`.
