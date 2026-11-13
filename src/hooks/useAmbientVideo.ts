import { useEffect, useRef } from 'react'
import { useAnimationsPaused } from './useMotionPreference'

type AmbientOptions = {
  autoPlay: boolean
  loop: boolean
  muted: boolean
  playsInline: boolean
  controls: boolean
}

/**
 * The playback props an ambient (decorative b-roll) <video> needs, plus the ref
 * it must be given. Ambient means looping, muted and inline, playing on its own
 * — the only combination browsers allow to start unprompted.
 *
 * Two things a raw <video> gets wrong that this handles:
 *   1. React sets `muted` as an attribute, not the DOM *property*, so playback
 *      is silently blocked — we set the property on a ref to make it stick.
 *   2. Chrome pauses muted b-roll that starts playing out of view and never
 *      resumes it, so a video hydrated below the fold would sit frozen on its
 *      first frame. Playback follows visibility instead (started here, never by
 *      an `autoplay` attribute): it plays while on screen and pauses when it
 *      leaves (no wasted decoding off screen either).
 *
 * Shared by the project covers, benefit cards and showreel preview.
 */
export function useAmbientVideo({ autoPlay, loop, muted, playsInline, controls }: AmbientOptions) {
  const ref = useRef<HTMLVideoElement>(null)
  const paused = useAnimationsPaused()

  // Reflect `muted` to the property, not just the attribute, or playback is
  // blocked even though the markup says muted.
  useEffect(() => {
    if (ref.current) ref.current.muted = muted
  }, [muted])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!autoPlay || paused) {
      el.pause()
      return
    }
    let visible = false
    const syncPlayback = () => {
      if (visible && !document.hidden) {
        el.preload = 'auto'
        void el.play().catch(() => {})
      } else el.pause()
    }
    // Play only while on screen — see (2) above. The browser can still
    // refuse (power saving, data saver); that's its call to make, so let
    // the rejection go.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncPlayback()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', syncPlayback)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      el.pause()
    }
  }, [autoPlay, paused])

  return {
    ref,
    loop,
    muted,
    playsInline,
    controls,
    preload: 'metadata',
  } as const
}
