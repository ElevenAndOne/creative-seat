import Button from '../components/autton'
import { Media } from '../components/base/media';
import { Layout } from '../components/base/layout';
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

export default function ModernMarketing() {
  return (
    <Section pad="md">
      <Layout.Grid className="grid-cols-2 landscape:grid-cols-1 gap-xhg">
        <div>
          <Eyebrow>Advertising has changed</Eyebrow>
          <Heading.H2 className="mt-xlg">
            Designed for <Em className="text-grape">modern marketing</Em> teams
          </Heading.H2>
          <Paragraph className="mt-xbg">
            Teams are expected to deliver more content across more channels than ever before.
          </Paragraph>
          <Paragraph className="mt-bg">
            Freelancers create complexity and brand inconsistency. Traditional agencies are costly and lead to production drag. <strong>Creative Seat</strong> gives your team a faster, more effective way to produce high-end content within one simple subscription.
          </Paragraph>
          <Button href="#contact" className="mt-xlg">Book a Demo</Button>
        </div>
        <Media.Image src="/images/placeholder.svg" alt="Marketing professional working from a chair" className="w-full aspect-3/2"/>
      </Layout.Grid>
    </Section>
  )
}
