import { styledText } from './base/polymorphic'

/**
 * Body copy. The dot-notation members carry the *style* (size + leading from
 * the `--text-p-*` ramp, Figma's Body styles) and render <p> by default;
 * override with `as` for inline or other contexts:
 *
 *   <Paragraph>Default body copy</Paragraph>               // Body/Medium 16/24
 *   <Paragraph.Big>Lead-in</Paragraph.Big>                 // Body/Large 18/28
 *   <Paragraph.Small>Card copy</Paragraph.Small>           // Body/Small 14/20
 *   <Paragraph.Caption as="span">Tags</Paragraph.Caption>  // Caption 12/16
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
