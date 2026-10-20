# Creative Seat

Marketing site for Creative Seat — "Increase your brand's creative capability." Built with [Astro](https://astro.build) and React islands, styled with Tailwind CSS v4.

## Stack

- **Astro 7** — file-based routing, HTML-first rendering
- **[@astrojs/react](https://docs.astro.build/en/guides/integrations-guide/react/)** — React islands for the interactive sections
- **React 19** + TypeScript
- **Tailwind CSS v4** — via the `@tailwindcss/vite` plugin, registered under `vite.plugins` in `astro.config.mjs`
- **Motion** — hero intro and card carousel, cookie banner, project viewer
- **Base UI** (`@base-ui/react`) — unstyled primitives (accordion, etc.)
- **Fontsource** — self-hosted Golos Text and Instrument Serif
- **[@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/)** — pages stay prerendered; only the booking API runs as a Vercel function

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
├── astro.config.mjs      # @astrojs/react, Vercel adapter, Tailwind v4 vite plugin, booking env schema, dev port 3000
├── .env.example          # the booking settings: Zapier webhook, calendar API, working hours
├── tsconfig.json         # extends astro/tsconfigs/base
├── eslint.config.js
├── package.json
├── public/
│   ├── images/           # brands, projects, work (case-study walls), hero, sections, icons
│   └── videos/           # the team canvas character loop (portfolio videos are hosted on Cloudflare R2)
└── src/
    ├── pages/
    │   ├── index.astro         # the home page (/) — composes the sections
    │   ├── book-a-demo.astro   # /book-a-demo — booking screen + the call's agenda
    │   └── api/                # slots.ts (GET availability), book.ts (POST a booking) — on-demand
    ├── server/           # server-only: slot generation, the calendar API client, the Zapier hand-off
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
    ├── utils/            # cn (class merge), cv (variant), analytics, structured data, booking contract
    └── index.css         # Tailwind v4 entry, design tokens, breakpoints
```

Build output goes to `dist/`, as before.

## Islands architecture

`src/pages/index.astro` renders every section, but each one hydrates differently:

- **Static, zero JS** — `pitch`, `benefits`, `testimonials`, `expertise`, `footer` are rendered to plain HTML with no client directive. Buttons are pure CSS, and so is the benefit cards' Superside-style hover (the card lifts, its caption band grows up into the photo and the description opens).
- **`client:load`** — `header` and `hero` hydrate immediately, since they're visible on first paint (on `/book-a-demo`, the header and the booking screen). The hero is one viewport tall (`100dvh`): copy, a 3D card fan of project imagery (`components/hero-stack.tsx` — real perspective and depth-sorting, draggable with a capped throw, advancing by itself every few seconds), and an endless, edge-faded marquee of client logos along the bottom.
- **`client:idle`** — `projects` hydrates once the page is idle rather than on scroll, so a `#work-<slug>` deep link can open its project viewer straight away. `pricing` too, so the visitor's currency is known before they reach it. The cookie banner (in the layout) also loads on idle.
- **`client:visible={{ rootMargin: '200px' }}`** — these hydrate slightly before they scroll into view:
  - `team`: a multiplayer canvas where four collaborator cursors drag a client's landing page together, piece by piece, then undo and rebuild. Hovering adds your own "You" cursor, and you can tug the pieces. The page's model is a transparent character loop (`public/videos/character-craig.webm`, with an HEVC-alpha `.mov` for Safari) that only plays while on screen.
  - `performance`: the 2026 showreel sits in the section as a silent, looping preview (`components/video-lightbox.tsx`) and morphs out of its own frame into a near-full-screen player when clicked — both boxes are 16:9, so opening and closing are a translate and a uniform scale between them. The player is the brand's own (`components/video-player.tsx`): Volt on Ink chrome, a scrubber with the buffered stretch behind it, volume that unrolls on hover, fullscreen, and `k`/`m`/`f`/arrow shortcuts. Everything but the picture fades away once the viewer stops reaching for it. The film is hosted on Cloudflare R2; only its poster lives in the repo.
  - `process`: four steps in a fixed row — the open one wide on Soft Volt, the rest as narrow numbered columns — opening in turn while on screen (paused under the pointer or focus) or on click. Phones stack all four, open.
  - `faq`: the Base UI accordion.
  - `cta`: the Volt band with a live WebGL pencil sketch of a photo (`components/sketch-canvas.tsx`), after Codrops' [Sketchy Pencil Effect](https://tympanus.net/codrops/2022/11/29/sketchy-pencil-effect-with-three-js-post-processing/). Sobel edges are read through cloud noise, so lines squiggle off true, and noise-scaled gradients from a softened copy add grainy shading. Even-width pencil scribbles darken the shadows. It boils through three drawings and shades harder under the pointer.

## Book a demo

Every "Book a demo" and "Get in touch" button leads to `/book-a-demo`. The page is one `client:load` island, `sections/book-demo.tsx`, on the night gradient. The pitch sits on the left and the form on the right: first and last name, email, phone, company and job role two to a row, then a date and a time, each picked from a small popover (Base UI). Below the form, `sections/demo-agenda.tsx` (static) lays the 30 minutes along a minute ruler that fills with Volt as it scrolls past.

It works like miacreate.ai's booking form, and shares its calendar:

- **`GET /api/slots`** offers half-hour slots across `BOOKING_HOURS` in `BOOKING_TIME_ZONE`, on the next 10 weekdays from tomorrow, and marks each one free or busy by asking the [mia calendar API](https://github.com/ElevenAndOne/mia-calendar-api) (`CALENDAR_API_URL`, `server/calendar-api.ts`) once per day. That API runs a Google Calendar FreeBusy query over the demo calendar (`sean@11and1.com`) and holds the Google credentials, so this site holds none. It only books until 31 December of the current year; later days stay closed. Visitors see the times in their own time zone, and busy ones are struck through.
- **`POST /api/book`** checks that the slot is still on offer and **still free at that moment**. If someone took it in the meantime, it answers 409 and the page sends the visitor back to the picker with fresh times. Otherwise it posts the booking to the Zapier webhook (`ZAPIER_WEBHOOK_URL`, `server/zapier.ts`) as flat JSON: names, email, phone, company, job role, `start`/`end` as ISO times with the studio's offset, the visitor's time zone, `form_source` and the `utm_*` tags. A hidden honeypot field turns bots away.

The `utm_*` tags a visitor lands with, on any page, are kept in `sessionStorage` (`layouts/base.astro`) and sent with the booking, so HubSpot knows which campaign it came from.

**The Zap** — "Creative Seat Book Demo Form" in Zapier: a *Catch Hook* trigger, then HubSpot *Create or Update Contact* (with the UTMs and Form Source), Google Calendar *Create Detailed Event* on `sean@11and1.com` (the visitor invited, a Meet link, shown as Busy — which is what blocks the slot for the next visitor), and an Email by Zapier confirmation from Sean with the date, time and Meet link.

**Setup:** add `ZAPIER_WEBHOOK_URL` (the Catch Hook's URL) to `.env` (gitignored) and to the Vercel project's environment variables; the rest have working defaults (see `.env.example`). Without the webhook, `npm run dev` labels bookings as samples and sends nothing, and production answers 503 — the page then offers the studio's email instead, so no request is silently lost.

## Project viewer

Clicking a portfolio card opens `components/project-viewer.tsx`: a full-screen Base UI dialog that clips open from the card, then lays the project out as a horizontally scrolling wall (wheel, arrows/keys, or drag with inertia) ending on a "next project" card. Projects with a `caseStudy` in `projects.json` get the curated two-row artboard (tiles in Figma units, scaled to the viewport height); the rest get a row of their `images`. Below 768px the wall stacks vertically.

Section components in `src/sections/` and shared components in `src/components/` are plain React `.tsx` files — nothing about them changed in the move to Astro; only how they're mounted did.

## Content collection

`src/content/` is the site's lightweight CMS: JSON files (`projects.json`, `testimonials.json`, `logos.json`) typed via `types.ts`, loaded and re-exported from `src/content/index.ts` as the single import point sections use. Static copy (services, benefit cards, FAQ items, process steps, socials) lives in `src/content/sections.ts`.

## Brand, fonts & design tokens

The visuals follow the **Creative Seat brand guide** (v1.0, Sept 2026):

- **Colour** — Volt, Soft Volt, Ink, Paper, Forest and Chalk are the only theme colours (Tailwind's own palette, `white` and `black` included, is switched off). Paper leads; text uses the guide's approved pairings. The hero, performance and benefits sections keep the original Forest-to-Ink gradient (`bg-night` / `bg-night-low`) by request.
- **Type** — **Golos Text** for almost everything (the hero's Bold + Regular *display duet*, Headlines 2–3, body), and **Instrument Serif** for Headline 1 — section titles, each ending on an italic phrase (`<Em>`) — and the pricing plans' names. Eyebrows are the only all-caps text. Both fonts are self-hosted through Fontsource and imported in `src/layouts/base.astro`.
- **Logo** — `components/wordmark.tsx` draws the guide's supplied wordmark artwork (never retyped); the chair logomark is used only for the favicon and app icons.
- **Buttons** — `components/autton.tsx` is the one call to action across the site: a pill with a Volt arrow that turns 45° on hover. It comes in four finishes: `primary` (Ink fill, the main action), `outline` (Ink hairline, secondary actions), and `inverse` / `outline-inverse` for the same pair on dark backgrounds. Every "Book a demo" and "Get in touch" button leads to the booking page, `/book-a-demo` (`utils/contact.ts`).
- **Copy** — sentence case and British English; the guide's banned words (e.g. "unlimited") are kept out.

Design tokens in `src/index.css` mirror the guide: colours, a fluid type scale (display 72 / h1 56 / h2 32 / h3 24 / body 17 at 1440px), radii, and the layout tokens behind `<Container>` / `<Section>` (a 1440px content column with fluid 20–40px gutters).

## Pricing & currency

`sections/pricing.tsx` shows each visitor one currency only — USD, GBP or EUR — picked by `hooks/useCurrency.ts` from the device's time zone (falling back to its language region): UK → GBP, the rest of Europe → EUR, everywhere else → USD. No network request, nothing to consent to. The price stays hidden until the currency is known, so nobody sees another region's price. Plan details live in `src/content/sections.ts` (`pricingPlans`).

## Analytics, consent & tracking

- **Consent** — `components/cookie-banner.tsx` asks once (Accept / Decline, equal weight) and drives Google Consent Mode v2: everything is denied by default in `base.astro`, and a stored "granted" is restored before the tag configures. The footer's "Cookie settings" reopens it.
- **Ids** — every key element has a stable `<section>-<element>` id (`hero-book-demo`, `header-nav-pricing`, `pricing-full-seat-book-demo`, `faq-question-3`, `work-card-cherry-time`, …) for GTM triggers.
- **Events** — any element with `data-track="<event>"` (plus optional `data-track-location`) sends that GA4 event through one delegated listener in `base.astro`: `book_demo_click`, `get_in_touch_click`, `see_work_click`, `nav_click`, `social_click`. Stateful moments call `track()` from `utils/analytics.ts`: `view_project`, `faq_open`, `process_slide`, `cookie_consent`, and `generate_lead` (a demo booked — no personal details are sent).

## SEO & AEO

`site` in `astro.config.mjs` (**currently a placeholder — confirm the domain before launch**) drives the canonical URL, Open Graph / Twitter cards (`public/og-image.jpg`), `robots.txt`, `sitemap.xml` and `llms.txt` (all generated in `src/pages/`), plus the JSON-LD graph from `utils/structured-data.ts`: Organization, WebSite, WebPage, Service with its plans, HowTo for the process, and FAQPage. `/book-a-demo` is a ContactPage linked into that graph. Structured data and `llms.txt` are built from the same content the page renders and leave prices out (visitors only see their own currency). Icons and `site.webmanifest` live in `public/`.

Breakpoints are desktop-first custom variants — `tablet:` (≤992px), `landscape:` (≤768px), `portrait:` (≤480px). Tailwind doesn't emit custom variants in declaration order, so each narrower variant carries a little extra specificity to make sure it wins; see the comment in `index.css`.
