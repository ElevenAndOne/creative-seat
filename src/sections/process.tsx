import { useInView, useReducedMotion } from 'motion/react'
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { processSteps } from '../content'
import { track } from '../utils/analytics'
import { cn } from '../utils/cn'

/** How long each step holds before the slider moves on by itself. */
const STEP_MS = 5000

const N = processSteps.length
/**
 * The steps run three times round the track. Only slides within three places
 * of the open one are visible, so with three copies any jump of up to three
 * places (the furthest a click can ask for) only ever wraps slides that are
 * already out of sight — every move is one continuous transition.
 */
const SLIDES = N * 3
const HALF = SLIDES / 2

/**
 * The cascade, by distance from the open slide: each slide's share of the row,
 * its height and its presence. Five show — the open step, a numbered block on
 * each side, and a blank block beyond each running out to the edge; anything
 * further is parked out of sight, ready to slide in. Phones show three.
 */
const CASCADE = [
  'grow-[48] h-full opacity-100 tablet:grow-[56] landscape:grow-[80]',
  'grow-[17] h-[92%] opacity-100 tablet:grow-[14] landscape:grow-[10]',
  'grow-[9] h-[84%] opacity-100 tablet:grow-[8] landscape:grow-0 landscape:mx-0',
  'grow-0 h-[76%] opacity-0 mx-0',
  'grow-0 h-[76%] opacity-0 mx-0',
]

/** One curve for every part of a move, so width, height and fade land together. */
const MOVE = 'duration-[1000ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none'

const mod = (n: number, m: number) => ((n % m) + m) % m
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * "A simpler way to work" as a cascading slider: the open step fills most of
 * the row, with a numbered block and then a blank one stepping down on each
 * side. It moves on by itself
 * every few seconds — a progress bar under the open step shows when — and
 * keeps playing on hover; it only pauses off screen or under reduced motion.
 * Visitors can jump with the progress bars, click a side block, swipe, or use
 * ← → once a progress bar has focus.
 *
 * Slides are reordered with CSS `order` rather than moved in the DOM, so their
 * widths transition in place and a slide only wraps round while it's hidden.
 */
