import LinkButton from '../components/link-button'
import { Section } from '../components/base/section'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { demoPage } from '../utils/contact'

/**
 * Collage pieces, placed as Figma's 320 × 333.47 frame draws them, in percent
 * of that frame so the whole collage scales with its column. Painted back to
 * front: the poolside ad, a campaign card (Onvlee's "Arcs & Bends" — Figma's
 * own card was template filler; its 4px Paper frame and 12px corner are drawn
 * in CSS since our bitmap has none), then the egg chair over both.
 */
const COLLAGE = [
  { src: '/images/cta/poolside-drink.webp', width: 300, height: 450, box: { left: '60.24%', top: '21.08%', width: '39.76%', height: '56.04%' }, fit: 'object-cover' },
  { src: '/images/cta/campaign-card.webp', width: 400, height: 583, box: { left: '0%', top: '0%', width: '53.01%', height: '74.14%' }, fit: 'object-cover rounded-md border-4 border-paper bg-paper' },
  { src: '/images/cta/egg-chair.webp', width: 380, height: 440, box: { left: '20.78%', top: '34.26%', width: '59.34%', height: '65.74%' }, fit: 'object-contain' },
] as const

/**
 * Closing campaign band on Volt, as the Figma file sets it: two equal columns,
 * the Display headline, a line of support and the Paper pill on the left, and
 * a small collage of the work on the right. Stacks on tablets and phones.
 */
export default function CtaBanner() {
  return (
    <Section id="contact" className="bg-volt text-ink" innerClassName="grid grid-cols-2 items-start gap-8 tablet:grid-cols-1 tablet:gap-12">
      <div className="flex flex-col items-start gap-6">
        <Heading.Display className="text-pretty">The simple way to get creative.</Heading.Display>
        <Paragraph className="max-w-[34rem] text-pretty">
          Design, illustration and animation for marketing teams that need more capacity.
        </Paragraph>
        <LinkButton href={demoPage} id="cta-book-demo" data-track="book_demo_click" data-track-location="cta" variant="inverse">
          Book a demo
        </LinkButton>
      </div>

      <div aria-hidden className="relative mx-auto aspect-[320/333.47] w-full max-w-80 tablet:max-w-72">
        {COLLAGE.map(({ src, width, height, box, fit }) => (
          <img
            key={src}
            src={src}
            width={width}
            height={height}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute ${fit}`}
            style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
          />
        ))}
      </div>
    </Section>
  )
}
