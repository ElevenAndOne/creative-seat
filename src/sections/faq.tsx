import Accordion from '../components/accordion'
import Button from '../components/autton'
import { Section } from '../components/base/section'
import Heading from '../components/heading'
import { faqItems } from '../content'
import { track } from '../utils/analytics'
import { contactMail } from '../utils/contact'

export default function Faq() {
  return (
    <Section id="resources" pad="md">
      <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-20 border-t border-ink pt-xlg tablet:grid-cols-1 tablet:gap-xlg">
        <div>
          <Heading.H2 className="max-w-[12ch]">Frequently asked questions</Heading.H2>
          <Button href={contactMail} id="faq-get-in-touch" data-track="get_in_touch_click" data-track-location="faq" className="mt-9">
            Get in touch
          </Button>
        </div>
        <Accordion items={faqItems} idPrefix="faq-question" onOpen={(item) => track('faq_open', { question: item.question })} />
      </div>
    </Section>
  )
}
