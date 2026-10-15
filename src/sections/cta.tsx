import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import SketchCanvas from '../components/sketch-canvas'

/**
 * Closing campaign band: Volt, with Ink type and the Ink pill, over a live
 * WebGL pencil sketch of a creative in her armchair — the brand's seat, drawn
 * in Forest. The brand's campaign pattern, set close: headline, one line of
 * support, the button. Phones get extra height so the drawing can sit below.
 */
export default function CtaBanner() {
  return (
    <Section id="contact" pad="md" className="isolate overflow-hidden bg-volt text-ink" innerClassName="flex flex-col items-start landscape:min-h-[32rem]">
      <div aria-hidden className="absolute inset-0 -z-10">
        <SketchCanvas src="/images/sections/pitch-marketer.avif" paper="#bce42d" ink="#212c26" focusX={0.62} />
      </div>
      {/* Hero scale, set in two lines so the italic phrase stays whole. */}
      <Heading.H1 className="max-w-[9em] text-[clamp(3rem,1.9rem+4.1vw,5.25rem)] leading-[0.95] tracking-[-0.015em]">
        <span className="block">The simple way</span> <Em>to get creative.</Em>
      </Heading.H1>
      <Paragraph.Big className="mt-7 max-w-[28rem]">
        Design, illustration and animation for marketing teams that need more capacity.
      </Paragraph.Big>
      <Button href="mailto:hello@creativeseat.example" id="cta-book-demo" data-track="book_demo_click" data-track-location="cta" className="mt-9">
        Book a demo
      </Button>
    </Section>
  )
}
