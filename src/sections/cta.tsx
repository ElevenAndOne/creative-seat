import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'

export default function CtaBanner() {
  return (
    <Section id="contact" pad="bg" className="isolate overflow-hidden text-center text-white">
      <img src="/images/sections/cta-background.avif" alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-cta-wash" />
      <Heading.H2 className="font-display">
        The simple way to <Em className="text-lime">get creative</Em>
      </Heading.H2>
      <Button href="mailto:hello@creativeseat.example" className="mt-9">Book a Demo</Button>
    </Section>
  )
}
