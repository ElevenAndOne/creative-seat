import { AnimatePresence, motion, useAnimate, type Transition } from 'motion/react'
import { useEffect, useReducer, useRef, useState, type CSSProperties, type RefObject } from 'react'
import Arrow from '../components/arrow'
import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { creditServices, pricingPlans } from '../content'
import { useCurrency } from '../hooks/useCurrency'
import { cn } from '../utils/cn'
import { demoPage } from '../utils/contact'
import { formatPrice } from '../utils/price'

type Service = (typeof creditServices)[number]
type ServiceId = Service['id']

/** The two plans with a credit allowance, smallest first — the calculator's seats. */
const seats = pricingPlans.flatMap((plan) => (plan.credits && plan.price ? [{ id: plan.id, name: plan.name, credits: plan.credits, price: plan.price }] : []))

/* ---------------------------------------------------------------------------
   Chairs. Each service brings its own: a crop of the chair sprite the
   expertise rows use, sized and offset as Figma crops it (the image's size and
   offset in % of the crop box), or the Figma file's separate blue armchair.
   ------------------------------------------------------------------------- */

type Crop = { src: string, aspect: number, sheetW: number, sheetH: number, left: number, top: number }

const SPRITE = '/images/expertise/chairs.webp'
const sprite = (sheetW: number, sheetH: number, left: number, top: number): Crop => ({ src: SPRITE, aspect: sheetH / sheetW, sheetW, sheetH, left, top })

const CHAIRS = {
  // Trimmed to the chair with the same margin the sprite's crops leave, so it
  // sits in a slot at the size the others do.
  'fluffy-blue': { src: '/images/calculator/website-chair.webp', aspect: 374 / 373, sheetW: 102.67, sheetH: 144.24, left: -2.94, top: -18.77 },
  flower: sprite(468.75, 436.89, -191.67, -308.74),
  shell: sprite(454.55, 454.55, -175.76, -121.21),
  egg: sprite(489.13, 424.53, -389.13, -105.66),
  pixel: sprite(523.26, 454.55, -8.14, -323.23),
  'fluffy-yellow': sprite(454.55, 445.54, -175.76, -11.88),
  tubular: sprite(535.71, 445.54, -111.9, -114.85),
  brick: sprite(500, 441.18, -300, -12.75),
  panton: sprite(548.78, 454.55, -114.63, -11.11),
  director: sprite(523.26, 441.18, -8.14, -213.73),
  lounge: sprite(500, 454.55, -300, -121.21),
  beanbag: sprite(494.51, 505.62, -102.33, -251.7),
  cow: sprite(489.13, 454.55, -389.13, -220.2),
} satisfies Record<Service['chair'], Crop>

/** The list's icons crop the blue armchair as Figma does; every other chair uses its summary crop. */
const ICON_CROPS: Partial<Record<Service['chair'], Crop>> = {
  'fluffy-blue': { src: CHAIRS['fluffy-blue'].src, aspect: 45.5 / 48, sheetW: 100, sheetH: 132.42, left: 0, top: -12.71 },
}

function ChairArt({ crop, className, style }: { crop: Crop, className?: string, style?: CSSProperties }) {
  return (
    <span aria-hidden className={cn('relative block overflow-hidden', className)} style={{ aspectRatio: crop.aspect, ...style }}>
      <img
        src={crop.src}
        alt=""
        draggable={false}
        loading="lazy"
        decoding="async"
        className="absolute max-w-none select-none"
        style={{ width: `${crop.sheetW}%`, height: `${crop.sheetH}%`, left: `${crop.left}%`, top: `${crop.top}%` }}
      />
    </span>
  )
}

/**
 * Where chairs land in the summary, in the order services are added. Figures
 * are px on Figma's 368 × 145 stage: the centre, the size (√ of the box's
 * area, so any chair's proportions fit), the resting tilt and the stacking
 * order. The first five are Figma's own pile; the rest fan out behind it.
 */
