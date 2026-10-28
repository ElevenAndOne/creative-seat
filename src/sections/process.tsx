import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { processSteps } from '../content'
import { track } from '../utils/analytics'
import { cn } from '../utils/cn'

/** How long each step stays open before the next one opens by itself. */
const STEP_MS = 6000

const N = processSteps.length

/** One curve for every part of a change, so the columns' widths and fills land together. */
const MOVE = 'duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * "A simpler way to work" as four columns in a fixed row, 01 to 04: the open
 * step fills most of the row on Soft Volt, the other three stand beside it as
 * narrow Chalk columns showing just their number. Click one to open it. The
 * steps also open in turn by themselves while the row is on screen, pausing
 * under the pointer or keyboard focus, and not at all under reduced motion.
 *
 * Phones stack all four steps, each one open.
 */
export default function Process() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)

  const playing = !reduce && inView && !held

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
    <Section id="process" pad="md">
      <div className="border-t border-ink pt-8">
        <Eyebrow>A simpler way to work</Eyebrow>
        <Heading.H1 className="mt-4">
          Effortless from <Em>brief to launch.</Em>
        </Heading.H1>
      </div>

      {/* Every step's copy is always in the document, in order, so assistive
          tech and search read all four whichever is open. The open column's
          copy is laid out at its final width (the row less three 180px
          columns and the gaps), so it never reflows as the column grows. */}
      <ol
        ref={ref}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
        className="@container mt-8 flex h-[clamp(25rem,calc(100svh-24rem),26rem)] gap-2.5 landscape:h-auto landscape:flex-col"
      >
        {processSteps.map((step, i) => {
          const isOpen = i === active
          return (
            <li
              key={step.title}
              className={cn(
                'relative min-w-0 basis-[180px] overflow-hidden rounded-card transition-[flex-grow,background-color] tablet:basis-24 landscape:basis-auto landscape:bg-soft-volt landscape:text-forest',
                MOVE,
                isOpen ? 'grow bg-soft-volt text-forest' : 'grow-0 bg-chalk text-ink hover:bg-line',
              )}
            >
              <div className="absolute inset-y-0 left-0 flex w-[calc(100cqw-570px)] flex-col p-9 tablet:w-[calc(100cqw-318px)] tablet:p-7 landscape:static landscape:w-auto landscape:p-6">
                <div className="flex items-start justify-between gap-6">
                  <p aria-hidden className={cn(rise(isOpen, 'delay-[350ms]'), 'font-serif text-[8.5rem] font-normal leading-[0.75] tracking-[-0.02em] landscape:text-[5rem]')}>
                    {pad(i + 1)}
                  </p>
                  <img
                    src={step.art}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className={cn(rise(isOpen, 'delay-[420ms]'), 'cs-blend-darker -mr-1 -mt-1 aspect-square w-[min(38%,12.5rem)] object-contain object-[right_top] landscape:w-[min(38%,8rem)]')}
                  />
                </div>
                <Heading.H2 as="h3" className={cn(rise(isOpen, 'delay-[500ms]'), 'mt-auto landscape:mt-8')}>
                  <span className="sr-only">{pad(i + 1)} </span>
                  {step.title} {step.subtitle}.
                </Heading.H2>
                <Paragraph.Small className={cn(rise(isOpen, 'delay-[580ms]'), 'mt-4 max-w-[36ch]')}>{step.body}</Paragraph.Small>
              </div>

              {/* Closed: just the step's number, top left. */}
              <p
                aria-hidden
                className={cn(
                  'pointer-events-none absolute left-6 top-5 font-serif text-[2.5rem] font-normal leading-none transition-opacity tablet:left-5 landscape:hidden',
                  isOpen ? 'opacity-0 duration-150' : 'opacity-100 delay-300 duration-500',
                )}
              >
                {pad(i + 1)}
              </p>

              {/* The whole closed column opens its step. */}
              <button
                type="button"
                id={`process-step-${i + 1}`}
                aria-label={`Show step ${i + 1}: ${step.title} ${step.subtitle}`}
                aria-current={isOpen ? 'step' : undefined}
                onClick={() => open(i)}
                className={cn(
                  'absolute inset-0 rounded-card outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink landscape:hidden',
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
    'transition-[opacity,translate] motion-reduce:transition-none landscape:translate-y-0 landscape:opacity-100',
    open ? cn('translate-y-0 opacity-100 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]', delay) : 'translate-y-4 opacity-0 duration-150',
  )
}
