import { styledText } from './base/polymorphic'

/**
 * Typographic heading. The dot-notation members carry the *size* from the
 * design system's type scale (`--text-display`, `--text-h1` … `--text-h6`) and
 * each renders its matching semantic tag by default. Override the element with
 * `as` when the visual level and the document outline need to differ:
 *
 *   <Heading.H2>Section title</Heading.H2>            // <h2>, styled h2
 *   <Heading.Display as="h1">Hero</Heading.Display>   // <h1>, styled display
 *   <Heading.H3 as="p">Looks like h3, off the outline</Heading.H3>
 *
 * Weight is intentionally left off: headings inherit the regular body weight by
 * default (Latinka ships no Light face) — add `font-medium`/`font-bold` via
 * `className` where a heading needs emphasis. Plain <Heading> renders an <h2>.
 */
const Heading = Object.assign(
  styledText('text-h2', 'h2', 'Heading'),
  {
    Display: styledText('text-display', 'h1', 'Heading.Display'),
    H1: styledText('text-h1', 'h1', 'Heading.H1'),
    H2: styledText('text-h2', 'h2', 'Heading.H2'),
    H3: styledText('text-h3', 'h3', 'Heading.H3'),
    H4: styledText('text-h4', 'h4', 'Heading.H4'),
    H5: styledText('text-h5', 'h5', 'Heading.H5'),
    H6: styledText('text-h6', 'h6', 'Heading.H6'),
  },
)

export default Heading
