import Button from '../ui/Button'
import Container from '../ui/Container'
import Em from '../ui/Em'
import Eyebrow from '../ui/Eyebrow'

export default function DesignedFor() {
  return (
    <section id="services" className="bg-paper py-20 md:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Advertising has changed</Eyebrow>
          <h2 className="mt-10 max-w-[650px] text-5xl font-light leading-tight md:text-h2">
            Designed for <Em className="text-grape">modern marketing</Em> teams
          </h2>
          <p className="mt-8 max-w-[620px] text-2xl leading-snug">
            Teams are expected to deliver more content across more channels than ever before.
          </p>
          <p className="mt-7 max-w-[650px] text-base leading-relaxed text-ink-soft">
            Freelancers create complexity and brand inconsistency. Traditional agencies are costly and lead to production drag. <strong>Creative Seat</strong> gives your team a faster, more effective way to produce high-end content within one simple subscription.
          </p>
          <Button href="#contact" className="mt-10">Book a Demo</Button>
        </div>
        <img src="/images/designedfor-photo.png" alt="Marketing professional working from a chair" className="w-full rounded-card object-cover" />
      </Container>
    </section>
  )
}
