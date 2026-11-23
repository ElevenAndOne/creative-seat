import { Section } from '../components/base/section'
import BenefitCard from '../components/benefit-card'
import Em from '../components/em'
import Heading from '../components/heading'
import { benefitCards } from '../content'

/**
 * On the dark Forest-to-Ink gradient: three static cards, each a 320px image
 * over a Soft Volt caption band. The middle card plays the Brief, Design,
 * Delivery loop exported from Figma.
 */
export default function FasterOutput() {
  return (
    <Section id="benefits" className="bg-night text-paper">
      <Heading.H2 className="mx-auto text-center">
        More ideas made. <Em>Less waiting.</Em>
      </Heading.H2>

      <div className="mt-12 grid grid-cols-3 gap-3 landscape:mx-auto landscape:max-w-[28rem] landscape:grid-cols-1">
        {benefitCards.map((card) => (
          <BenefitCard key={card.title} {...card} />
        ))}
      </div>
    </Section>
  )
}
