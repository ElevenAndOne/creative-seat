import { Section } from '../components/base/section'
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
    <Section className="bg-black text-white" pad="md">
      <h2 className="mx-auto max-w-[61rem] text-center text-display font-light">
        Faster output. Better execution. <Em className="block text-lime">Stronger results.</Em>
      </h2>

      <div className="mt-xxlg grid grid-cols-3 gap-bg tablet:grid-cols-1">
        {cards.map(([src, title, body, tone]) => (
          <article
            key={title}
            tabIndex={0}
            className="group flex h-[460px] flex-col overflow-hidden rounded-card bg-white outline-none ring-lime/70 focus-visible:ring-2"
          >
            {/* Image sits in its own column cell, so it visibly shrinks as the
                footer grows on hover — instead of being a static backdrop. */}
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <img src={`/images/${src}`} alt="" className="h-full w-full object-cover object-top" />
            </div>

            {/* Colored footer: title always visible; on hover/focus it grows to
                reveal the description (always open on phones — no hover). */}
            <div className={`${tone} px-xbg py-bg`}>
              <h3 className="text-2xl font-light leading-tight">
                <Em>{title.split(' ')[0]}</Em> {title.split(' ').slice(1).join(' ')}
              </h3>
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] landscape:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="pt-md text-sm leading-relaxed opacity-90">{body}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
