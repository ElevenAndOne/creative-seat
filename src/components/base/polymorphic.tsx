import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '../../utils/cn'

/**
 * Props for a polymorphic component. `as` swaps the rendered element while the
 * component keeps its own styling; every other prop is inferred from the chosen
 * element (so `as="a"` accepts `href`, `as="label"` accepts `htmlFor`, …).
 */
export type PolymorphicProps<E extends ElementType> = {
  as?: E
  className?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'className' | 'children'>

export type PolymorphicComponent<Default extends ElementType> = <
  E extends ElementType = Default,
>(
  props: PolymorphicProps<E>,
) => ReactNode

/**
 * Builds a polymorphic text component locked to a single visual style — the
 * factory behind every dot-notation member of `Heading` and `Paragraph`.
 *
 * It renders `defaultTag` for correct semantics out of the box, but the caller
 * can pass `as` to render any other element while keeping the same look. Style
 * classes merge with `className` through tailwind-merge, so a caller's classes
 * win on conflicts.
 */
export function styledText<Default extends ElementType>(
  style: string,
  defaultTag: Default,
  displayName: string,
): PolymorphicComponent<Default> {
  function Text({ as, className, ...rest }: PolymorphicProps<ElementType>) {
    const Tag = (as ?? defaultTag) as ElementType
    return <Tag className={cn(style, className)} {...rest} />
  }
  Text.displayName = displayName
  return Text as PolymorphicComponent<Default>
}
