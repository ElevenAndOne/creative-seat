import { Dialog } from '@base-ui/react/dialog'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import type { Project } from '../content'
import { cn } from '../utils/cn'
import Button from './autton'
import ProjectMedia from './project-media'
import Wordmark from './wordmark'
import { demoPage } from '../utils/contact'

/** The viewer's soft deceleration — same curve as the `ease-glide` token. */
const EASE = [0.22, 0.8, 0.18, 1] as const
/** Matches the `landscape:` variant: below it the wall stacks vertically and the drag cursor is off. */
const MOBILE = '(max-width: 48rem)'
/** Rail fade between projects, ms. */
const SWAP_MS = 320

const FULL = 'inset(0px 0px 0px 0px round 0px)'

/**
 * The overlay grows out of the clicked card's media and shrinks back into it:
 * `origin` is that box as a clip-path inset. With no origin (deep link, card
 * scrolled away) or under reduced motion it fades instead.
 */
const reveal = {
  hidden: ({ origin, reduce }: { origin: string | null; reduce: boolean }) =>
    origin && !reduce ? { clipPath: `inset(${origin} round 12px)`, opacity: 1 } : { clipPath: FULL, opacity: 0 },
  shown: { clipPath: FULL, opacity: 1 },
}

type ProjectViewerProps = {
  projects: Project[]
  /** Index into `projects` of the open project, or null when closed. */
  index: number | null
  /** The card box to grow from / shrink into, as a clip-path inset (`top right bottom left`). */
  origin: string | null
  onNavigate: (index: number) => void
  onClose: () => void
  /** Where focus lands on close — the card of whichever project is showing, which may not be the one clicked. */
  returnFocus: () => HTMLElement | null
}

/**
 * Full-screen project viewer, opened from a portfolio card. Each project lays
 * out as a horizontally scrolling wall: an intro column, then either the
 * curated two-row artboard from its case study (scaled to the viewport height)
 * or, without one, a row of its media. It scrolls with the wheel, the arrow
 * buttons/keys or a drag with inertia (a "Drag" cursor follows the mouse), and
 * ends on a card for the next project. Below 48rem it becomes a vertical stack.
 */
