import type { ReactNode } from 'react'
import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { cn } from '../utils/cn'

// Decorative artwork. Each card is a full-bleed background image with only the
// copy living as HTML on top. Swap these for the real per-breakpoint assets when
// they land — `img` is desktop, `imgMobile` (optional) is served ≤48rem.
const PLACEHOLDER = '/images/placeholder.svg'

export default function Intelligence() {
  return (
    <Section pad="md">
      <div className="grid grid-cols-[1.1fr_0.7fr] items-start gap-xlg tablet:grid-cols-1">
        <div>
          <Paragraph>Human-led. AI-enhanced.</Paragraph>
          <Heading.H2 className="mt-bg">
            Talented people, <Em className="text-grape">powered</Em> by intelligence
          </Heading.H2>
        </div>
        <div>
          <Paragraph>AI tools streamline workflows to deliver better work, faster.</Paragraph>
          <div className="mt-xlg flex flex-wrap gap-sm">
            <Button href="#contact" variant="black">Get In Touch</Button>
            <Button href="#mia" variant="outline-black">Learn more about MIA</Button>
          </div>
        </div>
      </div>

      {/* Every card is image-backed; the copy sits above on brand-tinted scrims. */}
      <div id="mia" className="mt-xxlg grid grid-cols-[0.9fr_1.8fr] gap-bg tablet:grid-cols-1">
        {/* Mia — tall left card */}
        <PhotoCard
          base="bg-mia"
          img={PLACEHOLDER}
          alt="Mia marketing-intelligence agent"
          className="row-span-2 min-h-[30rem] tablet:row-span-1 tablet:min-h-[22rem]"
        >
          <Heading.H4>Creative decisions driven by data, not guesswork</Heading.H4>
          <Paragraph className="mt-auto">
            <strong className="font-semibold">Mia</strong> is Creative Seat's integrated marketing intelligence agent that analyses the data from all your channels, identifies immediate opportunities and provides actionable insights.
          </Paragraph>
        </PhotoCard>

        {/* AI tools — wide top-right; light artwork keeps dark copy */}
        <PhotoCard
          base="bg-sky"
          text="dark"
          img={PLACEHOLDER}
          alt="AI studio automating repetitive production tasks"
          className="h-[21.25rem] tablet:h-[20rem]"
        >
          <Heading.H4>AI tools remove the repetitive so talented people can create the remarkable.</Heading.H4>
          <Paragraph.Small>
            Our purpose-built AI studio automates repetitive tasks and project administration, giving creatives more time to focus on ideas, craft, and high-quality design.
          </Paragraph.Small>
        </PhotoCard>

        <div className="grid grid-cols-2 gap-bg portrait:grid-cols-1">
          {/* AI knowledge */}
          <PhotoCard
            base="bg-grape"
            img={PLACEHOLDER}
            alt="AI knowledge system trained on your brand"
            className="h-[21.25rem] tablet:h-[20rem]"
          >
            <Heading.H4>An AI knowledge system that understands your brand.</Heading.H4>
            <Paragraph>
              Every brief, revision, and approved asset strengthens your brand knowledge, helping future projects move faster and with greater accuracy.
            </Paragraph>
          </PhotoCard>

          {/* Smart automations — checklist artwork is baked into the image */}
          <PhotoCard
            base="bg-flow"
            img={PLACEHOLDER}
            alt="Automated workflow: sharpen brief, organise assets, route approvals"
            className="h-[21.25rem] tablet:h-[20rem]"
          >
            <Heading.H4>Smart automations. Less friction.</Heading.H4>
          </PhotoCard>
        </div>
      </div>

      <Button href="#contact" className="mt-xlg">Book a Demo</Button>
    </Section>
  )
}

type PhotoCardProps = {
  /** Brand background — the fallback tint behind the artwork. */
  base: string
  /** Copy colour over the scrim: light (default) for dark artwork, dark for light. */
  text?: 'light' | 'dark'
  img: string
  /** Optional art-directed source served at ≤48rem. */
  imgMobile?: string
  alt?: string
  className?: string
  children: ReactNode
}

/**
 * Full-bleed image card: the photo fills the card, the brand colour sits behind
 * it, and top/bottom scrims in that same colour keep the overlaid copy legible
 * while preserving the card's brand tint. Copy is the only live HTML; anything
 * decorative belongs in the artwork. Generalises the AI-knowledge card so every
 * card in the grid shares one treatment.
 */
function PhotoCard({ base, text = 'light', img, imgMobile, alt = '', className, children }: PhotoCardProps) {
  return (
    <article className={cn('relative overflow-hidden rounded-card', base, text === 'light' ? 'text-white' : 'text-ink', className)}>
      <picture>
        {imgMobile && <source media="(max-width: 48rem)" srcSet={imgMobile} />}
        <img src={img} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <div className="relative z-10 flex h-full flex-col gap-md p-xlg landscape:p-xbg max-w-[40rem]">
        {children}
      </div>
    </article>
  )
}
