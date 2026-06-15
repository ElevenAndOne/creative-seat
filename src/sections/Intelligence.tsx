import Button from '../components/autton'
import Container from '../components/container'
import Em from '../components/em'

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

        {/* Cards carry live, selectable copy. Decorative artwork from the source
            PNGs is kept as a backdrop, with the baked-in text hidden under
            colour-matched scrims so only the HTML text reads. */}
        <div id="mia" className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-[0.9fr_1.8fr]">
          {/* Mia — rebuilt on a gradient with the standalone (transparent) logo. */}
          <article
            className="relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-card p-10 text-white lg:row-span-2 lg:h-full"
            style={{ background: 'linear-gradient(157deg, #7a2fa6 0%, #a82a86 46%, #cb1f6b 100%)' }}
          >
            <h3 className="max-w-[330px] text-2xl font-medium leading-snug">
              Creative decisions driven by data, not guesswork
            </h3>
            <img src="/images/placeholder.svg" alt="" className="mx-auto my-8 w-32 drop-shadow-2xl" />
            <p className="max-w-[420px] leading-relaxed text-white/90">
              <strong className="font-semibold">Mia</strong> is Creative Seat's integrated marketing intelligence agent
              that analyses the data from all your channels, identifies immediate opportunities and provides actionable
              insights.
            </p>
          </article>

          {/* AI tools — light-blue text panel butts up against the hands artwork. */}
          <article className="relative flex flex-col overflow-hidden rounded-card sm:h-[320px] sm:flex-row lg:h-[340px]" style={{ backgroundColor: '#a8d7e9' }}>
            <div className="relative z-10 flex flex-col justify-center p-8 sm:w-[60%] lg:p-10">
              <h3 className="max-w-[460px] text-2xl font-medium leading-snug text-[#103a4a] lg:text-3xl">
                AI tools remove the repetitive so talented people can create the remarkable.
              </h3>
              <p className="mt-5 max-w-[420px] text-sm leading-relaxed text-[#1c4456]">
                Our purpose-built AI studio automates repetitive tasks and project administration, giving creatives more
                time to focus on ideas, craft, and high-quality design.
              </p>
            </div>
            <img
              src="/images/placeholder.svg"
              alt=""
              className="h-44 w-[62%] self-end object-cover object-right sm:absolute sm:inset-y-0 sm:right-0 sm:h-full sm:w-[50%] sm:self-auto"
            />
          </article>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* AI knowledge — solid grape; baked text hidden under grape scrims. */}
            <article className="relative h-[320px] overflow-hidden rounded-card bg-grape text-white lg:h-[340px]">
              <img src="/images/placeholder.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
              <h3 className="absolute inset-x-0 top-0 z-10 max-w-[270px] p-7 text-xl font-medium leading-snug">
                An AI knowledge system that understands your brand.
              </h3>
              <p className="absolute inset-x-0 bottom-0 z-10 p-7 text-[13px] leading-relaxed text-white/90">
                Every brief, revision, and approved asset strengthens your brand knowledge, helping future projects move
                faster and with greater accuracy.
              </p>
            </article>

            {/* AI automations — gradient with a live HTML checklist (no baked image). */}
            <article
              className="relative flex h-[320px] flex-col justify-between overflow-hidden rounded-card p-8 text-white lg:h-[340px]"
              style={{ background: 'linear-gradient(125deg, #0c3b34 0%, #157064 52%, #4fd3bf 100%)' }}
            >
              <h3 className="max-w-[260px] text-2xl font-medium leading-snug">
                Smart automations. Less friction.
              </h3>
              <ul className="mt-6 space-y-2 self-end rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                {['Sharpen briefs', 'Organise assets', 'Reduce admin', 'Minimise reverts'].map((item) => (
                  <li key={item} className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-2 pr-4 text-xs font-medium text-ink">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime text-[9px] font-bold text-black">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <Button href="#contact" className="mt-12">Book a Demo</Button>
      </Container>
    </section>
  )
}
