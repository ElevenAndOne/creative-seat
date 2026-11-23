# Figma consistency audit — November 2026

Source: Figma "Creative Seat (Website)", file `v6Gj8f4rdhijK9VTa99NSh`, page frame `130:5280` (1440 wide).

## System changes (src/index.css, shared components)

| Area | Before | Now (Figma) |
| --- | --- | --- |
| Content column | 1440px (90rem) | 1120px — 1200 container with 40px gutters |
| Section padding | 40 / 64 / 80–96 mixed | 96px everywhere (64 on small screens), one `--section-pad` |
| Near-black | #14121a | #181b1e (neutral-950) |
| Muted text | #6a6972 | #5b655f (neutral-600) |
| Hairlines | #dedede | #e6e6e6 (border-subtle) |
| Display | Golos duet, unused | Instrument Serif 60/64 (Display/Large) — hero, performance, FAQ, CTA |
| Section titles | Serif 44/46 | Serif 48/56 (Display/Small) |
| Smaller titles | Golos Bold 32 | Serif 36/44 (Heading/H1) — benefits |
| Card titles | Golos Bold 24/29 | Golos 24/32 (Heading/H3/Sans) |
| Body | 16/25.6, 15, 13 | 16/24, 18/28, 14/20, 12/16 (Body M/L/S, Caption) |
| UI text | 15px medium | 14/20 (UI/Button, Label, Navigation, FAQ Question) |
| Radii | 8 · 12 · 16 · 22 · 28 · 30 | 8 · 12 · 16 · 24 |
| Button | 44px pill + Volt arrow disc | 40px pill, 24px sides, centred label, no icon |

Also fixed: `cn()` didn't know the `display`/`ui` text sizes, so a heading given a colour class lost its size.

## Section changes

- Eyebrows and `border-t` top rules removed from every home-page section (Figma has none).
- Navbar is a floating Paper pill (Work · Services · Pricing, "Book a demo"); footer is Ink with a closing large wordmark.
- Hero headline, expertise and projects titles and CTA headline are roman per Figma; the italic phrase stays where Figma has it.
- Benefits cards: one Soft Volt band, 8px radius. The hover reveal from main is back (owner's call, Nov 2026): the card lifts and its description opens under the title.
- Process cards all Chalk; testimonials and pricing cards follow Figma's sizes, gaps and inner panel.
- CTA: two columns with the Figma collage (public/images/cta), replacing the sketch canvas.
- FAQ: 3-column grid, all rows collapsed by default, 14px bold questions.

## Kept on purpose (Figma placeholder or earlier decision)

- Dark Forest→Ink gradients on hero, performance and benefits (owner's call, see brand-guide exceptions).
- Animated hero card fan, team pipeline (brief → design → motion → build), performance showreel and expertise marquee in place of Figma's grey image placeholders.
- Hero's row of five image tiles not added — Figma has only empty placeholders there.
- Real copy where Figma reuses placeholders: testimonials and pricing headings ("Effortless from brief to launch"), pricing features ("Dedicated designer" ×6), the second testimonial, three pricing plans incl. Enterprise.
- Calculator services and credit values (Figma's look like mock data): six whole deliverables priced at about one credit per design hour (see `creditServices`). The sticky seats/summary from commit 12ccae0 were dropped for a plain two-column planner.
- Footer: Figma's "© 2026 saypien GmbH · Berlin & Frankfurt", "Built to GDPR requirements" and Inter type are template leftovers — not copied. Footer keeps the FAQs and Our work links (Figma lists "Resources", which has no page).
