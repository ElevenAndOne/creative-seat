import { motion, useReducedMotion } from 'motion/react'
import { heroCards } from '../content'
import { cn } from '../utils/cn'

const EASE = [0.16, 1, 0.3, 1] as const

type Slot = (typeof heroCards)[number]['slot']

/**
 * Where each card sits, as a share of the 554.6 × 391 frame the design draws
 * the fan in — percentages, so the whole fan scales with its column. `from`
 * is how far (in % of the card's own width) it starts tucked in towards the
 * centre before fanning out.
 */
const SLOTS: Record<Slot, { box: string; radius: string; from: number }> = {
  'right-back': { box: 'left-[64.65%] top-[24.52%] w-[35.36%] h-[50.95%]', radius: 'rounded-md', from: -90 },
  'right-mid': { box: 'left-[48.07%] top-[15.65%] w-[45.62%] h-[68.8%]', radius: 'rounded-card', from: -45 },
  'left-back': { box: 'left-0 top-[24.52%] w-[35.36%] h-[50.95%]', radius: 'rounded-md', from: 90 },
  'left-mid': { box: 'left-[4.14%] top-[15.63%] w-[47.7%] h-[68.75%]', radius: 'rounded-card', from: 45 },
  center: { box: 'left-[16.34%] top-0 w-[67.97%] h-full', radius: 'rounded-[1.3rem]', from: 0 },
}

/**
 * Hero fan of work: a large centre card with two smaller cards tucked behind it
 * on each side. On mount the centre card settles in first, then the side cards
 * slide out from behind it. Under reduced motion the fan snaps straight into
 * place — the markup stays identical either way, since the preference is only
 * known in the browser and a hydration mismatch would leave the cards hidden.
 * Purely decorative — the images carry no information the copy doesn't.
 */
export default function HeroStack({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false

  return (
    <div aria-hidden className={cn('relative aspect-[554.6/391] w-full', className)}>
      {heroCards.map(({ src, slot }, i) => {
        const { box, radius, from } = SLOTS[slot]
        // The centre card leads; the side pairs follow it out, inner pair first.
        const delay = slot === 'center' ? 0.1 : 0.35 + (i % 2 === 1 ? 0 : 0.08)
        return (
          <motion.div
            key={slot}
            className={cn('absolute overflow-hidden shadow-2xl shadow-black/30', box, radius)}
            initial={{ opacity: 0, x: `${from}%`, scale: slot === 'center' ? 0.92 : 0.85 }}
            animate={{ opacity: 1, x: '0%', scale: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    default: { type: 'spring', stiffness: 80, damping: 18, delay },
                    opacity: { duration: 0.5, ease: EASE, delay },
                  }
            }
          >
            <img src={src} alt="" loading="eager" decoding="async" draggable={false} className="h-full w-full select-none object-cover" />
          </motion.div>
        )
      })}
    </div>
  )
}
