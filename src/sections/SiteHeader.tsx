import { useEffect, useRef, useState } from 'react'
import Button from '../components/autton'
import Container from '../components/container'
import { cn } from '../utils/cn'

export default function SiteHeader() {
  const ref = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  // Once the page scrolls past the header's own height, give it a solid purple
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
    <header
      ref={ref}
      className={cn(
        'fixed inset-x-0 top-0 z-50 py-8 text-white transition-colors duration-300',
        scrolled && 'bg-grape',
      )}
    >
      <Container className="flex items-center justify-between gap-6">
        <a href="/" aria-label="Creative Seat home">
          <img src="/images/brands/creative-seat.svg" alt="Creative Seat" className="h-7 w-auto landscape:h-6" />
        </a>
        <nav className="flex items-center gap-14 text-sm text-white/85 tablet:hidden" aria-label="Primary navigation">
          <a href="#services" className="transition hover:text-lime">Services</a>
          <a href="#work" className="transition hover:text-lime">Our Work</a>
          <a href="#resources" className="transition hover:text-lime">Resources</a>
          <a href="#contact" className="transition hover:text-lime">Pricing</a>
        </nav>
        <div className="flex items-center gap-2 landscape:hidden">
          <Button href="#contact" variant="outline-white">Sign Up</Button>
          <Button href="#contact" variant="white">Get In Touch</Button>
          <img src="/images/brands/11and1.svg" alt="11&1" className="ml-4 h-6 w-auto" />
        </div>
      </Container>
    </header>
  )
}
