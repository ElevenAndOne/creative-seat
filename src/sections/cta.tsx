import Button from '../components/autton'
import { Section } from '../components/base/section'
import Container from '../components/container';
import Em from '../components/em'
import Heading from '../components/heading'

export default function CtaBanner() {
  return (
    <Section id="contact" bleed pad="bg" className="isolate overflow-hidden text-center text-white">
      <img src="/images/placeholder.svg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <Container>
        <Heading.H2 className="mx-auto px-[var(--container-margin)]">
          The simple way to <Em className="text-lime">get creative</Em>
        </Heading.H2>
        <Button href="mailto:hello@creativeseat.example" className="mt-xbg">Book a Demo</Button>
      </Container>
    </Section>
  )
}
