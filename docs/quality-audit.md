# Website quality audit

Goal: reach the requested 9.5/10 quality bar across code, composition, design system, visual hierarchy, recovery, and keyboard accessibility.

Stage: DELIVER. Starting workspace: branch main, clean tracked files. Existing nested .claude worktree is preserved.

## Contract

Preserve the established Creative Seat identity (Golos Text / Instrument Serif, Paper / Ink / Volt / Forest, supplied artwork and sections). Improve observed deficiencies, rather than replace a coherent design. Use Base UI primitives for overlay semantics, native inputs for standard interaction, explicit presentation parts, and state owned by the feature that uses it. Avoid global/context state without a shared consumer.

Acceptance:
- Navigation and booking action reachable at 320, 390, 768, 992, and 1440px; menu traps focus, closes with Escape, and restores focus.
- Booking renders loading, empty, all-busy, unavailable, conflict, failure and confirmation states; retries preserve entered details; refresh cannot commit stale requests.
- Portfolio closes reliably during a next-project transition and supports deep links, Escape and focus return.
- Reduced-motion preference and explicit pause stop ambient automatic movement; content remains complete and readable.
- Consistent visible focus, skip link, semantic form labels and meaningful control names.
- No horizontal document overflow at representative widths; intentional artwork clipping remains local.
- Lint and production build pass; independent rendered review covers both pages and key interactions.

After three distinct unsuccessful fixes in one class, stop and revisit the strategy with evidence rather than adding compensating patches.

## Baseline evidence

- Production build passes, with four diagnostic hints.
- Lint fails with 115 parsing errors from scanning a nested worktree and ambiguous TypeScript roots.
- Desktop identity and section rhythm are coherent. Mobile header exposes only a logo.
- No reduced-motion path exists; decorative carousels, videos, GSAP and shader loops continue.
- Booking readiness incorrectly uses number of calendar days, even when all slots are busy; client/server field limits disagree.
- Portfolio next-project timer can reopen a dialog closed during its 320ms fade.
- Video playback has no load failure recovery and assumes autoplay succeeded.

Screenshots: `output/playwright/before-desktop.png`, `before-mobile.png`, `before-home-full.png`.

## Architectural references

- [Base UI composition](https://base-ui.com/react/handbook/composition): compose through render props, spread received DOM props, and forward refs.
- [Fernando Rojo: Composition Is All You Need](https://youtu.be/4KvbVq3Eg5w): explicit feature pieces and appropriate state ownership; benchmark supplied by the user. The YouTube page was reachable but the full transcript was not exposed by the browser tool.

## Active slices

- Parent: navigation, shared design controls, keyboard foundations, visual inspection and integration.
- Booking builder: request/validation controller and field/picker/status composition.
- Motion builder: shared preference and ambient animation consumers.
- Viewer builder: cancelable transitions and keyboard/deep-link behavior.
- Video builder: truthful playback status and retry.

## Independent assessment

An independent interface reviewer inspected actual pages and interactions at 320, 390, 768, 992 and 1440px. The final scoped judgment is **9.5/10 overall**, with a PASS on visual craft and functional interaction. This is an expert assessment, not an instrument-generated measure.

| Dimension | Score | Evidence and improvement |
| --- | ---: | --- |
| Code quality and maintainability | 9.5 | Booking controller, field metadata, pickers and status parts; obsolete wrappers removed; constraints shared with API. |
| React composition and state ownership | 9.6 | Feature root owns booking; pickers own disclosure; Base UI owns overlay semantics; one external store coordinates motion across islands. |
| Design system consistency and reuse | 9.5 | Semantic ref-capable LinkButton, shared navigation, consistent tokens and corrected calculator contrast. |
| Visual hierarchy and product fit | 9.5 | Existing creative subscription identity retained; mobile calculator measure and CTA copy/art separation improved. |
| UX workflows and recovery | 9.5 | Navigation restored; booking busy/empty/error/conflict/retry paths; cancelable portfolio navigation; video recovery; calculator reset. |
| Accessibility and keyboard | 9.5 | Skip link, menu focus containment and return, named pickers, FAQ keys, reduced motion and explicit animation pause. |

Typography, colour and section rhythm were already coherent and remain the visual authority. Refinement focused on legibility, interaction detail and complete workflows. All investigated contrast defects were corrected, including the decorative client mockup’s pink button.

The independent code reviewer returned PASS after corrections to late shader-image disposal and unbounded calendar reads. Availability reads are bounded at 12 seconds in the browser and 8 seconds upstream; booking writes are deliberately not retried automatically.

The referenced composition principles were also checked against [Vercel’s primary composition-patterns guidance](https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns): explicit composition, state/UI separation, and React 19 ref props. A context provider is deferred until a real sibling consumer needs booking state; current parts receive explicit props directly from the feature root.

## Evidence and review boundaries

Final desktop preview: `output/playwright/final-desktop.png`.

Screenshots are local generated artifacts under `output/playwright/` (ignored by Git):
- Baseline: before-desktop.png, before-mobile.png, before-home-full.png.
- Final independent views: review-menu-mobile-pass.png, review-book-desktop-final.png, review-book-mobile-final.png, review-calculator-320-final.png, review-contact-320-final.png, review-video-error-final.png, review-video-blocked-final.png.
- Motion: reduced-team.png, reduced-expertise.png, review-consent-reduced-final.png.
- Booking: booking-confirmation.png, booking-no-js.png, final-no-js.png.

No real booking was submitted and no deployment was made. Calendar/Zapier delivery is an external integration boundary, not established by mocked UI checks. Chromium was inspected; a full Safari/Firefox or screen-reader certification was outside this local verification.

## Integrated verification — 9 November 2026

- `npm run lint` — PASS.
- `npm run build` — PASS; Astro checked 83 files with 0 errors, 0 warnings and 0 hints. The upstream React/Vite integration still emits its existing esbuild-option deprecation notices during bundling.
- `git diff --check` and Node syntax checks for both browser scripts — PASS.
- `scripts/verify-ui.js` via Playwright CLI — PASS: five responsive widths, skip link, menu focus containment/Escape/return, FAQ keyboard disclosure/arrows, calculator range/accessible total/reset, portfolio Next-close race/hash dismissal/focus return, booking busy/error/conflict/success, 12-second calendar timeout/retry, motion persistence and OS preference.
- `scripts/verify-video.js` in a fresh isolated browser — PASS: failed source and disabled seek, retry to actual local media playback, blocked autoplay message, explicit user playback, keyboard close and focus return.
- Additional independently run booking scenarios — PASS: empty slots, calendar 503, submission 502 with preserved details, date/time initial focus and Escape, visible no-JavaScript fallback.
- axe-core 4.14.0 WCAG 2 A/AA and 2.1 AA scans — **0 violations** on home, booking page and open date picker. This automated result complements the manual keyboard review; it is not a blanket accessibility certification.
- Independent code review — PASS, including shader disposal, bounded availability reads and the final blocked-playback lifecycle fix.
- Independent interface review — PASS across the reviewed desktop/mobile layouts, navigation, booking, calculator, FAQ, video failure and reduced-motion states.

No required implementation defects remain in the inspected local scope. The external and browser-coverage boundaries above remain explicit.
