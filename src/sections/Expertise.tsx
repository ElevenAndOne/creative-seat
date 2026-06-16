import Em from '../components/em'
import Eyebrow from '../components/eyebrow'

// [label, chip styling] — mix of filled and outlined pills per the design.
const services: [string, string][] = [
  ['Ad Creative', 'bg-white text-black'],
  ['Social Assets', 'border border-mint text-mint'],
  ['Video Production', 'border border-lime text-lime'],
  ['photography', 'border border-blush text-blush'],
  ['Motion Graphics', 'bg-grape text-white'],
  ['Presentations', 'border border-white/70 text-white'],
  ['Web + UI Design', 'bg-lime text-black'],
  ['Illustration', 'border border-white/40 text-white/60'],
  ['Apps + Software', 'bg-lavender text-plum'],
  ['Brand Development', 'bg-magenta text-white'],
  ['Email Design', 'border border-white/70 text-white'],
  ['Copywriting', 'border border-lavender text-lavender'],
  ['Campaign Strategy', 'border border-lavender text-white'],
  ['AI Assisted Creative', 'border border-lime text-lime'],
]

export default function Expertise() {
  return (
    <section className="relative grid grid-cols-2 bg-black text-white tablet:grid-cols-1">
      <img src="/images/placeholder.svg" alt="Creative team walking outdoors" className="h-full min-h-[32rem] w-full object-cover" />
      <div className="flex items-center" style={{ paddingBlock: 'var(--section-pad-md)' }}>
        <div className="mx-auto w-full max-w-[47.5rem] px-xxlg tablet:px-[var(--container-margin)]">
          <Eyebrow tone="light">A complete creative service</Eyebrow>
          <h2 className="mt-xlg text-h2 font-light">Expertise <Em className="text-lime">on demand</Em></h2>
          <p className="mt-xbg max-w-[40rem] text-2xl leading-snug text-white/90">
            One subscription. One workflow. Access every service you need to support your campaigns, launches, and ongoing content production.
          </p>
          <div className="mt-xxlg flex flex-wrap gap-sm">
            {services.map(([label, cls]) => (
              <span key={label} className={`rounded-full px-5 py-2 text-lg ${cls}`}>
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
