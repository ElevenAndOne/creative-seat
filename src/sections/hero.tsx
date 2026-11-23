import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import { useRef } from 'react'
import LinkButton from '../components/link-button'
import BrandLogo from '../components/brand-logo'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { heroTiles, logos } from '../content'
import type { HeroTile } from '../content/sections'
import { useAmbientVideo } from '../hooks/useAmbientVideo'
import { useAnimationsPaused } from '../hooks/useMotionPreference'
import { demoPage } from '../utils/contact'

gsap.registerPlugin(useGSAP, ScrollTrigger, InertiaPlugin)

const EASE = [0.16, 1, 0.3, 1] as const
const MARQUEE_FADE = 'linear-gradient(to right, transparent, #000 16.35%, #000 82.69%, transparent)'
const MARQUEE_MASK = { maskImage: MARQUEE_FADE, WebkitMaskImage: MARQUEE_FADE }

/** Cruising speed of the tile strip, in px per second. */
const TILE_SPEED = 40
/** Copies of the tiles in the strip: enough to cover a 2560px window at any offset. */
const TILE_COPIES = 3

/**
 * The work tiles as an endless horizontal strip. It drifts left while the page
 * scrolls down and right while it scrolls up; a scroll flicks it faster, then
 * InertiaPlugin lets the speed glide back down to cruising in the new direction.
 *
 * The track holds identical copies of the tiles and is centred, so the
 * server render (and a paused page) shows the middle copy centred and bleeding
 * off both edges. The offset wraps within one copy's width, so the loop is
 * seamless either way; off screen the strip stops.
 */
function HeroTiles({ paused }: { paused: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = track.current
    if (paused || !el) return

    let copy = el.offsetWidth / TILE_COPIES
    let wrap = gsap.utils.wrap(-copy / 2, copy / 2)
    const measure = () => {
      copy = el.offsetWidth / TILE_COPIES
      wrap = gsap.utils.wrap(-copy / 2, copy / 2)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(el)

    // speed: signed multiple of TILE_SPEED; negative drifts left. dir is where it settles.
    const state = { x: 0, speed: -1, dir: -1, active: true }
    const setX = gsap.quickSetter(el, 'x', 'px')
    const tick = (_time: number, deltaMs: number) => {
      if (!state.active) return
      state.x = wrap(state.x + state.speed * TILE_SPEED * (deltaMs / 1000))
      setX(state.x)
    }
    gsap.ticker.add(tick)

    ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: ({ isActive }) => { state.active = isActive },
      onUpdate: ({ direction, getVelocity }) => {
        // Scrolling down (direction 1) sends the strip left.
        state.dir = -direction
        const push = Math.min(Math.abs(getVelocity()) / 150, 12)
        state.speed = state.dir * (1 + push)
        // Hand the extra speed to InertiaPlugin, which decelerates it naturally and lands on cruising in the new direction.
        gsap.to(state, {
          inertia: { speed: { velocity: -state.dir * push * 2, end: state.dir }, duration: { min: 0.8, max: 2 } },
          overwrite: true,
        })
      },
    })

    return () => {
      gsap.ticker.remove(tick)
      observer.disconnect()
    }
  }, { scope: root, dependencies: [paused], revertOnUpdate: true })

  return (
    <div ref={root} aria-hidden className="flex w-full justify-center overflow-hidden">
      {/* Centred and wider than the window, so it spills equally either side. */}
      <div ref={track} className="flex w-max shrink-0 will-change-transform">
        {Array.from({ length: TILE_COPIES }, (_, copy) =>
          heroTiles.map((tile) => <Tile key={`${copy}-${tileKey(tile)}`} tile={tile} />),
        )}
      </div>
    </div>
  )
}

const tileKey = (tile: HeroTile) => (tile.kind === 'image' ? tile.src : tile.mp4)
const TILE = 'relative mr-3 aspect-[280/303] w-[17.5rem] shrink-0 overflow-hidden rounded-sm bg-forest tablet:w-[13.75rem] portrait:w-40'
const FILL = 'pointer-events-none absolute inset-0 h-full w-full select-none object-cover'

