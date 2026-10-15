import { cn } from '../utils/cn'

const TONE = {
  ink: 'text-ink',
  paper: 'text-paper',
  muted: 'text-muted',
} as const

/**
 * Small-caps label above a heading — 10px Golos SemiBold, 8% tracking. The only
 * all-caps text the brand allows. Plain markup with no motion, so it renders
 * the same in static sections and hydrated islands.
 */
export default function Eyebrow({
  children,
  tone = 'ink',
  className,
}: {
  children: string
  tone?: keyof typeof TONE
  className?: string
}) {
  return <p className={cn('text-eyebrow font-semibold uppercase', TONE[tone], className)}>{children}</p>
}
