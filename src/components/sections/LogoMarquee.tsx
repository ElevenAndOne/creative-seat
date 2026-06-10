import Container from '../ui/Container'

const logos = Array.from({ length: 8 }, (_, i) => `/images/brandlogo-${i + 1}.png`)

export default function LogoMarquee() {
  return (
    <section className="bg-paper py-8">
      <Container>
        <div className="grid grid-cols-2 items-center gap-8 opacity-80 sm:grid-cols-4 lg:grid-cols-8">
          {logos.map((src, i) => (
            <img key={src} src={src} alt={`Client logo ${i + 1}`} className="mx-auto max-h-9 w-auto object-contain grayscale" />
          ))}
        </div>
      </Container>
    </section>
  )
}
