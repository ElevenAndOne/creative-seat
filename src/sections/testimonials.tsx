import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import { testimonials } from '../content'

export default function Testimonials() {
  return (
    <Section className="bg-gradient-to-b from-white to-mist" pad="md" innerClassName="text-center">
      <Eyebrow tone="ink" className="font-inter font-bold tracking-[0.12em]">Redefining success. Together.</Eyebrow>
      <Heading.H2 className="mt-0.5 font-display">
        Why <Em>teams choose</Em> Creative Seat
      </Heading.H2>

      {/* Desktop: static 3-up grid. Tablet & below: an edge-to-edge horizontal
          snap carousel — it breaks out of the container margin so cards can
          scroll all the way to the screen edges (no container clipping). */}
      <div className="mt-[60px] grid grid-cols-3 gap-[28px] text-left font-inter [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:-mx-[var(--container-margin)] tablet:flex tablet:snap-x tablet:snap-mandatory tablet:overflow-x-auto tablet:px-[var(--container-margin)] tablet:pb-md">
        {testimonials.map((t) => (
          <article key={t.name} className="flex shrink-0 snap-start flex-col gap-4 rounded-card bg-white p-8 shadow-[0_5px_6px_rgba(0,0,0,0.06)] tablet:w-[60%] landscape:w-[85%]">
            <div className="flex items-center gap-3.5">
              {t.avatar && <img src={t.avatar} alt="" className="size-14 shrink-0 rounded-full object-cover" />}
              <div>
                <h3 className="text-base font-semibold text-ink">{t.name}</h3>
                <p className="mt-0.5 text-p-xs text-smoke">{t.subscript}</p>
              </div>
            </div>
            <p className="min-h-[190px] text-p-sm text-charcoal">“{t.testimony}”</p>
            <img src={t.logo} alt="" className="mt-auto h-6 w-fit max-w-[11rem] object-contain object-left" />
          </article>
        ))}
      </div>
    </Section>
  )
}
