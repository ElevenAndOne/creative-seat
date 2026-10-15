import { styledText } from './base/polymorphic'

/**
 * Typographic heading, one member per level of the brand type scale. Each
 * carries its size, weight and family, and renders a sensible semantic tag
 * that `as` can override when the outline needs something else:
 *
 *   <Heading.Display>Increase your brand’s <b>creative capability.</b></Heading.Display>
 *   <Heading.H1>Trusted by market leaders <Em>to deliver their vision.</Em></Heading.H1>
 *   <Heading.H3 as="h4">Card title</Heading.H3>
 *
 * - Display — the Golos duet (72/72): Regular carries the context, a <b>
 *   carries the point. For posters and campaign moments; not used on the page.
 * - H1 — Headline 1 (56/59), Instrument Serif: every section title, so it
 *   renders an <h2>; the hero sets it larger as the page's <h1>. End it on one
 *   italic phrase of two or more words with <Em>; serif is for this level only,
 *   never the brand name.
 * - H2 / H3 — Headline 2 (32/35) and 3 (24/29), Golos Bold.
 * - H4 — small card titles, Golos Bold.
 *
 * Plain <Heading> is H2.
 */
const Heading = Object.assign(
  styledText('text-h2 font-bold', 'h2', 'Heading'),
  {
    Display: styledText('text-display font-normal [&_b]:font-bold', 'h1', 'Heading.Display'),
    H1: styledText('font-serif text-h1 font-normal', 'h2', 'Heading.H1'),
    H2: styledText('text-h2 font-bold', 'h2', 'Heading.H2'),
    H3: styledText('text-h3 font-bold', 'h3', 'Heading.H3'),
    H4: styledText('text-h4 font-bold', 'h4', 'Heading.H4'),
  },
)

export default Heading
