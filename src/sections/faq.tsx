import Accordion from '../components/accordion'
import Button from '../components/autton'
import { Section } from '../components/base/section'
import Heading from '../components/heading'
import { faqItems } from '../content'

export default function Faq() {
  return (
    <Section id="resources" className="bg-mist" pad="md" innerClassName="grid grid-cols-[0.8fr_1fr] gap-xlg tablet:grid-cols-1">
      <div>
        <Heading.H2>Frequently asked questions</Heading.H2>
        <Button href="#contact" variant="black" className="mt-xlg">Get In Touch</Button>
      </div>
      <Accordion items={faqItems} />
    </Section>
  )
}
