import { motion, useReducedMotion } from 'motion/react'
import Button from '../components/autton'
import Em from '../components/em'
import BrandLogo from '../components/brand-logo'
import Heading from '../components/heading'
import HeroStack from '../components/hero-stack'
import Paragraph from '../components/paragraph'
import { logos } from '../content'
import { demoPage } from '../utils/contact'

const EASE = [0.16, 1, 0.3, 1] as const

/** Height of the fixed header (16px padding either side of the 44px pill), which the hero clears. */
const HEADER = '4.75rem'

/**
 * The first screen, on the dark Forest-to-Ink gradient and one viewport tall
 * (`100dvh`, so mobile browser bars don't crop it): the display duet and CTA
 * on the left, the card fan on the right, the client logos along the bottom.
 *
 * Everything shares the page's content column, so the copy lines up with the
 * header and every section below. Vertical spacing and the fan's size come off
 * the viewport height, so it all fits from a 720px laptop up; taller content
 * (tablets, phones) lets it grow past one screen rather than squash.
 */
export default function Hero() {
  const reduce = useReducedMotion() ?? false

  // Copy rises in just ahead of the cards. The props must be the same on server
  // and client (the reduced-motion preference is only known in the browser, and
  // React won't patch a mismatched `style` on hydration, leaving the copy
  // invisible), so reduced motion just makes the transition instant.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay },
  })

  return (
    <section id="hero" className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-night text-paper">
      <div
        className="mx-auto grid w-full max-w-[var(--container-width)] flex-1 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-x-12 gap-y-14 pb-[clamp(2rem,5dvh,3.5rem)] tablet:grid-cols-1"
        style={{ paddingTop: `calc(${HEADER} + clamp(1.5rem, 7dvh, 4.5rem))` }}
      >
        <div className="flex flex-col items-start">
          {/* The brand's campaign pattern: an Instrument Serif headline
              finishing on its italic phrase, a line of support, then the one
              call to action. */}
          <motion.div {...rise(0.05)}>
            {/* Headline 1 at hero scale. Three set lines — "Increase your /
                brand's creative / capability." — held by the em-based measure. */}
            <Heading.H1 as="h1" className="max-w-[7.4em] text-[clamp(3rem,2.7143rem+1.4286vw,4rem)] leading-[0.95] tracking-[-0.015em] tablet:max-w-[9em]">
              <span className="block">Increase your</span> brand’s <Em>creative capability.</Em>
            </Heading.H1>
          </motion.div>
          <motion.div {...rise(0.18)} className="mt-7 max-w-[29rem]">
            <Paragraph.Big>
              Scale your brand’s content production through a simple subscription to your very own specialised creative team.
            </Paragraph.Big>
          </motion.div>
          <motion.div {...rise(0.31)} className="mt-10">
            <Button href={demoPage} id="hero-book-demo" data-track="book_demo_click" data-track-location="hero" variant="inverse">
              Book a demo
            </Button>
          </motion.div>
        </div>

        {/* As wide as its column allows, but never taller than the space left
            under the header and above the logos (the fan is 554.6 × 391). */}
        <div className="relative w-full max-w-[min(100%,calc((100dvh-19rem)*1.418))] justify-self-end tablet:mx-auto tablet:max-w-[38rem] tablet:justify-self-center">
          <HeroStack />
        </div>
      </div>

      {/* Client logos: the label, then an endless marquee of logos fading out
          at both edges — on one ruled line on desktop, stacked below. */}
      <motion.div {...rise(0.45)} id="clients" className="mx-auto w-full max-w-[var(--container-width)] pb-[clamp(1.75rem,4dvh,2.75rem)]">
        <div className="flex items-center gap-x-12 border-t border-paper/15 pt-6 tablet:flex-col tablet:items-start tablet:gap-y-6">
          <h2 className="max-w-[11rem] shrink-0 text-eyebrow font-semibold uppercase leading-[1.5] text-paper/70 tablet:max-w-none">
            Creative partner to worldwide brands
          </h2>
          <div className="cs-marquee min-w-0 flex-1 overflow-hidden tablet:w-full">
            {/* Two identical runs side by side; the track slides one run's
                width, then loops — seamless because the second run is where
                the first began. The copy is hidden from assistive tech. */}
            <div className="cs-marquee-track flex w-max">
              {[0, 1].map((run) => (
                <div key={run} aria-hidden={run === 1 || undefined} className="flex shrink-0 items-center gap-x-16 pr-16 landscape:gap-x-12 landscape:pr-12">
                  {logos.map((logo) => (
                    <BrandLogo key={logo.name} src={logo.src} name={logo.name} className="h-9 brightness-0 invert landscape:h-7" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
