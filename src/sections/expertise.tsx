import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { services } from '../content'

export default function Expertise() {
  return (
    <section className="relative grid grid-cols-2 bg-black text-white tablet:grid-cols-1">
      <img src="/images/placeholder.svg" alt="Creative team walking outdoors" className="h-full min-h-[32rem] w-full object-cover" />
      <div className="flex items-center" style={{ paddingBlock: 'var(--section-pad-md)' }}>
        <div className="mx-auto w-full max-w-[47.5rem] px-xxlg tablet:px-[var(--container-margin)]">
          <Eyebrow tone="light">A complete creative service</Eyebrow>
          <Heading.H2 className="mt-xlg">Expertise <Em className="text-lime">on demand</Em></Heading.H2>
          <Paragraph className="mt-xbg">
            One subscription. One workflow. Access every service you need to support your campaigns, launches, and ongoing content production.
          </Paragraph>
          <div className="mt-xxlg flex flex-wrap gap-sm">
            {services.map(({ label, className }) => (
              <span key={label} className={`rounded-full px-5 py-2 text-lg ${className}`}>
                {label}
              </span>
            ))}
            <span className="px-2 py-2 text-lg text-white/70">and more...</span>
          </div>
        </div>
      </div>
    </section>
  )
}
