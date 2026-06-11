import Button from '../components/autton'
import Container from '../components/container'

export default function SiteHeader() {
  return (
    <header className="relative z-10 py-8 text-white">
      <Container className="flex items-center justify-between gap-6">
        <a href="/" className="text-2xl font-light tracking-wide md:text-[34px]" aria-label="Creative Seat home">
          <strong className="font-extrabold">Creative</strong> Seat
        </a>
        <nav className="hidden items-center gap-14 text-sm text-white/85 lg:flex" aria-label="Primary navigation">
          <a href="#services" className="transition hover:text-lime">Services</a>
          <a href="#work" className="transition hover:text-lime">Our Work</a>
          <a href="#resources" className="transition hover:text-lime">Resources</a>
          <a href="#contact" className="transition hover:text-lime">Pricing</a>
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Button href="#contact" variant="outline-white">Sign Up</Button>
          <Button href="#contact" variant="white">Get In Touch</Button>
          <span className="ml-4 text-2xl font-black tracking-tighter">11&1</span>
        </div>
      </Container>
    </header>
  )
}
