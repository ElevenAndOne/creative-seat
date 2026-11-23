import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { useAnimationsPaused } from '../hooks/useMotionPreference'
import { Section } from '../components/base/section'
import Heading from '../components/heading'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const CHAIRS = '/images/expertise/chairs.webp'

/**
 * One cell of the chair sprite: the chair's own crop box in Figma px (only its
 * proportions matter; each chair is fitted, centred, into an 80×80 slot), then
 * the sheet's size and offset inside that crop in %, exactly as Figma crops it.
 */
type Chair = { w: number, h: number, sheetW: number, sheetH: number, left: number, top: number }
type Item = string | Chair

const chair = (w: number, h: number, sheetW: number, sheetH: number, left: number, top: number): Chair =>
  ({ w, h, sheetW, sheetH, left, top })

/**
 * The three rows in Figma's order: every row runs pill first, each chair after
 * its pill (seat/18 down to seat/01). A row loops back on itself, so each one
 * holds an even number of items and strictly alternates; otherwise two pills
 * or two chairs meet at the seam.
 */
const ROWS: Item[][] = [
  [
    'Brand development', chair(75.576, 87, 523.26, 454.55, -8.14, -323.23),
    'Ad creative', chair(72.138, 86.738, 535.71, 445.54, -111.9, -114.85),
    'Social assets', chair(88.558, 86.611, 494.51, 505.62, -102.33, -251.7),
    'Video production', chair(74, 82, 511.36, 459.18, -5.68, -120.41),
    'Photography', chair(75.205, 85.233, 500, 441.18, -300, -12.75),
    'Apps + software', chair(80, 81.6, 454.55, 445.54, -175.76, -11.88),
  ],
  [
    'Email design', chair(76.877, 76.877, 489.13, 489.13, -389.13, -21.74),
    'Copywriting', chair(72, 86, 523.26, 441.18, -8.14, -213.73),
    'Motion graphics', chair(69, 83, 548.78, 454.55, -114.63, -11.11),
    'Presentations', chair(73, 89, 511.36, 424.53, 0, -9.43),
    'Web + UI design', chair(82.726, 82.726, 454.55, 454.55, -175.76, -121.21),
    'Illustration', chair(59.2, 79.2, 576.92, 432.69, -358.97, -306.73),
  ],
  [
    'Video production', chair(75.205, 82.726, 500, 454.55, -300, -121.21),
    'Apps + software', chair(76.877, 82.726, 489.13, 454.55, -389.13, -220.2),
    'Brand development', chair(75.205, 83.562, 500, 450, -300, -219),
    'Email design', chair(80.219, 86.068, 468.75, 436.89, -191.67, -308.74),
    'Copywriting', chair(76.877, 88.575, 489.13, 424.53, -389.13, -105.66),
    'Social assets', chair(76.877, 78.548, 489.13, 478.72, -386.96, -342.55),
  ],
]

/** Drift direction per row (−1 leftward). */
const DRIFT = [-1, 1, -1]
/**
 * Where each row rests (server render, paused, and the loop's first frame): the
 * left edge of its first item, in px from the viewport's left edge, as Figma
 * places it at 1440 (container 120 + gutter 40 + the row's own x).
 */
const START_PX = [32, -68, -247.5]
/** Seconds for one full pass of each row; the outer two differ so they don't drift in step. */
const LOOP_S = [60, 60, 72]
const SERVICE_LABELS = [...new Set(ROWS.flat().filter((item) => typeof item === 'string'))]

/**
 * The resting offset as a transform that needs no measuring. A positive offset
 * is shifted back by one copy (50% of the two-copy track), so copy 1 fills the
 * gap at the left edge.
 */
const startTransform = (r: number) =>
  START_PX[r] > 0 ? `translateX(calc(${START_PX[r]}px - 50%))` : `translateX(${START_PX[r]}px)`

/**
 * "Expertise, on demand." over three rows of services drifting in alternate
 * directions, a 3D chair between each pill. GSAP runs each row as an endless
 * loop over two copies of its items, eases it to a crawl under the pointer and
 * pushes it along with the page's scroll speed.
 */
