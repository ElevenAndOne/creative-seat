import Button from '../ui/Button'
import Em from '../ui/Em'

export default function CtaBanner() {
  return (
    <section id="contact" className="relative isolate overflow-hidden py-28 text-center text-white md:py-36">
      <img src="/images/cta-bg.png" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <h2 className="mx-auto max-w-[980px] px-6 text-5xl font-light leading-tight md:text-h2">
        The simple way to <Em className="text-lime">get creative</Em>
      </h2>
      <Button href="mailto:hello@creativeseat.example" className="mt-9">Book a Demo</Button>
    </section>
  )
}