const STAGE = { w: 368, h: 145 }
const SLOTS = [
  { x: 131.2, y: 129.8, size: 88, r: -25.6, z: 4 },
  { x: 217.2, y: 37.7, size: 74.2, r: 19.7, z: 3 },
  { x: 294.3, y: 41.9, size: 55.4, r: 33.8, z: 6 },
  { x: 251.9, y: 99.7, size: 73.3, r: 25.3, z: 5 },
  { x: 111.5, y: 22, size: 63.3, r: 0, z: 2 },
  { x: 50, y: 96, size: 62, r: -14, z: 1 },
  { x: 326, y: 106, size: 58, r: 12, z: 1 },
  { x: 168, y: 14, size: 50, r: -10, z: 0 },
  { x: 38, y: 32, size: 48, r: -22, z: 0 },
  { x: 343, y: 30, size: 44, r: 24, z: 0 },
  { x: 190, y: 112, size: 56, r: 6, z: 1 },
  { x: 82, y: 70, size: 50, r: 10, z: 0 },
  { x: 262, y: 0, size: 44, r: -16, z: 0 },
]

/* ---------------------------------------------------------------------------
   Motion. Figma's demo animates with damped springs; these are the same
   curves as stiffness / damping (mass 1).
   ------------------------------------------------------------------------- */

const spring = (stiffness: number, damping: number): Transition => ({ type: 'spring', stiffness, damping })
const IN_OUT = [0.5, 0, 0.5, 1] as const

/** A chair drops into the pile: tipped 18° and shrunk, it settles with a wobble. */
const CHAIR_IN: Transition = {
  rotate: spring(284, 18.5),
  scale: spring(413, 18.3),
  y: spring(367, 23),
  opacity: { duration: 0.12, ease: 'easeOut' },
}
const CHAIR_OUT: Transition = { duration: 0.2, ease: [0.4, 0, 1, 1] }

/* ---------------------------------------------------------------------------
   Rolling values: the old one slides out, the new one in from the other side
   — upward when the value grows, downward when it shrinks.
   ------------------------------------------------------------------------- */

/** +1 if `order` rose since the last render, −1 if it fell; kept until it changes again. */
function useDirection(order: number) {
  const [prev, setPrev] = useState(order)
  const [dir, setDir] = useState(1)
  if (order !== prev) {
    setPrev(order)
    setDir(order > prev ? 1 : -1)
  }
  return dir
}

