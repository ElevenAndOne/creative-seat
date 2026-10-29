import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
  type PanInfo,
} from 'motion/react'
import { useEffect, useRef } from 'react'
import { heroCards } from '../content'
import { cn } from '../utils/cn'

/** How long each card holds the front before the fan moves on by itself. */
const STEP_MS = 3200
/** One step of the fan, as a share of the stage's width a drag has to travel. */
const DRAG_STEP = 0.26

const N = heroCards.length
const SPRING = { type: 'spring', stiffness: 110, damping: 22, mass: 1 } as const
const mod = (n: number, m: number) => ((n % m) + m) % m

/**
 * A card's place in the fan from its signed distance `d` to the front (0 is
 * the front, ±1 the inner pair, ±2 the outer pair; fractions mid-move). Cards
 * step back in depth, turn to face the centre like cover flow, and shrink.
 * Sideways spread is in container units, so the fan scales with its column.
 * `spread` (0 → 1) fans the cards out from a single stack on load.
 */
function pose(d: number, spread: number) {
  const a = Math.abs(d)
  const s = Math.sign(d)
  const ac = Math.min(a, 2.4)
  const x = s * (29 * ac - 4.5 * ac * ac) * spread // cqw, before perspective pulls it in
  const z = -a * 110 * spread // px
  const turn = -s * Math.min(a, 1.8) * 16 * spread // deg
  const scale = 1 - (1 - 1 / (1 + 0.36 * a + 0.03 * a * a)) * spread
  return `translate3d(${x.toFixed(3)}cqw, 0, ${z.toFixed(1)}px) rotateY(${turn.toFixed(2)}deg) scale(${scale.toFixed(4)})`
}

/** Fully there out to the outer pair, gone by the time a card is parked behind them. */
const visibility = (a: number) => (a <= 2 ? 1 : Math.max(0, 1 - (a - 2) / 0.7))

/**
 * Hero fan of work: a large front card with two smaller cards turned in on
 * each side, cycling through `heroCards`. It's draggable — grab and throw it
 * either way, and it settles on the nearest card — and moves on by itself
 * every few seconds when left alone. On load the cards fan out from a single
 * stack. The cycle pauses while the hero is off screen or the tab is hidden.
 *
 * The markup is identical on server and client: every card's pose is derived
 * from motion values that start at the same values in both.
 * Purely decorative — the images carry no information the copy doesn't.
 */
export default function HeroStack({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })

  /** Which card is at the front — fractional mid-move, unbounded (it wraps). */
  const pos = useMotionValue(0)
  const spread = useMotionValue(0)
  const motionRef = useRef<AnimationPlaybackControls | null>(null)
  const draggingRef = useRef(false)
  const dragFromRef = useRef(0)
  const lastTouchRef = useRef(0)

  const goTo = (target: number, velocity = 0) => {
    motionRef.current?.stop()
    motionRef.current = animate(pos, target, { ...SPRING, velocity })
  }

  // Fan out on load.
  useEffect(() => {
    const controls = animate(spread, 1, { type: 'spring', stiffness: 55, damping: 15, delay: 0.25 })
    return () => controls.stop()
  }, [spread])

  // Move on every few seconds, unless the visitor has just been dragging.
  useEffect(() => {
    if (!inView) return
    const id = window.setInterval(() => {
      if (document.hidden || draggingRef.current || Date.now() - lastTouchRef.current < STEP_MS) return
      goTo(Math.round(pos.get()) + 1)
    }, STEP_MS)
    return () => window.clearInterval(id)
    // goTo only closes over refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, pos])

  const stepPx = () => (ref.current?.offsetWidth ?? 500) * DRAG_STEP

  const onPanStart = () => {
    motionRef.current?.stop()
    draggingRef.current = true
    dragFromRef.current = pos.get()
  }
  const onPan = (_: PointerEvent, info: PanInfo) => {
    pos.set(dragFromRef.current - info.offset.x / stepPx())
  }
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    draggingRef.current = false
    lastTouchRef.current = Date.now()
    // Throw: carry the release velocity a little further (two cards at most,
    // however hard the flick), then settle on a card.
    const velocity = -info.velocity.x / stepPx()
    const carry = Math.max(-2, Math.min(2, velocity * 0.18))
    goTo(Math.round(pos.get() + carry), Math.max(-12, Math.min(12, velocity)))
  }

  return (
    <motion.div
      ref={ref}
      aria-hidden
      onPanStart={onPanStart}
      onPan={onPan}
      onPanEnd={onPanEnd}
      className={cn('@container relative aspect-[554.6/391] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing', className)}
    >
      {/* The 3D stage: one perspective for every card, but deliberately not
          preserve-3d. In a shared 3D scene two cards trading places — turned
          towards each other at the same depth — have planes that cross, so
          one visibly cuts through the other. Here each card is drawn whole in
          its own pose and they're layered by distance from the front instead
          (see `zIndex` in Card), so the nearer card always covers the
          further one. */}
      <div className="absolute inset-0 [perspective:1500px]">
        {heroCards.map((src, i) => (
          <Card key={src} src={src} index={i} pos={pos} spread={spread} />
        ))}
      </div>
    </motion.div>
  )
}

function Card({ src, index, pos, spread }: { src: string; index: number; pos: MotionValue<number>; spread: MotionValue<number> }) {
  // Signed distance to the front, wrapped so the fan loops.
  const d = useTransform(pos, (p) => mod(index - p + N / 2, N) - N / 2)
  const transform = useTransform([d, spread], ([d, s]: number[]) => pose(d, s))
  // Until the fan has spread, only the front card shows.
  const opacity = useTransform([d, spread], ([d, s]: number[]) => visibility(Math.abs(d)) * (Math.abs(d) < 0.5 ? 1 : s))
  // Cards further back sit a little in shadow.
  const shade = useTransform(d, (d) => Math.min(Math.abs(d), 2) * 0.13)
  // Layering: nearer the front draws on top. Fine-grained, so two cards
  // trading places swap layers exactly as they pass the halfway mark.
  const zIndex = useTransform(d, (d) => 1000 - Math.round(Math.abs(d) * 100))

  const first = Math.abs(mod(index + N / 2, N) - N / 2)

  return (
    <motion.div
      className="absolute left-[16cqw] top-0 h-full w-[68cqw] overflow-hidden rounded-[1.3rem] bg-chalk shadow-2xl shadow-ink/30 [backface-visibility:hidden] will-change-transform"
      style={{ transform, opacity, zIndex }}
    >
      <img
        src={src}
        alt=""
        loading={first <= 2 ? 'eager' : 'lazy'}
        fetchPriority={first === 0 ? 'high' : first <= 2 ? 'auto' : 'low'}
        decoding="async"
        draggable={false}
        className="pointer-events-none h-full w-full select-none object-cover"
      />
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: shade }} />
    </motion.div>
  )
}
