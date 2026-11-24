import { useAnimate, useInView } from 'motion/react'
import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { cn } from '../utils/cn'

export default function NoHiring() {
  return (
    <Section id="team">
      <div className="grid grid-cols-2 items-center gap-8 tablet:gap-6 portrait:gap-4 landscape:grid-cols-1">
        <Pipeline />
        <div className="flex flex-col items-start gap-xbg landscape:order-first">
          <Heading.H1>
            <span className="block">No hiring. No training.</span> <Em>No added complexity.</Em>
          </Heading.H1>
          <Paragraph className="max-w-[34rem] font-semibold">Your team of creative specialists is already in place.</Paragraph>
          <Paragraph className="max-w-[34rem]">
            Creative Seat tailors a team of experienced talent to the type of content you need. Whether you require digital, video, web, animation or brand design, simply brief your designated project manager and your specialised team gets to work.
          </Paragraph>
        </div>
      </div>
    </Section>
  )
}

/* ---------------------------------------------------------------------------
   The pipeline: one sample job (Sassy Locks' spring launch) passing through
   the team in a single Paper panel, told through the work rather than the
   tools. The project manager files the brief; the graphic designer takes a
   colour with the eyedropper and the wireframe card fills with it; the
   animator scrubs and the card's pieces move in; the developer drops it into
   a phone, publishes, and taps "Shop now" to show it works. A rail above the
   window ticks off each hand-off; then it holds, and runs again.

   Everything is placed in % of the 3:2 window, and type is in container
   units, so the whole thing scales with its column. Cursors are window-sized
   layers moved by transform, so a translate of (x%, y%) puts the pointer's
   tip at that point of the window. The card sits in the same place in every
   step after the brief, so the scenes cross-fade around it.

   It plays whatever the visitor's motion setting (reduced motion, or the
   site's pause control): the owner wants the story seen. Server-rendered as
   the finished state, every step ticked and the page live, until it starts.
   ------------------------------------------------------------------------- */

/** The sample client's own palette — their colours in a depiction of their work, not Creative Seat's. */
const CLIENT = { lilac: '#c9c6ec', plum: '#3b1667', pink: '#f06ca0', mist: '#edf2f4' }

const STEPS = [
  { id: 'brief', label: 'Brief' },
  { id: 'design', label: 'Design' },
  { id: 'motion', label: 'Motion' },
  { id: 'build', label: 'Launch' },
] as const
type StepId = (typeof STEPS)[number]['id']

/**
 * The people in the file, multiplayer-style: each has their own cursor and
 * name-tag colour, taken from the workflow illustration on the benefit cards
 * (its lime, sky, deep green and pink, plus Ink). `dark` colours carry Paper
 * text and a Paper edge; the light ones Ink. `flip` puts the tag left of the
 * pointer for people who work near the right edge.
 */
type Person = { label: string, colour: string, dark?: boolean, flip?: boolean, dropper?: boolean }
type PersonId = 'client' | 'pm' | 'designer' | 'animator' | 'developer'
const PEOPLE: Record<PersonId, Person> = {
  client: { label: 'Client', colour: '#f28cb4' },
  pm: { label: 'Project manager', colour: '#3c6c60', dark: true },
  designer: { label: 'Graphic designer', colour: '#5ac0ea', dropper: true },
  animator: { label: 'Animator', colour: 'var(--color-soft-volt)', flip: true },
  developer: { label: 'Developer', colour: 'var(--color-ink)', dark: true, flip: true },
}
const PEOPLE_IDS = Object.keys(PEOPLE) as PersonId[]
/** Who's in the file at each step: the one doing the work first, then who's with them. */
const CAST: Record<StepId, PersonId[]> = {
  brief: ['pm', 'client'],
  design: ['designer', 'pm'],
  motion: ['animator', 'designer'],
  build: ['developer', 'client'],
}

/** Strong curves: ease-out for things arriving, ease-in-out for things moving on screen. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
/** The card's pieces land with a little life in them. */
const POP = { type: 'spring', duration: 0.6, bounce: 0.3 } as const

