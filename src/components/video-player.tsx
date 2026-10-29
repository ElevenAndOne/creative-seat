import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../utils/cn'

/** How long the pointer sits still before the chrome fades out, ms. */
const IDLE_MS = 2400
/** Arrow-key seek, seconds. */
const STEP = 5

type VideoPlayerProps = {
  src: string
  poster: string
  /** Accessible name for the video. */
  label: string
  autoPlay?: boolean
  className?: string
  /** Anything to park in the top-right corner — it fades with the player's own chrome. */
  children?: ReactNode
}

/**
 * The brand's own video player: Volt on Ink chrome instead of the browser's.
 *
 * Everything but the picture — the bar, the corner slot, the cursor — fades
 * away once the viewer stops reaching for it (pointer still for `IDLE_MS`,
 * pointer gone, or playback started) and comes straight back on the next
 * move, key or focus. It never hides while the film is paused: a paused player
 * with no controls looks broken.
 */
export default function VideoPlayer({ src, poster, label, autoPlay = false, className, children }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const idleTimer = useRef(0)
  const [playing, setPlaying] = useState(autoPlay)
  /** `playing` for the media listeners and the idle timer, which both outlive a render. */
  const playingRef = useRef(autoPlay)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [full, setFull] = useState(false)
  const [idle, setIdle] = useState(false)

  /** Show the chrome and leave it up — the resting state while paused. */
  const show = useCallback(() => {
    setIdle(false)
    window.clearTimeout(idleTimer.current)
  }, [])

  /** Show it, then start the clock that takes it away again. */
  const arm = useCallback(() => {
    show()
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS)
  }, [show])

  /** A sign of life from the viewer: the chrome comes back, and only goes again mid-playback. */
  const wake = useCallback(() => {
    if (playingRef.current) arm()
    else show()
  }, [arm, show])

  useEffect(() => () => window.clearTimeout(idleTimer.current), [])

  // Mirror the element's own state: it also changes from the keyboard, the
  // media keys and the OS, not just from this bar.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const onTime = () => setTime(el.currentTime)
    const onMeta = () => setDuration(el.duration)
    // The chrome follows playback: it can hide once the film is running, and
    // stays put the moment it stops.
    const onPlay = () => { playingRef.current = true; setPlaying(true); arm() }
    const onPause = () => { playingRef.current = false; setPlaying(false); show() }
    const onVolume = () => { setMuted(el.muted); setVolume(el.volume) }
    const onProgress = () => setBuffered(el.buffered.length ? el.buffered.end(el.buffered.length - 1) : 0)

    el.addEventListener('timeupdate', onTime)
    el.addEventListener('durationchange', onMeta)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('play', onPlay)
    el.addEventListener('playing', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onPause)
    el.addEventListener('volumechange', onVolume)
    el.addEventListener('progress', onProgress)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('durationchange', onMeta)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('playing', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onPause)
      el.removeEventListener('volumechange', onVolume)
      el.removeEventListener('progress', onProgress)
    }
  }, [arm, show])

  // Keep the fullscreen button in step with however fullscreen was left (Esc, the OS, …).
  useEffect(() => {
    const sync = () => setFull(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const toggle = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }

  const seek = (to: number) => {
    const el = videoRef.current
    if (el) el.currentTime = Math.min(Math.max(to, 0), duration || el.duration || 0)
  }

  const toggleFullscreen = () => {
    const root = rootRef.current
    const el = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (document.fullscreenElement) return void document.exitFullscreen().catch(() => {})
    if (root?.requestFullscreen) return void root.requestFullscreen().catch(() => {})
    // iPhone Safari won't take a container fullscreen, only the video itself.
    el?.webkitEnterFullscreen?.()
  }

  // The player's own shortcuts. Buttons and sliders keep their native keys —
  // this only picks up what lands on the surface around them.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    wake()
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('button,input')) return
    const key = e.key.toLowerCase()
    if (key === ' ' || key === 'k') { e.preventDefault(); toggle() }
    else if (key === 'arrowright') { e.preventDefault(); seek(time + STEP) }
    else if (key === 'arrowleft') { e.preventDefault(); seek(time - STEP) }
    else if (key === 'm') { const el = videoRef.current; if (el) el.muted = !el.muted }
    else if (key === 'f') toggleFullscreen()
  }

  const pct = duration ? (time / duration) * 100 : 0
  const loaded = duration ? (buffered / duration) * 100 : 0
  const hidden = idle && playing

  return (
    <div
      ref={rootRef}
      onPointerMove={wake}
      onPointerDown={wake}
      onPointerLeave={() => playing && setIdle(true)}
      onKeyDown={onKeyDown}
      className={cn('group/player relative isolate bg-ink', hidden && 'cursor-none', className)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        preload="auto"
        aria-label={label}
        // A tap on a bare picture is asking for the controls back, not a pause
        // — once they're up (always the case under a mouse, which wakes them on
        // the way to the click) the same tap plays and pauses.
        onClick={() => (hidden ? wake() : toggle())}
        className="h-full w-full object-contain"
      />

      {/* Corner slot (the lightbox's close button) — fades with the bar. */}
      {children && (
        <div className={cn('absolute right-3 top-3 z-10 transition-opacity duration-300 ease-glide', hidden && 'pointer-events-none opacity-0')}>
          {children}
        </div>
      )}

      {/* Controls. `focus-within` keeps them up while they're being driven from the keyboard. */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent px-4 pb-3 pt-10 text-paper transition-[opacity,translate] duration-300 ease-glide focus-within:translate-y-0 focus-within:opacity-100 portrait:gap-2 portrait:px-3',
          hidden && 'translate-y-2 opacity-0 focus-within:pointer-events-auto',
          hidden && 'pointer-events-none',
        )}
      >
        <ControlButton label={playing ? 'Pause' : 'Play'} onClick={toggle} solid>
          {playing
            ? <path d="M9 5h2.4v14H9zm5.6 0H17v14h-2.4z" />
            : <path d="M8.5 5.3v13.4a.6.6 0 0 0 .92.5l10.2-6.7a.6.6 0 0 0 0-1L9.42 4.8a.6.6 0 0 0-.92.5Z" />}
        </ControlButton>

        <span className="w-[4.5ch] shrink-0 text-p-xs font-medium tabular-nums">{clock(time)}</span>

        <input
          type="range"
          aria-label="Seek"
          min={0}
          max={duration || 0}
          step={0.01}
          value={time}
          onChange={(e) => seek(Number(e.target.value))}
          className="cs-scrub h-1.5 min-w-0 flex-1"
          style={{ '--p': `${pct}%`, '--b': `${Math.max(loaded, pct)}%` } as CSSProperties}
        />

        <span className="w-[4.5ch] shrink-0 text-p-xs font-medium tabular-nums text-paper/60">{clock(duration)}</span>

        {/* The slider unrolls on hover or focus; the icon alone is the resting state. */}
        <div className="group/volume flex items-center portrait:hidden">
          <ControlButton
            label={muted || !volume ? 'Unmute' : 'Mute'}
            onClick={() => { const el = videoRef.current; if (el) el.muted = !el.muted }}
          >
            {muted || !volume
              ? <><path d="M11 5.5 6.8 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2.8L11 18.5a.6.6 0 0 0 1-.46V5.96a.6.6 0 0 0-1-.46Z" /><path d="M16 9.8l4.4 4.4m0-4.4L16 14.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" /></>
              : <><path d="M11 5.5 6.8 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2.8L11 18.5a.6.6 0 0 0 1-.46V5.96a.6.6 0 0 0-1-.46Z" /><path d="M15.5 9a4 4 0 0 1 0 6m2.6-8.6a7.5 7.5 0 0 1 0 11.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" /></>}
          </ControlButton>
          <input
            type="range"
            aria-label="Volume"
            min={0}
            max={1}
            step={0.02}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const el = videoRef.current
              if (!el) return
              el.volume = Number(e.target.value)
              el.muted = Number(e.target.value) === 0
            }}
            className="cs-scrub h-1 w-0 opacity-0 transition-[width,opacity,margin] duration-[350ms] ease-glide group-hover/volume:ml-2 group-hover/volume:w-20 group-hover/volume:opacity-100 focus-visible:ml-2 focus-visible:w-20 focus-visible:opacity-100"
            style={{ '--p': `${(muted ? 0 : volume) * 100}%`, '--b': `${(muted ? 0 : volume) * 100}%` } as CSSProperties}
          />
        </div>

        <ControlButton label={full ? 'Exit full screen' : 'Full screen'} onClick={toggleFullscreen}>
          {full
            ? <path d="M9.5 4.5v3a2 2 0 0 1-2 2h-3m15 0h-3a2 2 0 0 1-2-2v-3m0 15v-3a2 2 0 0 1 2-2h3m-15 0h3a2 2 0 0 1 2 2v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            : <path d="M4.5 9.5v-3a2 2 0 0 1 2-2h3m5 0h3a2 2 0 0 1 2 2v3m0 5v3a2 2 0 0 1-2 2h-3m-5 0h-3a2 2 0 0 1-2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
        </ControlButton>
      </div>
    </div>
  )
}

/** A round chrome button: Paper on a tinted disc, or solid Volt for the primary one. */
function ControlButton({ label, onClick, solid, children }: { label: string; onClick: () => void; solid?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt portrait:size-9',
        solid ? 'bg-volt text-ink hover:bg-soft-volt' : 'bg-paper/10 text-paper hover:bg-paper/20',
      )}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>{children}</svg>
    </button>
  )
}

/** Seconds as m:ss. */
function clock(s: number) {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}
