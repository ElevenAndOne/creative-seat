import Container from '../ui/Container'

export default function SiteFooter() {
  return (
    <footer className="bg-black py-14 text-white">
      <Container className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <a href="/" className="text-4xl font-light tracking-wide" aria-label="Creative Seat home">
          <strong className="font-extrabold">Creative</strong> Seat
        </a>
        <nav className="flex flex-wrap gap-10 text-sm text-white/70" aria-label="Footer navigation">
          <a href="#services" className="hover:text-lime">Services</a>
          <a href="#resources" className="hover:text-lime">Resources</a>
          <a href="#contact" className="hover:text-lime">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          {['f', '◎', '▶'].map((label) => (
            <a key={label} href="#contact" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-black" aria-label={`Social link ${label}`}>
              {label}
            </a>
          ))}
          <span className="ml-6 text-sm text-white/70">A product of</span>
          <span className="text-3xl font-black tracking-tighter">11&1</span>
        </div>
      </Container>
    </footer>
  )
}
