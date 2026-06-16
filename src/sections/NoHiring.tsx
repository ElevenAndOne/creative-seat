import Button from '../components/autton'
import { Section } from '../components/base/section'
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
    <Section pad="md" innerClassName="grid grid-cols-2 items-center gap-xlg tablet:grid-cols-1">
      <div>
        <div className="grid grid-cols-2 gap-md portrait:grid-cols-1">
          {roles.map(([avatar, role]) => (
            <div key={role} className="flex items-center gap-md rounded-lg bg-black p-sm text-xl text-white">
              <img src={`/images/${avatar}`} alt="" className="h-12 w-12 rounded-lg object-cover" />
              {role}
            </div>
          ))}
        </div>
        <img
          src="/images/placeholder.svg"
          alt="Campaign creative produced by a Creative Seat specialist team"
          className="mt-md aspect-[4/3] w-full rounded-card object-cover"
        />
      </div>
      <div>
        <Eyebrow>Instant access to the skills you need</Eyebrow>
        <h2 className="mt-xlg max-w-[42rem] text-h2 font-light">
          No hiring. No training. No added <Em className="text-grape">complexity.</Em>
        </h2>
        <p className="mt-xbg text-2xl">Your team of creative specialists are already in place.</p>
        <p className="mt-bg max-w-[40rem] leading-relaxed">
          <strong>Creative Seat</strong> tailors a team of experienced talent to the type of content you need. Whether you require digital, video, web, animation or brand design, simply brief your designated project manager and your specialised team gets to work.
        </p>
        <Button href="#contact" className="mt-xlg">Book a Demo</Button>
      </div>
    </Section>
  )
}
