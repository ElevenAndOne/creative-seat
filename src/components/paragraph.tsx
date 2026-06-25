import { styledText } from './base/polymorphic'

/**
 * Body copy. The dot-notation members carry the *style* (size + leading, both
 * from the `--text-p-*` ramp — bg 24 / md 18 / sm 14, all at 1.5 leading) and
 * render <p> by default; override with `as` for inline or other contexts:
 *
 *   <Paragraph>Default body copy</Paragraph>       // md (18)
 *   <Paragraph.Big>Lead-in line</Paragraph.Big>    // bg (24)
 *   <Paragraph.Small as="span">Caption</Paragraph.Small>  // sm (14)
 *
 * Plain <Paragraph> is the md body size; `.Body` is the explicit alias, and
 * `.Lead` is kept as an alias of `.Big` for intro paragraphs.
 */
const Paragraph = Object.assign(
  styledText('text-p-md', 'p', 'Paragraph'),
  {
    Big: styledText('text-p-bg', 'p', 'Paragraph.Big'),
    Lead: styledText('text-p-bg', 'p', 'Paragraph.Lead'),
    Body: styledText('text-p-md', 'p', 'Paragraph.Body'),
    Small: styledText('text-p-sm', 'p', 'Paragraph.Small'),
  },
)

export default Paragraph
