import { Section } from '../components/base/section'
import BenefitCard from '../components/benefit-card'
import Em from '../components/em'
import Heading from '../components/heading'
import { benefitCards } from '../content'

/**
 * On the dark Forest-to-Ink gradient: three tall cards with Soft Volt, Forest
 * and Paper caption bands. The middle card plays the Brief, Design, Delivery
 * loop exported from Figma.
 */
export default function FasterOutput() {
  return (
    <Section id="benefits" className="bg-night text-paper" pad="md" width="wide">
      <Heading.H1 className="mx-auto text-center">
        More ideas made. <Em>Less waiting.</Em>
      </Heading.H1>

      <div className="mt-xxlg grid grid-cols-3 gap-4 landscape:mx-auto landscape:max-w-[28rem] landscape:grid-cols-1">
        {benefitCards.map((card) => (
          <BenefitCard key={card.title} {...card} />
        ))}
      </div>
    </Section>
  )
}