function Roll({ value, id, order, distance, settle, className, itemClassName }: {
  value: string | number
  /** What counts as a new value (and rolls); defaults to the value itself. */
  id?: string
  /** What decides the direction; defaults to the value itself. */
  order?: number
  /** How far (px) a value travels in and out. */
  distance: number
  /** The spring a value settles on. */
  settle: Transition
  className?: string
  itemClassName?: string
}) {
  const dir = useDirection(order ?? Number(value))
  return (
    <span className={cn('relative block', className)}>
      <AnimatePresence initial={false} mode="popLayout" custom={dir}>
        <motion.span
          key={id ?? value}
          custom={dir}
          className={cn('block', itemClassName)}
          variants={{
            enter: (d: number) => ({ y: d * distance, opacity: 0 }),
            show: { y: 0, opacity: 1, transition: { y: settle, opacity: { duration: 0.14, ease: 'easeOut' } } },
            exit: (d: number) => ({ y: -d * distance, opacity: 0, transition: { duration: 0.09, ease: 'easeOut' } }),
          }}
          initial="enter"
          animate="show"
          exit="exit"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/* ---------------------------------------------------------------------------
   State: the chosen seat, each service's quantity, and which pile slot each
   added service's chair holds. A chair keeps its slot while its service stays
   in; a removed one frees it for the next.
   ------------------------------------------------------------------------- */

type State = { seat: string, qty: Record<ServiceId, number>, slots: Partial<Record<ServiceId, number>> }
type Action = { type: 'seat', seat: string } | { type: 'qty', id: ServiceId, value: number }

const initialState: State = {
  // Half seat is chosen to start with, so a visitor can go straight to the sliders.
  seat: seats[0].id,
  qty: Object.fromEntries(creditServices.map((s) => [s.id, 0])) as Record<ServiceId, number>,
  slots: {},
}

function reducer(state: State, action: Action): State {
  if (action.type === 'seat') return { ...state, seat: action.seat }

  const { id, value } = action
  const was = state.qty[id]
  if (was === value) return state

  let slots = state.slots
  if (!was && value) {
    const taken = new Set(Object.values(slots))
    let slot = 0
    while (taken.has(slot)) slot++
    slots = { ...slots, [id]: slot }
  } else if (was && !value) {
    slots = { ...slots }
    delete slots[id]
  }
  return { ...state, qty: { ...state.qty, [id]: value }, slots }
}

const plural = (n: number, word: string) => (n === 1 ? word : /[^aeiou]y$/.test(word) ? `${word.slice(0, -1)}ies` : `${word}s`)
const credits = (n: number) => `${n} ${plural(n, 'credit')}`

/* ---------------------------------------------------------------------------
   The builder: seat cards and the service sliders.
   ------------------------------------------------------------------------- */

function SeatOption({ seat, checked, onSelect }: { seat: (typeof seats)[number], checked: boolean, onSelect: () => void }) {
  const currency = useCurrency()
  return (
    <motion.label
      whileTap={{ scale: 0.97 }}
      transition={spring(1030, 35)}
      className="relative flex h-16 min-w-0 flex-1 cursor-pointer items-center gap-sm rounded-md border border-chalk bg-paper px-md py-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
    >
      <input type="radio" name="calculator-seat" value={seat.id} checked={checked} onChange={onSelect} className="sr-only" />
      <motion.span aria-hidden className="absolute -inset-px rounded-md bg-soft-volt" initial={false} animate={{ opacity: checked ? 1 : 0 }} transition={{ duration: 0.22, ease: 'easeOut' }} />

      {/* Radio: an Ink disc fills the ring, then a Volt dot pops in the middle. */}
      <span aria-hidden className="relative grid size-5 shrink-0 place-items-center rounded-full border-[1.5px] border-ink">
        <motion.span className="absolute -inset-[1.5px] rounded-full bg-ink" initial={false} animate={{ opacity: checked ? 1 : 0 }} transition={{ duration: 0.15, ease: 'easeOut' }} />
        <motion.span
          className="relative size-2 rounded-full bg-volt"
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={checked ? { scale: spring(1250, 32), opacity: { duration: 0.1 } } : { duration: 0.12, ease: 'easeOut' }}
        />
      </span>

      <span className="relative flex min-w-0 flex-1 flex-col gap-xxxsm whitespace-nowrap">
        <span className="text-sm font-semibold">{seat.name}</span>
        <span className={cn('text-xs text-forest/60 transition-opacity duration-300', !currency && 'opacity-0')}>
          {formatPrice(seat.price[currency ?? 'USD'], currency ?? 'USD')} / month
        </span>
      </span>
      <span className="relative whitespace-nowrap text-sm font-semibold">{seat.credits} credits</span>
    </motion.label>
  )
}

/**
 * A stepped slider: a native range input, invisible, over the drawn track so
 * pointer, touch and keyboard all just work. Its thumb is sized to the drawn
 * handle's 15px stop, so a click lands on the step under the pointer.
 */
function QuantitySlider({ service, value, onChange }: { service: Service, value: number, onChange: (value: number) => void }) {
  const f = value / service.max
  const text = `${value} ${plural(value, service.unit)}, ${credits(value * service.credits)}`
  return (
    <div className="relative h-6 overflow-hidden rounded-sm bg-chalk has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
      <div aria-hidden className="absolute inset-0 flex items-center justify-between px-1.5">
        {Array.from({ length: service.max + 1 }, (_, i) => (
          <span key={i} className="size-[3px] rounded-full bg-ink/30" />
        ))}
      </div>
      <div
        aria-hidden
        className={cn('absolute inset-0 rounded-sm bg-volt transition-[clip-path,opacity] duration-[250ms,150ms] ease-[cubic-bezier(0.4,0,0.25,1),ease-out]', !value && 'opacity-0')}
        style={{ clipPath: `inset(0 calc((100% - 15px) * ${1 - f}) 0 0 round 0.5rem)` }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.25,1)]" style={{ transform: `translateX(calc((100% - 15px) * ${f}))` }}>
        <span className={cn('absolute left-1.5 top-[5px] h-3.5 w-[3px] rounded-full transition-colors duration-150', value ? 'bg-ink' : 'bg-ink/45')} />
      </div>
      <input
        type="range"
        min={0}
        max={service.max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        aria-label={`${service.name}: how many`}
        aria-valuetext={text}
        className="cs-quantity absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </div>
  )
}

function ServiceRow({ service, value, onChange }: { service: Service, value: number, onChange: (id: ServiceId, value: number) => void }) {
  const [icon, animate] = useAnimate<HTMLSpanElement>()

  const set = (next: number) => {
    // Adding a service bounces its chair.
    if (!value && next) {
      animate(icon.current, { scale: 1.18 }, { duration: 0.12, ease: 'easeOut' }).then(() => animate(icon.current, { scale: 1 }, spring(940, 31)))
    }
    onChange(service.id, next)
  }

  const crop = ICON_CROPS[service.chair] ?? CHAIRS[service.chair]
  return (
    <li className="grid min-h-[4.25rem] grid-cols-[13rem_minmax(0,1fr)_4rem] items-center gap-x-6 border-b border-chalk px-md py-sm landscape:grid-cols-[minmax(0,1fr)_4rem] landscape:gap-y-sm">
      <div className="flex min-w-0 items-center gap-sm">
        <span ref={icon} className="grid size-12 shrink-0 place-items-center">
          <ChairArt crop={crop} className="h-12 max-w-12" />
        </span>
        <div className="flex min-w-0 flex-col gap-xxxsm">
          <p className="truncate text-sm font-medium landscape:whitespace-normal">{service.name}</p>
          <p className="text-xs text-forest/60">
            {credits(service.credits)} / {service.unit}
          </p>
        </div>
      </div>

      <div className="landscape:col-span-2 landscape:row-start-2">
        <QuantitySlider service={service} value={value} onChange={set} />
      </div>

      <div aria-hidden className="flex flex-col items-end gap-xxxsm text-right">
        <Roll value={value} distance={6} settle={spring(1740, 58)} className="text-base font-semibold" itemClassName={value ? 'text-ink' : 'text-ink/60'} />
        <Roll value={value ? credits(value * service.credits) : ''} order={value} distance={4} settle={{ duration: 0.3, ease: 'easeOut' }} className="h-4 whitespace-nowrap text-xs text-forest/60" />
      </div>
    </li>
  )
}

/**
 * The list's own scroll indicator, drawn as in Figma (the native bar is
 * hidden). It writes straight to the thumb's style, so scrolling never
 * re-renders the calculator.
 */
function ScrollThumb({ target }: { target: RefObject<HTMLUListElement | null> }) {
  const thumb = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const list = target.current
    const bar = thumb.current
    if (!list || !bar) return
    const INSET = 8
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = list
      const track = clientHeight - INSET * 2
      const overflow = scrollHeight - clientHeight
      bar.style.opacity = overflow > 1 ? '1' : '0'
      const size = Math.max(32, (track * clientHeight) / scrollHeight)
      bar.style.height = `${size}px`
      bar.style.transform = `translateY(${overflow > 0 ? (scrollTop / overflow) * (track - size) : 0}px)`
    }
    update()
    list.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(list)
    return () => {
      list.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [target])

  return <span ref={thumb} aria-hidden className="pointer-events-none absolute right-0.5 top-2 w-1 rounded-full bg-ink/25 opacity-0 transition-opacity tablet:hidden" />
}

/* ---------------------------------------------------------------------------
   The summary: chairs piling up, and the credits used against the seat.
   ------------------------------------------------------------------------- */

function ChairPile({ placed }: { placed: { id: ServiceId, crop: Crop, slot: number }[] }) {
  return (
    <div aria-hidden className="relative aspect-[368/145] w-full max-w-[23rem] shrink-0">
      <AnimatePresence>
        {placed.map(({ id, crop, slot }) => {
          const s = SLOTS[slot % SLOTS.length]
          const width = s.size * Math.sqrt(crop.aspect)
          const out = { opacity: 0, scale: 0.2, y: 28, rotate: s.r + 18 }
          return (
            <motion.div
              key={id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(s.x / STAGE.w) * 100}%`, top: `${(s.y / STAGE.h) * 100}%`, width: `${(width / STAGE.w) * 100}%`, zIndex: s.z }}
              initial={out}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: s.r }}
              exit={{ ...out, transition: CHAIR_OUT }}
              transition={CHAIR_IN}
            >
              <ChairArt crop={crop} className="w-full" />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function Usage({ used, cap, over }: { used: number, cap: number, over: boolean }) {
  const [figure, animate] = useAnimate<HTMLDivElement>()

  // Going over the seat's credits shakes the figure, once.
  useEffect(() => {
    if (over) animate(figure.current, { x: [0, -8, 8, -5, 4, 0] }, { duration: 0.4, ease: IN_OUT })
  }, [over, animate, figure])

  // The figure is sized to fit the panel: Figma's 84px where there's room, and
  // smaller as the digits grow or the panel narrows (ems are per character).
  const chars = Math.max(String(used).length, 2) + String(cap).length + 1
  return (
    <div className="relative w-full">
      <p className="sr-only" aria-live="polite">
        {used} of {cap} credits used
      </p>
      <div
        ref={figure}
        aria-hidden
        className="flex items-start justify-center overflow-y-clip text-[length:var(--fig)] font-extrabold leading-[1.2] tracking-[-1px]"
        style={{ '--fig': `min(5.25rem, calc((100cqw - 4.25rem) / ${chars * 0.59}))` } as CSSProperties}
      >
        <motion.span layout="position" transition={spring(581, 33.7)} className={cn('min-w-[1.31em] text-right tabular-nums transition-colors duration-200', over ? 'text-flare' : 'text-ink')}>
          <Roll value={used} distance={22} settle={spring(900, 40)} />
        </motion.span>
        <motion.span layout="position" transition={spring(581, 33.7)} className="text-ink/40">
          <Roll value={`/${cap}`} order={cap} distance={18} settle={spring(765, 33)} />
        </motion.span>
        <motion.span layout="position" transition={spring(581, 33.7)} className="ml-2 mt-[calc(var(--fig)*0.845)] text-base font-normal leading-[1.1] tracking-normal text-ink/40">
          credits
        </motion.span>
      </div>

      <div className="mt-sm h-2 overflow-hidden rounded-full bg-chalk">
        <motion.div
          className={cn('h-full min-w-2 rounded-full transition-colors duration-[250ms]', over ? 'bg-flare' : 'bg-volt')}
          initial={false}
          animate={{ width: `${Math.min(used / cap, 1) * 100}%`, opacity: used ? 1 : 0 }}
          transition={{ width: { duration: 0.32, ease: IN_OUT }, opacity: { duration: 0.15, ease: 'easeOut' } }}
        />
      </div>
    </div>
  )
}

function OverNote({ overBy, seatName, next, onUpgrade }: { overBy: number, seatName: string, next?: { name: string }, onUpgrade: () => void }) {
  return (
    <motion.p
      className="absolute inset-x-0 bottom-0 text-center text-xs text-flare"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
      transition={{ y: spring(837, 37.6), opacity: { duration: 0.2, ease: 'easeOut' } }}
    >
      {credits(overBy)} over a {seatName}.{' '}
      {next ? (
        <button type="button" onClick={onUpgrade} className="cursor-pointer underline underline-offset-2">
          Try a {next.name}.
        </button>
      ) : (
        <a href={demoPage} data-track="book_demo_click" data-track-location="credit_calculator_enterprise" className="underline underline-offset-2">
          Ask about Enterprise.
        </a>
      )}
    </motion.p>
  )
}

/**
 * "Your next project, in credits." — sits under the pricing cards. Pick a
 * seat, slide in the work you have in mind, and the summary piles up a chair
 * per service while the credits used count up against the seat's allowance;
 * going over turns it Flare and offers the bigger seat. The motion follows
 * the Figma prototype (Creative Seat — Website, node 79:3347).
 */
export default function CreditCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const currency = useCurrency()
  const list = useRef<HTMLUListElement>(null)

  const seatIndex = seats.findIndex((s) => s.id === state.seat)
  const seat = seats[seatIndex]
  const next = seats[seatIndex + 1]
  const used = creditServices.reduce((sum, s) => sum + state.qty[s.id] * s.credits, 0)
  const overBy = used - seat.credits
  const over = overBy > 0

  const placed = creditServices.flatMap((s) => {
    const slot = state.slots[s.id]
    return slot === undefined ? [] : [{ id: s.id, crop: CHAIRS[s.chair], slot }]
  })

  const setQty = (id: ServiceId, value: number) => dispatch({ type: 'qty', id, value })
  const detail = `${seat.name} · ${formatPrice(seat.price[currency ?? 'USD'], currency ?? 'USD')} / month`

  return (
    <Section id="credit-calculator" className="bg-chalk" pad="md" padTop="none">
      <div className="flex items-end justify-between gap-x-8 gap-y-5 tablet:flex-col tablet:items-start">
        <Heading.H1>
          Your next project, <Em>in credits.</Em>
        </Heading.H1>
        <Paragraph className="max-w-[25rem]">Pick a seat, add the work you have in mind and see how it fits your monthly credits.</Paragraph>
      </div>

      <div className="mt-xlg flex h-[33.375rem] gap-sm rounded-planner bg-volt p-sm tablet:h-auto tablet:flex-col">
        {/* Builder */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-sm">
          <fieldset className="flex gap-sm portrait:flex-col">
            <legend className="sr-only">Choose a seat</legend>
            {seats.map((s) => (
              <SeatOption key={s.id} seat={s} checked={state.seat === s.id} onSelect={() => dispatch({ type: 'seat', seat: s.id })} />
            ))}
          </fieldset>

          <div className="relative min-h-0 flex-1 rounded-card bg-paper">
            <ul ref={list} className="h-full overflow-y-auto overscroll-contain rounded-card [scrollbar-width:none] tablet:h-auto tablet:overflow-visible [&::-webkit-scrollbar]:hidden">
              {creditServices.map((s) => (
                <ServiceRow key={s.id} service={s} value={state.qty[s.id]} onChange={setQty} />
              ))}
              <li>
                <a
                  href={demoPage}
                  data-track="book_demo_click"
                  data-track-location="credit_calculator_custom"
                  className="group flex min-h-[4.25rem] items-center gap-6 px-md py-sm"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-xxxsm">
                    <span className="text-sm font-medium">Something else?</span>
                    <span className="text-xs text-forest/60">Tell us what you need and we’ll price it in credits</span>
                  </span>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-chalk transition-transform duration-[250ms] ease-out group-hover:rotate-45">
                    <Arrow />
                  </span>
                </a>
              </li>
            </ul>
            <ScrollThumb target={list} />
          </div>

          {/* Narrow screens: the summary sits below the list, so keep the tally in view while sliding. */}
          <div aria-hidden className="sticky bottom-sm z-10 hidden items-center gap-md rounded-card bg-ink px-md py-sm text-paper tablet:flex">
            <span className={cn('text-sm font-semibold tabular-nums', over && 'text-flare')}>
              {used}/{seat.credits} credits
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper/20">
              <span className={cn('block h-full rounded-full transition-[width,background-color] duration-300', over ? 'bg-flare' : 'bg-volt')} style={{ width: `${Math.min(used / seat.credits, 1) * 100}%` }} />
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="@container flex w-[24.5rem] shrink-0 flex-col gap-6 rounded-card bg-paper p-sm tablet:w-full">
          <div>
            <Heading.H3 className="font-serif font-normal">Your monthly seat</Heading.H3>
            {/* Keyed by seat, so only a seat change rolls the line; the price stays hidden until the visitor's currency is known. */}
            <Roll
              value={detail}
              id={seat.id}
              order={seatIndex}
              distance={6}
              settle={{ duration: 0.32, ease: 'easeOut' }}
              className={cn('mt-xxsm text-xs text-forest/60 transition-opacity duration-300', !currency && 'opacity-0')}
            />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-6 tablet:min-h-[21rem]">
            <ChairPile placed={placed} />
            <div className="relative w-full pb-6">
              <Usage used={used} cap={seat.credits} over={over} />
              <AnimatePresence>{over && <OverNote overBy={overBy} seatName={seat.name} next={next} onUpgrade={() => next && dispatch({ type: 'seat', seat: next.id })} />}</AnimatePresence>
            </div>
          </div>

          <Button
            href={demoPage}
            id="credit-calculator-book-demo"
            data-track="book_demo_click"
            data-track-location="credit_calculator"
            full
            className="h-10 pr-1 text-sm [&>span:first-child]:flex-1 [&>span:first-child]:text-center"
          >
            Discuss your creative mix
          </Button>
        </div>
      </div>
    </Section>
  )
}
