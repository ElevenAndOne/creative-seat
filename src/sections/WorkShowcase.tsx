import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import { projects } from '../content'

// Same projects collection as the hero, same order, limited to six.
const work = projects.slice(0, 6)

export default function WorkShowcase() {
  return (
    <Section id="work" pad="md">
      <div className="flex flex-row items-start justify-between gap-bg landscape:flex-col">
        <div>
          <p className="font-medium uppercase tracking-[0.18em]">Take a look at our work</p>
          <h2 className="mt-bg max-w-[52rem] text-h2 font-light text-grape">
            <Em>Trusted</Em> by global brands to deliver their vision
          </h2>
        </div>
        <Button href="#contact" variant="outline-black" className="mt-xsm shrink-0 landscape:mt-0">Download our portfolio</Button>
      </div>
      <div className="mt-xxlg grid grid-cols-4 gap-x-bg gap-y-xlg tablet:grid-cols-2 portrait:grid-cols-1">
        {work.map((project) => (
          <article key={project.title} className={project.wide ? 'col-span-2 portrait:col-span-1' : ''}>
            <img src={project.cover} alt={`${project.title} project`} className="h-[20rem] w-full rounded-lg object-cover tablet:h-72 portrait:h-60" />
            <h3 className="mt-bg text-h6 font-medium">{project.title}</h3>
            <p className="mt-xsm text-sm text-smoke">{project.tags.join(', ')}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
