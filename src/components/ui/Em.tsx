import type { ReactNode } from 'react'

/**
 * Italic emphasis used inside headings throughout the design
 * (e.g. "modern marketing", "every channel", "get creative").
 */
export default function Em({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <em className={`font-medium italic ${className}`}>{children}</em>
}
