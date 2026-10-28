import Accordion from '../components/accordion'
import { Section } from '../components/base/section'
import Heading from '../components/heading'
import { faqItems } from '../content'
import { track } from '../utils/analytics'

/** A large serif "FAQ" in a 464px aside, the questions filling the rest of the row. */
export default function Faq() {
  return (
    <Section id="resources" pad="md">
      <div className="grid grid-cols-[29rem_minmax(0,1fr)] items-start gap-6 tablet:grid-cols-1 tablet:gap-xlg">
        <Heading.H1 className="text-[clamp(3.5rem,3.3571rem+0.7143vw,4rem)] leading-[1.1] tracking-[-0.02em]">FAQ</Heading.H1>
        <Accordion items={faqItems} idPrefix="faq-question" onOpen={(item) => track('faq_open', { question: item.question })} />
      </div>
    </Section>
  )
}
