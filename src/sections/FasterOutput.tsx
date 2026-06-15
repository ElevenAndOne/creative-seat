import Container from '../components/container'
import Em from '../components/em'

// [image, title, hidden description, footer tone]
const cards: [string, string, string, string][] = [
  [
    'placeholder.svg',
    'More creative capacity',
    'Spin up extra hands the moment a campaign demands it and scale back just as easily — capacity that flexes with your roadmap.',
    'bg-magenta text-white',
  ],
  [
    'placeholder.svg',
    'Streamlined workflow',
    'Brief once and track everything in a single place, with a dedicated project manager keeping every task moving from kickoff to delivery.',
    'bg-grape text-white',
  ],
  [
    'placeholder.svg',
    'One simple subscription',
    'A full creative team for one predictable monthly fee — no per-project quotes, retainers, or surprise invoices.',
    'bg-lime text-black',
  ],
]

export default function FasterOutput() {
  return (
    <section className="bg-black py-20 text-white md:py-32">
      <Container>
        <h2 className="mx-auto max-w-[980px] text-center text-5xl font-light leading-tight md:text-h2-lg">
          Faster output. Better execution. <Em className="block text-lime">Stronger results.</Em>
        </h2>

        <div className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-3">
          {cards.map(([src, title, body, tone]) => (
            <article
              key={title}
              tabIndex={0}
              className="group relative h-[460px] overflow-hidden rounded-card bg-white outline-none ring-lime/70 focus-visible:ring-2"
            >
              {/* The card image sits behind; object-top keeps the baked-in label
                  below the fold so only the live footer carries the title. */}
              <img
                src={`/images/${src}`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top"
              />

              {/* Colored footer: the title is always visible; on hover/focus the
                  panel grows upward to reveal the description hidden beneath it. */}
              <div className={`absolute inset-x-0 bottom-0 px-8 py-7 ${tone}`}>
                <h3 className="text-2xl font-light leading-tight">
                  <Em>{title.split(' ')[0]}</Em> {title.split(' ').slice(1).join(' ')}
                </h3>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="pt-4 text-sm leading-relaxed opacity-90">{body}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
