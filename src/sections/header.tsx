import { Dialog } from '@base-ui/react/dialog'
import { useEffect, useRef, useState } from 'react'
import LinkButton from '../components/link-button'
import Wordmark from '../components/wordmark'
import { cn } from '../utils/cn'
import { demoPage } from '../utils/contact'
import { navigation } from '../content/navigation'
import MotionToggle from '../components/motion-toggle'

// Root-relative, so they work from every page (on the home page they just scroll).

/** `cta`: where "Get in touch" goes — the booking page, unless a page says otherwise. */
export default function SiteHeader({ cta = demoPage }: { cta?: string }) {
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
          {navigation.map(({ id, label, href }) => (
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
        <div className="flex items-center gap-3">
          <LinkButton href={cta} id="header-get-in-touch" data-track="get_in_touch_click" data-track-location="header" variant={scrolled ? 'primary' : 'inverse'} className="landscape:hidden">
            Get in touch
          </LinkButton>
          <MobileNavigation cta={cta} />
        </div>
      </div>
    </header>
  )
}

/** Base UI owns focus trapping, Escape dismissal and focus return. */
function MobileNavigation({ cta }: { cta: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 62.001rem)')
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger id="header-menu" className="hidden h-11 items-center gap-2 rounded-full border border-current/40 px-4 text-p-sm font-medium tablet:inline-flex">
        Menu
        <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h14M3 14h14" /></svg>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[80] bg-ink/55 backdrop-blur-sm transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-[81] flex w-full max-w-[24rem] flex-col overflow-y-auto bg-paper p-6 text-ink shadow-2xl outline-none transition-[translate,opacity] duration-200 data-[starting-style]:translate-x-8 data-[starting-style]:opacity-0 data-[ending-style]:translate-x-8 data-[ending-style]:opacity-0">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
            <Dialog.Title className="text-h4 font-semibold">Explore Creative Seat</Dialog.Title>
            <Dialog.Close aria-label="Close menu" className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:bg-chalk">
              <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 4 12 12M16 4 4 16" /></svg>
            </Dialog.Close>
          </div>
          <nav aria-label="Mobile navigation" className="my-6 flex flex-col">
            {navigation.map(({ id, href, label }) => (
              <a key={id} id={`header-mobile-${id}`} href={href} onClick={() => setOpen(false)} data-track="nav_click" data-track-location="mobile_header" className="border-b border-line py-5 text-h3 font-medium hover:text-muted">{label}</a>
            ))}
          </nav>
          <MotionToggle className="mb-6 self-start text-muted" />
          <LinkButton href={cta} id="header-mobile-get-in-touch" onClick={() => setOpen(false)} data-track="get_in_touch_click" data-track-location="mobile_header" full className="mt-auto">Book a demo</LinkButton>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
