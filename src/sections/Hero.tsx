import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import ScrollMarquee from '../components/marquee/ScrollMarquee'

export default function Hero() {
  return (
    <Section className="overflow-hidden bg-brand-radial text-white" pad="none" innerClassName="grid grid-cols-[0.9fr_1.1fr] items-stretch gap-xlg tablet:grid-cols-1">
      {/* The section itself has no vertical padding so the marquee runs the full
          hero height; the copy column carries that padding instead. */}
      {/* Top padding clears the now-fixed header (its floor) while keeping the
          larger section rhythm on desktop. */}
      <div className="flex flex-col justify-center pt-[max(var(--section-pad-md),7.5rem)] pb-[var(--section-pad-md)]">
        <h1 className="max-w-[39rem] text-display font-light tracking-normal">
          Increase your brands creative <Em className="text-lime">capability.</Em>
        </h1>
        <p className="mt-xbg max-w-[33rem] text-xl leading-relaxed text-white/90 landscape:text-lg">
          Scale your brands content production through a simple subscription to your very own specialised creative team.
        </p>
        <Button href="#contact" className="mt-xlg self-start">Book a Demo</Button>
      </div>
      <ScrollMarquee />
    </Section>
  )
}
