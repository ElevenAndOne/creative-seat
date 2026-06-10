import type { ReactNode } from 'react'

/**
 * Page-width wrapper matching the Figma content column
 * (1410px content in a 1684px artboard).
 */
export default function Container({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`mx-auto w-full max-w-[1410px] px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}
