import { useAmbientVideo } from '../hooks/useAmbientVideo'

interface BenefitCardProps {
  /** The photo, or the poster frame when there is a `video`. */
  src: string
  /** An ambient loop to play in place of the photo, WebM first with an MP4 fallback. */
  video?: { webm: string, mp4: string }
  title: string
  /** The part of `title` set in serif italic, if any. */
  em?: string
  /** The description that opens under the title. */
  body: string
  /** `object-position` for the photo, so each card keeps its subject in frame. */
  focus?: string
}

/**
 * A 320px image (or ambient loop) over a Soft Volt caption band; the title is
 * Golos 24/32 regular, with any italic phrase in Instrument Serif. The card is
 * a fixed height, so on hover/focus, as it lifts 10px, the band grows upward
 * into the image (which re-crops to fit) and the description opens and fades
 * in under the title. Touch screens have no hover, so there the description
 * is simply always open.
 */
export default function BenefitCard({ src, video, title, em, body, focus }: BenefitCardProps) {
  const [before, after] = em ? title.split(em) : [title, '']
  const playback = useAmbientVideo({ autoPlay: true, loop: true, muted: true, playsInline: true, controls: false })
  const media = 'absolute inset-0 h-full w-full object-cover'
  const open = 'group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100'

  return (
    <article
      tabIndex={0}
      className="group flex h-[25rem] flex-col overflow-hidden rounded-sm bg-soft-volt outline-none transition-[translate] duration-500 ease-glide hover:-translate-y-2.5 focus-visible:-translate-y-2.5 focus-visible:ring-2 focus-visible:ring-soft-volt focus-visible:ring-offset-4 focus-visible:ring-offset-ink landscape:h-auto [@media(hover:none)]:h-auto"
    >
      <div className="relative min-h-0 grow bg-chalk landscape:h-80 landscape:grow-0 [@media(hover:none)]:h-80 [@media(hover:none)]:grow-0">
        {video ? (
          <video {...playback} poster={src} aria-hidden="true" style={{ objectPosition: focus }} className={media}>
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </video>
        ) : (
          <img src={src} alt="" loading="lazy" decoding="async" style={{ objectPosition: focus }} className={media} />
        )}
      </div>
      <div className="shrink-0 bg-soft-volt px-4 py-6 text-forest">
        <h3 className="text-h3 font-normal tracking-normal">
          {before}
          {em && <em className="font-serif italic leading-none">{em}</em>}
          {after}
        </h3>
        <div className={`grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-glide ${open}`}>
          <div className="overflow-hidden">
            <p className="max-w-[36ch] pt-2 text-p-md">{body}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
