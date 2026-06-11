import { Section } from "../components/section";

export default function LogoMarquee() {
  return (
    <Section>
      <div className="flex justify-center items-center gap-12 sm:gap-16">
        <BrandLogo src='/images/brands/cherry-time.svg' />
        <BrandLogo src='/images/brands/dried-fruit-sa.svg' />
        <BrandLogo src='/images/brands/dutoit.svg' />
        <BrandLogo src='/images/brands/finmap.svg' />
        <BrandLogo src='/images/brands/holiday.svg' />
        <BrandLogo src='/images/brands/leva-foundation.svg' />
        <BrandLogo src='/images/brands/onvlee-engineering.svg' />
        <BrandLogo src='/images/brands/sojern.svg' />
      </div>
    </Section>
  )
}

function BrandLogo({ src, alt }: { src: string; alt?: string }) {
  return (
    <img src={src} alt={alt} className="aspect-3/1 w-30 shrink-0 object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0" />
  )
}