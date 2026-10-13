import { Section } from '../components/base/section'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { processSteps } from '../content'

export default function Process() {
  return (
    <Section pad="md" innerClassName="text-center">
      <Eyebrow>A simpler way to work</Eyebrow>
      <Heading.H2 className="mt-[18px]">Effortless from brief to launch.</Heading.H2>

      <div className="mt-[44px] grid grid-cols-4 gap-[30px] rounded-panel bg-lavender/50 px-[30px] py-[50px] text-left tablet:grid-cols-2 tablet:gap-y-xlg portrait:grid-cols-1 portrait:px-xbg portrait:py-xlg">
        {processSteps.map(({ icon, title, subtitle, body }) => (
          <article key={title}>
            <div className="flex size-14 items-center justify-center rounded-md bg-palm">
              <img src={icon} alt="" className="size-6" />
            </div>
            <Heading.H3 className="mt-[19px] text-palm">
              <span className="block">{title}</span> {subtitle}
            </Heading.H3>
            <Paragraph.Small className="mt-[18px] text-forest">{body}</Paragraph.Small>
          </article>
        ))}
      </div>
    </Section>
  )
}
