import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

const steps = [
  ['placeholder.svg', 'Submit', 'your brief', 'Tell us your priorities, timelines and requirements via the Creative Seat request system, freeing up your team to focus on the bigger picture without added pressure.'],
  ['placeholder.svg', 'Activate', 'your team', 'A consistent team of specialists are assigned around the work you need and a streamlined production workflow is created to ensure tasks move quickly and accurately.'],
  ['placeholder.svg', 'Review', 'and refine', 'Feedback stays centralised and easy to manage across every stage of production. Strong first drafts and clear communication help projects move forward with few delays.'],
  ['placeholder.svg', 'Approve', '+ keep moving', 'Your approved final assets are delivered for launch across the required channels. As new priorities emerge, your team is ready to get on the next project.'],
]

export default function Process() {
  return (
    <Section pad="md">
      <Paragraph>A simpler way to work</Paragraph>
      <Heading.H2 className="mx-auto mt-bg">
        Move <Em className="text-grape">effortlessly</Em> from brief to launch.
      </Heading.H2>
      <div className="mt-xxlg grid grid-cols-2 gap-xlg rounded-card bg-lime-soft p-xxxlg landscape:grid-cols-1 landscape:p-xbg">
        {steps.map(([icon, title, subtitle, body]) => (
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
