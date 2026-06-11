import Container from '../components/container'
import Em from '../components/em'

const cards = [
  ['card-capacity.png', 'More creative capacity', 'bg-magenta text-white'],
  ['card-workflow.png', 'Streamlined workflow', 'bg-grape text-white'],
  ['card-subscription.png', 'One simple subscription', 'bg-lime text-black'],
]

export default function FasterOutput() {
  return (
    <section className="bg-black py-20 text-white md:py-32">
      <Container>
        <h2 className="mx-auto max-w-[980px] text-center text-5xl font-light leading-tight md:text-h2-lg">
          Faster output. Better execution. <Em className="block text-lime">Stronger results.</Em>
        </h2>
        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {cards.map(([src, title, tone]) => (
            <article key={title} className="overflow-hidden rounded-card bg-white">
              <img src={`/images/${src}`} alt="" className="aspect-[4/4.6] w-full object-cover" />
              <h3 className={`p-8 text-3xl font-light ${tone}`}>
                <Em>{title.split(' ')[0]}</Em> {title.split(' ').slice(1).join(' ')}
              </h3>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
