import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import { testimonials } from '../content'

export default function Testimonials() {
  return (
    <Section id="testimonials" className="bg-chalk" pad="md">
      <div className="border-t border-ink pt-xlg">
        <Eyebrow>Redefining success. Together.</Eyebrow>
        <Heading.H1 className="mt-4">
          Why marketing teams <Em>take a seat.</Em>
        </Heading.H1>
      </div>

      {/* Two quotes side by side on Chalk, stacking on phones. Each is a Paper
          card that turns Soft Volt — the brand's quote bubble — under the
          pointer. */}
      <div className="mt-[56px] grid grid-cols-2 gap-[24px] landscape:grid-cols-1">
        {testimonials.map((t) => (
          <article
            key={t.name}
            className="flex min-h-[23.75rem] flex-col gap-8 rounded-[18px] bg-paper p-10 text-ink transition-colors duration-300 ease-out hover:bg-soft-volt hover:text-forest landscape:min-h-0 landscape:p-8"
          >
            <p className="text-p-md">“{t.testimony}”</p>
            {/* Pinned to the bottom, so the names and logos line up across the cards. */}
            <div className="mt-auto flex items-start justify-between gap-4">
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
