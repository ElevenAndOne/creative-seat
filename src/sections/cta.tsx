import { useState, useSyncExternalStore } from 'react'
import LinkButton from '../components/link-button'
import { Section } from '../components/base/section'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { cn } from '../utils/cn'
import { demoPage } from '../utils/contact'
import { seatOfTheDay, type Seat } from '../utils/seat-of-the-day'

const noSubscription = () => () => {}

/**
 * Today's seat, worked out in the browser: the page is prerendered, so a pick
 * made at build time would go stale. Null on the server and while hydrating,
 * so the markup matches, then the visitor's own date.
 */
const useSeatOfTheDay = () => useSyncExternalStore(noSubscription, () => seatOfTheDay(), () => null)

/** The seat box is 139% of its column: ~600px beside the text, up to ~620px once stacked. */
const SIZES = '(max-width: 48rem) min(128vw, 39rem), 37.5rem'

function Plate({ seat, plate, onLoad }: { seat: Seat, plate: 'shadow' | 'chair', onLoad?: () => void }) {
  const src = (size: number) => `/images/cta/seats/${seat}-${plate}-${size}.webp`
  return (
    <img
      src={src(1200)}
      srcSet={`${src(600)} 600w, ${src(1200)} 1200w`}
      sizes={SIZES}
      width={1200}
      height={1200}
      alt=""
      loading="lazy"
      decoding="async"
      onLoad={onLoad}
      className="absolute inset-0 size-full"
    />
  )
}

/**
 * One seat from Figma's Seats set, built as its two layers: the studio shot
 * multiplied into the band (its white drops out and the floor shadow stays),
 * then the cut-out chair over it at full colour. The glass Animator chair is
 * drawn at 80% in both layers, as Figma has it. Fades in once both images
 * have loaded. The fade sits on each layer, not on a wrapper: a translucent
 * wrapper would isolate the multiply and flash the white plate.
 */
function SeatOfTheDay({ seat }: { seat: Seat }) {
  const [loaded, setLoaded] = useState(0)
  const onLoad = () => setLoaded((n) => n + 1)
  const layer = cn('absolute inset-0 transition-opacity duration-500 ease-out', loaded < 2 && 'opacity-0')
  const tint = cn('absolute inset-0', seat === 'animator' && 'opacity-80')

  return (
    // Figma: left −13.81%, right −25.42%, top −67px of the column, square.
    <div className="pointer-events-none absolute -top-[4.1875rem] -right-[25.42%] -left-[13.81%] aspect-square">
      <div className={cn(layer, 'mix-blend-multiply')}>
        <div className={tint}>
          <Plate seat={seat} plate="shadow" onLoad={onLoad} />
          <Plate seat={seat} plate="chair" />
        </div>
      </div>
      <div className={layer}>
        <div className={tint}>
          <Plate seat={seat} plate="chair" onLoad={onLoad} />
        </div>
      </div>
    </div>
  )
}

/**
 * Closing campaign band on Soft Volt, as the Figma file sets it (221:1924,
 * Mobile 221:1968): a five-column grid with the Display headline, a line of
 * support and the Ink pill across three, and a seat across two that bleeds
 * off the band's bottom edge. The seat changes every day
 * (utils/seat-of-the-day.ts). Stacks at 768px and below.
 */
export default function CtaBanner() {
  const seat = useSeatOfTheDay()

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
