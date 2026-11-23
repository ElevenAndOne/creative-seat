import { Dialog } from '@base-ui/react/dialog'
import { useEffect, useState, type KeyboardEvent } from 'react'
import LinkButton from '../components/link-button'
import Wordmark from '../components/wordmark'
import { cn } from '../utils/cn'
import { demoPage } from '../utils/contact'
import { navigation } from '../content/navigation'
import MotionToggle from '../components/motion-toggle'

/**
 * The Figma navbar (Version=02): a floating Paper pill 24px from the top (20px
 * on mobile), as wide as the content column plus 20px either side. Wordmark
 * left, the three section links 12px apart (spacing/md), then "Book a demo"
 * in the Ink pill. Below desktop the controls are 44px tall. A soft shadow
 * lifts it off the page once it scrolls.
 *
 * `cta`: where "Book a demo" goes — the booking page, unless a page says otherwise.
 */
export default function SiteHeader({ cta = demoPage }: { cta?: string }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-6 portrait:top-5 z-50">
      <div
        className={cn(
          'pointer-events-auto mx-auto flex w-[min(calc(var(--container-width)+2.5rem),calc(100%-1.5rem))] items-center justify-between gap-6 rounded-full bg-paper p-1 text-ink transition-shadow duration-300',
          scrolled ? 'shadow-[0_8px_24px_-8px_rgb(24_27_30/0.18)]' : 'shadow-none',
        )}
      >
        <a href="/" id="header-logo" data-track="nav_click" data-track-location="header" className="-mr-2 flex h-10 items-center rounded-full pr-2 pl-4 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-0">
          <Wordmark className="w-[120px]" />
        </a>
        <nav className="flex items-center gap-0 text-ui tablet:hidden" aria-label="Primary navigation">
          {navigation.map(({ id, label, href }) => (
            <a
              key={id}
              href={href}
              id={`header-nav-${id}`}
              data-track="nav_click"
              data-track-location="header"
              className="flex h-10 items-center rounded-full px-1.5 underline-offset-4 transition hover:underline focus-visible:outline-2 focus-visible:outline-ink"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <LinkButton href={cta} id="header-get-in-touch" data-track="get_in_touch_click" data-track-location="header" className="landscape:hidden focus-visible:outline-paper focus-visible:-outline-offset-4">
            Book a demo
          </LinkButton>
          <MobileNavigation cta={cta} />
        </div>
      </div>
    </header>
  )
}

/**
 * Base UI owns focus trapping, Escape dismissal and focus return. The dialog
 * portals into its own <body> child, and while it is open every other <body>
 * child is made `inert`, so Tab can never reach the (aria-hidden) page behind it.
 */
function MobileNavigation({ cta }: { cta: string }) {
  const [open, setOpen] = useState(false)
  const [layer, setLayer] = useState<HTMLElement | null>(null)

  // The layer is made on the first open (never during SSR) and removed with the header.
  const onOpenChange = (next: boolean) => {
    if (next && !layer) {
      const el = document.createElement('div')
      el.dataset.headerMenuLayer = ''
      document.body.append(el)
      setLayer(el)
    }
    setOpen(next)
  }
  useEffect(() => () => layer?.remove(), [layer])

  useEffect(() => {
    if (!open || !layer) return
    const made = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el !== layer && el instanceof HTMLElement && !el.inert,
    )
    made.forEach((el) => { el.inert = true })
    // Lifted as soon as the dialog starts closing, so Base UI can return focus to #header-menu.
    return () => made.forEach((el) => { el.inert = false })
  }, [open, layer])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 62.001rem)')
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger id="header-menu" className="hidden h-10 tablet:h-11 items-center gap-2 rounded-full px-4 text-ui font-medium transition-colors hover:bg-chalk focus-visible:outline-2 focus-visible:outline-ink tablet:inline-flex">
        Menu
        <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h14M3 14h14" /></svg>
      </Dialog.Trigger>
      <Dialog.Portal container={layer}>
        <Dialog.Backdrop className="fixed inset-0 z-[80] bg-ink/55 backdrop-blur-sm transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup onKeyDown={wrapTab} className="fixed inset-y-0 right-0 z-[81] flex w-full max-w-[24rem] flex-col overflow-y-auto bg-paper p-6 text-ink shadow-2xl outline-none transition-[translate,opacity] duration-200 data-[starting-style]:translate-x-8 data-[starting-style]:opacity-0 data-[ending-style]:translate-x-8 data-[ending-style]:opacity-0">
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

const TABBABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Wrap Tab at the panel's ends ourselves rather than via Base UI's focus guards,
 * which can briefly drop focus to <body> on the way round.
 */
function wrapTab(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== 'Tab') return
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(TABBABLE)).filter((el) => el.getClientRects().length > 0)
  if (items.length === 0) return
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  if (event.shiftKey && (active === first || active === event.currentTarget)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}
