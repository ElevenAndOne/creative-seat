import Button from '../components/autton'
import Container from '../components/container'
import Em from '../components/em'
import Eyebrow from '../components/eyebrow'

const roles = [
  ['placeholder.svg', 'Project Manager'],
  ['placeholder.svg', 'Web Developer'],
  ['placeholder.svg', 'Graphic Designer'],
  ['placeholder.svg', 'Animator'],
]

export default function NoHiring() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {roles.map(([avatar, role]) => (
              <div key={role} className="flex items-center gap-4 rounded-lg bg-black p-3 text-xl text-white">
                <img src={`/images/${avatar}`} alt="" className="h-12 w-12 rounded-lg object-cover" />
                {role}
              </div>
            ))}
          </div>
          <img
            src="/images/placeholder.svg"
            alt="Campaign creative produced by a Creative Seat specialist team"
            className="mt-4 aspect-[4/3] w-full rounded-card object-cover"
          />
        </div>
        <div>
          <Eyebrow>Instant access to the skills you need</Eyebrow>
          <h2 className="mt-10 max-w-[680px] text-5xl font-light leading-tight md:text-h2">
            No hiring. No training. No added <Em className="text-grape">complexity.</Em>
          </h2>
          <p className="mt-8 text-2xl">Your team of creative specialists are already in place.</p>
          <p className="mt-7 max-w-[650px] leading-relaxed">
            <strong>Creative Seat</strong> tailors a team of experienced talent to the type of content you need. Whether you require digital, video, web, animation or brand design, simply brief your designated project manager and your specialised team gets to work.
          </p>
          <Button href="#contact" className="mt-10">Book a Demo</Button>
        </div>
      </Container>
    </section>
  )
}
