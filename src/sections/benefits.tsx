import { Layout } from '../components/base/layout';
import { Section } from '../components/base/section'
import BenefitCard from '../components/benefit-card'
import Em from '../components/em'
import Heading from '../components/heading'
import { benefitCards } from '../content'

export default function FasterOutput() {
  return (
    <Section className="bg-black text-white" pad="md">
      <Heading.H1 as="h2" className="mx-auto">
        Faster output. Better execution. <Em className="block text-lime">Stronger results.</Em>
      </Heading.H1>

      <Layout.Grid className="mt-xlg grid-cols-3 landscape:grid-cols-1 gap-md">
        {benefitCards.map(({ src, title, body, tone }) => (
          <BenefitCard key={title} src={src} title={title} body={body} tone={tone} />
        ))}
      </Layout.Grid>
    </Section>
  )
}
