import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import { services } from '../content'

export default function Expertise() {
  return (
    <section id="services" className="grid grid-cols-[660fr_780fr] bg-coal text-white tablet:grid-cols-1">
      <img
        src="/images/sections/expertise-team.avif"
        alt="Three creatives walking across a desert salt flat with a laptop and notes"
        loading="lazy"
        decoding="async"
        className="h-full min-h-[35rem] w-full object-cover tablet:aspect-[4/3] tablet:min-h-0"
      />
      <div className="px-[60px] pt-[70px] pb-[127px] tablet:px-[var(--container-margin)] tablet:py-[var(--section-pad-md)]">
        <div className="max-w-[41.25rem]">
          <Eyebrow tone="light" className="font-inter font-bold tracking-[0.12em] text-white">A complete creative service</Eyebrow>
          <Heading.H2 className="mt-[18px] font-display">
            Expertise <Em className="text-lime">on demand</Em>
          </Heading.H2>
          <p className="mt-[16px] max-w-[26.25rem] font-inter text-[15.5px] leading-[1.6] text-[#e7e7e7]">
            One subscription. One workflow. Access every service you need to support your campaigns, launches, and ongoing content production.
          </p>
          <ul className="mt-[34px] flex max-w-[32.5rem] flex-wrap items-center gap-x-[11px] gap-y-3">
            {services.map((label) => (
              <li key={label} className="rounded-full border-2 border-lime-soft px-[22px] py-[11px] font-display text-[15px] font-semibold leading-none text-lime-soft">
                {label}
              </li>
            ))}
            <li className="pl-1.5 font-inter text-base font-semibold text-lime-soft">and more...</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
