import type { ElementType, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import Container from '../container'

type Pad = 'none' | 'sm' | 'md' | 'bg'
type Width = 'max' | 'mid' | 'full'

const PAD: Record<Pad, string> = {
  none: '0rem',
  sm: 'var(--section-pad-sm)',
  md: 'var(--section-pad-md)',
  bg: 'var(--section-pad-bg)',
}

type SectionProps = {
  children: ReactNode
  /** Classes for the full-bleed <section> itself — backgrounds, text colour, etc. */
  className?: string
  /** Layout classes for the inner container (grid/flex, alignment, gap…). */
  innerClassName?: string
  /** Vertical rhythm from the spacing tokens; `pad` sets both edges. */
  pad?: Pad
  padTop?: Pad
  padBottom?: Pad
  /** Inner container width: max (90rem) · mid (64rem) · full. */
  width?: Width
  /** Skip the inner container for edge-to-edge layouts. */
  bleed?: boolean
  id?: string
  as?: ElementType
}

/**
 * The page's building block. Backgrounds + vertical rhythm live on the section;
 * the inner <Container> handles max-width and horizontal margin from tokens.
 * Building a new page is mostly: copy a <Section>, swap the content.
 *
 *   <Section className="bg-paper" pad="md" innerClassName="grid grid-cols-2 gap-lg tablet:grid-cols-1">
 *     …
 *   </Section>
 */
export function Section({ children, className, innerClassName, pad = 'md', padTop, padBottom, width = 'max', bleed = false, id, as: Tag = 'section' }: SectionProps) {
  return (
    <Tag id={id} className={cn('relative', className)} style={{ paddingTop: PAD[padTop ?? pad], paddingBottom: PAD[padBottom ?? pad] }} >
      {bleed && (children)}

      {!bleed && (
        <Container width={width} className={innerClassName}>
          {children}
        </Container>
      )}
    </Tag>
  )
}