export default function ProjectViewer({ projects, index, origin, onNavigate, onClose, returnFocus }: ProjectViewerProps) {
  const reduce = useReducedMotion() ?? false
  const trackRef = useRef<HTMLDivElement>(null)
  const [swapping, setSwapping] = useState(false)
  const project = index === null ? null : projects[index]

  // Fade the rail out, switch project, and let the new one fade its tiles in.
  const goTo = (next: number) => {
    if (reduce) return onNavigate(next)
    setSwapping(true)
    window.setTimeout(() => {
      onNavigate(next)
      setSwapping(false)
    }, SWAP_MS)
  }

  return (
    <Dialog.Root open={project !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <AnimatePresence custom={{ origin, reduce }}>
        {project && index !== null && (
          <Dialog.Portal>
            <Dialog.Popup
              render={
                <motion.div
                  custom={{ origin, reduce }}
                  variants={reveal}
                  initial="hidden"
                  animate="shown"
                  exit="hidden"
                  transition={{ clipPath: { duration: 0.7, ease: EASE }, opacity: { duration: 0.3, ease: EASE } }}
                />
              }
              initialFocus={trackRef}
              finalFocus={() => returnFocus() ?? true}
              className="fixed inset-0 z-[100] flex flex-col bg-night text-paper outline-none"
            >
              <ViewerBody
                key={index}
                project={project}
                next={projects[(index + 1) % projects.length]}
                position={index + 1}
                total={projects.length}
                swapping={swapping}
                reduce={reduce}
                trackRef={trackRef}
                onNext={() => goTo((index + 1) % projects.length)}
              />
            </Dialog.Popup>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

type ViewerBodyProps = {
  project: Project
  next: Project
  position: number
  total: number
  swapping: boolean
  reduce: boolean
  trackRef: RefObject<HTMLDivElement | null>
  onNext: () => void
}

/**
 * One project's worth of viewer. Keyed by project, so switching projects
 * remounts it: scroll starts at zero and the tiles stagger in afresh.
 */
function ViewerBody({ project, next, position, total, swapping, reduce, trackRef, onNext }: ViewerBodyProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  /** Set while a drag is in progress or has just ended, so it doesn't count as a click. */
  const draggedRef = useRef(false)
  const [revealed, setRevealed] = useState(false)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })
  const study = project.caseStudy

  // Let the clip-path open a little before the tiles start rising in.
  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), reduce ? 0 : 220)
    return () => window.clearTimeout(t)
  }, [reduce])

  // Scale the artboard to the track's height, keep the progress bar and arrow
  // buttons in step with the scroll position, and turn vertical wheel into
  // horizontal scroll on desktop.
  useEffect(() => {
    const track = trackRef.current
    const rail = railRef.current
    if (!track || !rail) return
    const mobile = window.matchMedia(MOBILE)

    const syncProgress = () => {
      const max = track.scrollWidth - track.clientWidth
      const p = max > 0 ? track.scrollLeft / max : 0
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`
      const atStart = track.scrollLeft < 4
      const atEnd = track.scrollLeft > max - 4
      setEdges((prev) => (prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd }))
    }
    const size = () => {
      const th = Math.max(320, Math.min(track.clientHeight - 24, 760))
      const s = th / (study?.wall.height ?? 1168)
      rail.style.setProperty('--th', `${th}px`)
      rail.style.setProperty('--s', String(s))
      rail.style.setProperty('--gap', `${Math.round(48 * s)}px`)
      syncProgress()
    }
    const onWheel = (e: WheelEvent) => {
      if (mobile.matches || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      track.scrollLeft += e.deltaY
    }

    const ro = new ResizeObserver(size)
    ro.observe(track)
    track.addEventListener('scroll', syncProgress, { passive: true })
    track.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      ro.disconnect()
      track.removeEventListener('scroll', syncProgress)
      track.removeEventListener('wheel', onWheel)
    }
  }, [trackRef, study])

  // Mouse drag with inertia, the "Drag" cursor, and arrow-key paging (desktop only).
  useEffect(() => {
    const track = trackRef.current
    const cursor = cursorRef.current
    if (!track || !cursor) return
    const mobile = window.matchMedia(MOBILE)
    let down = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, velocity = 0, glide = 0

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || mobile.matches || e.button !== 0) return
      cancelAnimationFrame(glide)
      down = true
      draggedRef.current = false
      startX = lastX = e.clientX
      startLeft = track.scrollLeft
      velocity = 0
      lastT = performance.now()
      cursor.dataset.down = ''
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        cursor.style.setProperty('--cx', `${e.clientX}px`)
        cursor.style.setProperty('--cy', `${e.clientY}px`)
        const target = e.target instanceof Element ? e.target : null
        const over = !mobile.matches && !!target && track.contains(target) && !target.closest('[data-next]')
        cursor.style.setProperty('--cs', over ? '1' : '0')
        track.style.cursor = over ? 'none' : ''
      }
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 4) draggedRef.current = true
      track.scrollLeft = startLeft - dx
      const now = performance.now()
      velocity = (e.clientX - lastX) / Math.max(1, now - lastT)
      lastX = e.clientX
      lastT = now
    }
    const onUp = () => {
      if (!down) return
      down = false
      delete cursor.dataset.down
      // Let the click that ends a drag see the flag, then clear it.
      window.setTimeout(() => { draggedRef.current = false }, 0)
      if (reduce) return
      let v = velocity * 16
      const step = () => {
        if (Math.abs(v) < 0.4) return
        track.scrollLeft -= v
        v *= 0.94
        glide = requestAnimationFrame(step)
      }
      step()
    }
    const onKey = (e: KeyboardEvent) => {
      if (mobile.matches || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return
      e.preventDefault()
      page(track, e.key === 'ArrowRight' ? 1 : -1, reduce)
    }
    const noDrag = (e: DragEvent) => e.preventDefault()

    track.addEventListener('pointerdown', onDown)
    track.addEventListener('dragstart', noDrag)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(glide)
      track.removeEventListener('pointerdown', onDown)
      track.removeEventListener('dragstart', noDrag)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('keydown', onKey)
    }
  }, [trackRef, reduce])

  // Keep focus inside the viewer when the body remounts for the next project.
  useEffect(() => {
    trackRef.current?.focus({ preventScroll: true })
  }, [trackRef])

  const meta = study ? [study.industry, study.location] : [project.category]
  const blurb = study?.blurb ?? [project.description]
  const services = study?.services ?? project.tags
  const nextImage = next.poster ?? next.cover

  return (
    <>
      <header className="grid h-[76px] shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 px-[var(--container-margin)] landscape:h-16 landscape:grid-cols-[1fr_auto]">
        <p className="flex items-center gap-3 whitespace-nowrap text-lg">
          <Wordmark className="w-[124px]" /> <span className="text-paper/60">/ Work</span>
        </p>
        <p className="text-[13px] font-medium tracking-[0.08em] text-paper/60 tabular-nums landscape:hidden" aria-live="polite">
          <b className="font-semibold text-paper">{pad(position)}</b> / {pad(total)}
        </p>
        <div className="flex justify-end gap-2">
          <IconButton label="Scroll back" disabled={edges.atStart} onClick={() => trackRef.current && page(trackRef.current, -1, reduce)} className="landscape:hidden">
            <path d="M15 18l-6-6 6-6" />
          </IconButton>
          <IconButton label="Scroll forward" disabled={edges.atEnd} onClick={() => trackRef.current && page(trackRef.current, 1, reduce)} className="landscape:hidden">
            <path d="M9 18l6-6-6-6" />
          </IconButton>
          <Dialog.Close aria-label="Close project" className="ml-2 grid size-11 place-items-center rounded-full border-[1.5px] border-paper bg-paper text-ink transition-colors duration-200 hover:border-volt hover:bg-volt focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-paper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
          </Dialog.Close>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <div
          ref={trackRef}
          tabIndex={0}
          aria-label="Project images"
          className="absolute inset-0 overflow-x-auto overflow-y-hidden overscroll-contain outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden landscape:overflow-x-hidden landscape:overflow-y-auto"
        >
          <div
            ref={railRef}
            className={cn(
              'relative flex h-full w-max min-w-full items-center gap-[var(--gap)] px-[var(--container-margin)] transition-opacity duration-[350ms] ease-glide',
              'landscape:block landscape:h-auto landscape:w-auto landscape:px-4 landscape:pt-2 landscape:pb-8',
              swapping && 'opacity-0',
            )}
          >
            {/* Intro column */}
            <div className="flex h-[var(--th)] w-[min(420px,80vw)] shrink-0 flex-col justify-between pr-[clamp(8px,2vw,32px)] landscape:h-auto landscape:w-auto landscape:gap-7 landscape:p-0 landscape:pb-7">
              <div>
                <p className="mb-[18px] text-xs font-bold uppercase tracking-[0.14em] text-volt">Client</p>
                <Dialog.Title className="mb-3.5 font-serif text-[clamp(34px,4.2vw,56px)] font-normal leading-[1.04] tracking-[-0.01em] [text-wrap:balance]">
                  {project.title}
                </Dialog.Title>
                <p className="mb-[22px] flex flex-wrap gap-x-[18px] gap-y-1.5 text-[13px] font-medium leading-[1.4] text-paper/60">
                  {meta.map((m) => <span key={m}>{m}</span>)}
                </p>
                <div className="max-w-[44ch] text-[15px] leading-[1.65] text-paper/80">
                  {blurb.map((p) => <p key={p} className="mb-3">{p}</p>)}
                </div>
                <ul className="mt-[22px] flex flex-wrap gap-2">
                  {services.map((s) => (
                    <li key={s} className="rounded-full border border-paper/15 px-[13px] py-[9px] text-[12.5px] font-medium leading-none">{s}</li>
                  ))}
                </ul>
              </div>
              <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.04em] text-paper/60">
                <span aria-hidden className="relative block h-px w-[34px] overflow-hidden bg-current">
                  <span className="cs-hint absolute inset-0 bg-volt" />
                </span>
                <span className="landscape:hidden">Scroll or drag to explore</span>
                <span className="hidden landscape:inline">Scroll to explore</span>
              </p>
            </div>

            {study ? (
              <div
                className="relative h-[var(--th)] w-[calc(var(--ww)*var(--s)*1px)] shrink-0 landscape:flex landscape:h-auto landscape:w-auto landscape:flex-col landscape:gap-2.5"
                style={{ '--ww': study.wall.width } as CSSProperties}
              >
                {study.wall.tiles.map(([src, x, y, w, h], k) => (
                  <Tile
                    key={k}
                    revealed={revealed}
                    delay={Math.min(k * 55, 600)}
                    className="absolute left-[calc(var(--x)*var(--s)*1px)] top-[calc(var(--y)*var(--s)*1px)] h-[calc(var(--h)*var(--s)*1px)] w-[calc(var(--w)*var(--s)*1px)] landscape:relative landscape:left-auto landscape:top-auto landscape:aspect-[var(--w)/var(--h)] landscape:h-auto landscape:w-full"
                    style={{ '--x': x, '--y': y, '--w': w, '--h': h, ...(src === 'logo' ? { background: study.logoBg } : {}) } as CSSProperties}
                  >
                    {src === 'logo' ? (
                      <div className="grid h-full w-full place-items-center">
                        <img src={study.logo} alt={`${project.title} logo`} className="max-h-[60%] w-[76%] object-contain" />
                      </div>
                    ) : (
                      <FadeImage src={src} alt={`${project.title} work sample ${k}`} loading={k > 5 ? 'lazy' : undefined} />
                    )}
                  </Tile>
                ))}
              </div>
            ) : (
              <div className="flex h-[var(--th)] shrink-0 gap-[var(--gap)] landscape:h-auto landscape:flex-col landscape:gap-2.5">
                {project.images.map((src, k) => (
                  <Tile key={src} revealed={revealed} delay={Math.min(k * 55, 600)} className="h-full landscape:h-auto">
                    <ProjectMedia
                      src={src}
                      poster={src === project.cover ? project.poster : undefined}
                      alt={`${project.title} work sample ${k + 1}`}
                      draggable={false}
                      className="block h-full w-auto max-w-none select-none landscape:h-auto landscape:w-full"
                    />
                  </Tile>
                ))}
              </div>
            )}

            {/* Next project */}
            <button
              type="button"
              id="viewer-next-project"
              data-next
              onClick={() => { if (!draggedRef.current) onNext() }}
              className="group/next relative isolate flex h-[var(--th)] w-[calc(var(--th)*0.62)] shrink-0 flex-col justify-end overflow-hidden rounded-[10px] p-7 text-left text-paper outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-paper landscape:mt-2.5 landscape:aspect-[4/3] landscape:h-auto landscape:w-full"
            >
              <img src={nextImage} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-1000 ease-glide group-hover/next:scale-105" />
              <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/15 from-20% to-ink/90" />
              <small className="text-xs font-bold uppercase tracking-[0.14em] text-volt">Next project</small>
              <strong className="mt-3 flex items-center justify-between gap-3 text-[clamp(24px,2.4vw,34px)] font-bold leading-[1.1] tracking-[-0.02em]">
                {next.title}
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-volt text-ink transition-transform duration-[350ms] ease-glide group-hover/next:translate-x-1">
                  <Arrow />
                </span>
              </strong>
            </button>
          </div>
        </div>
      </div>

      <footer className="flex h-16 shrink-0 items-center gap-5 px-[var(--container-margin)] landscape:hidden">
        <div aria-hidden className="h-0.5 flex-1 overflow-hidden rounded-full bg-paper/15">
          <div ref={fillRef} className="h-full w-full origin-left scale-x-0 bg-volt" />
        </div>
        <Button href={demoPage} id="viewer-book-demo" data-track="book_demo_click" data-track-location="project_viewer" variant="inverse">Book a demo</Button>
      </footer>

      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] -ml-[42px] -mt-[42px] grid size-[84px] place-items-center rounded-full bg-volt text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-transform duration-[250ms] ease-glide [transform:translate3d(var(--cx,-200px),var(--cy,-200px),0)_scale(var(--cs,0))] data-[down]:[transform:translate3d(var(--cx,-200px),var(--cy,-200px),0)_scale(0.8)] landscape:hidden [@media(hover:none)]:hidden"
      >
        Drag
      </div>
    </>
  )
}

/** A wall tile: rises and sharpens into place, staggered by `delay`, once the viewer has opened. */
function Tile({ revealed, delay, className, style, children }: { revealed: boolean; delay: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <figure
      className={cn(
        'm-0 overflow-hidden rounded-[10px] bg-paper/5 transition-[opacity,translate,scale] duration-[700ms,900ms,900ms] ease-glide motion-reduce:transition-none',
        revealed ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-7 scale-[0.985] opacity-0',
        className,
      )}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </figure>
  )
}

/** Wall photo that fades in once it has loaded, rather than painting in strips. */
function FadeImage({ src, alt, loading }: { src: string; alt: string; loading?: 'lazy' }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      className={cn('block h-full w-full select-none object-cover transition-opacity duration-[600ms] ease-glide', loaded ? 'opacity-100' : 'opacity-0')}
    />
  )
}

function IconButton({ label, disabled, onClick, className, children }: { label: string; disabled: boolean; onClick: () => void; className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn('grid size-11 place-items-center rounded-full border-[1.5px] border-paper/15 transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-paper disabled:pointer-events-none disabled:opacity-35', className)}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
    </button>
  )
}

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/** Scroll the wall by most of a screen in `dir` (1 forward, -1 back). */
function page(track: HTMLElement, dir: 1 | -1, reduce: boolean) {
  track.scrollBy({ left: dir * track.clientWidth * 0.7, behavior: reduce ? 'auto' : 'smooth' })
}

const pad = (n: number) => String(n).padStart(2, '0')
