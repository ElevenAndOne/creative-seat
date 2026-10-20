import { cn } from '../utils/cn'

export type PillVariant = 'primary' | 'outline' | 'inverse' | 'outline-inverse'

const PILL =
  'group inline-flex h-11 items-center gap-2.5 whitespace-nowrap rounded-full pl-[18px] pr-1.5 text-[0.9375rem] font-medium leading-none transition-[transform,background-color,border-color,color] duration-200 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4'

const VARIANTS: Record<PillVariant, string> = {
  primary: 'bg-ink text-paper focus-visible:outline-ink',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-paper focus-visible:outline-ink',
  inverse: 'bg-paper text-ink focus-visible:outline-paper',
  'outline-inverse': 'border border-paper/60 text-paper hover:border-paper hover:bg-paper hover:text-ink focus-visible:outline-paper',
}

/**
 * The call-to-action pill's classes (see components/autton.tsx), also for a
 * <button> that has to look like one — a form's submit. Pair it with
 * <PillArrow /> at the end.
 */
export const pillClass = (variant: PillVariant = 'primary', full = false) => cn(PILL, VARIANTS[variant], full && 'flex w-full justify-between')
