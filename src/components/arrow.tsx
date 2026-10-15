import { cn } from '../utils/cn'

/** The brand's up-right arrow, as drawn in the guide's buttons. Stroke follows `currentColor`. */
export default function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn('size-3.5', className)}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}
