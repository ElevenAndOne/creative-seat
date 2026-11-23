import type { ComponentPropsWithRef } from 'react'
import { cn } from '../utils/cn'
import { pillClass, type PillVariant } from './pill'

export interface LinkButtonProps extends ComponentPropsWithRef<'a'> {
  href: string
  /**
   * One pill, five finishes — every call to action on the site uses it:
   * - primary — Ink fill (Figma "Inverse"): a section's main action, on Paper or colour.
   * - outline — muted hairline on Paper (Figma "Outline"): a secondary action,
   *   or one of several equals (e.g. the other pricing plans).
   * - inverse — Paper fill (Figma "Default"): the main action on Ink, Forest or Volt.
   * - outline-inverse — Paper hairline (code-only): a secondary action on Ink or Forest.
   * - brand — Volt fill, Ink label (Figma "Branded", Hug): a main action on
   *   Paper or Chalk where the campaign colour should lead.
   * Disabled: pass `aria-disabled` (or `disabled` on a <button>) for Figma's
   * action/disabled finish, Forest on Chalk.
   */
  variant?: PillVariant
  /** Stretch the pill to its container, label centred. */
  full?: boolean
}

/**
 * The site's call to action, as the Figma website file draws it: a 40px pill
 * (44px below desktop) with a centred label. Copy starts with a verb, runs two to four words,
 * sentence case, no full stop. Pure CSS, so it needs no hydration.
 */
export default function LinkButton({ variant = 'primary', full = false, className, children, href, ...rest }: LinkButtonProps) {
  return (
    <a href={href} className={cn(pillClass(variant, full), className)} {...rest}>
      {children}
    </a>
  )
}
