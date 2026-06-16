import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'

export default function DesignedFor() {
  return (
    <Section pad="md" innerClassName="grid grid-cols-2 items-center gap-xlg landscape:grid-cols-1">
      <div>
        <Eyebrow>Advertising has changed</Eyebrow>
        <h2 className="mt-xlg max-w-[40rem] text-h2 font-light">
          Designed for <Em className="text-grape">modern marketing</Em> teams
        </h2>
        <p className="mt-xbg max-w-[38rem] text-2xl leading-snug">
          Teams are expected to deliver more content across more channels than ever before.
        </p>
        <p className="mt-bg max-w-[40rem] text-base leading-relaxed text-ink-soft">
          Freelancers create complexity and brand inconsistency. Traditional agencies are costly and lead to production drag. <strong>Creative Seat</strong> gives your team a faster, more effective way to produce high-end content within one simple subscription.
        </p>
        <Button href="#contact" className="mt-xlg">Book a Demo</Button>
      </div>
      <img src="/images/placeholder.svg" alt="Marketing professional working from a chair" className="w-full rounded-card object-cover" />
    </Section>
  )
}
