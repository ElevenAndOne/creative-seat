import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../../utils/cn'
import { showcasedProjects, type Project } from '../../content'
import Lightbox from '../marquee/Lightbox'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * How far a card travels before settling. Both rows use the same figure in
 * opposite directions, so the pair converges evenly on the gap between them —
 * an uneven split would read as one row chasing the other.
 */
const TRAVEL = 110

/**
 * Three masonry columns of work. Each column's pair meets in the middle — the
 * top card drops in, the bottom card rises — and the middle/right columns start
 * lower so the settled grid reads as staggered rather than a flat 3×2. `mt-*`
 * on the column is the resting offset.
 */
const COLUMNS: { offset: string; items: Project[] }[] = [
  { offset: '', items: [showcasedProjects[0], showcasedProjects[3]] },
  { offset: 'mt-[16%]', items: [showcasedProjects[1], showcasedProjects[4]] },
  { offset: 'mt-[6%]', items: [showcasedProjects[2], showcasedProjects[5]] },
].map((col) => ({ ...col, items: col.items.filter(Boolean) })) as typeof COLUMNS

/**
 * Hero work grid — the swap-in replacement for the scrolling marquee. A static
 * staggered grid of the showcased projects that plays a one-shot intro on mount
 * (top and bottom cards converge on the centre, lightly staggered), then sits
 * still. Cards open the shared <Lightbox>. Under reduced motion the intro is
 * dropped and the grid renders in place. Self-contained and prop-free like the
 * marquee it replaces, so the hero can swap between them freely.
 */
export default function HeroGrid({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false
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

  return (
    <div className={cn('relative', className)}>
      <div className="flex gap-bg landscape:gap-md">
        {COLUMNS.map((col, ci) => (
          <div key={ci} className={cn('flex flex-1 flex-col gap-bg landscape:gap-md', col.offset)}>
            {col.items.map((project, ri) => (
              <Tile
                key={project.title}
                project={project}
                onOpen={openCard}
                reduce={reduce}
                // Top row drops in, bottom row rises, so the pair meets in the
                // middle. Only the column term staggers arrival — give the two
                // rows different delays and they never appear to meet.
                from={ri === 0 ? -1 : 1}
                delay={0.15 + ci * 0.08}
              />
            ))}
          </div>
        ))}
      </div>
      <Lightbox project={selected} onClose={closeCard} />
    </div>
  )
}

function Tile({
  project,
  onOpen,
  reduce,
  from,
  delay,
}: {
  project: Project
  onOpen: (project: Project, trigger: HTMLButtonElement) => void
  reduce: boolean
  /** -1 = starts above its slot and drops in; 1 = starts below and rises. */
  from: -1 | 1
  delay: number
}) {
  const className = cn(
    'group block w-full overflow-hidden rounded-card bg-white/5 shadow-2xl shadow-black/25 outline-none',
    'focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-grape',
  )
  const image = (
    <img
      src={project.cover}
      alt={project.title}
      loading="eager"
      decoding="async"
      draggable={false}
      className="h-full w-full select-none object-cover transition duration-500 group-hover:scale-[1.05] [-webkit-user-drag:none]"
    />
  )

  if (reduce) {
    return (
      <button type="button" onClick={(e) => onOpen(project, e.currentTarget)} style={{ aspectRatio: '4 / 5' }} className={className}>
        {image}
      </button>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={(e) => onOpen(project, e.currentTarget)}
      initial={{ opacity: 0, y: from * TRAVEL, scale: 0.9, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{
        // Position/scale settle on a soft spring; opacity + focus-pull ride a
        // quicker tween so cards read as sharpening into place.
        default: { type: 'spring', stiffness: 90, damping: 18, delay },
        opacity: { duration: 0.6, ease: EASE, delay },
        filter: { duration: 0.7, ease: EASE, delay },
      }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
      style={{ aspectRatio: '4 / 5' }}
      className={className}
    >
      {image}
    </motion.button>
  )
}
