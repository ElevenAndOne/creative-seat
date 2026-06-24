import Button from '../components/autton'
import { Layout } from '../components/base/layout';
import { Media } from '../components/base/media';
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'

export default function NoHiring() {
  return (
    <Section pad="md">
      <Layout.Grid className="grid-cols-2 landscape:grid-cols-1 gap-xhg">
        <Media.Video
          src="https://timothyricks.us.getafile.online/background-video"
          // alt="Campaign creative produced by a Creative Seat specialist team"
          className="w-full aspect-16/9"
        />
        <div>
          <Eyebrow>Instant access to the skills you need</Eyebrow>
          <Heading.H2 className="mt-xlg">
            No hiring. No training. No added <Em className="text-grape">complexity.</Em>
          </Heading.H2>
          <Paragraph className="mt-xbg">Your team of creative specialists are already in place.</Paragraph>
          <Paragraph className="mt-bg">
            <strong>Creative Seat</strong> tailors a team of experienced talent to the type of content you need. Whether you require digital, video, web, animation or brand design, simply brief your designated project manager and your specialised team gets to work.
          </Paragraph>
          <Button href="#contact" className="mt-xlg">Book a Demo</Button>
        </div>
      </Layout.Grid>
    </Section>
  )
}
