import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { demoAgenda, testimonials } from '../content'
import { DEMO_MINUTES } from '../utils/booking'

/** The client voice set beside the agenda — the many-campaigns problem a seat answers. */
const QUOTE = testimonials.find((t) => t.name === 'Runei Kotze') ?? testimonials[0]

/**
 * What happens on the call, on Paper below the booking screen: the three parts
 * of the 30 minutes laid along a minute ruler, which fills with Volt as it
 * scrolls by (CSS only — see `.cs-ruler-fill`). Then a client's voice and a
 * Forest card that sends the reader back up to the picker. Static: no JS.
 */
export default function DemoAgenda() {
  return (
    <Section id="agenda" pad="md">
      <div className="border-t border-ink pt-xlg">
        <Heading.H1>
          <span className="block">What we’ll cover</span> <Em>on the call.</Em>
        </Heading.H1>
      </div>

      {/* The ruler: a tick a minute, taller every five, numbered every ten. */}
      <div aria-hidden className="mt-[56px] landscape:hidden">
        <div className="relative h-4 text-p-xs font-semibold tabular-nums">
          {[0, 10, 20, 30].map((minute) => (
            <span key={minute} className="absolute top-0 -translate-x-1/2 whitespace-nowrap first:translate-x-0 last:-translate-x-full" style={{ left: `${(minute / DEMO_MINUTES) * 100}%` }}>
              {minute === DEMO_MINUTES ? `${minute} min` : String(minute).padStart(2, '0')}
            </span>
          ))}
        </div>
        <div className="relative mt-3 h-5 border-r border-ink/40 [background:repeating-linear-gradient(to_right,color-mix(in_oklab,var(--color-ink)_40%,transparent)_0_1px,transparent_1px_calc(100%/6))_0_0/100%_100%_no-repeat,repeating-linear-gradient(to_right,color-mix(in_oklab,var(--color-ink)_22%,transparent)_0_1px,transparent_1px_calc(100%/30))_0_100%/100%_45%_no-repeat]">
          <div className="cs-ruler-fill absolute inset-x-0 -bottom-1 h-1.5 origin-left rounded-full bg-volt" />
        </div>
      </div>

      <ol className="grid grid-cols-3 landscape:mt-[48px] landscape:grid-cols-1 landscape:gap-8">
        {demoAgenda.map(({ from, to, title, body }) => (
          <li key={title} className="border-l border-ink/20 pl-6 pr-10 pt-8 tablet:pr-6 landscape:pt-0">
            <Heading.H3>{title}</Heading.H3>
            {/* Phones hide the ruler, so the minutes go under the title instead. */}
            <p className="mt-1 hidden text-p-sm text-muted landscape:block">
              {from}–{to} min
            </p>
            <Paragraph className="mt-3 max-w-[24rem]">{body}</Paragraph>
          </li>
        ))}
      </ol>

      <div className="mt-xxxlg grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 tablet:grid-cols-1">
        <figure className="flex flex-col justify-between gap-10 rounded-[18px] bg-soft-volt p-10 text-forest landscape:p-8">
          <blockquote className="max-w-[44rem] text-[1.25rem] font-medium leading-[1.5] tracking-[-0.005em] landscape:text-p-lg">“{QUOTE.testimony}”</blockquote>
          <figcaption className="flex items-center justify-between gap-4 border-t border-forest/20 pt-6">
            <div>
              <p className="font-bold">{QUOTE.name}</p>
              <p className="mt-1 text-p-xs">{QUOTE.subscript}</p>
            </div>
            <img src={QUOTE.logo} alt="" className="h-9 w-fit max-w-[9rem] shrink-0 object-contain object-right" />
          </figcaption>
        </figure>

        <div className="flex flex-col items-start justify-between gap-10 rounded-[18px] bg-forest p-10 text-paper landscape:p-8">
          <div>
            <Heading.H3>Takes under a minute.</Heading.H3>
            <Paragraph className="mt-3 text-paper/80">Add your details, choose a time from our live calendar, and the invite is on its way.</Paragraph>
          </div>
          <Button href="#book" id="agenda-book-demo" data-track="book_demo_click" data-track-location="book_demo_agenda" variant="inverse">
            Pick a time
          </Button>
        </div>
      </div>
    </Section>
  )
}
