import Button from '../ui/Button'
import Container from '../ui/Container'
import Em from '../ui/Em'
import Eyebrow from '../ui/Eyebrow'

export default function HighImpact() {
  return (
    <section className="bg-brand-radial py-20 text-white md:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <Eyebrow tone="light">Multi-platform performance</Eyebrow>
          <h2 className="mt-10 max-w-[700px] text-5xl font-light leading-tight md:text-h2">
            High impact creative across <Em className="text-lime">every channel.</Em>
          </h2>
          <p className="mt-8 max-w-[610px] text-lg leading-relaxed text-white/90">
            Deliver attention-grabbing campaigns across the channels your audience uses every day. Strengthen your brand with consistently strong creative designed to make an impact.
          </p>
          <p className="mt-8 max-w-[620px] text-2xl leading-snug">Launch standout campaigns and content that perform on every platform.</p>
          <Button href="#contact" className="mt-10">Book a Demo</Button>
        </div>
        <img src="/images/highimpact-mockup.png" alt="Montage of creative across platforms" className="w-full rounded-lg object-cover" />
      </Container>
    </section>
  )
}
