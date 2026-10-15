import { cn } from '../utils/cn'

interface BrandLogoProps {
  src: string
  name: string
  className?: string
}

/** One client wordmark in the partners row — the black SVGs, softened to 85%. */
export default function BrandLogo({ src, name, className }: BrandLogoProps) {
  return (
    <img
      src={src}
      alt={name}
      className={cn('h-7 w-auto shrink-0 object-contain opacity-85 transition-opacity duration-300 hover:opacity-100 landscape:h-6', className)}
    />
  )
}
