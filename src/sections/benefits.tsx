import { Section } from '../components/base/section'
import BenefitCard from '../components/benefit-card'
import Heading from '../components/heading'
import { benefitCards } from '../content'

export default function FasterOutput() {
  return (
    <Section className="bg-night text-white" pad="md">
      <Heading.H2 className="text-center font-display">Faster output. Better execution.</Heading.H2>

      <div className="mt-xxlg grid grid-cols-3 gap-[18px] tablet:grid-cols-2 landscape:grid-cols-1">
        {benefitCards.map((card) => (
          <BenefitCard key={card.title} {...card} />
        ))}
      </div>
    </Section>
  )
}
