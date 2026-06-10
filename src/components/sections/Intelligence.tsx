import Button from '../ui/Button'
import Container from '../ui/Container'
import Em from '../ui/Em'

export default function Intelligence() {
  return (
    <section className="bg-paper py-20 md:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr] lg:items-start">
          <div>
            <p className="font-medium uppercase tracking-[0.18em]">Human-led. AI-enhanced.</p>
            <h2 className="mt-8 max-w-[760px] text-5xl font-light leading-tight md:text-h2">
              Talented people, <Em className="text-grape">powered</Em> by intelligence
            </h2>
          </div>
          <div>
            <p className="max-w-[520px] text-2xl leading-snug">AI tools streamline workflows to deliver better work, faster.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#contact" variant="black">Get In Touch</Button>
              <Button href="#mia" variant="outline-black">Learn more about MIA</Button>
            </div>
          </div>
        </div>
        <div id="mia" className="mt-20 grid gap-6 lg:grid-cols-[0.9fr_1.8fr]">
          <article className="relative overflow-hidden rounded-card bg-grape p-10 text-white lg:row-span-2">
            <img src="/images/ai-mia.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between">
              <h3 className="max-w-[360px] text-3xl font-medium leading-tight">Creative decisions driven by data, not guesswork</h3>
              <p className="max-w-[420px] leading-relaxed"><strong>Mia</strong> is CreativeSeat's integrated marketing Intelligence agent that analyses the data from all your channels, identifies immediate opportunities and provides actionable insights.</p>
            </div>
          </article>
          <article className="relative overflow-hidden rounded-card bg-mint p-10">
            <img src="/images/ai-tools.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="relative max-w-[470px]">
              <h3 className="text-3xl font-medium leading-tight">AI tools remove the repetitive so that talented people can create the remarkable.</h3>
              <p className="mt-8 leading-relaxed">Our purpose-built AI studio automates repetitive tasks and project administration, giving creatives more time to focus on ideas, craft, and high-quality design.</p>
            </div>
          </article>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-card bg-grape p-10 text-white">
              <h3 className="max-w-[460px] text-3xl font-medium leading-tight">An AI knowledge system that understands your brand.</h3>
              <img src="/images/ai-knowledge.png" alt="" className="my-9 max-h-28 w-auto" />
              <p className="leading-relaxed text-white/90">Every brief, revision, and approved asset strengthens your brand knowledge, helping future projects move faster and with greater accuracy.</p>
            </article>
            <article className="relative overflow-hidden rounded-card p-10 text-white">
              <img src="/images/ai-automations.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
              <h3 className="relative max-w-[320px] text-3xl font-medium leading-tight">Smart automations. Less friction.</h3>
            </article>
          </div>
        </div>
        <Button href="#contact" className="mt-12">Book a Demo</Button>
      </Container>
    </section>
  )
}
