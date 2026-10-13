import Accordion from '../components/accordion'
import Button from '../components/autton'
import { Section } from '../components/base/section'
import Heading from '../components/heading'
import { faqItems } from '../content'

export default function Faq() {
  return (
    <Section id="resources" className="bg-mist" pad="md" innerClassName="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-20 tablet:grid-cols-1 tablet:gap-xlg">
      <div className="pt-[17px] tablet:pt-0">
        <Heading.H2 className="max-w-[25rem] font-display">Frequently asked questions</Heading.H2>
        <Button href="#contact" variant="black" className="mt-9">Get In Touch</Button>
      </div>
      <Accordion items={faqItems} />
    </Section>
  )
}
