import { Section } from '../components/base/section'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { cn } from '../utils/cn'

/** Palette swatches for the sample brand, light to dark to light. */
const SWATCHES = ['bg-lavender', 'bg-plum', 'bg-rose', 'bg-mist']

/**
 * Collaborator cursors pinned around the collage, positioned as a share of its
 * 505 × 596 frame. `cursorFirst` puts the pointer before the label.
 */
const CURSORS = [
  { label: 'Project Manager', pill: 'bg-magenta', cursor: 'magenta', at: 'left-[21.1%] top-[2.5%]', cursorFirst: true, delay: '0s' },
  { label: 'Animator', pill: 'bg-orange', cursor: 'orange', at: 'left-[77%] top-[21.9%] landscape:left-auto landscape:right-[-2%]', cursorFirst: false, delay: '-1.2s' },
  { label: 'Graphic Designer', pill: 'bg-teal', cursor: 'teal', at: 'left-[54.7%] top-[44.5%] portrait:left-[45%]', cursorFirst: true, delay: '-2.6s' },
  { label: 'Web Developer', pill: 'bg-violet', cursor: 'violet', at: 'left-[-6%] top-[88.8%] landscape:left-[-2%]', cursorFirst: false, delay: '-3.8s' },
]

export default function NoHiring() {
  return (
    // The cursor labels deliberately spill past the collage; clip (not scroll) any
    // that reach the screen edge on the narrowest phones.
    <Section pad="md" className="overflow-x-clip">
      <div className="grid grid-cols-2 items-start gap-[70px] tablet:gap-xlg landscape:grid-cols-1">
        <Collage />
        <div className="landscape:order-first">
          <Eyebrow>Instant access to the skills you need</Eyebrow>
          <Heading.H2 className="mt-[14px]">
            <span className="block">No hiring. No training.</span> <span className="block">No added complexity.</span>
          </Heading.H2>
          <Paragraph className="mt-6 font-bold text-forest">Your team of creative specialists are already in place.</Paragraph>
          <Paragraph className="mt-5 text-forest">
            <strong>Creative Seat</strong> tailors a team of experienced talent to the type of content you need. Whether you require digital, video, web, animation or brand design, simply brief your designated project manager and your specialised team gets to work.
          </Paragraph>
        </div>
      </div>
    </Section>
  )
}

/**
 * A sample brand job broken into the pieces each specialist owns — packaging,
 * type, palette, logo, website — with their cursors hovering over it.
 */
function Collage() {
  return (
    <div className="relative aspect-[505/596] w-full">
      {/* minmax(0, …) so the photos can't stretch their rows to their natural height. */}
      <div className="grid h-full grid-cols-2 grid-rows-[minmax(0,180fr)_minmax(0,90fr)_minmax(0,298fr)] gap-[14px]">
        <img src="/images/sections/team-bottle.avif" alt="Sassy Locks haircare bottle" loading="lazy" decoding="async" className="h-full w-full rounded-md object-cover" />
        <div className="flex items-center justify-center rounded-md bg-lavender/50 font-display text-[2.75rem] text-ink">Aa</div>
        <div className="flex items-center" aria-hidden>
          {SWATCHES.map((swatch) => (
            <span key={swatch} className={cn('-mr-[7.3%] aspect-square w-[23.6%] rounded-full last:mr-0', swatch)} />
          ))}
        </div>
        <div className="flex items-center justify-center rounded-md bg-plum font-inter text-base font-extrabold tracking-[0.02em] text-white">SASSY LOCKS®</div>
        <img src="/images/sections/team-laptop.webp" alt="Sassy Locks website on a laptop" loading="lazy" decoding="async" className="col-span-2 h-full w-full rounded-md bg-black object-cover object-bottom" />
      </div>

      {CURSORS.map(({ label, pill, cursor, at, cursorFirst, delay }) => (
        <div key={label} aria-hidden className={cn('cs-float absolute flex items-center', cursorFirst ? 'gap-2' : 'gap-0.5', at)} style={{ animationDelay: delay }}>
          <span className={cn('flex h-[43px] w-[45px] shrink-0 items-center justify-center', !cursorFirst && 'order-last')}>
            <img src={`/images/icons/cursor-${cursor}.svg`} alt="" className="h-[36.3px] w-[32.5px] -rotate-60" />
          </span>
          <span className={cn('whitespace-nowrap rounded-full px-[8.25px] py-[5.25px] font-inter text-[11.25px] font-semibold leading-none text-white drop-shadow-[2.25px_1.5px_2.6px_rgba(0,0,0,0.15)]', pill)}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
