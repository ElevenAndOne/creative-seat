import Em from './em'
import Heading from './heading'
import Paragraph from './paragraph'

interface BenefitCardProps {
  src: string
  title: string
  body: string
  tone: string
}

export default function BenefitCard({ src, title, body, tone }: BenefitCardProps) {
  return (
    <article key={title} tabIndex={0} className="group flex flex-col overflow-clip aspect-8/11 rounded-xl">
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
