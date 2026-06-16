import { useEffect, useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, wrap, type MotionValue } from 'motion/react'
import { cn } from '../../utils/cn'
import { TILE_ASPECT, type ColumnConfig, type Project } from './tiles'

type Axis = 'y' | 'x'

const MAX_DRAG = 2200 // px/s cap on a drag-flick
const MAX_WHEEL = 1800 // px/s cap on the wheel-boost
const WHEEL_GAIN = 4 // how much each wheel notch adds to this column's velocity
const DRAG_THRESHOLD = 5 // px of movement before a press counts as a drag (not a click)
const DECAY_RATE = 2.2 // per-second exponential decay of the drag + wheel impulses

const clamp = (min: number, max: number, v: number) => Math.max(min, Math.min(max, v))

type MarqueeColumnProps = {
  projects: Project[]
  config: ColumnConfig
  axis: Axis
  /** Shared, signed page-scroll velocity bias (px/s) folded into every column. */
  scrollBias: MotionValue<number>
  /** Shared hover-slow multiplier in [SLOW_MIN, 1]. */
  slowFactor: MotionValue<number>
  onCardClick: (project: Project, trigger: HTMLButtonElement) => void
  className?: string
}

export default function MarqueeColumn({ projects, config, axis, scrollBias, slowFactor, onCardClick, className }: MarqueeColumnProps) {
  const offset = useMotionValue(0)
  // Per-column impulses: drag-flick + scroll-wheel boost. Both decay back to 0.
  const dragBias = useMotionValue(0)
  const wheelBias = useMotionValue(0)
  const trackLen = useRef(0)
  const firstCopyRef = useRef<HTMLDivElement>(null)

  const dragState = useRef({ active: false, lastPos: 0, lastT: 0, startPos: 0, moved: false })
  const draggedRef = useRef(false)

  // Measure one copy of the card list; that length is the wrap period.
  useEffect(() => {
    const el = firstCopyRef.current
    if (!el) return
    const measure = () => {
      trackLen.current = axis === 'y' ? el.offsetHeight : el.offsetWidth
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [axis])

  // Axis flip: drop any accumulated offset so we don't render a half-wrapped jump.
  useEffect(() => {
    offset.set(0)
    trackLen.current = 0
  }, [axis, offset])

  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 50) / 1000 // clamp big gaps (tab refocus) to avoid leaps
    const len = trackLen.current
    if (len) {
      // Drift + page-scroll bias are damped by hover-slow; per-column impulses are full strength.
      const v = (config.sign * config.speed + scrollBias.get()) * slowFactor.get() + dragBias.get() + wheelBias.get()
      offset.set(wrap(-len, 0, offset.get() + v * dt))
    }
    const decay = Math.exp(-DECAY_RATE * dt)
    dragBias.set(dragBias.get() * decay)
    wheelBias.set(wheelBias.get() * decay)
  })

  const vertical = axis === 'y'
  const axisPos = (e: React.PointerEvent) => (vertical ? e.clientY : e.clientX)

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = { active: true, lastPos: axisPos(e), lastT: e.timeStamp, startPos: axisPos(e), moved: false }
    draggedRef.current = false
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragState.current
    if (!d.active) return
    const pos = axisPos(e)
    const dt = (e.timeStamp - d.lastT) / 1000
    if (dt > 0) dragBias.set(clamp(-MAX_DRAG, MAX_DRAG, (pos - d.lastPos) / dt))
    d.lastPos = pos
    d.lastT = e.timeStamp
    if (!d.moved && Math.abs(pos - d.startPos) > DRAG_THRESHOLD) {
      d.moved = true
      // Capture lazily — only once it's really a drag — so a plain click still
      // reaches the card's onClick (pointer capture would steal the click event).
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }
  const endDrag = () => {
    if (!dragState.current.active) return
    dragState.current.active = false
    draggedRef.current = dragState.current.moved
  }
  // Wheel over this column nudges its speed in the scroll direction (then decays).
  // We don't preventDefault, so the page still scrolls normally underneath.
  const onWheel = (e: React.WheelEvent) => {
    wheelBias.set(clamp(-MAX_WHEEL, MAX_WHEEL, wheelBias.get() + e.deltaY * WHEEL_GAIN))
  }
  const handleCardClick = (project: Project, trigger: HTMLButtonElement) => {
    if (draggedRef.current) {
      draggedRef.current = false
      return // released a drag on this card — don't open the modal
    }
    onCardClick(project, trigger)
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
      className={cn('relative flex-1 touch-pan-y overflow-hidden', className)}
    >
      <motion.div
        className={cn('absolute will-change-transform', vertical ? 'inset-x-0 top-0 flex flex-col' : 'inset-y-0 left-0 flex flex-row')}
        style={vertical ? { y: offset } : { x: offset }}
      >
        <Copy ref={firstCopyRef} projects={projects} vertical={vertical} onCardClick={handleCardClick} />
        <Copy projects={projects} vertical={vertical} onCardClick={handleCardClick} duplicate />
      </motion.div>
    </div>
  )
}

function Copy({ ref, projects, vertical, onCardClick, duplicate }: {
  ref?: React.Ref<HTMLDivElement>
  projects: Project[]
  vertical: boolean
  onCardClick: (project: Project, trigger: HTMLButtonElement) => void
  duplicate?: boolean
}) {
  return (
    <div ref={ref} className={cn('flex', vertical ? 'flex-col' : 'flex-row')} aria-hidden={duplicate || undefined}>
      {projects.map((project, i) => (
        <button
          key={i}
          type="button"
          tabIndex={duplicate ? -1 : undefined}
          onClick={(e) => onCardClick(project, e.currentTarget)}
          style={{ aspectRatio: TILE_ASPECT }}
          className={cn(
            'group block shrink-0 overflow-hidden rounded-card bg-white/5 shadow-2xl shadow-black/20 outline-none',
            'focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-grape',
            vertical ? 'w-full mb-bg' : 'h-full mr-md',
          )}
        >
          <img
            src={project.cover}
            alt={duplicate ? '' : project.title}
            loading="eager"
            decoding="async"
            draggable={false}
            className="h-full w-full select-none object-cover transition duration-500 group-hover:scale-[1.04] [-webkit-user-drag:none]"
          />
        </button>
      ))}
    </div>
  )
}