export default function Expertise() {
  const root = useRef<HTMLDivElement>(null)
  const paused = useAnimationsPaused()

  useGSAP(() => {
    if (paused) {
      gsap.set('[data-reveal]', { autoAlpha: 1, y: 0 })
      return
    }
    gsap.from('[data-reveal]', {
      autoAlpha: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: root.current, start: 'top 75%' },
    })

    // Each row's speed is its hover factor times the shared scroll boost.
    const scroll = { boost: 1 }
    const rows = gsap.utils.toArray<HTMLElement>('[data-track]').map((track, i) => {
      // A track holds two identical copies, so 50% is exactly one copy along.
      // x: 0 drops the server-rendered starting offset GSAP would otherwise read in as pixels.
      const [from, to] = DRIFT[i] < 0 ? [0, -50] : [-50, 0]
      const tween = gsap.fromTo(track, { x: 0, xPercent: from }, { xPercent: to, duration: LOOP_S[i], ease: 'none', repeat: -1 })
      // Start on the same frame the server rendered: START_PX folded into one copy.
      const copy = track.offsetWidth / 2
      const s = START_PX[i] > 0 ? START_PX[i] - copy : START_PX[i]
      tween.progress(DRIFT[i] < 0 ? -s / copy : (s + copy) / copy)

      const hover = { speed: 1 }
      const row = track.parentElement!
      const slow = () => gsap.to(hover, { speed: 0.2, duration: 0.6, overwrite: true })
      const resume = () => gsap.to(hover, { speed: 1, duration: 0.6, overwrite: true })
      row.addEventListener('pointerenter', slow)
      row.addEventListener('pointerleave', resume)
      return { tween, hover, row, slow, resume }
    })

    const tick = () => rows.forEach(({ tween, hover }) => tween.timeScale(hover.speed * scroll.boost))
    gsap.ticker.add(tick)

    // Scrolling the page pushes every row along, then lets it settle back.
    // Off screen the loops pause.
    ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: ({ isActive }) => rows.forEach(({ tween }) => (isActive ? tween.resume() : tween.pause())),
      onUpdate: ({ getVelocity }) => {
        scroll.boost = 1 + Math.min(Math.abs(getVelocity()) / 300, 5)
        gsap.to(scroll, { boost: 1, duration: 1.2, ease: 'power2.out', overwrite: true })
      },
    })

    return () => {
      gsap.ticker.remove(tick)
      rows.forEach(({ row, slow, resume }) => {
        row.removeEventListener('pointerenter', slow)
        row.removeEventListener('pointerleave', resume)
      })
    }
  }, { scope: root, dependencies: [paused], revertOnUpdate: true })

  return (
    <Section id="services" bleed className="overflow-hidden bg-ink text-paper">
      <div ref={root}>
        <Heading.H1 data-reveal className="px-[var(--container-margin)] text-center">
          Expertise, on demand.
        </Heading.H1>

        {/* The full list for assistive tech; the rows below are decoration. */}
        <ul className="sr-only">
          {SERVICE_LABELS.map((label) => <li key={label}>{label}</li>)}
        </ul>

        {/* The same three rows render on the server, paused and playing, so the
            section's height never changes (and in-page anchors land true):
            paused, each row simply stands still at its starting offset. */}
        <div
          data-reveal
          aria-hidden="true"
          className="mt-xlg flex flex-col gap-xxsm"
        >
          {ROWS.map((items, r) => (
            <div key={r} className="flex h-20 items-center">
              <div
                data-track
                className="flex w-max shrink-0 will-change-transform"
                style={{ transform: startTransform(r) }}
              >
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center">
                    {items.map((item, i) => <Cell key={i} item={item} />)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Cell({ item }: { item: Item }) {
  if (typeof item === 'string') {
    return (
      <span className="mr-md shrink-0 whitespace-nowrap rounded-full bg-soft-volt px-xbg py-xsm text-p-md text-ink">
        {item}
      </span>
    )
  }
  // Fit the chair's crop box inside the square slot, keeping its proportions.
  const side = Math.max(item.w, item.h)
  return (
    <span className="mr-md flex size-20 shrink-0 items-center justify-center">
      <span className="relative overflow-hidden" style={{ width: `${(item.w / side) * 100}%`, height: `${(item.h / side) * 100}%` }}>
        <img
          src={CHAIRS}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute max-w-none select-none"
          style={{ width: `${item.sheetW}%`, height: `${item.sheetH}%`, left: `${item.left}%`, top: `${item.top}%` }}
        />
      </span>
    </span>
  )
}
