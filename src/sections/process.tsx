import { useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { processSteps } from '../content'
import { useAnimationsPaused } from '../hooks/useMotionPreference'
import { track } from '../utils/analytics'
import { cn } from '../utils/cn'

/** How long each step stays open before the next one opens by itself. */
const STEP_MS = 6000

const N = processSteps.length

/** One curve for every part of a change, so the columns' widths and fills land together. */
const MOVE = 'duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)]'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * "Effortless from brief to launch." as four Chalk columns in a fixed row, 01
 * to 04: the open step fills most of the row, the other three stand beside it
 * as narrow columns showing their number and sketch. Click one to open it. The
 * steps also open in turn by themselves while the row is on screen, pausing
 * under the pointer or keyboard focus.
 *
 * Phones stack all four steps, each one open.
 */
export default function Process() {
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const paused = useAnimationsPaused()

  const playing = inView && !held && !paused

  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => setActive((a) => (a + 1) % N), STEP_MS)
    return () => clearTimeout(timer)
  }, [active, playing])

  const open = (i: number) => {
    if (i === active) return
    setActive(i)
    track('process_slide', { step: i + 1, method: 'click' })
  }

  return (
    <Section id="process" className="bg-paper">
      <Heading.H1>
        Effortless from <Em>brief to launch.</Em>
      </Heading.H1>

      {/* Every step's copy is always in the document, in order, so assistive
          tech and search read all four whichever is open. The open column's
          copy is laid out at its final width (the row less three 140px
          columns and the 12px gaps), so it never reflows as the column grows. */}
      <ol
        ref={ref}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
        className="@container mt-xlg flex h-[25.125rem] gap-3 landscape:h-auto landscape:flex-col"
      >
        {processSteps.map((step, i) => {
          const isOpen = i === active
          return (
            <li
              key={step.title}
              className={cn(
                'relative min-w-0 basis-[140px] overflow-hidden rounded-md bg-chalk transition-[flex-grow,filter] tablet:basis-24 landscape:basis-auto landscape:text-forest',
                MOVE,
                isOpen ? 'grow text-forest' : 'grow-0 text-ink hover:brightness-[0.96]',
              )}
            >
              <div className="absolute inset-y-0 left-0 flex w-[calc(100cqw-456px)] flex-col p-xxxbg tablet:w-[calc(100cqw-324px)] landscape:static landscape:w-auto">
                <div className="flex min-h-[150px] items-start justify-between gap-6 landscape:min-h-0">
                  <p aria-hidden className={cn(rise(isOpen, 'delay-[350ms]'), 'font-serif text-display font-normal')}>
                    {pad(i + 1)}
                  </p>
                  <img
                    src={step.art}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className={cn(rise(isOpen, 'delay-[420ms]'), 'cs-blend-darker aspect-square w-[min(38%,9.375rem)] object-contain object-[right_top] landscape:w-[min(38%,8rem)]')}
                  />
                </div>
                <div className="mt-auto flex max-w-[21.25rem] flex-col gap-sm pt-6 landscape:pt-8">
                  <Heading.H3 className={rise(isOpen, 'delay-[500ms]')}>
                    <span className="sr-only">{pad(i + 1)} </span>
                    {step.title} {step.subtitle}.
                  </Heading.H3>
                  <Paragraph className={cn(rise(isOpen, 'delay-[580ms]'), 'text-ink')}>{step.body}</Paragraph>
                </div>
              </div>

              {/* Closed: just the step's number, top left. */}
              <p
                aria-hidden
                className={cn(
                  'pointer-events-none absolute left-xbg top-xbg font-serif text-h2 font-normal transition-opacity landscape:hidden',
                  isOpen ? 'opacity-0 duration-150' : 'opacity-100 delay-300 duration-500',
                )}
              >
                {pad(i + 1)}
              </p>

              {/* Closed: the step's sketch, centred in the column. */}
              <img
                src={step.art}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                draggable={false}
                className={cn(
                  'cs-blend-darker pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[calc(100%-3rem)] max-w-[5.75rem] -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity tablet:w-[calc(100%-2.5rem)] landscape:hidden',
                  isOpen ? 'opacity-0 duration-150' : 'opacity-100 delay-300 duration-500',
                )}
              />

              {/* The whole closed column opens its step. */}
              <button
                type="button"
                id={`process-step-${i + 1}`}
                aria-label={`Show step ${i + 1}: ${step.title} ${step.subtitle}`}
                aria-current={isOpen ? 'step' : undefined}
                onClick={() => open(i)}
                className={cn(
                  'absolute inset-0 rounded-md outline-hidden focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-ink landscape:hidden',
                  isOpen ? 'cursor-default' : 'cursor-pointer',
                )}
              />
            </li>
          )
        })}
      </ol>
    </Section>
  )
}

/** Fade-and-rise for the open column's parts: staggered in, instant out. Phones show every step open. */
function rise(open: boolean, delay: string) {
  return cn(
    'transition-[opacity,translate] landscape:translate-y-0 landscape:opacity-100',
    open ? cn('translate-y-0 opacity-100 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]', delay) : 'translate-y-4 opacity-0 duration-150',
  )
}
