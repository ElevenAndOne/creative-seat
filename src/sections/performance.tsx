import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import VideoLightbox from '../components/video-lightbox'

/** The 2026 showreel, hosted on Cloudflare R2 alongside the portfolio videos. */
const SHOWREEL = 'https://pub-1cc862ca275241f289d614f4081c03c1.r2.dev/11%261_Creative%20Showreel_2026_il_Final_2.mp4'

export default function HighImpact() {
  return (
    <Section id="performance" className="bg-night-low text-paper">
      {/* Two equal columns (grid/gutter 32/24), copy centred against the 8:5 showreel. */}
      <div className="grid grid-cols-2 items-center gap-8 tablet:gap-6 landscape:grid-cols-1 landscape:gap-xbg">
        <div className="flex flex-col gap-xbg">
          <Heading.Display>
            High impact creative <Em>across every channel.</Em>
          </Heading.Display>
          <Paragraph>
            Deliver attention-grabbing campaigns across the channels your audience uses every day. Strengthen your brand with consistently strong creative designed to make an impact.
          </Paragraph>
          <Paragraph>Launch standout campaigns and content that perform on every platform.</Paragraph>
        </div>
        <VideoLightbox
          src={SHOWREEL}
          poster="/images/sections/performance-showreel.avif"
          title="Creative Seat showreel 2026"
          cta="Watch the 2026 showreel"
          id="performance-showreel"
          trackLocation="performance"
          className="aspect-[8/5]"
        />
      </div>
    </Section>
  )
}
