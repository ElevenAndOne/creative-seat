import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import VideoLightbox from '../components/video-lightbox'
import { demoPage } from '../utils/contact'

/** The 2026 showreel, hosted on Cloudflare R2 alongside the portfolio videos. */
const SHOWREEL = 'https://pub-1cc862ca275241f289d614f4081c03c1.r2.dev/11%261_Creative%20Showreel_2026_il_Final_2.mp4'

export default function HighImpact() {
  return (
    <Section id="performance" className="bg-night-low text-paper" pad="md">
      {/* The showreel takes the larger share of the row. The headline is sized
          off its own column (up to 96px), so it always sets as two lines:
          "High impact creative / across every channel." */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-14 tablet:gap-xlg landscape:grid-cols-1">
        <div className="@container">
          <Eyebrow tone="paper">Multi-platform performance</Eyebrow>
          <Heading.H1 className="mt-4 text-[min(6rem,13.5cqi)] leading-[1.05] tracking-[-0.01em] landscape:text-[min(3.75rem,13.5cqi)]">
            High impact creative <Em>across every channel.</Em>
          </Heading.H1>
          <div className="mt-6 max-w-[28.75rem]">
            <Paragraph>
              Deliver attention-grabbing campaigns across the channels your audience uses every day. Strengthen your brand with consistently strong creative designed to make an impact.
            </Paragraph>
            <Paragraph className="mt-5">Launch standout campaigns and content that perform on every platform.</Paragraph>
          </div>
          <Button href={demoPage} id="performance-book-demo" data-track="book_demo_click" data-track-location="performance" variant="inverse" className="mt-9">
            Book a demo
          </Button>
        </div>
        <VideoLightbox
          src={SHOWREEL}
          poster="/images/sections/performance-showreel.avif"
          title="Creative Seat showreel 2026"
          cta="Watch the 2026 showreel"
          id="performance-showreel"
          trackLocation="performance"
        />
      </div>
    </Section>
  )
}
