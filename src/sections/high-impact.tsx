import Button from '../components/autton'
import { Layout } from '../components/base/layout';
import { Media } from '../components/base/media';
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

export default function HighImpact() {
  return (
    <Section className="bg-brand-radial text-white" pad="md">
      <Layout.Grid className="grid-cols-2 landscape:grid-cols-1 gap-xhg">
        <div>
          <Eyebrow tone="light">Multi-platform performance</Eyebrow>
          <Heading.H2 className="mt-xlg">
            High impact creative across <Em className="text-lime">every channel.</Em>
          </Heading.H2>
          <Paragraph className="mt-xbg">
            Deliver attention-grabbing campaigns across the channels your audience uses every day. Strengthen your brand with consistently strong creative designed to make an impact.
          </Paragraph>
          <Paragraph className="mt-xbg">Launch standout campaigns and content that perform on every platform.</Paragraph>
          <Button href="#contact" className="mt-xlg">Book a Demo</Button>
        </div>
        <Media.Image
          src="/images/placeholder.svg"
          alt="Montage of creative across platforms"
          className="w-full aspect-3/2"
        />
      </Layout.Grid>
    </Section>
  )
}
