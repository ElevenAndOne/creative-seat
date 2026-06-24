import { styledText } from './base/polymorphic'

/**
 * Body copy. The dot-notation members carry the *style* (size + leading) and
 * render <p> by default; override with `as` for inline or other contexts:
 *
 *   <Paragraph>Default body copy</Paragraph>
 *   <Paragraph.Lead>Intro line</Paragraph.Lead>
 *   <Paragraph.Small as="span">Inline caption</Paragraph.Small>
 *
 * Plain <Paragraph> is the body size; `.Body` is the explicit alias.
 */
const Paragraph = Object.assign(
  styledText('text-base leading-relaxed', 'p', 'Paragraph'),
  {
    Lead: styledText('text-lead leading-relaxed', 'p', 'Paragraph.Lead'),
    Body: styledText('text-base leading-relaxed', 'p', 'Paragraph.Body'),
    Small: styledText('text-sm leading-relaxed', 'p', 'Paragraph.Small'),
  },
)

export default Paragraph
