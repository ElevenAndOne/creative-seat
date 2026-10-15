import type { ReactNode } from 'react'

/**
 * The italic closing phrase of a Headline 1 — Instrument Serif Italic. One per
 * headline, at the end, and never a single word.
 */
export default function Em({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <em className={`italic ${className}`}>{children}</em>
}
