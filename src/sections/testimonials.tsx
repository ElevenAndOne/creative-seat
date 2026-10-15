import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import { testimonials } from '../content'

export default function Testimonials() {
  return (
    <Section id="testimonials" pad="md">
      <div className="border-t border-ink pt-xlg">
        <Eyebrow>Redefining success. Together.</Eyebrow>
        <Heading.H1 className="mt-4">
          Why marketing teams <Em>take a seat.</Em>
        </Heading.H1>
      </div>

      {/* Desktop: static 3-up grid. Tablet & below: an edge-to-edge horizontal
          snap carousel — it breaks out of the container margin so cards can
          scroll all the way to the screen edges (no container clipping). Each
          card is a Soft Volt quote bubble on Paper, as the brand draws a
          client's voice. */}
      <div className="mt-[56px] grid grid-cols-3 gap-[24px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:-mx-[var(--container-margin)] tablet:flex tablet:snap-x tablet:snap-mandatory tablet:overflow-x-auto tablet:px-[var(--container-margin)] tablet:pb-md">
        {testimonials.map((t) => (
          <article key={t.name} className="flex min-h-[28rem] shrink-0 snap-start flex-col gap-8 rounded-[18px] bg-soft-volt p-10 text-forest tablet:w-[60%] landscape:min-h-[26rem] landscape:w-[85%] landscape:p-8">
            <p className="text-p-md">“{t.testimony}”</p>
            {/* Every footer is the same height and pinned to the bottom, so the
                rules, names and logos line up across the cards. */}
            <div className="mt-auto flex min-h-[5.75rem] items-start justify-between gap-4 border-t border-forest/20 pt-6">
              <div>
                <h3 className="font-bold">{t.name}</h3>
                <p className="mt-1 text-p-xs">{t.subscript}</p>
              </div>
              <img src={t.logo} alt="" className="h-9 w-fit max-w-[9rem] shrink-0 object-contain object-right" />
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
