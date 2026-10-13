import { styledText } from './base/polymorphic'

/**
 * Body copy. The dot-notation members carry the *style* (size + leading from
 * the `--text-p-*` ramp — lg 17 / md 16 / sm 14.5 / xs 12.5) and render <p> by
 * default; override with `as` for inline or other contexts:
 *
 *   <Paragraph>Default body copy</Paragraph>               // md (16)
 *   <Paragraph.Big>Hero lead-in</Paragraph.Big>            // lg (17)
 *   <Paragraph.Small>Card copy</Paragraph.Small>           // sm (14.5)
 *   <Paragraph.Caption as="span">Tags</Paragraph.Caption>  // xs (12.5)
 */
const Paragraph = Object.assign(
  styledText('text-p-md', 'p', 'Paragraph'),
  {
    Big: styledText('text-p-lg', 'p', 'Paragraph.Big'),
    Small: styledText('text-p-sm', 'p', 'Paragraph.Small'),
    Caption: styledText('text-p-xs', 'p', 'Paragraph.Caption'),
  },
)

export default Paragraph
