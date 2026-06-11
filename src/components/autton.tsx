import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

type Variant = 'lime' | 'white' | 'black' | 'outline-white' | 'outline-black'

const variants: Record<Variant, string> = {
  lime: 'bg-lime text-black hover:bg-lime-soft',
  white: 'bg-white text-black hover:bg-lime',
  black: 'bg-black text-white hover:bg-grape',
  'outline-white':
    'border border-white/70 text-white hover:bg-white hover:text-black',
  'outline-black': 'border border-black/60 text-black hover:bg-black hover:text-white',
}

export interface ButtonProps extends HTMLMotionProps<'a'> {
  variant?: Variant
}

/**
 * Pill CTA — 12.8px Inter Bold in Figma, ~45px tall. Lifts a touch on hover
 * and presses in on tap, the way Superside's CTAs respond.
 */
export default function Button({
  variant = 'lime',
  className = '',
  children,
  href = '#',
  ...rest
}: ButtonProps) {
  const reduce = useReducedMotion()

  return (
    <motion.a
      href={href}
      className={`inline-flex h-[45px] items-center justify-center rounded-full px-7 text-[12.8px] font-bold tracking-wide transition-colors duration-200 ${variants[variant]} ${className}`}
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...rest}
    >
      {children}
    </motion.a>
  )
}
