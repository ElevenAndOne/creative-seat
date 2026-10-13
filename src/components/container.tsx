import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type Width = 'max' | 'wide' | 'mid' | 'full'

const MAX_WIDTH: Record<Width, string> = {
  max: 'max-w-[var(--container-width)]', // 67.5rem — the content column
  wide: 'max-w-[var(--container-wide)]', // 72.5rem — column + its 40px gutters
  mid: 'max-w-[var(--container-mid-width)]', // 64rem
  full: 'max-w-full',
}

/**
 * Page-width wrapper. Width + horizontal margin come from the layout tokens
 * (`--container-max-width`, `--container-margin`), so spacing stays consistent
 * across every section and scales fluidly with the viewport. Pass a `width`
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
