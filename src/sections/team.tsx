import { motion, useAnimate, useDragControls, useInView, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useRef, type PointerEvent, type ReactNode, type RefObject } from 'react'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import Paragraph from '../components/paragraph'
import { cn } from '../utils/cn'

export default function NoHiring() {
  return (
    // The cursor labels deliberately spill past the artwork; clip (not scroll) any
    // that reach the screen edge on the narrowest phones.
    <Section id="team" pad="md" className="overflow-x-clip">
      <div className="grid grid-cols-2 items-center gap-[70px] tablet:gap-xlg landscape:grid-cols-1">
        <Canvas />
        <div className="landscape:order-first">
          <Eyebrow>Instant access to the skills you need</Eyebrow>
          <Heading.H1 className="mt-4">
            <span className="block">No hiring. No training.</span> <Em>No added complexity.</Em>
          </Heading.H1>
          <Paragraph className="mt-6 max-w-[34rem] font-bold">Your team of creative specialists is already in place.</Paragraph>
          <Paragraph className="mt-5 max-w-[34rem]">
            Creative Seat tailors a team of experienced talent to the type of content you need. Whether you require digital, video, web, animation or brand design, simply brief your designated project manager and your specialised team gets to work.
          </Paragraph>
        </div>
      </div>
    </Section>
  )
}

/* ---------------------------------------------------------------------------
   The canvas: a multiplayer design file in miniature. Four collaborators drag
   the pieces of a sample client's landing page (Sassy Locks) onto the artboard
   until it's one finished artwork, hold it, undo, and build it again. Hover in
   and your own cursor joins them, labelled "You" — grab a piece and it springs
   back into place.

   Everything is positioned in % of the 505 × 596 frame (type in container
   units), so the whole canvas scales with its column.
   ------------------------------------------------------------------------- */

/** The sample client's own palette — their colours in a depiction of their work, not Creative Seat's. */
const CLIENT = { lilac: '#c9c6ec', plum: '#3b1667', pink: '#f06ca0', mist: '#edf2f4' }

type PieceId = 'logo' | 'copy' | 'model' | 'button' | 'palette'

/** Where each piece lands on the artboard (`to`), and where it lies scattered before (`from`, with a tilt). */
const PIECES: Record<PieceId, { to: { x: number; y: number; w: number; h: number }; from: { x: number; y: number; r: number } }> = {
  logo: { to: { x: 11, y: 14.2, w: 31, h: 4.6 }, from: { x: 55, y: 1.2, r: 7 } },
  copy: { to: { x: 11, y: 27, w: 44, h: 24 }, from: { x: -3, y: 56, r: -8 } },
  // The animated model: sized to the character's 0.81 framing (34% × 35.6% of the 505 × 596 frame).
  model: { to: { x: 55, y: 26, w: 36, h: 37.7 }, from: { x: 63, y: 47, r: 8 } },
  button: { to: { x: 11, y: 55.5, w: 24, h: 6 }, from: { x: 64, y: 89.5, r: 9 } },
  palette: { to: { x: 11, y: 71.5, w: 30, h: 8.5 }, from: { x: 3, y: 90.5, r: -6 } },
}
const PIECE_IDS = Object.keys(PIECES) as PieceId[]

/**
 * The crew: who carries which pieces, when they start, where they wait
 * (`home`, by their first piece) and where they rest once done. `flip` puts
 * the label left of the pointer for cursors working near the right edge.
 */
const CREW = [
  { id: 'designer', label: 'Graphic designer', pieces: ['logo', 'palette'] as PieceId[], delay: 0.2, home: { x: 79, y: 9 }, rest: { x: 44, y: 84 }, flip: false },
  { id: 'pm', label: 'Project manager', pieces: ['copy'] as PieceId[], delay: 0.6, home: { x: 28, y: 50 }, rest: { x: 38, y: 49.5 }, flip: false },
  { id: 'animator', label: 'Animator', pieces: ['model'] as PieceId[], delay: 1.1, home: { x: 97, y: 55 }, rest: { x: 95, y: 93 }, flip: true },
  { id: 'dev', label: 'Web developer', pieces: ['button'] as PieceId[], delay: 1.6, home: { x: 92, y: 97 }, rest: { x: 33, y: 58.5 }, flip: true },
]

