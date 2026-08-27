import type { ComponentPropsWithoutRef } from 'react'
import { useAmbientVideo } from './base/media'

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i

/** Whether a content `cover` / `images` entry points at a video rather than an image. */
const isVideo = (src: string) => VIDEO_EXT.test(src)

type ProjectMediaProps = {
  /** An image or a video path — the element is chosen from the extension. */
  src: string
  /** Still frame for a video source; ignored for images. */
  poster?: string
  /** Empty string marks the media decorative (duplicated marquee copies). */
  alt: string
  className?: string
} & Pick<ComponentPropsWithoutRef<'img'>, 'loading' | 'decoding' | 'draggable' | 'style'>

/**
 * One project cover, rendered as <img> or <video> depending on the source.
 *
 * Both branches put `className` on the media element itself rather than a
 * wrapper, so the two are interchangeable at every call site: the same classes
 * that crop an image to a card (`h-full w-full object-cover`) crop the video
 * the same way, and the same classes that let an image size itself in the
 * lightbox let the video keep its own aspect ratio.
 */
export default function ProjectMedia({ src, poster, alt, className, loading, decoding, draggable, style }: ProjectMediaProps) {
  const playback = useAmbientVideo({ autoPlay: true, loop: true, muted: true, playsInline: true, controls: false })

  if (isVideo(src)) {
    return (
      <video
        {...playback}
        src={src}
        poster={poster}
        // <video> has no alt; label it for screen readers, or hide it outright
        // when the caller marked it decorative.
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={className}
        style={style}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      draggable={draggable}
      className={className}
      style={style}
    />
  )
}
