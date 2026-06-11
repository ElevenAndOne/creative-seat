import Container from '../components/container'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'

const services = [
  'Ad Creative', 'Social Assets', 'Video Production', 'Photography', 'Motion Graphics', 'Presentations',
  'Web + UI Design', 'Illustration', 'Apps + Software', 'Brand Development', 'Email Design', 'Copywriting',
  'Campaign Strategy', 'AI Assisted Creative',
]

export default function Expertise() {
  return (
    <section className="grid bg-black text-white lg:grid-cols-2">
      <img src="/images/expertise-photo.png" alt="Creative team walking outdoors" className="h-full min-h-[520px] w-full object-cover" />
      <div className="flex items-center py-20 md:py-28">
        <Container className="max-w-[760px] lg:px-16">
          <Eyebrow tone="light">A complete creative service</Eyebrow>
          <h2 className="mt-10 text-5xl font-light leading-tight md:text-h2">Expertise <Em className="text-lime">on demand</Em></h2>
          <p className="mt-8 max-w-[640px] text-2xl leading-snug text-white/90">
            One subscription. One workflow. Access every service you need to support your campaigns, launches, and ongoing content production.
          </p>
          <div className="mt-16 flex flex-wrap gap-3">
            {services.map((service, i) => (
              <span key={service} className={`rounded-full border px-5 py-2 text-lg ${i % 5 === 0 ? 'bg-white text-black' : i % 5 === 1 ? 'border-mint text-mint' : i % 5 === 2 ? 'border-lime text-lime' : i % 5 === 3 ? 'border-magenta text-blush' : 'border-white/70 text-white'}`}>
                {service}
              </span>
            ))}
            <span className="px-2 py-2 text-lg">and more...</span>
          </div>
        </Container>
      </div>
    </section>
  )
}
