# Creative Seat

Marketing site for Creative Seat — "Increase your brand's creative capability." Built with [Astro](https://astro.build) and React islands, styled with Tailwind CSS v4.

## Stack

- **Astro 7** — file-based routing, HTML-first rendering
- **[@astrojs/react](https://docs.astro.build/en/guides/integrations-guide/react/)** — React islands for the interactive sections
- **React 19** + TypeScript
- **Tailwind CSS v4** — via the `@tailwindcss/vite` plugin, registered under `vite.plugins` in `astro.config.mjs`
- **Motion** — entrance/scroll animation (`whileInView`, hover/tap springs)
- **Base UI** (`@base-ui/react`) — unstyled primitives (accordion, etc.)

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
│   ├── font/             # self-hosted Latinka OTF (Regular, Medium, Medium Italic, Bold)
│   └── images/           # brand logos, project imagery, icons
└── src/
    ├── pages/
    │   └── index.astro   # the only route (/) — composes the sections
    ├── layouts/
    │   └── base.astro    # <html>/<head>: title, description, favicon, index.css
    ├── sections/         # one React component per page section
    ├── components/
    │   ├── base/         # Grid, Layout, Media, Section, Polymorphic
    │   ├── marquee/      # scroll marquee + lightbox
    │   ├── hero-grid/    # animated hero card grid
    │   └── ...           # Button, Eyebrow, Heading, Accordion, BenefitCard, BrandLogo
    ├── content/          # typed content collection (the site's "CMS")
    │   ├── index.ts      # single import point — typed + re-exported
    │   ├── types.ts      # Project / Testimonial / Logo shapes
    │   ├── sections.ts   # static copy: services, benefits, FAQ, process, socials
    │   ├── projects.json
    │   ├── testimonials.json
    │   └── logos.json
    ├── hooks/            # useMediaFlag
    ├── utils/            # cn (class merge), cv (variant) helpers
    └── index.css         # Tailwind v4 entry, Latinka @font-face, design tokens
```

Build output goes to `dist/`, as before.

## Islands architecture

`src/pages/index.astro` renders every section, but each one hydrates differently:

- **Static, zero JS** — `clients`, `benefits`, `process`, `testimonials`, `footer` are rendered to plain HTML with no client directive.
- **`client:load`** — `header` and `hero` hydrate immediately, since they're visible on first paint.
- **`client:visible={{ rootMargin: '200px' }}`** — `pitch`, `team`, `performance`, `tools`, `expertise`, `projects`, `faq`, `cta` hydrate slightly before they scroll into view, so their Motion `whileInView` entrance animations still fire on time.

Section components in `src/sections/` and shared components in `src/components/` are plain React `.tsx` files — nothing about them changed in the move to Astro; only how they're mounted did.

## Content collection

`src/content/` is the site's lightweight CMS: JSON files (`projects.json`, `testimonials.json`, `logos.json`) typed via `types.ts`, loaded and re-exported from `src/content/index.ts` as the single import point sections use. Static copy (services, benefit cards, FAQ items, process steps, socials) lives in `src/content/sections.ts`.

## Fonts & design tokens

Latinka is self-hosted from `public/font/` and declared via `@font-face` in `src/index.css` (Regular, Medium, Medium Italic, Bold — there's no Light face, so lighter weights fall back to Regular). Design tokens in the same file mirror the Creative Seat design system.
