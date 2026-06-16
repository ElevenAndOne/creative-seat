import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'

export default function CtaBanner() {
  return (
    <Section id="contact" bleed pad="bg" className="isolate overflow-hidden text-center text-white">
      <img src="/images/placeholder.svg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <h2 className="mx-auto max-w-[61rem] px-[var(--container-margin)] text-h2 font-light">
        The simple way to <Em className="text-lime">get creative</Em>
      </h2>
      <Button href="mailto:hello@creativeseat.example" className="mt-xbg">Book a Demo</Button>
    </Section>
  )
}
