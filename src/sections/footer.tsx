import Container from '../components/container'
import Wordmark from '../components/wordmark'
import { socials } from '../content'

export default function SiteFooter() {
  return (
    <footer className="bg-coal py-11 text-white">
      <Container className="flex flex-wrap items-center justify-between gap-x-10 gap-y-8 landscape:flex-col">
        <a href="/" aria-label="Creative Seat home">
          <Wordmark spaced className="text-[22px]" />
        </a>
        <nav className="flex flex-wrap gap-[34px] font-inter text-sm" aria-label="Footer navigation">
          <a href="#services" className="transition hover:text-lime">Services</a>
          <a href="#resources" className="transition hover:text-lime">Resources</a>
          <a href="#contact" className="transition hover:text-lime">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          {socials.map((social) => (
            <a key={social.name} href="#contact" className="flex size-[34px] items-center justify-center rounded-full bg-white transition hover:bg-lime" aria-label={social.name}>
              <img src={social.icon} alt="" className={social.size} />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-inter text-[13px] text-[#ccc]">A product of</span>
          <img src="/images/brands/11and1.svg" alt="11&1" className="h-[22px] w-auto" />
        </div>
      </Container>
    </footer>
  )
}
