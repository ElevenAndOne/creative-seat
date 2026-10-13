import type { ReactNode } from 'react'

/**
 * Italic emphasis inside headings (e.g. "teams choose", "on demand", "get
 * creative"). Keeps the heading's own weight, so Poppins Medium headings pick
 * up Poppins Medium Italic.
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
