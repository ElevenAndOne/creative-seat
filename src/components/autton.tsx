import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { cn } from '../utils/cn'

type Variant = 'lime' | 'white' | 'black' | 'outline-white' | 'outline-black'
type Size = 'md' | 'sm'

const variants: Record<Variant, string> = {
  lime: 'border-transparent bg-lime text-palm hover:bg-lime-soft',
  white: 'border-transparent bg-snow text-ink hover:bg-lime',
  black: 'border-transparent bg-coal text-white hover:bg-forest',
  'outline-white': 'border-white/60 text-snow hover:border-white hover:bg-white hover:text-ink',
  'outline-black': 'border-black/50 text-coal hover:border-coal hover:bg-coal hover:text-white',
}

const sizes: Record<Size, string> = {
  // 54px pill — the design's "Semantic/Link" style, Inter Bold 15.
  md: 'px-[30px] py-[16px] font-inter text-[15px]',
  // 45px nav pill, Golos Bold 14.
  sm: 'px-[22px] py-[12px] font-sans text-sm',
}

export interface ButtonProps extends HTMLMotionProps<'a'> {
  variant?: Variant
  size?: Size
}

/**
 * Pill CTA with a 2px border (transparent on the filled variants, so filled and
 * outlined pills share one height). Lifts a touch on hover and presses in on
 * tap, the way Superside's CTAs respond.
 */
export default function Button({
  variant = 'lime',
  size = 'md',
  className = '',
  children,
  href = '#',
  ...rest
}: ButtonProps) {
  const reduce = useReducedMotion()

  return (
    <motion.a
      href={href}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full border-2 font-bold leading-none transition-colors duration-200 landscape:flex landscape:w-full',
        sizes[size],
        variants[variant],
        className,
      )}
      // Always defined (scale 1 under reduced motion): Motion adds a tabindex for
      // tap gestures, and dropping them on the client only would mismatch the
      // server markup on hydration.
      whileHover={{ scale: reduce ? 1 : 1.04 }}
      whileTap={{ scale: reduce ? 1 : 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...rest}
    >
      {children}
    </motion.a>
  )
}
