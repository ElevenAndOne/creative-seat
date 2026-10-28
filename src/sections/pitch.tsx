import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

export default function ModernMarketing() {
  return (
    // The panel spans the column plus its gutters, so its 40px padding lines the
    // copy back up with every other section. Soft Volt is the layout's accent;
    // the photo fills the other half to the panel's edges, cut by its corners.
    <Section id="pitch" pad="sm" width="wide">
      <div className="grid min-h-[clamp(24rem,calc(100svh-12rem),30rem)] grid-cols-2 overflow-hidden rounded-frame bg-soft-volt text-forest landscape:min-h-0 landscape:grid-cols-1">
        <div className="self-center p-10 landscape:p-xbg">
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
        <div className="relative landscape:aspect-[4/3]">
          <img
            src="/images/sections/pitch-marketer.avif"
            alt="Marketer working on a laptop in an armchair, surrounded by floating social posts and ad layouts"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[68%_center]"
          />
        </div>
      </div>
    </Section>
  )
}
