import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

export default function ModernMarketing() {
  return (
    // The panel spans the column plus its gutters, so its 40px padding lines the
    // copy back up with every other section. Soft Volt is the layout's accent.
    <Section id="pitch" pad="sm" width="wide">
      <div className="grid grid-cols-2 items-center gap-[70px] rounded-frame bg-soft-volt p-10 text-forest tablet:gap-xlg landscape:grid-cols-1 landscape:p-xbg">
        <div>
          <Eyebrow className="text-forest">Advertising has changed</Eyebrow>
          <Heading.H1 className="mt-4 max-w-[16ch]">
            Designed for <Em>modern marketing teams.</Em>
          </Heading.H1>
          <Paragraph className="mt-6 max-w-[34rem]">
            Teams are expected to deliver more content across more channels than ever before.
          </Paragraph>
          <Paragraph className="mt-5 max-w-[34rem]">
            Freelancers create complexity and brand inconsistency. Traditional agencies are costly and lead to production drag. Creative Seat gives your team a faster, more effective way to produce high-end content within one simple subscription.
          </Paragraph>
        </div>
        <img
          src="/images/sections/pitch-marketer.avif"
          alt="Marketer working on a laptop in an armchair, surrounded by floating social posts and ad layouts"
          loading="lazy"
          decoding="async"
          className="aspect-[505/498] w-full rounded-md object-cover object-[68%_center]"
        />
      </div>
    </Section>
  )
}
