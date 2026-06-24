import Container from '../components/container'
import { socials } from '../content'

export default function SiteFooter() {
  return (
    <footer className="bg-black py-14 text-white">
      <Container className="flex flex-row items-center justify-between gap-10 landscape:flex-col landscape:items-start">
        <a href="/" aria-label="Creative Seat home">
          <img src="/images/brands/creative-seat.svg" alt="Creative Seat" className="h-9 w-auto" />
        </a>
        <nav className="flex flex-wrap gap-10 text-sm text-white/70" aria-label="Footer navigation">
          <a href="#services" className="hover:text-lime">Services</a>
          <a href="#resources" className="hover:text-lime">Resources</a>
          <a href="#contact" className="hover:text-lime">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          {socials.map((social) => (
            <a key={social.name} href="#contact" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-lime hover:bg-white/5" aria-label={social.name}>
              <img src={social.icon} alt="" className="h-5 w-5" />
            </a>
          ))}
          <span className="ml-6 text-sm text-white/70">A product of</span>
          <img src="/images/brands/11and1.svg" alt="11&1" className="h-7 w-auto" />
        </div>
      </Container>
    </footer>
  )
}
