import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

export default function ModernMarketing() {
  return (
    // Soft Volt panel per Figma: copy top-aligned beside a photo that fills the
    // other half to the panel's edges. Padding, stack gap and radius step with
    // Figma Desktop/Tablet/Mobile (48/40/32, 24/24/20, 24/20/16). The panel
    // stacks at <=768, where the photo row is Figma's 320 image minimum.
    <Section id="pitch">
      <div className="grid min-h-[30rem] grid-cols-2 gap-x-8 overflow-hidden rounded-panel bg-soft-volt text-ink landscape:min-h-0 landscape:grid-cols-1">
        <div className="flex flex-col gap-xbg self-start p-xlg">
          <Heading.H1>
            Designed for <Em>modern marketing teams.</Em>
          </Heading.H1>
          <Paragraph>
            Teams are expected to deliver more content across more channels than ever before.
          </Paragraph>
          <Paragraph>
            Freelancers create complexity and brand inconsistency. Traditional agencies are costly and lead to production drag. Creative Seat gives your team a faster, more effective way to produce high-end content within one simple subscription.
          </Paragraph>
        </div>
        <div className="relative landscape:h-80">
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
