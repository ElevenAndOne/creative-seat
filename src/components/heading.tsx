import { styledText } from './base/polymorphic'

/**
 * Typographic heading, one member per level of the Figma website file's type
 * scale. Each carries its size, weight and family, and renders a sensible
 * semantic tag that `as` can override when the outline needs something else:
 *
 *   <Heading.Display as="h1">Increase your brand’s creative capability.</Heading.Display>
 *   <Heading.H1>Trusted by market leaders to deliver their vision.</Heading.H1>
 *   <Heading.H3 as="h4">Card title</Heading.H3>
 *
 * - Display — Display/Large 60/64, Instrument Serif: the hero and the big
 *   statement sections (performance, FAQ, CTA).
 * - H1 — Display/Small 48/56, Instrument Serif: every other section title, so
 *   it renders an <h2>. A closing italic phrase goes in <Em>.
 * - H2 — Heading/H1 36/44, Instrument Serif: smaller section titles.
 * - H3 — Heading/H3/Sans 24/32, Golos: card and step titles (bold by default).
 * - H3Serif — Heading/H3 24/32, Instrument Serif: plan titles (pricing, calculator).
 * - H4 — Body/Large/Bold 18/28, Golos: small card titles.
 *
 * Plain <Heading> is H1.
 */
const Heading = Object.assign(
  styledText('font-serif text-h1 font-normal', 'h2', 'Heading'),
  {
    Display: styledText('font-serif text-display font-normal', 'h2', 'Heading.Display'),
    H1: styledText('font-serif text-h1 font-normal', 'h2', 'Heading.H1'),
    H2: styledText('font-serif text-h2 font-normal', 'h2', 'Heading.H2'),
    H3: styledText('text-h3 font-bold', 'h3', 'Heading.H3'),
    H3Serif: styledText('font-serif text-h3 font-normal', 'h3', 'Heading.H3Serif'),
    H4: styledText('text-h4 font-bold', 'h4', 'Heading.H4'),
  },
)

export default Heading
