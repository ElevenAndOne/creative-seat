import Button from '../components/autton'
import Container from '../components/container'
import Em from '../components/em'

const tiles = [
  ['hero-tile-tl.png', 'Brand campaign shown on a phone'],
  ['hero-tile-tc.png', 'Styled food photography'],
  ['hero-tile-tr.png', 'Laptop with presentation creative'],
  ['hero-tile-bl.png', 'Reddit campaign creative'],
  ['hero-tile-bc.png', 'Product launch kit'],
  ['hero-tile-br.png', 'Jewellery campaign image'],
]

export default function Hero() {
  return (
    <section className="overflow-hidden pb-20 pt-20 text-white md:pb-28 md:pt-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="max-w-[620px] text-5xl font-light leading-[1.08] tracking-normal md:text-display">
            Increase your brands creative <Em className="text-lime">capability.</Em>
          </h1>
          <p className="mt-8 max-w-[520px] text-lg leading-relaxed text-white/90 md:text-xl">
            Scale your brands content production through a simple subscription to your very own specialised creative team.
          </p>
          <Button href="#contact" className="mt-10">Book a Demo</Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-7">
          {tiles.map(([src, alt], index) => (
            <img
              key={src}
              src={`/images/${src}`}
              alt={alt}
              className={`aspect-square w-full rounded-card object-cover shadow-2xl shadow-black/20 ${index === 1 || index === 4 ? 'md:translate-y-16' : ''}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
