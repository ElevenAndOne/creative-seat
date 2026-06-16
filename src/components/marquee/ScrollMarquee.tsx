import { useEffect, useRef, useState } from 'react'
import { useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { cn } from '../../utils/cn'
import { useMediaFlag } from '../../hooks/useMediaFlag'
import { projects } from '../../content'
import { COLUMN_CONFIG, TILE_ASPECT, columns, type Project } from './tiles'
import MarqueeColumn from './MarqueeColumn'
import ExpandCursor from './ExpandCursor'
import Lightbox from './Lightbox'

const SLOW_MIN = 0.25 // hover never fully stops the drift
const SCROLL_GAIN = 0.4 // how hard page-scroll velocity pushes the tiles
const MAX_BIAS = 600 // px/s cap so a fast page scroll can't fling tiles
const LERP_RATE = 6 // hover-slow easing rate (per second)

const clamp = (min: number, max: number, v: number) => Math.max(min, Math.min(max, v))

export default function ScrollMarquee({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const mobile = useMediaFlag('(max-width: 48rem)')
  const finePointer = useMediaFlag('(pointer: fine)')
  const axis: 'y' | 'x' = mobile ? 'x' : 'y'

  // Scroll-velocity bias shared by every column (signed px/s, smoothed + clamped).
  const { scrollY } = useScroll()
  const rawVel = useVelocity(scrollY)
  const smoothVel = useSpring(rawVel, { stiffness: 200, damping: 50, mass: 0.2 })
  const scrollBias = useTransform(smoothVel, (v) => clamp(-MAX_BIAS, MAX_BIAS, v * SCROLL_GAIN))

  // Hover-slow multiplier, eased toward a target with a frame-rate-independent lerp.
  const slowFactor = useMotionValue(1)
  const slowTarget = useRef(1)
  useAnimationFrame((_, delta) => {
    const k = 1 - Math.exp((-LERP_RATE * Math.min(delta, 50)) / 1000)
    slowFactor.set(slowFactor.get() + (slowTarget.current - slowFactor.get()) * k)
  })

  // Custom cursor visibility (the cursor tracks the pointer itself).
  const [cursorVisible, setCursorVisible] = useState(false)

  // Modal state + focus return to the originating card.
  const [selected, setSelected] = useState<Project | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const openCard = (project: Project, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setSelected(project)
  }
  const closeCard = () => {
    setSelected(null)
    triggerRef.current?.focus()
  }

  const showCursor = finePointer && !reduce

  // Reduced motion: render a static grid (post-hydration swap via `mounted`), no
  // rAF drift, no cursor/drag — but cards still open the modal.
  if (mounted && reduce) {
    return (
      <>
        <div className={cn('grid grid-cols-3 gap-bg landscape:grid-cols-2 landscape:gap-md', className)}>
          {projects.slice(0, 6).map((project, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => openCard(project, e.currentTarget)}
              style={{ aspectRatio: TILE_ASPECT }}
              className="group block overflow-hidden rounded-card bg-white/5 shadow-2xl shadow-black/20 outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <img src={project.cover} alt={project.title} draggable={false} className="h-full w-full select-none object-cover [-webkit-user-drag:none]" />
            </button>
          ))}
        </div>
        <Lightbox project={selected} onClose={closeCard} />
      </>
    )
  }

  const verticalMask = '[-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_var(--edge),#000_calc(100%-var(--edge)),transparent)] [mask-image:linear-gradient(to_bottom,transparent,#000_var(--edge),#000_calc(100%-var(--edge)),transparent)]'

  return (
    <>
      <div
        onPointerEnter={() => {
          if (finePointer) setCursorVisible(true)
          slowTarget.current = SLOW_MIN
        }}
        onPointerLeave={() => {
          setCursorVisible(false)
          slowTarget.current = 1
        }}
        className={cn(
          'relative flex overflow-hidden',
          // Desktop: fill the hero height (edge to edge vertically) with a top/bottom
          // fade. Tablet/mobile vertical falls back to a fixed height.
          // Mobile horizontal: fixed height, full-bleed to the screen edges, no fade.
          axis === 'y'
            ? cn('h-full flex-row gap-bg [--edge:9%] tablet:h-[34rem]', verticalMask)
            : 'h-[26rem] flex-col gap-md -mx-[var(--container-margin)]',
          showCursor && 'cursor-none',
          className,
        )}
      >
        {columns.map((colProjects, i) => (
          <MarqueeColumn
            key={i}
            projects={colProjects}
            config={COLUMN_CONFIG[i]}
            axis={axis}
            scrollBias={scrollBias}
            slowFactor={slowFactor}
            onCardClick={openCard}
          />
        ))}
      </div>

      {showCursor && <ExpandCursor visible={cursorVisible} />}
      <Lightbox project={selected} onClose={closeCard} />
    </>
  )
}