/** One tile of work: a still or a muted loop, with the client's logo laid over it when the piece keeps it separate. */
function Tile({ tile }: { tile: HeroTile }) {
  return (
    <div className={TILE}>
      {tile.kind === 'image' ? (
        <img src={tile.src} alt="" width={280} height={303} loading="eager" decoding="async" draggable={false} className={FILL} />
      ) : (
        <TileVideo tile={tile} />
      )}
      {tile.logo && (
        <img
          src={tile.logo.src}
          alt=""
          decoding="async"
          draggable={false}
          className="pointer-events-none absolute h-auto select-none"
          style={{ left: tile.logo.left, top: tile.logo.top, width: tile.logo.width }}
        />
      )}
    </div>
  )
}

/**
 * A tile's loop. Playback follows visibility (useAmbientVideo), so of the
 * strip's copies only the ones on screen decode; the poster holds the frame
 * until then, and while motion is paused. A tile that doesn't loop plays
 * through each time it comes into view and holds its last frame.
 */
function TileVideo({ tile }: { tile: Extract<HeroTile, { kind: 'video' }> }) {
  const playback = useAmbientVideo({ autoPlay: true, loop: tile.loop ?? true, muted: true, playsInline: true, controls: false })
  return (
    <video {...playback} poster={tile.poster} disablePictureInPicture className={FILL}>
      <source src={tile.webm} type="video/webm" />
      <source src={tile.mp4} type="video/mp4" />
    </video>
  )
}

/**
 * The first screen on the dark night gradient, following Figma's centred hero
 * (Creative Seat — Website, node 158:1729): the Display headline, a line of
 * support and the Volt CTA stacked down the middle, then the client-logo
 * marquee across the page's content column, then a row of work tiles —
 * stills and loops — running endlessly with the page's scroll (HeroTiles).
 *
 * The section clips the tile row, so the page never scrolls sideways.
 */
export default function Hero() {
  const paused = useAnimationsPaused()
  // Copy rises in just ahead of the logos and tiles.
  const rise = (delay: number) => ({
    initial: paused ? false as const : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: paused ? 0 : 0.7, ease: EASE, delay: paused ? 0 : delay },
  })

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-night py-[var(--section-pad-sm)] text-paper">
      {/* Figma "Channel introduction": centred, 24px apart, headline up to 720px and the line up to 560px. */}
      <div className="mx-auto flex w-full max-w-[var(--container-width)] flex-col items-center gap-xbg pt-xhg text-center portrait:pt-20">
        <motion.div {...rise(0.05)} className="max-w-[45rem]">
          <Heading.Display as="h1">
            <span className="block">Increase your</span> brand’s creative capability.
          </Heading.Display>
        </motion.div>
        <motion.div {...rise(0.18)} className="max-w-[35rem]">
          <Paragraph>
            Scale your brand’s content production through a simple subscription to your very own specialised creative team.
          </Paragraph>
        </motion.div>
        <motion.div {...rise(0.31)}>
          <LinkButton href={demoPage} id="hero-book-demo" data-track="book_demo_click" data-track-location="hero" variant="brand">
            Book a demo
          </LinkButton>
        </motion.div>
      </div>

      {/* Client logos: an endless marquee across the full column, fading out at both edges. */}
      <motion.div {...rise(0.4)} id="clients" className="relative mx-auto w-full max-w-[var(--container-width)] pt-xlg">
        <h2 className="sr-only">Creative partner to worldwide brands</h2>
        {/* Figma's Logos mask fades over 16.35% / 82.69%, wider than the
            shared .cs-marquee default, so the stops are set here. */}
        <div className="cs-marquee overflow-hidden" style={MARQUEE_MASK}>
          {/* Two identical runs side by side; the track slides one run's
              width, then loops — seamless because the second run is where
              the first began. The copy is hidden from assistive tech. */}
          <div className="cs-marquee-track flex w-max">
            {[0, 1].map((run) => (
              <div key={run} aria-hidden={run === 1 || undefined} className="flex shrink-0 items-center gap-x-xlg pr-xlg">
                {logos.map((logo) => (
                  <BrandLogo key={logo.name} src={logo.src} name={logo.name} className="h-6 brightness-0 invert-[0.9] landscape:h-6" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Work tiles in an endless strip that follows the page's scroll direction. */}
      <motion.div {...rise(0.5)} className="pt-xxxbg">
        <HeroTiles paused={paused} />
      </motion.div>
    </section>
  )
}
