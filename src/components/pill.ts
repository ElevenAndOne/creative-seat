import { cn } from '../utils/cn'

export type PillVariant = 'primary' | 'outline' | 'inverse' | 'outline-inverse' | 'brand'

/** Figma "Button": 40px tall (44 below desktop), 24px sides, 12 gap, UI/Button 14/20 Medium, fully rounded, no icon. */
const PILL =
  'inline-flex h-10 tablet:h-11 items-center justify-center gap-3 whitespace-nowrap rounded-full px-6 text-ui font-medium transition-[scale,transform,background-color,border-color,color] duration-200 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 ' +
  // Figma Theme action/disabled — Forest on Chalk (10.9:1). `aria-disabled` covers <a>, which never matches :disabled.
  'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-chalk disabled:text-forest disabled:hover:bg-chalk disabled:hover:text-forest disabled:active:scale-100 ' +
  'aria-disabled:cursor-not-allowed aria-disabled:border-transparent aria-disabled:bg-chalk aria-disabled:text-forest aria-disabled:hover:bg-chalk aria-disabled:hover:text-forest aria-disabled:active:scale-100'

/*
 * Code names → Figma Button (8:13431) Appearance:
 * - primary         = Inverse (Ink fill)
 * - inverse         = Default (Paper fill)
 * - outline         = Outline (the home-page instance's neutral-300 stroke)
 * - brand           = Branded, Width=Hug (Volt fill)
 * - outline-inverse = code-only, for an outline on Ink or Forest
 * Figma Branded/Fill (Volt label on Paper) is deliberately not built: it fails AA.
 */
const VARIANTS: Record<PillVariant, string> = {
  primary: 'bg-ink text-paper hover:bg-forest focus-visible:outline-ink',
  outline: 'border border-muted bg-paper text-ink hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-ink',
  // Two-tone focus: an Ink band hugging the pill (fills the 4px offset gap) inside the Paper outline, so
  // the indicator clears 3:1 on every surface this pill sits on — Paper ring on Ink/Forest, Ink band on Volt.
  inverse: 'bg-paper text-ink hover:bg-soft-volt focus-visible:outline-paper focus-visible:ring-4 focus-visible:ring-ink',
  'outline-inverse': 'border border-paper/60 text-paper hover:border-paper hover:bg-paper hover:text-ink focus-visible:outline-paper',
  brand: 'bg-volt text-ink hover:bg-soft-volt focus-visible:outline-ink',
}

/**
 * The call-to-action pill's classes (see components/link-button.tsx), also for
 * a <button> that has to look like one — a form's submit.
 */
export const pillClass = (variant: PillVariant = 'primary', full = false) => cn(PILL, VARIANTS[variant], full && 'flex w-full')
