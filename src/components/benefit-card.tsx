import { cn } from '../utils/cn'
import Heading from './heading'
import Paragraph from './paragraph'

interface BenefitCardProps {
  src: string
  title: string
  body: string
  /** Footer bar treatment: frosted dark glass, or solid lime for the highlighted card. */
  tone: 'glass' | 'lime'
  /** `object-position` for the photo, so each card keeps its subject in frame. */
  focus?: string
}

/**
 * Photo card with a caption bar pinned to the bottom. The bar holds the title;
 * on hover/focus it grows to reveal the description (always open on phones —
 * there's no hover there).
 */
export default function BenefitCard({ src, title, body, tone, focus }: BenefitCardProps) {
  return (
    <article tabIndex={0} className="group relative flex h-[310px] flex-col justify-end overflow-clip rounded-card bg-white outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink landscape:h-[22rem]">
      <img src={src} alt="" loading="lazy" decoding="async" style={{ objectPosition: focus }} className="absolute inset-0 h-full w-full object-cover" />

      <div className={cn('relative px-[22px] py-[21px]', tone === 'lime' ? 'bg-lime text-ink' : 'bg-[#1b1f20]/75 text-white backdrop-blur-[10px]')}>
        <Heading.H4 as="h3">{title}</Heading.H4>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] landscape:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <Paragraph.Small className="pt-sm opacity-90">{body}</Paragraph.Small>
          </div>
        </div>
      </div>
    </article>
  )
}
