import { useEffect, useRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn';

function Image({ src, alt, className }: { src: string; alt?: string; className?: string }) {
    return (
        <div className={className} >
            <img src={src} alt={alt} className='w-full h-full object-cover' />
        </div>
    )
}

type AmbientOptions = {
    autoPlay: boolean
    loop: boolean
    muted: boolean
    playsInline: boolean
    controls: boolean
}

/**
 * The playback props an ambient (decorative b-roll) <video> needs, plus the ref
 * it must be given. Ambient means looping, muted and inline, playing on its own
 * — the only combination browsers allow to start unprompted.
 *
 * Two things a raw <video> gets wrong that this handles:
 *   1. React sets `muted` as an attribute, not the DOM *property*, so playback
 *      is silently blocked — we set the property on a ref to make it stick.
 *   2. Chrome pauses muted b-roll that starts playing out of view and never
 *      resumes it, so a video hydrated below the fold would sit frozen on its
 *      first frame. Playback follows visibility instead (started here, never by
 *      an `autoplay` attribute): it plays while on screen and pauses when it
 *      leaves (no wasted decoding off screen either).
 *
 * Shared by <Media.Video> and the project covers, which differ only in whether
 * the element fills a sized box or sizes itself.
 */
export function useAmbientVideo({ autoPlay, loop, muted, playsInline, controls }: AmbientOptions) {
    const ref = useRef<HTMLVideoElement>(null)

    // Reflect `muted` to the property, not just the attribute, or playback is
    // blocked even though the markup says muted.
    useEffect(() => {
        if (ref.current) ref.current.muted = muted
    }, [muted])

    useEffect(() => {
        const el = ref.current
        if (!el || !autoPlay) return
        el.preload = 'auto'
        // Play only while on screen — see (2) above. The browser can still
        // refuse (power saving, data saver); that's its call to make, so let
        // the rejection go.
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) void el.play().catch(() => {})
            else el.pause()
        })
        io.observe(el)
        return () => io.disconnect()
    }, [autoPlay])

    return {
        ref,
        loop,
        muted,
        playsInline,
        controls,
        preload: 'metadata',
    } as const
}

type VideoProps = {
    src: string
    /** Still frame shown before playback / while loading. */
    poster?: string
    /** Classes for the wrapper; the <video> itself always fills it (object-cover). */
    className?: string
} & Omit<ComponentPropsWithoutRef<'video'>, 'src' | 'poster' | 'className'>

/**
 * Ambient-by-default video in a sized box. With no flags it behaves like
 * decorative b-roll; pass `controls` (and/or `autoPlay={false}`) for a player
 * the user drives instead.
 */
function Video({ src, poster, className, autoPlay = true, loop = true, muted = true, playsInline = true, controls = false, ...rest}: VideoProps) {
    const playback = useAmbientVideo({ autoPlay, loop, muted, playsInline, controls })

    return (
        <div className={cn('overflow-clip', className)} >
            <video
                {...rest}
                {...playback}
                src={src}
                poster={poster}
                className='w-full h-full object-cover'
            />
        </div>
    )
}


export const Media = { Image, Video }