export default function Process() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const [active, setActive] = useState(0)
  const swipe = useRef<number | null>(null)

  const playing = !reduce && inView
  const current = active % N

  const move = (delta: number) => setActive((a) => mod(a + delta, SLIDES))
  const manual = (delta: number, method: string) => {
    if (delta === 0) return
    move(delta)
    track('process_slide', { step: mod(current + delta, N) + 1, method })
  }
  /** Shortest way round the loop to step `i`. */
  const toStep = (i: number) => mod(i - current + Math.floor(N / 2), N) - Math.floor(N / 2)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') manual(1, 'key')
    else if (e.key === 'ArrowLeft') manual(-1, 'key')
  }
  const onPointerDown = (e: PointerEvent) => {
    swipe.current = e.clientX
  }
  const onPointerUp = (e: PointerEvent) => {
    if (swipe.current === null) return
    const dx = e.clientX - swipe.current
    swipe.current = null
    if (Math.abs(dx) > 50) manual(dx < 0 ? 1 : -1, 'swipe')
  }

  return (
    <Section id="process" pad="md">
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        aria-label="How it works"
        onKeyDown={onKeyDown}
      >
        <div className="border-t border-ink pt-xlg">
          <Eyebrow>A simpler way to work</Eyebrow>
          <Heading.H1 className="mt-4">
            Effortless from <Em>brief to launch.</Em>
          </Heading.H1>
        </div>

        {/* Every step in reading order for assistive tech and search; the
            moving track below is decoration over the same content. */}
        <ol className="sr-only">
          {processSteps.map(({ title, subtitle, body }) => (
            <li key={title}>
              <h3>{title} {subtitle}.</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>

        <div
          aria-hidden
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
          className="@container mt-12 flex h-[27rem] cursor-grab touch-pan-y select-none items-center active:cursor-grabbing landscape:h-[25rem]"
        >
          {Array.from({ length: SLIDES }, (_, k) => {
            const step = processSteps[k % N]
            const number = pad((k % N) + 1)
            const d = mod(k - active + HALF, SLIDES) - HALF
            const dist = Math.min(Math.abs(d), 4)
            const open = d === 0
            return (
              <div
                key={k}
                style={{ order: d }}
                onClick={() => !open && dist < 4 && manual(d, 'slide')}
                className={cn(
                  'relative mx-[5px] min-w-0 basis-0 overflow-hidden rounded-card transition-[flex-grow,height,opacity,margin,background-color]',
                  MOVE,
                  CASCADE[dist],
                  open ? 'bg-soft-volt text-forest' : 'cursor-pointer bg-chalk text-ink hover:bg-line',
                )}
              >
                {/* Open: the full step, laid out at the open slide's final width
                    (its share of the track, less the slides' 10px margins) so
                    it never reflows as the slide grows. Its parts rise in one
                    after another once the slide has mostly opened, and drop out
                    at once on leaving. */}
                <div className="absolute inset-y-0 left-0 flex w-[calc((100cqw-50px)*0.48)] flex-col p-9 tablet:w-[calc((100cqw-50px)*0.56)] landscape:w-[calc((100cqw-30px)*0.8)] landscape:p-6">
                  <div className="flex items-start justify-between gap-6">
                    <p className={cn(rise(open, 'delay-[550ms]'), 'font-serif text-[8.5rem] font-normal leading-[0.75] tracking-[-0.02em] landscape:text-[6rem]')}>{number}</p>
                    <img
                      src={step.art}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className={cn(rise(open, 'delay-[620ms]'), 'cs-blend-darker -mr-1 -mt-1 aspect-square w-[min(38%,12.5rem)] object-contain object-[right_top]')}
                    />
                  </div>
                  <Heading.H2 as="p" className={cn(rise(open, 'delay-[700ms]'), 'mt-auto')}>
                    {step.title} {step.subtitle}.
                  </Heading.H2>
                  <Paragraph.Small className={cn(rise(open, 'delay-[780ms]'), 'mt-4 max-w-[36ch]')}>{step.body}</Paragraph.Small>
                </div>

                {/* Either side: a plain block with just its number. */}
                <p className={cn('absolute left-6 top-5 font-serif text-[2.5rem] font-normal leading-none transition-opacity landscape:inset-x-0 landscape:top-4 landscape:text-center landscape:text-[1.25rem]', dist === 1 ? 'opacity-100 delay-500 duration-500' : 'opacity-0 duration-150')}>{number}</p>
              </div>
            )
          })}
        </div>

        {/* Progress: one bar per step. The open step's bar fills over STEP_MS and
            moves the slider on when it's full; pausing freezes it mid-fill. */}
        <div className="mt-7 grid grid-cols-4 gap-2.5 landscape:gap-1.5">
          {processSteps.map(({ title, subtitle }, i) => (
            <button
              key={title}
              type="button"
              id={`process-step-${i + 1}`}
              aria-label={`Go to step ${i + 1}: ${title} ${subtitle}`}
              aria-current={i === current ? 'step' : undefined}
              onClick={() => manual(toStep(i), 'progress')}
              className="group py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <span className="relative block h-0.5 overflow-hidden rounded-full bg-line">
                {i === current && (
                  <span
                    key={active}
                    onAnimationEnd={() => move(1)}
                    className="absolute inset-0 origin-left rounded-full bg-ink"
                    style={
                      reduce
                        ? undefined
                        : { animation: `cs-progress ${STEP_MS}ms linear forwards`, animationPlayState: playing ? 'running' : 'paused' }
                    }
                  />
                )}
              </span>
              <span className={cn('mt-3 block text-p-xs transition-colors duration-300 landscape:hidden', i === current ? 'font-semibold text-ink' : 'text-muted group-hover:text-ink')}>
                {pad(i + 1)} {title} {subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Section>
  )
}

/** Fade-and-rise for the open slide's parts: staggered in, instant out. */
function rise(open: boolean, delay: string) {
  return cn(
    'transition-[opacity,translate] motion-reduce:transition-none',
    open ? cn('translate-y-0 opacity-100 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]', delay) : 'translate-y-4 opacity-0 duration-150',
  )
}
