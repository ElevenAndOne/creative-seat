import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { showcasedProjects } from '../content'

export default function WorkShowcase() {
  return (
    <Section id="work" pad="md">
      <div className="flex flex-row items-start justify-between gap-bg landscape:flex-col">
        <div>
          <Paragraph>Take a look at our work</Paragraph>
          <Heading.H2 className="mt-bg">
            <Em>Trusted</Em> by global brands to deliver their vision
          </Heading.H2>
        </div>
        <Button href="#contact" variant="outline-black" className="mt-xsm shrink-0 landscape:mt-0">Download our portfolio</Button>
      </div>
      <div className="mt-xxlg grid grid-cols-4 gap-x-bg gap-y-xlg tablet:grid-cols-2 portrait:grid-cols-1">
        {showcasedProjects.map((project) => (
          <article key={project.title} className={project.wide ? 'col-span-2 portrait:col-span-1' : ''}>
            <img src={project.cover} alt={`${project.title} project`} className="h-[20rem] w-full rounded-lg object-cover tablet:h-72 portrait:h-60" />
            <Heading.H6 as="h3" className="mt-bg">{project.title}</Heading.H6>
            <Paragraph.Small className="mt-xsm">{project.tags.join(', ')}</Paragraph.Small>
          </article>
        ))}
      </div>
    </Section>
  )
}
