import { Layout } from '../components/base/layout';
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

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
      <Heading.H1 as="h2" className="mx-auto">
        Faster output. Better execution. <Em className="block text-lime">Stronger results.</Em>
      </Heading.H1>

      <Layout.Grid className="mt-xlg grid-cols-3 landscape:grid-cols-1 gap-md">
        {cards.map(([src, title, body, tone]) => (
          <Card key={title} src={src} title={title} body={body} tone={tone} />
        ))}
      </Layout.Grid>
    </Section>
  )
}

function Card({ src, title, body, tone }: { src: string; title: string; body: string; tone: string }) {
  return (
    <article key={title} tabIndex={0} className="group flex flex-col overflow-clip aspect-8/11 rounded-xl" >
      {/* Image sits in its own column cell, so it visibly shrinks as the footer grows on hover — instead of being a static backdrop. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img src={`/images/${src}`} alt="" className="h-full w-full object-cover object-top" />
      </div>

      {/* Colored footer: title always visible; on hover/focus it grows to reveal the description (always open on phones — no hover). */}
      <div className={`${tone} px-xbg py-bg`}>
        <Heading.H3>
          <Em>{title.split(' ')[0]}</Em> {title.split(' ').slice(1).join(' ')}
        </Heading.H3>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] landscape:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <Paragraph.Lead className="pt-md opacity-90">{body}</Paragraph.Lead>
          </div>
        </div>
      </div>
    </article>
  )
}