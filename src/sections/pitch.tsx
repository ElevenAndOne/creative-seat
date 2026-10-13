import { Section } from '../components/base/section'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

export default function ModernMarketing() {
  return (
    // The card spans the column plus its gutters, so its 40px padding lines the
    // copy back up with every other section.
    <Section pad="sm" width="wide">
      <div className="grid grid-cols-2 items-center gap-[70px] rounded-frame bg-mist p-10 text-forest tablet:gap-xlg landscape:grid-cols-1 landscape:p-xbg">
        <div>
          <Eyebrow>Advertising has changed</Eyebrow>
          <Heading.H2 className="mt-[14px] max-w-[30rem]">Designed for modern marketing teams</Heading.H2>
          <Paragraph className="mt-6">
            Teams are expected to deliver more content across more channels than ever before.
          </Paragraph>
          <Paragraph className="mt-5">
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
