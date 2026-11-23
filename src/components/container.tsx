import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type Width = 'max' | 'wide' | 'mid' | 'full'

const MAX_WIDTH: Record<Width, string> = {
  max: 'max-w-[var(--container-width)]', // 70rem — the 1120px content column
  wide: 'max-w-[var(--container-wide)]', // 70rem — panels share the column
  mid: 'max-w-[var(--container-mid-width)]', // 64rem
  full: 'max-w-full',
}

/**
 * Page-width wrapper. Width + horizontal margin come from the layout tokens
 * (`--container-max-width`, `--container-margin`), so spacing stays consistent
 * across every section and steps with the Figma Desktop/Tablet/Mobile gutters (40 / 24 / 16). Pass a `width`
 * variant for narrower content; anything in `className` can still override
 * (it's merged with tailwind-merge).
 */
export default function Container({ width = 'max', className = '', children }: { width?: Width, className?: string, children: ReactNode}) {
  return (
    <div className={cn('mx-auto w-full', MAX_WIDTH[width], className)}>
      {children}
    </div>
  )
}
