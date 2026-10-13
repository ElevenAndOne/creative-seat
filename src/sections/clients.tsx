import { Section } from '../components/base/section'
import BrandLogo from '../components/brand-logo'
import { logos } from '../content'

export default function LogoMarquee() {
  return (
    <Section pad="sm" className="text-center">
      <h2 className="text-sm font-medium uppercase tracking-[0.1em] text-ink/50">Creative partner to worldwide brands</h2>
      <div className="mt-[34px] flex flex-wrap items-center justify-between gap-x-8 gap-y-6 tablet:justify-center tablet:gap-x-12">
        {logos.map((logo) => (
          <BrandLogo key={logo.name} src={logo.src} name={logo.name} />
        ))}
      </div>
    </Section>
  )
}