const EASE = [0.65, 0, 0.35, 1] as const
const pct = (n: number) => `${n}%`
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const pieceSel = (id: PieceId) => `[data-piece="${id}"]`
const cursorSel = (id: string) => `[data-cursor="${id}"]`
/** The point a collaborator grabs a piece by: a little left of centre, upper half. */
const grabPoint = (id: PieceId, at: { x: number; y: number }) => ({
  left: pct(at.x + PIECES[id].to.w * 0.55),
  top: pct(at.y + PIECES[id].to.h * 0.4),
})

function Canvas() {
  const reduce = useReducedMotion() ?? false
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const inView = useInView(scope, { amount: 0.3 })
  const visible = useRef(false)
  const draggingRef = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    visible.current = inView
    // The model loops only while the canvas is on screen (and never under
    // reduced motion), and doesn't download until it first comes into view.
    const video = videoRef.current
    if (!video) return
    // React doesn't server-render the muted attribute, and an unmuted video
    // isn't allowed to start on its own — so set it here, before play().
    video.muted = true
    if (inView && !reduce) video.play().catch(() => {})
    else video.pause()
  }, [inView, reduce])

  // The visitor's own cursor — motion values only, so hovering never re-renders the canvas.
  const youX = useMotionValue(0)
  const youY = useMotionValue(0)
  const youOpacity = useMotionValue(0)
  const youScale = useMotionValue(1)

  useEffect(() => {
    if (reduce) return
    let alive = true
    /** Hold between steps while the canvas is off screen or the visitor is dragging a piece. */
    const gate = async () => {
      while (alive && (!visible.current || draggingRef.current)) await wait(250)
      return alive
    }

    const trip = async (crewId: string, id: PieceId) => {
      const { from, to } = PIECES[id]
      const cursor = cursorSel(crewId)
      const piece = pieceSel(id)
      await animate(cursor, grabPoint(id, from), { duration: 0.75, ease: EASE })
      // Grab: the pointer presses, the piece lifts and shows its selection box.
      await Promise.all([
        animate(cursor, { scale: 0.85 }, { duration: 0.12 }),
        animate(piece, { scale: 1.04 }, { duration: 0.18 }),
        animate(`${piece} [data-selection]`, { opacity: 1 }, { duration: 0.15 }),
      ])
      await Promise.all([
        animate(piece, { left: pct(to.x), top: pct(to.y), rotate: 0 }, { duration: 1.1, ease: EASE }),
        animate(cursor, grabPoint(id, to), { duration: 1.1, ease: EASE }),
      ])
      // Drop: the piece covers its slot, whose outline goes.
      await Promise.all([
        animate(`[data-slot="${id}"]`, { opacity: 0 }, { duration: 0.2 }),
        animate(cursor, { scale: 1 }, { duration: 0.12 }),
        animate(piece, { scale: 1 }, { duration: 0.25 }),
        animate(`${piece} [data-selection]`, { opacity: 0 }, { duration: 0.3, delay: 0.25 }),
      ])
    }

    const work = async (member: (typeof CREW)[number]) => {
      await wait(member.delay * 1000)
      for (const id of member.pieces) {
        if (!(await gate())) return
        await trip(member.id, id)
      }
      await animate(cursorSel(member.id), { left: pct(member.rest.x), top: pct(member.rest.y) }, { duration: 0.8, ease: EASE })
    }

    const scatter = (duration: number) =>
      Promise.all([
        ...PIECE_IDS.map((id) => {
          const { from } = PIECES[id]
          return animate(pieceSel(id), { left: pct(from.x), top: pct(from.y), rotate: from.r }, { duration, ease: EASE })
        }),
        ...CREW.map((m) => animate(cursorSel(m.id), { left: pct(m.home.x), top: pct(m.home.y) }, { duration, ease: EASE })),
        animate('[data-slot]', { opacity: 1 }, { duration }),
      ])

    const run = async () => {
      // Prerendered finished (the reduced-motion view); take it apart before it's seen.
      await scatter(0)
      while (alive) {
        if (!(await gate())) return
        await Promise.all(CREW.map(work))
        await wait(3200)
        if (!(await gate())) return
        await scatter(0.9) // ⌘Z
        await wait(900)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [reduce, animate])

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const box = e.currentTarget.getBoundingClientRect()
    youX.set(e.clientX - box.left)
    youY.set(e.clientY - box.top)
    youOpacity.set(1)
  }

  return (
    <div
      ref={scope}
      role="img"
      aria-label="Four Creative Seat specialists dragging the pieces of a client's landing page into place on a shared canvas"
      onPointerMove={onPointerMove}
      onPointerLeave={() => youOpacity.set(0)}
      onPointerDown={() => youScale.set(0.85)}
      onPointerUp={() => youScale.set(1)}
      className="@container relative aspect-[505/596] w-full select-none [@media(hover:hover)]:cursor-none [@media(hover:hover)]:[&_*]:cursor-none"
    >
      {/* The artboard. */}
      <div aria-hidden className="absolute left-[5%] top-[9%] h-[80%] w-[90%] rounded-[2.8cqw]" style={{ background: `linear-gradient(160deg, #f1effc 0%, ${CLIENT.lilac} 100%)` }} />
      {/* Static page furniture: nav, menu button, header rule. */}
      <div aria-hidden className="absolute left-[60%] top-[15.6%] flex w-[20%] justify-between">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[0.9cqw] w-[4.4cqw] rounded-full" style={{ background: `${CLIENT.plum}55` }} />
        ))}
      </div>
      <span aria-hidden className="absolute left-[84%] top-[14.6%] size-[4.2cqw] rounded-[0.8cqw]" style={{ background: CLIENT.plum }} />
      <span aria-hidden className="absolute left-[11%] top-[21.5%] h-px w-[78%]" style={{ background: `${CLIENT.plum}33` }} />

      {/* Empty slots, outlined until their piece lands on them (prerendered filled). */}
      {PIECE_IDS.map((id) => {
        const { to } = PIECES[id]
        return (
          <span
            key={id}
            data-slot={id}
            aria-hidden
            className="absolute rounded-[1.4cqw] border border-dashed opacity-0"
            style={{ left: pct(to.x), top: pct(to.y), width: pct(to.w), height: pct(to.h), borderColor: `${CLIENT.plum}59` }}
          />
        )
      })}

      <Piece id="logo" draggingRef={draggingRef}>
        <span className="flex h-full items-center whitespace-nowrap text-[4.4cqw] font-extrabold tracking-[0.04em]" style={{ color: CLIENT.plum }}>
          SASSY LOCKS®
        </span>
      </Piece>
      <Piece id="copy" draggingRef={draggingRef}>
        <div className="flex h-full flex-col" style={{ color: CLIENT.plum }}>
          <p className="font-serif text-[7cqw] leading-[0.95]">The difference is the detail.</p>
          <div className="mt-auto space-y-[1.4cqw]">
            {['92%', '84%', '58%'].map((w) => (
              <span key={w} className="block h-[1.1cqw] rounded-full" style={{ width: w, background: `${CLIENT.plum}33` }} />
            ))}
          </div>
        </div>
      </Piece>
      <Piece id="model" draggingRef={draggingRef}>
        {/* Transparent character loop: HEVC with alpha for Safari (which drops
            WebM transparency), VP9 WebM with alpha for everyone else. */}
        <video ref={videoRef} muted loop playsInline preload="none" disablePictureInPicture className="pointer-events-none h-full w-full object-cover">
          <source src="/videos/character-craig.mov" type='video/quicktime; codecs="hvc1"' />
          <source src="/videos/character-craig.webm" type="video/webm" />
        </video>
      </Piece>
      <Piece id="button" draggingRef={draggingRef}>
        <span className="flex h-full items-center justify-center rounded-full text-[2.7cqw] font-semibold text-paper" style={{ background: CLIENT.pink }}>
          Shop now →
        </span>
      </Piece>
      <Piece id="palette" draggingRef={draggingRef}>
        <span className="flex h-full items-center">
          {[CLIENT.lilac, CLIENT.plum, CLIENT.pink, CLIENT.mist].map((swatch) => (
            <span key={swatch} className="-mr-[6%] aspect-square h-full rounded-full border-[0.4cqw] border-paper last:mr-0" style={{ background: swatch }} />
          ))}
        </span>
      </Piece>

      {/* Prerendered at rest beside their finished work (the reduced-motion view). */}
      {CREW.map((member) => (
        <div key={member.id} data-cursor={member.id} aria-hidden className="pointer-events-none absolute z-20" style={{ left: pct(member.rest.x), top: pct(member.rest.y) }}>
          <Pointer label={member.label} flip={member.flip} />
        </div>
      ))}

      {/* You. */}
      <motion.div aria-hidden className="pointer-events-none absolute left-0 top-0 z-30" style={{ x: youX, y: youY, opacity: youOpacity, scale: youScale, transformOrigin: '0 0' }}>
        <Pointer label="You" you />
      </motion.div>
    </div>
  )
}

