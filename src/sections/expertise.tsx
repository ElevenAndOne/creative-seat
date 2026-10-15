import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { services } from '../content'

/** Ink section — Volt is its accent, the one colour cleared for text on Ink. */
export default function Expertise() {
  return (
    <section id="services" className="grid grid-cols-[660fr_780fr] bg-ink text-paper tablet:grid-cols-1">
      <img
        src="/images/sections/expertise-team.avif"
        alt="Three creatives walking across a desert salt flat with a laptop and notes"
        loading="lazy"
        decoding="async"
        className="h-full min-h-[35rem] w-full object-cover tablet:aspect-[4/3] tablet:min-h-0"
      />
      <div className="px-[60px] pt-[70px] pb-[127px] flex tablet:px-[var(--container-margin)] tablet:py-[var(--section-pad-md)]">
        <div className="max-w-[41.25rem] my-auto">
          <Eyebrow tone="paper">A complete creative service</Eyebrow>
          <Heading.H1 className="mt-4">
            Expertise, <Em>on demand.</Em>
          </Heading.H1>
          <Paragraph className="mt-5 max-w-[26.25rem]">
            One subscription. One workflow. Access every service you need to support your campaigns, launches, and ongoing content production.
          </Paragraph>
          <ul className="mt-[34px] flex max-w-[32.5rem] flex-wrap items-center gap-x-[10px] gap-y-3">
            {services.map((label) => (
              <li key={label} className="rounded-full border border-volt px-[18px] py-[10px] text-[0.9375rem] font-medium leading-none text-volt">
                {label}
              </li>
            ))}
            <li className="pl-1.5 font-medium text-volt">and more…</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
