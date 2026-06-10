import Container from '../ui/Container'
import Em from '../ui/Em'

const testimonials = [
  ['testimonial-avatar-1.png', 'testimonial-logo-1.png', 'Anja Niewoudt', 'Senior Designer, Onlvee Engineering'],
  ['testimonial-avatar-2.png', 'testimonial-logo-2.png', 'Michael Reddy', 'Marketing Lead, Sojern'],
  ['testimonial-avatar-3.png', 'testimonial-logo-3.png', 'Tara Naidoo', 'Growth Manager, Finmap'],
]

export default function Testimonials() {
  return (
    <section className="bg-paper py-20 md:py-32">
      <Container>
        <p className="text-center font-medium uppercase tracking-[0.18em]">Redefining success. Together.</p>
        <h2 className="mt-8 text-center text-5xl font-light leading-tight md:text-h2">
          Why teams <Em className="text-grape">choose</Em> Creative Seat
        </h2>
        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {testimonials.map(([avatar, logo, name, role]) => (
            <article key={name} className="flex min-h-[520px] flex-col rounded-card border-2 border-grape bg-white p-8 md:p-10">
              <div className="flex items-center gap-7">
                <img src={`/images/${avatar}`} alt="" className="h-24 w-24 rounded-lg object-cover" />
                <div>
                  <h3 className="text-2xl font-medium">{name}</h3>
                  <p className="mt-1 text-sm text-smoke">{role}</p>
                </div>
              </div>
              <p className="mt-14 max-w-[420px] text-lg leading-relaxed text-ink-soft">
                "CreativeSeat has fundamentally changed how we approach creative production. Instead of managing freelancers, juggling timelines, and worrying about capacity, we now have immediate access to the specialist expertise we need through one simple workflow."
              </p>
              <img src={`/images/${logo}`} alt="" className="mt-auto max-h-10 w-fit object-contain opacity-75" />
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
