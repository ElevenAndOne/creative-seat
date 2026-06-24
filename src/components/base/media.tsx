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

type VideoProps = {
    src: string
    /** Still frame shown before playback / while loading and when motion is reduced. */
    poster?: string
    /** Classes for the wrapper; the <video> itself always fills it (object-cover). */
    className?: string
} & Omit<ComponentPropsWithoutRef<'video'>, 'src' | 'poster' | 'className'>

/**
 * Ambient-by-default video. With no flags it behaves like decorative b-roll —
 * autoplaying, looping, muted, inline — the only way browsers allow silent
 * autoplay. Pass `controls` (and/or `autoPlay={false}`) for a player the user
 * drives instead.
 *
 * Two things a raw <video> gets wrong that this handles:
 *   1. React sets `muted` as an attribute, not the DOM *property*, so autoplay
 *      is silently blocked — we set the property on a ref to make it stick.
 *   2. Reduced-motion users don't get motion forced on them: autoplay is
 *      dropped and controls are surfaced so they can start it themselves.
 */
function Video({ src, poster, className, autoPlay = true, loop = true, muted = true, playsInline = true, controls = false, ...rest}: VideoProps) {
    const ref = useRef<HTMLVideoElement>(null)
    const reduce = useReducedMotion()

    // Ambient = autoplaying b-roll with no player chrome. For those, reduced
    // motion holds on the poster and reveals controls instead of playing.
    const ambient = autoPlay && !controls
    const shouldAutoPlay = autoPlay && !reduce
    const showControls = controls || (ambient && !!reduce)

    // Reflect `muted` to the property, not just the attribute, or autoplay is
    // blocked even though the markup says muted.
    useEffect(() => {
        if (ref.current) ref.current.muted = muted
    }, [muted])

    return (
        <div className={cn('overflow-clip', className)} >
            <video
                ref={ref}
                {...rest}
                src={src}
                poster={poster}
                autoPlay={shouldAutoPlay}
                loop={loop}
                muted={muted}
                playsInline={playsInline}
                controls={showControls}
                preload={shouldAutoPlay ? 'auto' : 'metadata'}
                className='w-full h-full object-cover'
            />
        </div>
    )
}


export const Media = { Image, Video }
