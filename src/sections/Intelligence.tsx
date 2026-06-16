import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'

export default function Intelligence() {
  return (
    <Section pad="md">
      <div className="grid grid-cols-[1.1fr_0.7fr] items-start gap-xlg tablet:grid-cols-1">
        <div>
          <p className="font-medium uppercase tracking-[0.18em]">Human-led. AI-enhanced.</p>
          <h2 className="mt-bg max-w-[48rem] text-h2 font-light">
            Talented people, <Em className="text-grape">powered</Em> by intelligence
          </h2>
        </div>
        <div>
          <p className="max-w-[33rem] text-2xl leading-snug">AI tools streamline workflows to deliver better work, faster.</p>
          <div className="mt-xlg flex flex-wrap gap-sm">
            <Button href="#contact" variant="black">Get In Touch</Button>
            <Button href="#mia" variant="outline-black">Learn more about MIA</Button>
          </div>
        </div>
      </div>

      {/* Each PNG is decorative artwork only; all copy below is live HTML text. */}
      <div id="mia" className="mt-xxlg grid grid-cols-[0.9fr_1.8fr] gap-bg tablet:grid-cols-1">
        {/* Mia — gradient + transparent logo */}
        <article className="bg-mia relative row-span-2 flex h-full min-h-[30rem] flex-col justify-between overflow-hidden rounded-card p-xlg text-white tablet:row-span-1 tablet:h-auto">
          <h3 className="max-w-[21rem] text-2xl font-medium leading-snug">
            Creative decisions driven by data, not guesswork
          </h3>
          <img src="/images/mia-square.png" alt="" className="mx-auto my-xbg w-32 drop-shadow-2xl" />
          <p className="max-w-[26rem] leading-relaxed text-white/90">
            <strong className="font-semibold">Mia</strong> is Creative Seat's integrated marketing intelligence agent that analyses the data from all your channels, identifies immediate opportunities and provides actionable insights.
          </p>
        </article>

        {/* AI tools — sky panel + hands artwork */}
        <article className="bg-sky relative flex h-[21.25rem] flex-row overflow-hidden rounded-card tablet:h-[20rem] landscape:h-auto landscape:flex-col">
          <div className="relative z-10 flex w-[60%] flex-col justify-center p-xlg landscape:w-full landscape:p-xbg">
            <h3 className="max-w-[29rem] text-3xl font-medium leading-snug text-ink tablet:text-2xl">
              AI tools remove the repetitive so talented people can create the remarkable.
            </h3>
            <p className="mt-sm max-w-[26rem] text-sm leading-relaxed text-ink-soft">
              Our purpose-built AI studio automates repetitive tasks and project administration, giving creatives more time to focus on ideas, craft, and high-quality design.
            </p>
          </div>
          <img
            src="/images/placeholder.svg"
            alt=""
            className="absolute inset-y-0 right-0 h-full w-[50%] object-cover object-right landscape:static landscape:h-44 landscape:w-[62%] landscape:self-end"
          />
        </article>

        <div className="grid grid-cols-2 gap-bg portrait:grid-cols-1">
          {/* AI knowledge — grape card; grape scrims hide baked text on artwork */}
          <article className="relative h-[21.25rem] overflow-hidden rounded-card bg-grape text-white tablet:h-[20rem]">
            <img src="/images/placeholder.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 h-[40%]" style={{ background: 'linear-gradient(to bottom, var(--color-grape) 0%, var(--color-grape) 80%, transparent 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 h-[42%]" style={{ background: 'linear-gradient(to top, var(--color-grape) 0%, var(--color-grape) 66%, transparent 100%)' }} />
            <h3 className="absolute inset-x-0 top-0 z-10 max-w-[17rem] p-bg text-xl font-medium leading-snug">
              An AI knowledge system that understands your brand.
            </h3>
            <p className="absolute inset-x-0 bottom-0 z-10 p-bg text-[13px] leading-relaxed text-white/90">
              Every brief, revision, and approved asset strengthens your brand knowledge, helping future projects move faster and with greater accuracy.
            </p>
          </article>

          {/* AI automations — gradient + live HTML checklist */}
          <article className="bg-flow relative flex h-[21.25rem] flex-col justify-between overflow-hidden rounded-card p-xbg text-white tablet:h-[20rem]">
            <h3 className="max-w-[16rem] text-2xl font-medium leading-snug">
              Smart automations. Less friction.
            </h3>
            <ul className="mt-bg space-y-xsm self-end rounded-2xl bg-white/15 p-sm backdrop-blur-sm">
              {['Sharpen briefs', 'Organise assets', 'Reduce admin', 'Minimise reverts'].map((item) => (
                <li key={item} className="flex items-center gap-xsm rounded-full bg-white py-1.5 pl-2 pr-md text-xs font-medium text-ink">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime text-[9px] font-bold text-black">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <Button href="#contact" className="mt-xlg">Book a Demo</Button>
    </Section>
  )
}
