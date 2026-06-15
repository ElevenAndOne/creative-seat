import Container from '../components/container'
import Em from '../components/em'

const steps = [
  ['placeholder.svg', 'Submit', 'your brief', 'Tell us your priorities, timelines and requirements via the Creative Seat request system, freeing up your team to focus on the bigger picture without added pressure.'],
  ['placeholder.svg', 'Activate', 'your team', 'A consistent team of specialists are assigned around the work you need and a streamlined production workflow is created to ensure tasks move quickly and accurately.'],
  ['placeholder.svg', 'Review', 'and refine', 'Feedback stays centralised and easy to manage across every stage of production. Strong first drafts and clear communication help projects move forward with few delays.'],
  ['placeholder.svg', 'Approve', '+ keep moving', 'Your approved final assets are delivered for launch across the required channels. As new priorities emerge, your team is ready to get on the next project.'],
]

export default function Process() {
  return (
    <section className="bg-paper py-20 md:py-32">
      <Container>
        <p className="text-center font-medium uppercase tracking-[0.18em]">A simpler way to work</p>
        <h2 className="mx-auto mt-8 max-w-[780px] text-center text-5xl font-light leading-tight md:text-h2">
          Move <Em className="text-grape">effortlessly</Em> from brief to launch.
        </h2>
        <div className="mt-20 grid gap-12 rounded-card bg-lime-soft p-8 md:grid-cols-2 md:p-20">
          {steps.map(([icon, title, subtitle, body]) => (
            <article key={title} className="grid gap-6 sm:grid-cols-[86px_1fr]">
              <img src={`/images/${icon}`} alt="" className="h-20 w-20 rounded-lg" />
              <div>
                <h3 className="text-4xl font-light text-grape">{title}</h3>
                <p className="-mt-1 text-2xl font-medium">{subtitle}</p>
                <p className="mt-8 max-w-[500px] leading-relaxed">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
