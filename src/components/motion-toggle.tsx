import { setAnimationsPaused, useAnimationsPaused, useReducedMotion } from '../hooks/useMotionPreference'
import { cn } from '../utils/cn'

/** A single page-wide control for decorative loops; explicit video playback stays independent. */
export default function MotionToggle({ className }: { className?: string }) {
  const paused = useAnimationsPaused()
  const reduced = useReducedMotion()
  return (
    <button
      type="button"
      aria-pressed={paused}
      disabled={reduced}
      onClick={() => setAnimationsPaused(!paused)}
      className={cn('min-h-11 text-p-xs underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:no-underline', className)}
    >
      {reduced ? 'Reduced motion on' : paused ? 'Resume animations' : 'Pause animations'}
    </button>
  )
}
