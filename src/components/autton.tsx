import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'
import Arrow from './arrow'

type Variant = 'primary' | 'outline' | 'inverse' | 'outline-inverse'

export interface ButtonProps extends ComponentPropsWithoutRef<'a'> {
  /**
   * One pill, four finishes — every call to action on the site uses it:
   * - primary — Ink fill: a section's main action, on Paper or colour.
   * - outline — Ink hairline: a secondary action, or one of several equals
   *   (e.g. the other pricing plans). It can sit beside a primary.
   * - inverse — Paper fill: the main action on Ink or Forest.
   * - outline-inverse — Paper hairline: a secondary action on Ink or Forest.
   */
  variant?: Variant
  /** Stretch the pill to its container, label left and arrow right. */
  full?: boolean
}

const PILL =
  'group inline-flex h-11 items-center gap-2.5 whitespace-nowrap rounded-full pl-[18px] pr-1.5 text-[0.9375rem] font-medium leading-none transition-[transform,background-color,border-color,color] duration-200 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink text-paper focus-visible:outline-ink',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-paper focus-visible:outline-ink',
  inverse: 'bg-paper text-ink focus-visible:outline-paper',
  'outline-inverse': 'border border-paper/60 text-paper hover:border-paper hover:bg-paper hover:text-ink focus-visible:outline-paper',
}

/**
 * The site's call to action, as the brand guide draws it: a pill with a Volt
 * arrow that turns 45° on hover. Copy starts with a verb, runs two to four
 * words, sentence case, no full stop. Pure CSS, so it needs no hydration.
 */
export default function Button({ variant = 'primary', full = false, className, children, href = '#', ...rest }: ButtonProps) {
  return (
    <a href={href} className={cn(PILL, VARIANTS[variant], full && 'flex w-full justify-between', className)} {...rest}>
      <span>{children}</span>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-volt text-ink transition-transform duration-[250ms] ease-out group-hover:rotate-45">
        <Arrow />
      </span>
    </a>
  )
}
