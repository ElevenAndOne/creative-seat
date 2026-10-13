import { styledText } from './base/polymorphic'

/**
 * Typographic heading. The dot-notation members carry the *size* from the
 * design system's type scale (`--text-h1` … `--text-h4`) plus the weight the
 * Figma design pairs with it, and each renders its matching semantic tag by
 * default. Override the element with `as` when the visual level and the
 * document outline need to differ:
 *
 *   <Heading.H2>Section title</Heading.H2>              // <h2>, styled h2
 *   <Heading.H4 as="h3">Card title</Heading.H4>         // <h3>, styled h4
 *   <Heading.H2 className="font-display">…</Heading.H2> // Poppins instead of Golos
 *
 * Family: headings inherit Golos Text; the sections the design sets in Poppins
 * add `font-display`. Weights: h1 regular (its emphasis is semibold), h2
 * medium, h3/h4 semibold — `className` wins on conflicts via tailwind-merge.
 * Plain <Heading> renders an <h2>.
 */
const Heading = Object.assign(
  styledText('text-h2 font-medium', 'h2', 'Heading'),
  {
    H1: styledText('text-h1 font-normal', 'h1', 'Heading.H1'),
    H2: styledText('text-h2 font-medium', 'h2', 'Heading.H2'),
    H3: styledText('text-h3 font-semibold', 'h3', 'Heading.H3'),
    H4: styledText('text-h4 font-semibold', 'h4', 'Heading.H4'),
  },
)

export default Heading
