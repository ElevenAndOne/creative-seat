import { useEffect, useRef, useState } from 'react'
import Button from '../components/autton'
import Wordmark from '../components/wordmark'
import { cn } from '../utils/cn'

const NAV = [
  { label: 'Services', href: '#services', menu: true },
  { label: 'Our Work', href: '#work' },
  { label: 'Resources', href: '#resources' },
  { label: 'Pricing', href: '#contact', menu: true },
]

export default function SiteHeader() {
  const ref = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  // Once the page scrolls past the header's own height, give it a solid Cinder
  // background (it sits transparent over the hero gradient until then).
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
    <header ref={ref} className={cn('fixed inset-x-0 top-0 z-50 text-snow transition-colors duration-300', scrolled && 'bg-ink/95 backdrop-blur-md')}>
      <div className="flex items-center justify-between gap-6 px-[var(--container-margin)] py-5">
        <a href="/" aria-label="Creative Seat home">
          <Wordmark className="text-2xl landscape:text-xl" />
        </a>
        <nav className="flex items-center gap-11 text-sm font-medium tablet:hidden" aria-label="Primary navigation">
          {NAV.map(({ label, href, menu }) => (
            <a key={label} href={href} className="flex items-center gap-1.5 transition hover:text-lime">
              {label}
              {menu && <img src="/images/icons/chevron-down.svg" alt="" className="h-1.5 w-2.5" />}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3.5 landscape:hidden">
          <Button href="#contact" variant="outline-white" size="sm">Sign Up</Button>
          <Button href="#contact" variant="white" size="sm">Get In Touch</Button>
        </div>
      </div>
    </header>
  )
}
