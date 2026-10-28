import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const CHAIRS = '/images/expertise/chairs.webp'

/** Figma's pill type size; every other measure below is in ems of it. */
const FIGMA_PX = 24.332

/**
 * One cell of the chair sprite: the box size in Figma px, then the sheet's
 * size and offset inside it in % of that box, exactly as Figma crops it.
 */
type Chair = { w: number, h: number, sheetW: number, sheetH: number, left: number, top: number }
type Item = string | Chair

const chair = (w: number, h: number, sheetW: number, sheetH: number, left: number, top: number): Chair =>
  ({ w, h, sheetW, sheetH, left, top })

/**
 * The three rows as drawn in Figma: pills with a chair between each pair. A
 * row loops back on itself, so each one holds an even number of items and
 * strictly alternates; otherwise two pills or two chairs meet at the seam.
 */
const ROWS: Item[][] = [
  [
    'Brand development', chair(75.576, 87, 523.26, 454.55, -8.14, -323.23),
    'Ad creative', chair(72.138, 86.738, 535.71, 445.54, -111.9, -114.85),
    'Social assets', chair(88.558, 86.611, 494.51, 505.62, -102.33, -251.7),
    'Video production', chair(74, 82, 511.36, 459.18, -5.68, -120.41),
    'Photography', chair(75.205, 85.233, 500, 441.18, -300, -12.75),
    'Apps + software', chair(80.219, 86.068, 468.75, 436.89, -191.67, -308.74),
  ],
  [
    'Email design', chair(76.877, 76.877, 489.13, 489.13, -389.13, -21.74),
    'Copywriting', chair(72, 86, 523.26, 441.18, -8.14, -213.73),
    'Motion graphics', chair(69, 83, 548.78, 454.55, -114.63, -11.11),
    'Presentations', chair(73, 89, 511.36, 424.53, 0, -9.43),
    'Web + UI design', chair(82.726, 82.726, 454.55, 454.55, -175.76, -121.21),
    'Illustration', chair(75.205, 83.562, 500, 450, -300, -219),
  ],
  [
    chair(75.205, 82.726, 500, 454.55, -300, -121.21), 'Video production',
    chair(76.877, 82.726, 489.13, 454.55, -389.13, -220.2), 'Apps + software',
    chair(75.205, 83.562, 500, 450, -300, -219), 'Brand development',
    chair(80.219, 86.068, 468.75, 436.89, -191.67, -308.74), 'Email design',
    chair(76.877, 88.575, 489.13, 424.53, -389.13, -105.66), 'Copywriting',
    chair(76.877, 78.548, 489.13, 478.72, -386.96, -342.55), 'Social assets',
  ],
]

/** Drift direction per row (−1 leftward), and where in its loop each row starts. */
const DRIFT = [-1, 1, -1]
const START = [0.12, 0.45, 0.3]
/** Seconds for one full pass of each row; the outer two differ so they don't drift in step. */
const LOOP_S = [60, 60, 72]

const em = (px: number) => `${px / FIGMA_PX}em`

/**
 * "Expertise, on demand." over three rows of services drifting in alternate
 * directions, a 3D chair between each pill. GSAP runs each row as an endless
 * loop over two copies of its items, eases it to a crawl under the pointer and
 * pushes it along with the page's scroll speed. Reduced motion leaves the rows
 * still.
 */
export default function Expertise() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
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
        const [from, to] = DRIFT[i] < 0 ? [0, -50] : [-50, 0]
        const tween = gsap.fromTo(track, { xPercent: from }, { xPercent: to, duration: LOOP_S[i], ease: 'none', repeat: -1 })
        tween.progress(START[i])

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
    })
  }, { scope: root })

  return (
    <Section id="services" pad="bg" bleed className="overflow-hidden bg-ink text-paper">
      <div ref={root}>
        <Heading.H1 data-reveal className="px-[var(--container-margin)] text-center text-[clamp(2.75rem,2.487rem+1.127vw,3.75rem)] leading-[1.05] tracking-[-0.01em]">
          Expertise, <Em>on demand.</Em>
        </Heading.H1>

        <ul className="sr-only">
          {[...new Set(ROWS.flat().filter((item) => typeof item === 'string'))].map((label) => <li key={label}>{label}</li>)}
        </ul>

        <div
          data-reveal
          aria-hidden="true"
          className="mt-[clamp(2rem,1.25rem+2vw,3.5rem)] flex flex-col text-[clamp(0.9375rem,0.796rem+0.604vw,1.52rem)] font-medium leading-none"
        >
          {ROWS.map((items, r) => (
            <div key={r} className="flex h-[3.45em] items-center">
              <div data-track className="flex w-max shrink-0 will-change-transform">
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
      <span className="mr-[1.67em] shrink-0 whitespace-nowrap rounded-full bg-soft-volt px-[1.2em] py-[0.667em] text-ink">
        {item}
      </span>
    )
  }
  return (
    <span className="relative mr-[1.67em] shrink-0 overflow-hidden" style={{ width: em(item.w), height: em(item.h) }}>
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
  )
}
