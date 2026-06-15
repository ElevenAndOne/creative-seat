import Button from '../components/autton'
import Container from '../components/container'
import Em from '../components/em'

const work = [
  ['placeholder.svg', 'Dried Fruit South Africa', 'Motion Design, Social Media Creative, Ad Creative, Video Production', 'lg:col-span-2'],
  ['placeholder.svg', 'DuToit Agri', 'Motion Design, Social Media Creative, Ad Creative', ''],
  ['placeholder.svg', 'CherryTime', 'Motion Design, Social Media Creative, Ad Creative, Video Production', ''],
  ['placeholder.svg', 'Onvlee Engineering', 'Motion Design, Social Media Creative, Ad Creative', ''],
  ['placeholder.svg', 'Holiday', 'Motion Design, Social Media Creative, Ad Creative', ''],
  ['placeholder.svg', 'Daniel Wellington', 'Motion Design, Social Media Creative, Ad Creative', 'lg:col-span-2'],
]

export default function WorkShowcase() {
  return (
    <section id="work" className="bg-paper py-20 md:py-32">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-medium uppercase tracking-[0.18em]">Take a look at our work</p>
            <h2 className="mt-8 max-w-[820px] text-5xl font-light leading-tight text-grape md:text-h2">
              <Em>Trusted</Em> by global brands to deliver their vision
            </h2>
          </div>
          <Button href="#contact" variant="outline-black" className="mt-10">Download our portfolio</Button>
        </div>
        <div className="mt-20 grid gap-x-6 gap-y-12 lg:grid-cols-4">
          {work.map(([src, title, meta, span]) => (
            <article key={title} className={span}>
              <img src={`/images/${src}`} alt={`${title} project`} className="h-60 w-full rounded-lg object-cover sm:h-72 lg:h-[320px]" />
              <h3 className="mt-7 text-3xl font-medium">{title}</h3>
              <p className="mt-3 text-sm text-smoke">{meta}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
