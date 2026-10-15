import { Dialog } from '@base-ui/react/dialog'
import { motion, useAnimationControls, useIsomorphicLayoutEffect, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../utils/cn'
import { useAmbientVideo } from './base/media'
import VideoPlayer from './video-player'

/** The portfolio's soft deceleration — same curve as the `ease-glide` token. */
const EASE = [0.22, 0.8, 0.18, 1] as const
/** The preview's corner (`rounded-card`) and the player's, in px. */
const CARD_RADIUS = 16
const PLAYER_RADIUS = 6
/** Morph out, morph back, and the backdrop's fade — seconds. */
const OPEN_S = 0.62
const CLOSE_S = 0.5
const FADE_S = 0.4
/** Reduced motion keeps the change, just short enough not to read as movement. */
const REDUCED_S = 0.2

type VideoLightboxProps = {
  /** The film itself — played full size, with sound and controls, in the lightbox. */
  src: string
  /** A lighter loop for the inline preview, if there is one. Defaults to `src`. */
  previewSrc?: string
  /** First frame: what the preview holds on before it plays, and what the lightbox shows while it buffers. */
  poster: string
  /** Names the trigger for screen readers and titles the dialog. */
  title: string
  /** The trigger's visible call to action. */
  cta?: string
  /** Classes for the trigger — it sizes itself to them (the preview fills it 16:9). */
  className?: string
  /** `id` + `data-track-location` for the GA4 click tracking in layouts/base.astro. */
  id?: string
  trackLocation?: string
}

/** Where the player grows from / shrinks back to: the preview's offset from screen centre, and its size as a scale. */
type Morph = { x: number; y: number; scale: number }

/**
 * A video that sits in the page as a silent, looping preview and grows out of
 * its own frame — with sound and the brand's own controls — when clicked.
 *
 * The preview is the trigger, so it carries no controls of its own: it plays
 * only while on screen, holds on its poster when motion is reduced, and pauses
 * while the lightbox is open so the two aren't buffering against each other.
 *
 * Both boxes are 16:9, so open and close are a plain translate and a uniform
 * scale between them — a true morph, with nothing stretched. When the preview
 * has scrolled away (or motion is reduced) the player fades instead.
 */
export default function VideoLightbox({ src, previewSrc, poster, title, cta = 'Watch the showreel', className, id, trackLocation }: VideoLightboxProps) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion() ?? false
  const player = useAnimationControls()
  const backdrop = useAnimationControls()
  const triggerRef = useRef<HTMLButtonElement>(null)
  /** Set while the player shrinks away, so a second Escape can't restart it. */
  const closing = useRef(false)
  /** The player itself, held as state: Base UI portals it in a tick after the dialog opens. */
  const [popup, setPopup] = useState<HTMLDivElement | null>(null)
  const preview = useAmbientVideo({ autoPlay: true, loop: true, muted: true, playsInline: true, controls: false, posterOnReduce: true })

  /**
   * The preview's box relative to the player's. The player is centred with
   * `left/top-1/2` and a -50% translate, so its untransformed centre is the
   * viewport's — no need to measure it mid-animation, when its own transform
   * would skew the reading.
   */
  const morphFrom = (): Morph | null => {
    const box = triggerRef.current?.getBoundingClientRect()
    if (reduce || !popup?.offsetWidth || !box?.width) return null
    const { clientWidth: vw, clientHeight: vh } = document.documentElement
    // Scrolled out of sight: there's nothing on screen to grow out of.
    if (box.bottom <= 0 || box.top >= vh) return null
    return { x: box.left + box.width / 2 - vw / 2, y: box.top + box.height / 2 - vh / 2, scale: box.width / popup.offsetWidth }
  }

  // Grow the player out of the preview, the moment the portal hands it over —
  // before paint, so it never shows a frame at full size first. (Isomorphic:
  // the island is server-rendered, where a layout effect would only warn.)
  useIsomorphicLayoutEffect(() => {
    if (!popup) return
    const from = morphFrom()
    player.set(from ? { ...from, borderRadius: CARD_RADIUS / from.scale, opacity: 1 } : { x: 0, y: 0, scale: 1, borderRadius: PLAYER_RADIUS, opacity: 0 })
    backdrop.set({ opacity: 0 })
    void player.start({ x: 0, y: 0, scale: 1, borderRadius: PLAYER_RADIUS, opacity: 1 }, { duration: reduce ? REDUCED_S : OPEN_S, ease: EASE })
    void backdrop.start({ opacity: 1 }, { duration: reduce ? REDUCED_S : FADE_S, ease: EASE })
  }, [popup, reduce])

  // Nothing to watch behind a full-screen player: hand the bandwidth to the
  // lightbox while it's open, and pick the loop back up once it has gone.
  useEffect(() => {
    const el = preview.ref.current
    if (!el) return
    if (open) el.pause()
    else if (!reduce) void el.play().catch(() => {})
  }, [open, reduce, preview.ref])

  /**
   * Base UI hides a closed popup on the spot, so the shrink has to play out
   * while the dialog still counts as open — only then does it close for real.
   */
  const onOpenChange = (next: boolean) => {
    if (next) return setOpen(true)
    if (closing.current) return
    closing.current = true
    // Re-measure: the page may have scrolled under the lightbox.
    const to = morphFrom()
    void Promise.all([
      player.start(to ? { ...to, borderRadius: CARD_RADIUS / to.scale } : { opacity: 0 }, { duration: reduce ? REDUCED_S : CLOSE_S, ease: EASE }),
      backdrop.start({ opacity: 0 }, { duration: reduce ? REDUCED_S : FADE_S, ease: EASE }),
    ]).then(() => {
      closing.current = false
      setOpen(false)
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger
        ref={triggerRef}
        id={id}
        data-track="play_showreel"
        data-track-location={trackLocation}
        className={cn(
          'group relative block w-full cursor-pointer overflow-hidden rounded-card bg-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-paper',
          className,
        )}
      >
        <video
          {...preview}
          src={previewSrc ?? src}
          poster={poster}
          aria-hidden
          className="block aspect-video w-full object-cover transition-transform duration-[900ms] ease-glide group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 from-0% via-ink/10 via-45% to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-xbg text-left text-paper">
          <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-full bg-volt text-ink transition-transform duration-[350ms] ease-glide group-hover:scale-105 motion-reduce:transition-none portrait:size-12">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5.2v13.6a.6.6 0 0 0 .92.5l10.7-6.8a.6.6 0 0 0 0-1l-10.7-6.8a.6.6 0 0 0-.92.5Z" /></svg>
          </span>
          <span className="text-p-sm font-semibold leading-tight">{cta}</span>
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop
          render={<motion.div initial={{ opacity: 0 }} animate={backdrop} />}
          className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-[3px]"
        />
        {/* Sized to the film rather than the screen, so a click beside it lands on the backdrop and closes. */}
        <Dialog.Popup
          ref={setPopup}
          render={<motion.div initial={{ opacity: 0 }} animate={player} />}
          className="fixed left-1/2 top-1/2 z-[100] aspect-video w-[min(98vw,calc(96dvh*16/9))] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-ink outline-none"
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {/* Mounted only once open, so `autoPlay` is safe here — it never reaches
              the server-rendered markup, and the click that opened the lightbox
              is the gesture that lets it start with sound. */}
          <VideoPlayer src={src} poster={poster} label={title} autoPlay className="h-full w-full">
            <Dialog.Close
              aria-label="Close video"
              className="grid size-11 place-items-center rounded-full bg-paper/10 text-paper backdrop-blur-sm transition-colors duration-200 hover:bg-volt hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
            </Dialog.Close>
          </VideoPlayer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
