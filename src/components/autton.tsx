import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'
import Arrow from './arrow'
import { pillClass, type PillVariant } from './pill'

export interface ButtonProps extends ComponentPropsWithoutRef<'a'> {
  /**
   * One pill, four finishes — every call to action on the site uses it:
   * - primary — Ink fill: a section's main action, on Paper or colour.
   * - outline — Ink hairline: a secondary action, or one of several equals
   *   (e.g. the other pricing plans). It can sit beside a primary.
   * - inverse — Paper fill: the main action on Ink or Forest.
   * - outline-inverse — Paper hairline: a secondary action on Ink or Forest.
   */
  variant?: PillVariant
  /** Stretch the pill to its container, label left and arrow right. */
  full?: boolean
}

/** The Volt disc with the arrow, at the pill's end. */
export function PillArrow() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-volt text-ink transition-transform duration-[250ms] ease-out group-hover:rotate-45">
      <Arrow />
    </span>
  )
}

/**
 * The site's call to action, as the brand guide draws it: a pill with a Volt
 * arrow that turns 45° on hover. Copy starts with a verb, runs two to four
 * words, sentence case, no full stop. Pure CSS, so it needs no hydration.
 */
export default function Button({ variant = 'primary', full = false, className, children, href = '#', ...rest }: ButtonProps) {
  return (
    <a href={href} className={cn(pillClass(variant, full), className)} {...rest}>
      <span>{children}</span>
      <PillArrow />
    </a>
  )
}
