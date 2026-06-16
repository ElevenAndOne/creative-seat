import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'

export default function HighImpact() {
  return (
    <Section className="bg-brand-radial text-white" pad="md" innerClassName="grid grid-cols-[0.95fr_1.05fr] items-center gap-xlg tablet:grid-cols-1">
      <div>
        <Eyebrow tone="light">Multi-platform performance</Eyebrow>
        <h2 className="mt-xlg max-w-[44rem] text-h2 font-light">
          High impact creative across <Em className="text-lime">every channel.</Em>
        </h2>
        <p className="mt-xbg max-w-[38rem] text-lg leading-relaxed text-white/90">
          Deliver attention-grabbing campaigns across the channels your audience uses every day. Strengthen your brand with consistently strong creative designed to make an impact.
        </p>
        <p className="mt-xbg max-w-[39rem] text-2xl leading-snug">Launch standout campaigns and content that perform on every platform.</p>
        <Button href="#contact" className="mt-xlg">Book a Demo</Button>
      </div>
      <img src="/images/placeholder.svg" alt="Montage of creative across platforms" className="w-full rounded-card object-cover" />
    </Section>
  )
}
