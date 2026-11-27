import { useState, useSyncExternalStore } from 'react'
import LinkButton from '../components/link-button'
import { Section } from '../components/base/section'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { cn } from '../utils/cn'
import { demoPage } from '../utils/contact'
import { sessionSeat, type Seat } from '../utils/session-seat'

const noSubscription = () => () => {}

/**
 * This session's seat, worked out in the browser: the page is prerendered, so
 * a pick made at build time would be the same for everyone. Null on the
 * server and while hydrating, so the markup matches.
 */
const useSessionSeat = () => useSyncExternalStore(noSubscription, sessionSeat, () => null)

/**
 * One seat from Figma's Seats set, as its two layers rendered from Figma at
 * 1080: the background (studio shot with the chair, on white) multiplied
 * into the band, so the white drops out and the floor shadow stays, then the
 * cut-out foreground chair over it at full colour. The glass Animator's 80%
 * opacity is baked into its renders. Fades in once both have loaded. The fade
 * sits on each layer, not on a wrapper: a translucent wrapper would isolate
 * the multiply and flash the white plate.
 */
function SeatOfTheDay({ seat }: { seat: Seat }) {
  const [loaded, setLoaded] = useState(0)
  const onLoad = () => setLoaded((n) => n + 1)
  const fade = cn('absolute inset-0 size-full transition-opacity duration-500 ease-out', loaded < 2 && 'opacity-0')

  return (
    // Figma: left −13.81%, right −25.42%, top −67px of the column, square.
    <div className="pointer-events-none absolute -top-[4.1875rem] -right-[25.42%] -left-[13.81%] aspect-square">
      {(['background', 'foreground'] as const).map((layer) => (
        <img
          key={layer}
          src={`/images/cta/seats/${seat}-${layer}.avif`}
          width={1080}
          height={1080}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={onLoad}
          className={cn(fade, layer === 'background' && 'mix-blend-multiply')}
        />
      ))}
    </div>
  )
}

/**
 * Closing campaign band on Soft Volt, as the Figma file sets it (221:1924,
 * Mobile 221:1968): a five-column grid with the Display headline, a line of
 * support and the Ink pill across three, and a seat across two that bleeds
 * off the band's bottom edge. The seat changes with every new browser session
 * (utils/session-seat.ts). Stacks at 768px and below.
 */
export default function CtaBanner() {
  const seat = useSessionSeat()

  return (
    <Section
      id="contact"
      pad="none"
      className="overflow-hidden bg-soft-volt text-ink"
      innerClassName="grid grid-cols-5 gap-x-8 tablet:gap-x-6 landscape:grid-cols-1"
    >
      <div className="col-span-3 flex flex-col items-start justify-center gap-xbg py-[var(--section-pad-md)] landscape:col-span-1">
        <Heading.Display>The simple way to get creative.</Heading.Display>
        <Paragraph className="text-pretty">
          Design, illustration and animation for marketing teams that need more capacity.
        </Paragraph>
        <LinkButton href={demoPage} id="cta-book-demo" data-track="book_demo_click" data-track-location="cta">
          Book a demo
        </LinkButton>
      </div>

      <div aria-hidden className="relative col-span-2 aspect-[428.8/333.47] self-end landscape:col-span-1 landscape:w-full landscape:max-w-[28rem]">
        {seat && <SeatOfTheDay key={seat} seat={seat} />}
      </div>
    </Section>
  )
}
