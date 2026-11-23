import Accordion from '../components/accordion'
import { Section } from '../components/base/section'
import Heading from '../components/heading'
import { faqItems } from '../content'
import { track } from '../utils/analytics'

/** A Display "FAQ" in the first of three columns, the questions filling the other two. */
export default function Faq() {
  return (
    <Section id="resources">
      <div className="grid grid-cols-3 items-start gap-8 tablet:grid-cols-1 tablet:gap-xlg">
        <Heading.Display>FAQ</Heading.Display>
        <div className="col-span-2 tablet:col-span-1">
          <Accordion items={faqItems} idPrefix="faq-question" onOpen={(item) => track('faq_open', { question: item.question })} />
        </div>
      </div>
    </Section>
  )
}