type Box = { x: number, y: number, w: number, h: number }
type Point = readonly [number, number]
const place = (b: Box): CSSProperties => ({ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` })
/** The translate that moves a box's top-left corner to (x, y), in % of the box itself. */
const shift = (b: Box, x: number, y: number) => ({ x: `${((x - b.x) / b.w) * 100}%`, y: `${((y - b.y) / b.h) * 100}%` })
const centre = (b: Box): Point => [b.x + b.w / 2, b.y + b.h / 2]
/** A point given in % of a box, in % of the window. */
const within = (b: Box, px: number, py: number): Point => [b.x + (b.w * px) / 100, b.y + (b.h * py) / 100]

// Brief
const CARD: Box = { x: 8, y: 24, w: 38, h: 48 }
const FOLDER: Box = { x: 58, y: 30, w: 26, h: 38 }
const CARD_SCALE = 0.35
/** How far right of its place the brief starts, in card widths, as the client drags it in. */
const BRIEF_IN = 0.6
// The work: a portrait card, in the same place from design to launch.
const ART: Box = { x: 37, y: 14, w: 26, h: 70 }
// Design
const SWATCHES = [CLIENT.lilac, CLIENT.pink, CLIENT.plum, CLIENT.mist]
const PALETTE: Box = { x: 14, y: 28, w: 8, h: 44 }
/** Where the colour floods in from, in % of the card. */
const FILL_FROM = [50, 46] as const
// Motion
const SCRUB: Box = { x: 31, y: 88, w: 38, h: 2.4 }
// Launch
const PUBLISH: Box = { x: 71, y: 38, w: 21, h: 9 }

/** Where each cursor goes, in % of the window. */
const AT = {
  enter: [97, 97],
  // The client brings the brief in by its top-right corner, from where it starts.
  clientFrom: [within(CARD, 86, 20)[0] + CARD.w * BRIEF_IN, within(CARD, 86, 20)[1]],
  clientGrab: within(CARD, 86, 20),
  clientRest: [12, 86],
  card: [24, 36],
  // The grab point once the card has shrunk into the folder's centre.
  filed: [centre(FOLDER)[0] + (24 - centre(CARD)[0]) * CARD_SCALE, centre(FOLDER)[1] + (36 - centre(CARD)[1]) * CARD_SCALE],
  briefRest: [30, 86],
  swatch: within(PALETTE, 50, 37.5),
  fill: within(ART, FILL_FROM[0], FILL_FROM[1]),
  designRest: [72, 76],
  pmWatch: [68, 22],
  pmWatch2: [65, 30],
  knobFrom: [SCRUB.x, SCRUB.y + SCRUB.h / 2],
  knobTo: [SCRUB.x + SCRUB.w, SCRUB.y + SCRUB.h / 2],
  motionRest: [80, 66],
  designerWatch: [10, 24],
  designerWatch2: [16, 34],
  // High on the button, so the flipped tag hangs below it rather than over the label.
  publish: within(PUBLISH, 60, 30),
  clientWatch: [20, 60],
  shop: within(ART, 50, 91),
  clientDone: [24, 70],
  buildRest: [86, 74],
} satisfies Record<string, Point>

/** The card's pieces: how each sits before the animator plays it in, and when it comes in as the scrub runs. */
const PIECES = [
  { id: 'headline', from: { opacity: 0, y: '40%', scale: 1 }, at: 0.1 },
  { id: 'sun', from: { opacity: 0, y: '0%', scale: 0.4 }, at: 0.45 },
  { id: 'model', from: { opacity: 0, y: '30%', scale: 1 }, at: 0.75 },
  { id: 'button', from: { opacity: 0, y: '0%', scale: 0.8 }, at: 1.1 },
] as const
const SCRUB_SECONDS = 1.6

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const now = { duration: 0 }
const cur = (id: PersonId) => `[data-cursor="${id}"]`
const fill = (r: number) => `circle(${r}% at ${FILL_FROM[0]}% ${FILL_FROM[1]}%)`

function Pipeline() {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const inView = useInView(scope, { amount: 0.3 })
  const visible = useRef(false)
  useEffect(() => {
    visible.current = inView
  }, [inView])

  useEffect(() => {
    /** The empty pipeline, before the brief arrives. */
    const showStart = () => {
      animate('[data-step-active]', { opacity: 0 }, now)
      animate('[data-step-done]', { opacity: 0, scale: 0.8 }, now)
      animate('[data-track]', { scaleX: 0 }, now)
      animate('[data-scene]', { opacity: 0 }, now)
      animate('[data-cursor]', { opacity: 0, x: `${AT.enter[0]}%`, y: `${AT.enter[1]}%` }, now)
      animate(cur('client'), { x: `${AT.clientFrom[0]}%`, y: `${AT.clientFrom[1]}%` }, now)
      animate('[data-pointer]', { scale: 1 }, now)
      // Brief
      animate('[data-brief-card]', { opacity: 0, x: `${BRIEF_IN * 100}%`, y: '0%', scale: 1 }, now)
      animate('[data-folder-tick]', { opacity: 0, scale: 0.8 }, now)
      animate('[data-brief-chip]', { opacity: 0, y: '60%' }, now)
      // Design
      animate('[data-colour]', { clipPath: fill(0) }, now)
      animate('[data-loupe]', { opacity: 0, scale: 0.9 }, now)
      animate('[data-swatch-ring]', { opacity: 0 }, now)
      // Motion
      animate('[data-piece]', { opacity: 1, y: '0%', scale: 1 }, now)
      animate('[data-knob]', { x: '0%' }, now)
      animate('[data-scrub-fill]', { scaleX: 0 }, now)
      // Launch
      animate('[data-phone]', { opacity: 0, scale: 1.06 }, now)
      animate('[data-state]', { opacity: 0 }, now)
      animate('[data-state="idle"]', { opacity: 1 }, now)
      animate('[data-live-url]', { opacity: 0, y: '40%' }, now)
      animate('[data-added]', { opacity: 0, y: '-40%' }, now)
    }

    let alive = true
    /** Hold between steps while the window is off screen or the tab is hidden. */
    const gate = async () => {
      while (alive && (!visible.current || document.hidden)) await wait(250)
      return alive
    }
    const pause = async (ms: number) => {
      await wait(ms)
      return alive
    }

    const cursorTo = (id: PersonId, [x, y]: Point, duration = 0.7, ease: typeof EASE_IN_OUT | typeof EASE_OUT = EASE_IN_OUT) =>
      animate(cur(id), { x: `${x}%`, y: `${y}%` }, { duration, ease })
    const press = (id: PersonId, down: boolean) => animate(`${cur(id)} [data-pointer]`, { scale: down ? 0.85 : 1 }, { duration: down ? 0.1 : 0.16, ease: EASE_OUT })
    const click = async (id: PersonId) => {
      await press(id, true)
      await press(id, false)
    }

    /** A step begins: its rail dot lights, its scene comes up, and its people join the file as the others leave. */
    const begin = async (id: StepId) => {
      animate(`[data-step-active="${id}"]`, { opacity: 1 }, { duration: 0.25, ease: EASE_OUT })
      STEPS.forEach((s) => {
        animate(`[data-scene="${s.id}"]`, { opacity: s.id === id ? 1 : 0 }, { duration: 0.35, ease: EASE_OUT })
      })
      PEOPLE_IDS.forEach((person) => animate(cur(person), { opacity: CAST[id].includes(person) ? 1 : 0 }, { duration: 0.25, ease: EASE_OUT }))
      await wait(350)
    }

    /** A step is done: its dot ticks and the rail fills to the next. */
    const finish = async (id: StepId) => {
      const i = STEPS.findIndex((s) => s.id === id)
      await animate(`[data-step-done="${id}"]`, { opacity: 1, scale: 1 }, { duration: 0.25, ease: EASE_OUT })
      animate(`[data-step-active="${id}"]`, { opacity: 0 }, now)
      if (i < STEPS.length - 1) await animate(`[data-track="${i + 1}"]`, { scaleX: 1 }, { duration: 0.5, ease: EASE_IN_OUT })
    }

    /** The client drags the brief in; the project manager files it. */
    const brief = async () => {
      await press('client', true)
      await Promise.all([
        animate('[data-brief-card]', { opacity: 1, x: '0%' }, { duration: 0.8, ease: EASE_OUT }),
        cursorTo('client', AT.clientGrab, 0.8, EASE_OUT),
      ])
      await press('client', false)
      cursorTo('client', AT.clientRest, 0.8)
      await cursorTo('pm', AT.card, 0.8)
      await Promise.all([press('pm', true), animate('[data-brief-card]', { scale: 1.03 }, { duration: 0.15, ease: EASE_OUT })])
      const target = centre(FOLDER)
      await Promise.all([
        animate('[data-brief-card]', { ...shift(CARD, target[0] - CARD.w / 2, target[1] - CARD.h / 2), scale: CARD_SCALE }, { duration: 0.9, ease: EASE_IN_OUT }),
        cursorTo('pm', AT.filed, 0.9),
      ])
      press('pm', false)
      await Promise.all([
        animate('[data-brief-card]', { opacity: 0, scale: 0.2 }, { duration: 0.2, ease: EASE_OUT }),
        animate('[data-folder-front]', { scaleY: [1, 0.9, 1] }, { duration: 0.35, ease: EASE_OUT }),
      ])
      await animate('[data-folder-tick]', { opacity: 1, scale: 1 }, { duration: 0.25, ease: EASE_OUT })
      await animate('[data-brief-chip]', { opacity: 1, y: '0%' }, { duration: 0.3, ease: EASE_OUT })
      await cursorTo('pm', AT.briefRest, 0.6)
      await wait(700)
    }

    /** The eyedropper takes the client's pink, and the wireframe card floods with colour from where it's dropped. */
    const design = async () => {
      cursorTo('pm', AT.pmWatch, 0.9)
      await cursorTo('designer', AT.swatch, 0.8)
      await Promise.all([
        animate('[data-swatch-ring]', { opacity: 1 }, { duration: 0.15, ease: EASE_OUT }),
        animate('[data-loupe]', { opacity: 1, scale: 1 }, { duration: 0.2, ease: EASE_OUT }),
      ])
      await wait(250)
      await click('designer')
      animate('[data-swatch-ring]', { opacity: 0 }, { duration: 0.2 })
      await cursorTo('designer', AT.fill, 0.8)
      await click('designer')
      animate('[data-loupe]', { opacity: 0, scale: 0.9 }, { duration: 0.15, ease: EASE_OUT })
      await animate('[data-colour]', { clipPath: fill(150) }, { duration: 0.9, ease: EASE_OUT })
      cursorTo('pm', AT.pmWatch2, 0.6)
      await cursorTo('designer', AT.designRest, 0.6)
      await wait(500)
    }

    /** The animator rewinds the card, then scrubs it forward and its pieces move in. */
    const motion = async () => {
      cursorTo('designer', AT.designerWatch, 0.9)
      await Promise.all(PIECES.map((p) => animate(`[data-piece="${p.id}"]`, p.from, { duration: 0.25, ease: EASE_OUT })))
      await cursorTo('animator', AT.knobFrom, 0.7)
      await press('animator', true)
      await Promise.all([
        cursorTo('animator', AT.knobTo, SCRUB_SECONDS),
        animate('[data-knob]', { x: '100%' }, { duration: SCRUB_SECONDS, ease: EASE_IN_OUT }),
        animate('[data-scrub-fill]', { scaleX: 1 }, { duration: SCRUB_SECONDS, ease: EASE_IN_OUT }),
        ...PIECES.map((p) => animate(`[data-piece="${p.id}"]`, { opacity: 1, y: '0%', scale: 1 }, { ...POP, delay: p.at })),
      ])
      await press('animator', false)
      cursorTo('designer', AT.designerWatch2, 0.6)
      await cursorTo('animator', AT.motionRest, 0.6)
      await wait(600)
    }

    /** The card goes into a phone, the developer publishes, and the client taps "Shop now" to see it work. */
    const build = async () => {
      cursorTo('client', AT.clientWatch, 0.9)
      await animate('[data-phone]', { opacity: 1, scale: 1 }, { duration: 0.5, ease: EASE_OUT })
      await cursorTo('developer', AT.publish, 0.8)
      await click('developer')
      animate('[data-state="idle"]', { opacity: 0 }, { duration: 0.15 })
      animate('[data-state="busy"]', { opacity: 1 }, { duration: 0.15 })
      await animate('[data-spinner]', { rotate: [0, 540] }, { duration: 1, ease: 'linear' })
      animate('[data-state="busy"]', { opacity: 0 }, { duration: 0.15 })
      await animate('[data-state="live"]', { opacity: 1 }, { duration: 0.2, ease: EASE_OUT })
      await animate('[data-live-url]', { opacity: 1, y: '0%' }, { duration: 0.35, ease: EASE_OUT })
      cursorTo('developer', AT.buildRest, 0.7)
      await cursorTo('client', AT.shop, 0.8)
      await Promise.all([click('client'), animate('[data-shop]', { scale: [1, 0.92, 1] }, { duration: 0.3, ease: EASE_OUT })])
      await animate('[data-added]', { opacity: 1, y: '0%' }, POP)
      await cursorTo('client', AT.clientDone, 0.6)
      await wait(400)
    }

    const scenes: Record<StepId, () => Promise<void>> = { brief, design, motion, build }

    const run = async () => {
      showStart()
      while (alive) {
        for (const step of STEPS) {
          if (!(await gate())) return
          await begin(step.id)
          await scenes[step.id]()
          if (!alive) return
          await finish(step.id)
        }
        if (!(await pause(2800)) || !(await gate())) return
        // Clear down for the next job.
        await Promise.all([
          animate('[data-scene], [data-cursor]', { opacity: 0 }, { duration: 0.35, ease: EASE_OUT }),
          animate('[data-step-done]', { opacity: 0 }, { duration: 0.35, ease: EASE_OUT }),
          animate('[data-track]', { scaleX: 0 }, { duration: 0.5, ease: EASE_IN_OUT }),
        ])
        showStart()
        if (!(await pause(400))) return
      }
    }
    run()
    return () => {
      alive = false
      scope.animations.forEach((control) => control.stop())
    }
  }, [animate, scope])

  return (
    <div
      ref={scope}
      role="img"
      aria-label="A Creative Seat job passing through the team: the client hands over the brief and the project manager files it, the graphic designer adds the colour, the animator brings it to life, and the developer launches it for the client to try"
      className="flex w-full select-none flex-col gap-sm rounded-panel bg-soft-volt p-sm"
    >
      <Rail />

      <div aria-hidden className="@container relative aspect-[3/2] w-full overflow-hidden rounded-md bg-paper text-ink shadow-[0_18px_40px_-24px_rgba(24,27,30,0.45)]">
        <BriefScene />
        <DesignScene />
        <MotionScene />
        <LaunchScene />

        {PEOPLE_IDS.map((id) => (
          <div key={id} data-cursor={id} className="pointer-events-none absolute inset-0 z-30 opacity-0">
            <Pointer person={PEOPLE[id]} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** The hand-offs: a numbered dot per step that lights while it's worked and ticks when done, joined by a filling line. */
function Rail() {
  return (
    <ol aria-hidden className="flex items-center gap-2 px-1 portrait:gap-1 portrait:px-0">
      {STEPS.map((s, i) => (
        <Fragment key={s.id}>
          {i > 0 && (
            <li className="relative h-0.5 min-w-2 flex-1 overflow-hidden rounded-full bg-forest/15">
              <span data-track={i} className="absolute inset-0 origin-left bg-forest" />
            </li>
          )}
          <li className="flex items-center gap-1.5 portrait:gap-1">
            <span className="relative grid size-6 shrink-0 place-items-center rounded-full bg-paper text-[11px] font-semibold text-forest/70 portrait:size-5 portrait:text-[10px]">
              {i + 1}
              <span data-step-active={s.id} className="absolute inset-0 grid place-items-center rounded-full bg-forest text-soft-volt opacity-0">
                {i + 1}
              </span>
              <span data-step-done={s.id} className="absolute inset-0 grid place-items-center rounded-full bg-volt text-ink">
                <Tick className="w-3" />
              </span>
            </span>
            <span className="text-p-xs font-semibold text-forest portrait:text-[11px]">{s.label}</span>
          </li>
        </Fragment>
      ))}
    </ol>
  )
}

function Scene({ id, children }: { id: StepId, children: ReactNode }) {
  return (
    <div data-scene={id} className={cn('absolute inset-0', id !== 'build' && 'opacity-0')}>
      {children}
    </div>
  )
}

/** The brief lands, and the project manager files it in the job's folder. */
function BriefScene() {
  return (
    <Scene id="brief">
      <div className="absolute" style={place(FOLDER)}>
        <span className="absolute inset-x-0 bottom-0 top-[6%] rounded-[1.4cqw] bg-volt" />
        <span className="absolute left-0 top-0 h-[16%] w-[40%] rounded-t-[1.4cqw] bg-volt" />
        <span data-folder-front className="absolute inset-x-0 bottom-0 top-[22%] flex origin-bottom items-end rounded-[1.4cqw] bg-soft-volt p-[1.8cqw] shadow-[0_-4px_10px_-6px_rgba(24,27,30,0.3)]">
          <span className="text-[2cqw] font-semibold text-forest">Spring launch</span>
        </span>
        <span data-folder-tick className="absolute -right-[1.6cqw] -top-[1.6cqw] grid size-[6cqw] place-items-center rounded-full bg-ink text-volt opacity-0 shadow-[0_4px_10px_-4px_rgba(24,27,30,0.5)]">
          <Tick className="w-[50%]" />
        </span>
      </div>
      <div className="absolute flex -translate-x-1/2 justify-center" style={{ left: `${centre(FOLDER)[0]}%`, top: `${FOLDER.y + FOLDER.h + 5}%` }}>
        <span data-brief-chip className="flex items-center gap-[1cqw] whitespace-nowrap rounded-full bg-ink px-[2cqw] py-[1cqw] text-[1.9cqw] font-semibold text-paper opacity-0">
          <span className="size-[1.3cqw] rounded-full bg-volt" />
          Brief scoped · team assigned
        </span>
      </div>

      <div data-brief-card className="absolute z-10 flex flex-col rounded-[1.6cqw] border border-ink/10 bg-paper p-[2.2cqw] opacity-0 shadow-[0_10px_24px_-14px_rgba(24,27,30,0.45)]" style={place(CARD)}>
        <span className="flex items-center gap-[1cqw] text-[1.7cqw] font-semibold uppercase tracking-[0.08em] text-muted">
          <span className="size-[1.3cqw] rounded-full bg-volt" />
          New brief
        </span>
        <p className="mt-[1.6cqw] font-serif text-[3.8cqw] leading-[1.05]">Sassy Locks spring launch</p>
        <p className="mt-[1.2cqw] text-[1.9cqw] text-muted">Landing page · due Friday</p>
        <div className="mt-auto space-y-[1cqw]">
          {['90%', '76%', '52%'].map((w) => (
            <span key={w} className="block h-[1cqw] rounded-full bg-chalk" style={{ width: w }} />
          ))}
        </div>
      </div>
    </Scene>
  )
}

/** The palette and the card: a grey wireframe, with the finished colour underneath waiting to flood in. */
function DesignScene() {
  return (
    <Scene id="design">
      <div className="absolute flex flex-col items-center justify-around rounded-full bg-chalk/70" style={place(PALETTE)}>
        {SWATCHES.map((swatch) => (
          <span key={swatch} className="relative aspect-square w-[62%] rounded-full border border-ink/10" style={{ background: swatch }}>
            {swatch === CLIENT.pink && <span data-swatch-ring className="absolute -inset-[0.7cqw] rounded-full border-2 border-ink opacity-0" />}
          </span>
        ))}
      </div>

      <ArtFrame>
        <Wireframe />
        <span data-colour className="absolute inset-0">
          <Art />
        </span>
      </ArtFrame>
    </Scene>
  )
}

/** The same card with a single scrub bar under it: the animator drags it and the card's pieces move in. */
function MotionScene() {
  return (
    <Scene id="motion">
      <ArtFrame>
        <Art pieces />
      </ArtFrame>

      <div className="absolute rounded-full bg-chalk" style={place(SCRUB)}>
        <span data-scrub-fill className="absolute inset-0 origin-left rounded-full bg-volt" />
        {/* A track-wide layer whose left edge is the knob, so a translate of 100% takes it to the end. */}
        <span data-knob className="absolute inset-0">
          <span className="absolute left-0 top-1/2 size-[2.6cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5cqw] border-ink bg-paper shadow-[0_2px_6px_-2px_rgba(24,27,30,0.4)]" />
        </span>
      </div>
    </Scene>
  )
}

/** The card in a phone, the Publish button that takes it live, and its address once it is. */
function LaunchScene() {
  const state = 'absolute inset-0 flex items-center justify-center gap-[1cqw] rounded-full'
  return (
    <Scene id="build">
      <div className="absolute" style={place(ART)}>
        <span data-phone className="absolute -inset-[1.6cqw] rounded-[3.4cqw] bg-ink shadow-[0_16px_32px_-18px_rgba(24,27,30,0.6)]" />
      </div>
      <ArtFrame>
        <Art />
        <span className="absolute left-1/2 top-[2%] h-[2.6%] w-[28%] -translate-x-1/2 rounded-full bg-ink" />
        <div className="absolute inset-x-0 top-[7%] flex justify-center">
          <span data-added className="flex items-center gap-[0.8cqw] whitespace-nowrap rounded-full bg-ink px-[1.6cqw] py-[0.8cqw] text-[1.6cqw] font-semibold text-paper opacity-0">
            <Tick className="w-[1.8cqw] text-volt" />
            Added to bag
          </span>
        </div>
      </ArtFrame>

      <span className="absolute text-[2.1cqw] font-semibold" style={place(PUBLISH)}>
        <span data-state="idle" className={cn(state, 'bg-volt text-ink opacity-0')}>Publish</span>
        <span data-state="busy" className={cn(state, 'bg-volt text-ink opacity-0')}>
          <span data-spinner className="size-[2.2cqw] rounded-full border-[0.4cqw] border-ink/25 border-t-ink" />
          Publishing
        </span>
        <span data-state="live" className={cn(state, 'bg-ink text-volt')}>
          <Tick className="w-[2.2cqw]" />
          Live
        </span>
      </span>
      <div className="absolute flex justify-center" style={{ left: `${PUBLISH.x}%`, width: `${PUBLISH.w}%`, top: `${PUBLISH.y + PUBLISH.h + 3}%` }}>
        <span data-live-url className="flex items-center gap-[0.9cqw] whitespace-nowrap text-[1.8cqw] text-muted">
          <span className="size-[1.2cqw] rounded-full bg-volt" />
          sassylocks.com/spring
        </span>
      </div>
    </Scene>
  )
}

/** The card's frame, in the same place in every step after the brief. */
function ArtFrame({ children }: { children: ReactNode }) {
  return (
    <div className="absolute overflow-hidden rounded-[1.6cqw] border border-ink/10 bg-paper shadow-[0_12px_28px_-18px_rgba(24,27,30,0.5)]" style={place(ART)}>
      {children}
    </div>
  )
}

/** The finished card: a headline, a pink sun, the model and the button. `pieces` tags them for the animator. */
function Art({ pieces = false }: { pieces?: boolean }) {
  const piece = (id: (typeof PIECES)[number]['id']) => (pieces ? { 'data-piece': id } : {})
  return (
    <span className="absolute inset-0 overflow-hidden" style={{ background: CLIENT.lilac }}>
      <p {...piece('headline')} className="absolute left-[10%] top-[7%] w-[80%] font-serif text-[3.3cqw] leading-[0.95]" style={{ color: CLIENT.plum }}>
        The difference is the detail.
      </p>
      <span {...piece('sun')} className="absolute left-[18%] top-[33%] aspect-square w-[64%] rounded-full" style={{ background: CLIENT.pink }} />
      <img
        {...piece('model')}
        src="/images/sections/character-craig.webp"
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute bottom-[15%] left-0 h-[50%] w-full object-contain object-bottom"
      />
      <span className="absolute bottom-[4.5%] left-1/2 h-[8.5%] w-[54%] -translate-x-1/2">
        <span {...piece('button')} data-shop className="grid h-full w-full place-items-center rounded-full text-[1.7cqw] font-semibold text-ink" style={{ background: CLIENT.pink }}>
          Shop now
        </span>
      </span>
    </span>
  )
}

/** The card before the designer: grey placeholders where the finished pieces will go. */
function Wireframe() {
  return (
    <span className="absolute inset-0 bg-paper">
      <span className="absolute left-[10%] top-[8%] flex w-[80%] flex-col gap-[1cqw]">
        {['92%', '78%', '50%'].map((w) => (
          <span key={w} className="block h-[1.4cqw] rounded-full bg-chalk" style={{ width: w }} />
        ))}
      </span>
      <span className="absolute left-[18%] top-[33%] aspect-square w-[64%] rounded-full border-2 border-dashed border-ink/15" />
      <span className="absolute bottom-[15%] left-[33%] h-[40%] w-[34%] rounded-t-full bg-chalk" />
      <span className="absolute bottom-[4.5%] left-1/2 h-[8.5%] w-[54%] -translate-x-1/2 rounded-full bg-chalk" />
    </span>
  )
}

function Tick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path d="M13.3 4 6 11.3 2.7 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * A person's pointer and name tag, both in their colour, multiplayer-style.
 * The designer's pointer is an eyedropper, with a loupe that shows the colour
 * it's holding. The tip of either glyph is the layer's top-left corner.
 */
function Pointer({ person }: { person: Person }) {
  const edge = person.dark ? 'var(--color-paper)' : 'var(--color-ink)'
  return (
    <div data-pointer className="absolute left-0 top-0" style={{ transformOrigin: '0 0' }}>
      {person.dropper ? (
        <>
          {/* An eyedropper whose tip is the bottom-left corner of its 24 × 24 box. */}
          <svg viewBox="0 0 24 24" className="absolute -left-[2px] -top-[22px] size-6 drop-shadow-[0_1px_2px_rgba(24,27,30,0.3)]">
            <g fill={person.colour} stroke={edge} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m2 22 1-1h3l9-9" />
              <path d="M3 21v-3l9-9" />
              <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
            </g>
          </svg>
          <span data-loupe className="absolute -top-[60px] left-[14px] size-9 rounded-full border-[3px] border-paper opacity-0 shadow-[0_4px_12px_-4px_rgba(24,27,30,0.5)]" style={{ background: CLIENT.pink }} />
        </>
      ) : (
        <svg viewBox="0 0 16 22" className="absolute left-0 top-0 h-[22px] w-4 drop-shadow-[0_2px_3px_rgba(24,27,30,0.25)]">
          <path d="M1 1v17.5l4.6-4.4 3.3 7.2 3-1.4-3.2-7H15L1 1Z" fill={person.colour} stroke={edge} strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      )}
      <span
        className={cn(
          'absolute top-[19px] whitespace-nowrap rounded-[4px] px-[7px] py-[5px] text-[11.5px] font-semibold leading-none shadow-[1px_2px_4px_rgba(24,27,30,0.18)]',
          person.flip ? 'right-1' : 'left-3',
        )}
        style={{ background: person.colour, color: person.dark ? 'var(--color-paper)' : 'var(--color-ink)' }}
      >
        {person.label}
      </span>
    </div>
  )
}
