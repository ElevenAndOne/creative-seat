import Button from '../components/autton'
import { Section } from '../components/base/section'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

export default function HighImpact() {
  return (
    <Section className="bg-night-low text-white" pad="md">
      <div className="grid grid-cols-2 items-center gap-[70px] tablet:gap-xlg landscape:grid-cols-1">
        <div>
          <Eyebrow tone="light">Multi-platform performance</Eyebrow>
          <Heading.H2 className="mt-[14px]">
            <span className="block">High impact creative</span> <span className="block">across <span className="text-lime">every channel.</span></span>
          </Heading.H2>
          <div className="mt-6 max-w-[28.75rem] text-whisper">
            <Paragraph>
              Deliver attention-grabbing campaigns across the channels your audience uses every day. Strengthen your brand with consistently strong creative designed to make an impact.
            </Paragraph>
            <Paragraph className="mt-5">Launch standout campaigns and content that perform on every platform.</Paragraph>
          </div>
          <Button href="#contact" className="mt-[34px]">Book a Demo</Button>
        </div>
        <img
          src="/images/sections/performance-montage.avif"
          alt="Montage of Creative Seat work across social, print, outdoor and web"
          loading="lazy"
          decoding="async"
          className="aspect-[505/285] w-full rounded-card object-cover"
        />
      </div>
    </Section>
  )
}
