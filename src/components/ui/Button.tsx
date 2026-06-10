import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type Variant = 'lime' | 'white' | 'black' | 'outline-white' | 'outline-black'

const variants: Record<Variant, string> = {
  lime: 'bg-lime text-black hover:bg-lime-soft',
  white: 'bg-white text-black hover:bg-lime',
  black: 'bg-black text-white hover:bg-grape',
  'outline-white':
    'border border-white/70 text-white hover:bg-white hover:text-black',
  'outline-black': 'border border-black/60 text-black hover:bg-black hover:text-white',
}

export interface ButtonProps extends ComponentPropsWithoutRef<'a'> {
  variant?: Variant
  children: ReactNode
}

/**
 * Pill CTA — 12.8px Inter Bold in Figma, ~45px tall.
 */
export default function Button({
  variant = 'lime',
  className = '',
  children,
  href = '#',
  ...rest
}: ButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex h-[45px] items-center justify-center rounded-full px-7 text-[12.8px] font-bold tracking-wide transition-colors duration-200 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
