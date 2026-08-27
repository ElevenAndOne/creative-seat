import { useEffect, useRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { useReducedMotion } from 'motion/react'
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
 * it must be given. Ambient means autoplaying, looping, muted and inline — the
 * only combination browsers allow to start on its own.
 *
 * Two things a raw <video> gets wrong that this handles:
 *   1. React sets `muted` as an attribute, not the DOM *property*, so autoplay
 *      is silently blocked — we set the property on a ref to make it stick.
 *   2. Reduced-motion users don't get motion forced on them: autoplay is
 *      dropped and controls are surfaced so they can start it themselves.
 *
 * Shared by <Media.Video> and the project covers, which differ only in whether
 * the element fills a sized box or sizes itself.
 */
export function useAmbientVideo({ autoPlay, loop, muted, playsInline, controls }: AmbientOptions) {
    const ref = useRef<HTMLVideoElement>(null)
    const reduce = useReducedMotion()

    // Ambient = autoplaying b-roll with no player chrome. For those, reduced
    // motion holds on the poster and reveals controls instead of playing.
    const ambient = autoPlay && !controls
    const shouldAutoPlay = autoPlay && !reduce

    // Reflect `muted` to the property, not just the attribute, or autoplay is
    // blocked even though the markup says muted.
    useEffect(() => {
        if (ref.current) ref.current.muted = muted
    }, [muted])

    return {
        ref,
        autoPlay: shouldAutoPlay,
        loop,
        muted,
        playsInline,
        controls: controls || (ambient && !!reduce),
        preload: shouldAutoPlay ? 'auto' : 'metadata',
    } as const
}

type VideoProps = {
    src: string
    /** Still frame shown before playback / while loading and when motion is reduced. */
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
