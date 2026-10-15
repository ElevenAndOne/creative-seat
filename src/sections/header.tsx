import { useEffect, useRef, useState } from 'react'
import Button from '../components/autton'
import Wordmark from '../components/wordmark'
import { cn } from '../utils/cn'
import { contactMail } from '../utils/contact'

// Root-relative, so they work from every page (on the home page they just scroll).
const NAV = [
  { id: 'services', label: 'Services', href: '/#services' },
  { id: 'work', label: 'Our work', href: '/#work' },
  { id: 'resources', label: 'Resources', href: '/#resources' },
  { id: 'pricing', label: 'Pricing', href: '/#pricing' },
]

/** `cta`: where "Get in touch" goes — an email to the studio, unless a page says otherwise. */
export default function SiteHeader({ cta = contactMail }: { cta?: string }) {
  const ref = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  // Over the dark hero the header is Paper on nothing; once the page scrolls
  // past its own height it turns Ink on a frosted Paper backing with a hairline.
  useEffect(() => {
    const onScroll = () => {
      const height = ref.current?.offsetHeight ?? 0
      setScrolled(window.scrollY > height)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      ref={ref}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled ? 'border-line bg-paper/90 text-ink backdrop-blur-md' : 'border-transparent text-paper',
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--container-width)] items-center justify-between gap-6 py-4">
        <a href="/" id="header-logo" data-track="nav_click" data-track-location="header" className="py-1.5">
          <Wordmark className="w-[150px] landscape:w-[124px]" />
        </a>
        <nav className="flex items-center gap-10 text-[0.9375rem] font-medium tablet:hidden" aria-label="Primary navigation">
          {NAV.map(({ id, label, href }) => (
            <a
              key={label}
              href={href}
              id={`header-nav-${id}`}
              data-track="nav_click"
              data-track-location="header"
              className="flex items-center gap-1.5 underline-offset-4 transition hover:underline"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-6 landscape:hidden">
          <Button href={cta} id="header-get-in-touch" data-track="get_in_touch_click" data-track-location="header" variant={scrolled ? 'primary' : 'inverse'}>
            Get in touch
          </Button>
        </div>
      </div>
    </header>
  )
}
