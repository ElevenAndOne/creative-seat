# Creative Seat

Marketing site for Creative Seat — "Increase your brand's creative capability." Built with [Astro](https://astro.build) and React islands, styled with Tailwind CSS v4.

## Stack

- **Astro 7** — file-based routing, HTML-first rendering
- **[@astrojs/react](https://docs.astro.build/en/guides/integrations-guide/react/)** — React islands for the interactive sections
- **React 19** + TypeScript
- **Tailwind CSS v4** — via the `@tailwindcss/vite` plugin, registered under `vite.plugins` in `astro.config.mjs`
- **Motion** — hero intro and hover/tap springs
- **Base UI** (`@base-ui/react`) — unstyled primitives (accordion, etc.)
- **Fontsource** — self-hosted Golos Text, Poppins and Inter

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`. The port is pinned in `astro.config.mjs` (`server.port` + `vite.server.strictPort`) so a busy port fails loudly instead of silently sliding to another one — Ship Studio expects the app on 3000.

### Scripts

| Script            | Description                                    |
| ------------------ | ----------------------------------------------- |
| `npm run dev`       | Start the Astro dev server (port 3000)          |
| `npm run build`     | `astro check` then `astro build` → `dist/`      |
| `npm run preview`   | Serve the built `dist/` output locally          |
| `npm run lint`      | ESLint over the project                         |

## Project structure

```
creative-seat/
├── astro.config.mjs      # @astrojs/react, Tailwind v4 vite plugin, dev port 3000
├── tsconfig.json         # extends astro/tsconfigs/base
├── eslint.config.js
├── package.json
├── public/
│   ├── images/           # brands, projects, work (case-study walls), hero, sections, avatars, icons
│   └── videos/           # compressed project videos
└── src/
    ├── pages/
    │   └── index.astro   # the only route (/) — composes the sections
    ├── layouts/
    │   └── base.astro    # <html>/<head>: title, description, favicon, fonts, index.css
    ├── sections/         # one React component per page section
    ├── components/
    │   ├── base/         # Grid, Layout, Media, Section, Polymorphic
    │   ├── marquee/      # scroll marquee + lightbox (not currently mounted)
    │   └── ...           # Button, Eyebrow, Heading, Accordion, HeroStack, ProjectViewer, Wordmark, BenefitCard, BrandLogo
    ├── content/          # typed content collection (the site's "CMS")
    │   ├── index.ts      # single import point — typed + re-exported
    │   ├── types.ts      # Project / Testimonial / Logo shapes
    │   ├── sections.ts   # static copy: services, benefits, FAQ, process, socials
    │   ├── projects.json
    │   ├── testimonials.json
    │   └── logos.json
    ├── hooks/            # useMediaFlag
    ├── utils/            # cn (class merge), cv (variant) helpers
    └── index.css         # Tailwind v4 entry, design tokens, breakpoints
```

Build output goes to `dist/`, as before.

## Islands architecture

`src/pages/index.astro` renders every section, but each one hydrates differently:

- **Static, zero JS** — `clients`, `pitch`, `team`, `benefits`, `process`, `testimonials`, `expertise`, `footer` are rendered to plain HTML with no client directive. (The cursors on the `team` collage float with pure CSS.)
- **`client:load`** — `header` and `hero` hydrate immediately, since they're visible on first paint.
- **`client:idle`** — `projects` hydrates once the page is idle rather than on scroll, so a `#work-<slug>` deep link can open its project viewer straight away.
- **`client:visible={{ rootMargin: '200px' }}`** — `performance`, `faq`, `cta` hydrate slightly before they scroll into view: they drive the Base UI accordion or a Button's hover spring.

## Project viewer

Clicking a portfolio card opens `components/project-viewer.tsx`: a full-screen Base UI dialog that clips open from the card, then lays the project out as a horizontally scrolling wall (wheel, arrows/keys, or drag with inertia) ending on a "next project" card. Projects with a `caseStudy` in `projects.json` get the curated two-row artboard (tiles in Figma units, scaled to the viewport height); the rest get a row of their `images`. Below 768px the wall stacks vertically.

Section components in `src/sections/` and shared components in `src/components/` are plain React `.tsx` files — nothing about them changed in the move to Astro; only how they're mounted did.

## Content collection

`src/content/` is the site's lightweight CMS: JSON files (`projects.json`, `testimonials.json`, `logos.json`) typed via `types.ts`, loaded and re-exported from `src/content/index.ts` as the single import point sections use. Static copy (services, benefit cards, FAQ items, process steps, socials) lives in `src/content/sections.ts`.

## Fonts & design tokens

The type follows the Figma design (Creative Seat file, Frame 131): **Golos Text** for body copy and most headings, **Poppins** for display headings, chips and the wordmark, and **Inter** for cards, captions and buttons. All three are self-hosted through Fontsource and imported in `src/layouts/base.astro`.

Design tokens in `src/index.css` mirror that file: colours, a fluid type scale (h1 56 / h2 42 / h3 22 / h4 19 at 1440px), radii, and the layout tokens behind `<Container>` / `<Section>` (a 1080px content column with fluid 20–40px gutters).

Breakpoints are desktop-first custom variants — `tablet:` (≤992px), `landscape:` (≤768px), `portrait:` (≤480px). Tailwind doesn't emit custom variants in declaration order, so each narrower variant carries a little extra specificity to make sure it wins; see the comment in `index.css`.
