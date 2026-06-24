import { Section } from '../components/base/section'
import BrandLogo from '../components/brand-logo'
import Container from '../components/container'
import Heading from '../components/heading'
import { logoMarqueeTrack } from '../content'

export default function LogoMarquee() {
  return (
    <Section bleed pad="sm" className="bg-mist">
      <Container>
        <Heading.H5 as="h2">Creative partner to worldwide brands</Heading.H5>
      </Container>
      <div className="cs-marquee relative mt-xlg w-full overflow-hidden [--edge:10%] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_var(--edge),#000_calc(100%-var(--edge)),transparent)] [mask-image:linear-gradient(to_right,transparent,#000_var(--edge),#000_calc(100%-var(--edge)),transparent)] landscape:[--edge:7%]">
        <div className="cs-marquee-track">
          {logoMarqueeTrack.map((logo, i) => (
            <BrandLogo
              key={i}
              src={logo.src}
              name={logo.name}
              duplicate={logo.duplicate}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
