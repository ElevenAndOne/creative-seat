import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import { testimonials } from '../content'

export default function Testimonials() {
  return (
    <Section id="testimonials" className="bg-chalk">
      <Heading.H1>
        Why marketing teams <Em>take a seat.</Em>
      </Heading.H1>

      {/* Two quotes side by side as Paper cards on Chalk, stacking on phones. */}
      <div className="mt-xlg grid grid-cols-2 gap-3 landscape:grid-cols-1">
        {testimonials.map((t) => (
          <article
            key={t.name}
            className="flex min-h-[304px] flex-col gap-xlg rounded-md bg-paper p-xxxbg text-ink landscape:min-h-0"
          >
            <p className="text-p-md">“{t.testimony}”</p>
            {/* Pinned to the bottom, so the names and logos line up across the cards. */}
            <div className="mt-auto flex items-end justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-xxsm">
                <h3 className="text-p-sm font-bold">{t.name}</h3>
                <p className="text-p-xs">{t.subscript}</p>
              </div>
              <img src={t.logo} alt="" className="h-8 w-auto max-w-[9rem] shrink-0 object-contain object-right" />
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
