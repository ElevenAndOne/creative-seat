import { cn } from '../utils/cn'

/**
 * The "Creative Seat" wordmark as the design sets it: Poppins, "Creative" in
 * Bold and "Seat" in Regular. Size and colour come from the caller; `spaced`
 * adds the word gap the footer uses (the nav runs the two words together).
 */
export default function Wordmark({ spaced = false, className }: { spaced?: boolean; className?: string }) {
  return (
    <span className={cn('whitespace-nowrap font-display leading-none', className)}>
      <span className="font-bold">Creative</span>
      {spaced && ' '}
      <span className="font-normal">Seat</span>
    </span>
  )
}
