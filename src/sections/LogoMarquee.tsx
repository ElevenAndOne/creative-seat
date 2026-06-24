import { Section } from '../components/base/section'
import Container from '../components/container'
import Heading from '../components/heading'
import { logos } from '../content'

// Two copies of the list sit on the track; the CSS animation translates it by
// -50%, so the second copy seamlessly takes the first's place as it loops.
const track = [...logos, ...logos]

export default function LogoMarquee() {
  return (
    <Section bleed pad="sm" className="bg-mist">
      <Container>
        <Heading.H5 as="h2">Creative partner to worldwide brands</Heading.H5>
      </Container>
      <div
        className="cs-marquee relative mt-xlg w-full overflow-hidden [--edge:10%] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_var(--edge),#000_calc(100%-var(--edge)),transparent)] [mask-image:linear-gradient(to_right,transparent,#000_var(--edge),#000_calc(100%-var(--edge)),transparent)] landscape:[--edge:7%]"
      >
        <div className="cs-marquee-track">
          {track.map((logo, i) => (
            <BrandLogo
              key={i}
              src={logo.src}
              name={logo.name}
              duplicate={i >= logos.length}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}

function BrandLogo({ src, name, duplicate }: { src: string; name: string; duplicate: boolean }) {
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
