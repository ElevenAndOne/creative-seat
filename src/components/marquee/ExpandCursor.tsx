import { useEffect } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'

/**
 * A `fixed`, pointer-events-none follower showing an "Expand" pill while the
 * pointer is over the marquee. Tracks the pointer itself via a window listener
 * (decoupled from the panel's React handlers) and spring-smooths the motion.
 * The outer element is translated to the cursor; the inner element re-centres
 * the pill with its own transform so the two never conflict.
 */
export default function ExpandCursor({ visible }: { visible: boolean }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [x, y])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-50"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.span
            className="-translate-x-1/2 -translate-y-1/2 flex h-24 w-24 items-center justify-center rounded-full bg-grape/60 text-sm font-semibold text-white backdrop-blur-[8px]"
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            Expand
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
