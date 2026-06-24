interface BrandLogoProps {
  src: string
  name: string
  duplicate: boolean
}

export default function BrandLogo({ src, name, duplicate }: BrandLogoProps) {
  return (
    <div className="flex shrink-0 items-center mx-11 landscape:mx-7" aria-hidden={duplicate || undefined}>
      <img
        src={src}
        alt={duplicate ? '' : name}
        className="h-10 w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 landscape:h-6"
      />
    </div>
  )
}
