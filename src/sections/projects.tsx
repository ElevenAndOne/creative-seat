import { useEffect, useRef, useState } from 'react'
import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'
import Heading from '../components/heading'
import ProjectMedia from '../components/project-media'
import ProjectViewer, { Arrow } from '../components/project-viewer'
import { projectSlug, showcasedProjects } from '../content'
import { track } from '../utils/analytics'

/** Deep links look like `/#work-cherry-time`. */
const HASH = /^#work-([a-z0-9-]+)$/

/** Report a project view: `method` is how it was reached — its card, the viewer's next-project card, or a deep link. */
const trackView = (i: number, method: 'card' | 'next' | 'deep_link') =>
  track('view_project', { project_name: showcasedProjects[i].title, method })

/** Mirror the open project in the URL without adding history entries. */
function setHash(slug: string | null) {
  try {
    history.replaceState(null, '', slug ? `#work-${slug}` : location.pathname + location.search)
  } catch {
    // Some embedded browsers refuse history changes; the viewer works without them.
  }
}

export default function WorkShowcase() {
  const [index, setIndex] = useState<number | null>(null)
  const [origin, setOrigin] = useState<string | null>(null)
  const cards = useRef<(HTMLButtonElement | null)[]>([])
  /** The project last shown in the viewer, whose card takes focus back on close. */
  const shown = useRef<number | null>(null)

  /** The card's media box as a clip-path inset — or null when it's off screen, so the viewer fades instead. */
  const insetOf = (i: number) => {
    const el = cards.current[i]?.querySelector('[data-media]')
    if (!el) return null
    const r = el.getBoundingClientRect()
    const { clientWidth: vw, clientHeight: vh } = document.documentElement
    if (r.bottom <= 0 || r.top >= vh) return null
    return `${r.top}px ${vw - r.right}px ${vh - r.bottom}px ${r.left}px`
  }

  const open = (i: number, fromCard: boolean) => {
    setOrigin(fromCard ? insetOf(i) : null)
    setIndex(i)
    shown.current = i
    setHash(projectSlug(showcasedProjects[i]))
    trackView(i, 'card')
  }
  const navigate = (i: number) => {
    setIndex(i)
    shown.current = i
    setHash(projectSlug(showcasedProjects[i]))
    trackView(i, 'next')
  }
  const close = () => {
    // Shrink back into whichever project is showing now — it may not be the card that was clicked.
    if (index !== null) setOrigin(insetOf(index))
    setIndex(null)
    setHash(null)
  }

  // Open the project a deep link points at, on load and on later hash changes.
  useEffect(() => {
    const fromHash = () => {
      const slug = location.hash.match(HASH)?.[1]
      const i = showcasedProjects.findIndex((p) => projectSlug(p) === slug)
      if (i > -1) {
        setOrigin(null)
        setIndex(i)
        shown.current = i
        trackView(i, 'deep_link')
      }
    }
    const raf = requestAnimationFrame(fromHash)
    window.addEventListener('hashchange', fromHash)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('hashchange', fromHash)
    }
  }, [])

  return (
    <Section id="work" pad="md">
      <div className="border-t border-ink pt-xlg">
        <Eyebrow>Take a look at our work</Eyebrow>
        <div className="mt-4 flex items-end justify-between gap-bg landscape:flex-col landscape:items-start">
          <Heading.H1 className="max-w-[24ch]">
            Trusted by market leaders <Em>to deliver their vision.</Em>
          </Heading.H1>
          <Button href="#contact" id="work-download-portfolio" data-track="download_portfolio_click" data-track-location="work" variant="outline" className="shrink-0">
            Download our portfolio
          </Button>
        </div>
      </div>

      <div className="mt-[56px] grid grid-cols-3 gap-x-[30px] gap-y-[34px] tablet:grid-cols-2 portrait:grid-cols-1">
        {showcasedProjects.map((project, i) => (
          <button
            key={project.title}
            ref={(el) => { cards.current[i] = el }}
            id={`work-card-${projectSlug(project)}`}
            type="button"
            onClick={() => open(i, true)}
            aria-label={`View ${project.title} project`}
            className="group block w-full text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <div data-media className="relative isolate aspect-[340/230] overflow-hidden rounded-md bg-chalk">
              <ProjectMedia
                src={project.cover}
                poster={project.poster}
                alt=""
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-glide group-hover:scale-[1.045] group-focus-visible:scale-[1.045]"
              />
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-45% to-ink/55 opacity-0 transition-opacity duration-[400ms] ease-glide group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="absolute bottom-4 left-4 z-[1] inline-flex h-9 translate-y-2 items-center gap-2 rounded-full bg-paper pl-4 pr-3.5 text-[13px] font-medium leading-none text-ink opacity-0 transition-[opacity,translate] duration-[350ms,450ms] ease-glide group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                View project
                <span className="transition-transform duration-[350ms] ease-glide group-hover:translate-x-[3px]"><Arrow /></span>
              </span>
            </div>
            <Heading.H4 as="h3" className="mt-[19px]">{project.title}</Heading.H4>
            <p className="mt-1.5 text-p-xs text-muted">{project.tags.join(', ')}</p>
          </button>
        ))}
      </div>

      <ProjectViewer
        projects={showcasedProjects}
        index={index}
        origin={origin}
        onNavigate={navigate}
        onClose={close}
        returnFocus={() => (shown.current === null ? null : cards.current[shown.current])}
      />
    </Section>
  )
}
