import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { processSteps } from '../content'

export default function Process() {
  return (
    <Section pad="md">
      <Paragraph>A simpler way to work</Paragraph>
      <Heading.H2 className="mx-auto mt-bg">
        Move <Em className="text-grape">effortlessly</Em> from brief to launch.
      </Heading.H2>
      <div className="mt-xxlg grid grid-cols-2 gap-xlg rounded-card bg-lime-soft p-xxxlg landscape:grid-cols-1 landscape:p-xbg">
        {processSteps.map(({ icon, title, subtitle, body }) => (
          <article key={title} className="grid grid-cols-[86px_1fr] gap-bg portrait:grid-cols-1">
            <img src={`/images/${icon}`} alt="" className="h-20 w-20 rounded-lg" />
            <div>
              <Heading.H3>{title}</Heading.H3>
              <Paragraph className="-mt-1">{subtitle}</Paragraph>
              <Paragraph className="mt-xbg">{body}</Paragraph>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
