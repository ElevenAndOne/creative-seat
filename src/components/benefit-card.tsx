import { cn } from '../utils/cn'
import { useAmbientVideo } from './base/media'

interface BenefitCardProps {
  /** The photo, or the poster frame when there is a `video`. */
  src: string
  /** An ambient loop to play in place of the photo, WebM first with an MP4 fallback. */
  video?: { webm: string, mp4: string }
  title: string
  /** The part of `title` set in serif italic. */
  em: string
  body: string
  /** Caption band: Soft Volt (the accent), Forest, or Paper. */
  tone: 'accent' | 'deep' | 'light'
  /** `object-position` for the photo, so each card keeps its subject in frame. */
  focus?: string
}

const TONE = {
  accent: 'bg-soft-volt text-forest',
  deep: 'bg-forest text-soft-volt',
  light: 'bg-paper text-ink',
}

/**
 * Tall photo card over a solid caption band, its title ending (or starting) on
 * a serif italic phrase — after Superside's benefit cards, motion included. The
 * card is a fixed height, so on hover/focus, as it lifts 10px, the band grows
 * upward into the photo (which re-crops to fit) and the description opens and
 * fades in underneath the title. Touch screens have no hover, so there the
 * description is simply always open.
 */
export default function BenefitCard({ src, video, title, em, body, tone, focus }: BenefitCardProps) {
  const [before, after] = title.split(em)
  // Reduced motion holds on the poster: the card is decoration, so it needs no controls.
  const playback = useAmbientVideo({ autoPlay: true, loop: true, muted: true, playsInline: true, controls: false, posterOnReduce: true })
  const media = 'absolute inset-0 h-full w-full object-cover'

  return (
    <article
      tabIndex={0}
      className="group flex h-[36.75rem] flex-col overflow-hidden rounded-[10px] outline-none transition-[translate] duration-500 ease-glide hover:-translate-y-2.5 focus-visible:-translate-y-2.5 focus-visible:ring-2 focus-visible:ring-soft-volt focus-visible:ring-offset-4 focus-visible:ring-offset-ink tablet:h-[32rem] landscape:h-auto"
    >
      <div className="relative min-h-0 grow bg-chalk landscape:aspect-[4/3] landscape:grow-0">
        {video ? (
          <video {...playback} poster={src} aria-hidden="true" style={{ objectPosition: focus }} className={media}>
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </video>
        ) : (
          <img src={src} alt="" loading="lazy" decoding="async" style={{ objectPosition: focus }} className={media} />
        )}
      </div>
      <div
        className={cn(
          'shrink-0 px-[clamp(1.25rem,0.5rem+2vw,2.5rem)] pb-4 pt-[clamp(1.5rem,1rem+1.4vw,2.5rem)] transition-[padding] duration-500 ease-glide group-hover:pb-10 group-focus-visible:pb-10 [@media(hover:none)]:pb-8',
          TONE[tone],
        )}
      >
        <h3 className="mb-4 text-[clamp(1.5rem,1.1rem+1.1vw,2.25rem)] leading-[1.1] tracking-[-0.02em]">
          {before}
          <em className="font-serif italic tracking-[-0.01em]">{em}</em>
          {after}
        </h3>
        <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-in-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100">
          <div className="overflow-hidden">
            <p className="max-w-[36ch] text-p-md">{body}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
