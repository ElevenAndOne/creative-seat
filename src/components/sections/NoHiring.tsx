import Button from '../ui/Button'
import Container from '../ui/Container'
import Em from '../ui/Em'
import Eyebrow from '../ui/Eyebrow'

const roles = [
  ['avatar-pm.png', 'Project Manager'],
  ['avatar-wd.png', 'Web Developer'],
  ['avatar-gd.png', 'Graphic Designer'],
  ['avatar-anim.png', 'Animator'],
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
          <div className="mt-8 grid grid-cols-5 gap-3">
            <img src="/images/nohiring-1.png" alt="Beauty product campaign" className="col-span-2 row-span-2 h-full rounded-lg object-cover" />
            <div className="flex aspect-square items-center justify-center rounded-lg bg-white text-5xl font-serif">Aa</div>
            <div className="col-span-2 flex items-center justify-center gap-3 rounded-lg bg-paper">
              <span className="h-20 w-20 rounded-full bg-lavender" />
              <span className="h-20 w-20 rounded-full bg-mauve" />
              <span className="h-20 w-20 rounded-full bg-black" />
            </div>
            <div className="col-span-2 rounded-lg bg-white p-8 text-3xl font-black uppercase tracking-tight">Glossy Locks</div>
            <img src="/images/nohiring-2.png" alt="Hair campaign visual" className="col-span-3 row-span-2 h-full rounded-lg object-cover" />
          </div>
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
