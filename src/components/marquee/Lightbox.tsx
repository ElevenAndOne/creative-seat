import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Project } from './tiles'

type LightboxProps = {
  project: Project | null
  onClose: () => void
}

export default function Lightbox({ project, onClose }: LightboxProps) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentH, setContentH] = useState(0)
  const open = project !== null

  // While open: lock body scroll, close on Esc, and move focus into the dialog.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  // Measure the overlaid content bar so the gallery's bottom padding matches it —
  // the final image then scrolls up and settles just above the content.
  useEffect(() => {
    if (!open) return
    const el = contentRef.current
    if (!el) return
    const measure = () => setContentH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [open, project])

  const contentMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.15 } } }
    : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 16, transition: { duration: 0.18 } } }

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          onClick={onClose}
          className="fixed inset-0 z-50 overflow-hidden bg-plum/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-round bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            <span aria-hidden="true">×</span>
          </button>

          {/* Gallery — full-bleed to the screen edges, with the inner container
              padding. Bottom padding clears the overlaid content bar. */}
          <div
            className="h-full overflow-y-auto px-[var(--container-margin)] pt-24 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden landscape:pt-20"
            style={{ paddingBottom: contentH }}
          >
            <ProjectImages images={project.images} title={project.title} />
          </div>

          {/* Content bar — sits on top of the gallery with a purple, blurred,
              darkened backing (matched to the navbar). */}
          <motion.div
            ref={contentRef}
            className="absolute inset-x-0 bottom-0 z-10 bg-grape/70 px-[var(--container-margin)] py-xlg text-white backdrop-blur-md"
            {...contentMotion}
            transition={{ type: reduce ? 'tween' : 'spring', duration: reduce ? 0.2 : undefined, stiffness: 260, damping: 28 }}
          >
            <div className="flex items-end justify-between gap-xlg landscape:flex-col landscape:items-start landscape:gap-md">
              <div className="shrink-0">
                <h2 className="text-h2 font-light leading-none">{project.title}</h2>
                <p className="mt-sm text-sm uppercase tracking-[0.18em] text-white/60">{project.category}</p>
              </div>
              <p className="max-w-[34rem] text-base leading-relaxed text-white/85">{project.description}</p>
              <div className="flex shrink-0 flex-wrap gap-xsm landscape:justify-start">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-round border border-white/40 px-4 py-2 text-sm text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Adaptive layout: one image sits centred; multiples flow into a full-width grid. */
function ProjectImages({ images, title }: { images: string[]; title: string }) {
  if (images.length <= 1) {
    return (
      <img
        src={images[0]}
        alt={title}
        draggable={false}
        className="mx-auto w-full max-w-[72rem] select-none rounded-card [-webkit-user-drag:none]"
      />
    )
  }
  return (
    <div className="grid w-full grid-cols-2 gap-md landscape:grid-cols-1">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${title} — ${i + 1}`}
          draggable={false}
          className="aspect-[4/3] w-full select-none rounded-card bg-white/5 object-cover [-webkit-user-drag:none]"
        />
      ))}
    </div>
  )
}
