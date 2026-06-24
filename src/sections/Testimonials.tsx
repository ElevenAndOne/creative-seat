import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { testimonials } from '../content'

export default function Testimonials() {
  return (
    <Section className="bg-mist" pad="md">
      <Paragraph>Redefining success. Together.</Paragraph>
      <Heading.H2 className="mt-bg">
        Why teams <Em className="text-grape">choose</Em> Creative Seat
      </Heading.H2>

      {/* Desktop: static 3-up grid. Tablet & below: an edge-to-edge horizontal
          snap carousel — it breaks out of the container margin so cards can
          scroll all the way to the screen edges (no container clipping). */}
      <div className="mt-xlg grid grid-cols-3 gap-bg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:-mx-[var(--container-margin)] tablet:flex tablet:snap-x tablet:snap-mandatory tablet:overflow-x-auto tablet:px-[var(--container-margin)] tablet:pb-md">
        {testimonials.map((t) => (
          <article key={t.name} className="flex min-h-[32rem] shrink-0 snap-start flex-col rounded-card border-2 border-grape bg-white p-xlg tablet:w-[60%] landscape:w-[85%]">
            <div className="flex items-center gap-bg">
              {t.avatar && <img src={t.avatar} alt="" className="h-24 w-24 rounded-lg object-cover" />}
              <div>
                <Heading.H3>{t.name}</Heading.H3>
                <Paragraph.Small className="mt-xxsm">{t.subscript}</Paragraph.Small>
              </div>
            </div>
            <Paragraph className="mt-xxlg">
              "{t.testimony}"
            </Paragraph>
            <img src={t.logo} alt="" className="mt-auto max-h-10 w-fit object-contain opacity-75" />
          </article>
        ))}
      </div>
    </Section>
  )
}
