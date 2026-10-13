import { cn } from '../utils/cn'

const TONE = {
  violet: 'text-violet',
  ink: 'text-ink',
  light: 'text-white/90',
} as const

/**
 * Uppercase section label above a heading — 13px, 0.1em tracking. Golos Medium
 * by default; the later sections of the design set it in Inter Bold, which
 * callers pass through `className`. Plain markup with no motion, so it renders
 * the same in static sections and hydrated islands.
 */
export default function Eyebrow({
  children,
  tone = 'violet',
  className,
}: {
  children: string
  tone?: keyof typeof TONE
  className?: string
}) {
  return <p className={cn('text-eyebrow font-medium uppercase', TONE[tone], className)}>{children}</p>
}