/**
 * One piece of the artwork. The outer box is placed and moved by the crew's
 * script (left/top/rotate/scale); the inner layer is the visitor's to tug —
 * mouse only, so touch still scrolls the page — and springs back on release.
 */
function Piece({ id, draggingRef, className, children }: { id: PieceId; draggingRef: RefObject<boolean>; className?: string; children: ReactNode }) {
  const controls = useDragControls()
  const { to } = PIECES[id]
  return (
    <div data-piece={id} aria-hidden className="absolute z-10" style={{ left: pct(to.x), top: pct(to.y), width: pct(to.w), height: pct(to.h) }}>
      <motion.div
        drag
        dragControls={controls}
        dragListener={false}
        dragSnapToOrigin
        dragElastic={0.35}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
        onPointerDown={(e) => e.pointerType === 'mouse' && controls.start(e)}
        onDragStart={() => (draggingRef.current = true)}
        onDragEnd={() => (draggingRef.current = false)}
        whileDrag={{ scale: 1.05, zIndex: 25 }}
        className={cn('relative h-full w-full', className)}
      >
        {children}
        {/* Selection box with corner handles, shown while a collaborator holds it. */}
        <span data-selection className="pointer-events-none absolute -inset-[0.8cqw] rounded-[0.6cqw] border border-ink opacity-0">
          {['-left-1 -top-1', '-right-1 -top-1', '-left-1 -bottom-1', '-right-1 -bottom-1'].map((at) => (
            <span key={at} className={cn('absolute size-2 border border-ink bg-paper', at)} />
          ))}
        </span>
      </motion.div>
    </div>
  )
}

/** A collaborator's pointer and name tag. Theirs: Ink arrow, Volt tag. Yours: Volt arrow, Ink tag. */
function Pointer({ label, flip = false, you = false }: { label: string; flip?: boolean; you?: boolean }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 16 22" className="absolute left-0 top-0 h-[22px] w-4 drop-shadow-[0_2px_3px_rgba(20,18,26,0.25)]">
        <path d="M1 1v17.5l4.6-4.4 3.3 7.2 3-1.4-3.2-7H15L1 1Z" fill={you ? 'var(--color-volt)' : 'var(--color-ink)'} stroke={you ? 'var(--color-ink)' : 'var(--color-paper)'} strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
      <span
        className={cn(
          'absolute top-[19px] whitespace-nowrap rounded-full px-[9px] py-[6px] text-[11.5px] font-semibold leading-none shadow-[2px_2px_4px_rgba(20,18,26,0.15)]',
          flip ? 'right-1' : 'left-3',
          you ? 'bg-ink text-paper' : 'bg-volt text-ink',
        )}
      >
        {label}
      </span>
    </div>
  )
}
