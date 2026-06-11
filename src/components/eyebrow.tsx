import { motion, useReducedMotion } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Uppercase section label with the hairline rule underneath, as used above
 * every section heading in the Figma design. On scroll-in the label rises and
 * the rule draws across from the left.
 */
export default function Eyebrow({
  children,
  tone = 'dark',
  className = '',
}: {
  children: string
  tone?: 'dark' | 'light'
  className?: string
}) {
  const reduce = useReducedMotion()
  const text = tone === 'dark' ? 'text-black' : 'text-white'
  const rule = tone === 'dark' ? 'border-black/30' : 'border-white/40'

  if (reduce) {
    return (
      <div className={className}>
        <p className={`text-base font-medium uppercase tracking-wide ${text}`}>{children}</p>
        <hr className={`mt-4 ${rule}`} />
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      <motion.p
        className={`text-base font-medium uppercase tracking-wide ${text}`}
        variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {children}
      </motion.p>
      <motion.hr
        className={`mt-4 origin-left ${rule}`}
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      />
    </motion.div>
  )
}
