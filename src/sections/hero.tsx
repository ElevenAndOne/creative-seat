import { motion, useReducedMotion } from 'motion/react'
import Button from '../components/autton'
import { Section } from '../components/base/section'
import Heading from '../components/heading'
import HeroStack from '../components/hero-stack'
import Paragraph from '../components/paragraph'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const reduce = useReducedMotion() ?? false

  // Copy rises in just ahead of the cards. The props must be the same on server
  // and client (the reduced-motion preference is only known in the browser, and
  // React won't patch a mismatched `style` on hydration, leaving the copy
  // invisible), so reduced motion just makes the transition instant.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay },
  })

  return (
    <Section
      className="isolate overflow-hidden bg-night text-snow"
      pad="none"
      innerClassName="grid grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] items-center gap-5 pt-[clamp(7.5rem,6.43rem+5.36vw,10.5rem)] pb-[clamp(3.5rem,2.82rem+3.39vw,5.625rem)] tablet:grid-cols-1 tablet:gap-xxlg"
    >
      <div className="flex flex-col items-start">
        <motion.div {...rise(0.05)}>
          <Heading.H1 className="max-w-[32rem]">
            Increase your brands <span className="font-semibold text-mint">creative capability.</span>
          </Heading.H1>
        </motion.div>
        <motion.div {...rise(0.18)} className="mt-[14px] max-w-[27rem]">
          <Paragraph.Big className="text-whisper">
            Scale your brands content production through a simple subscription to your very own specialised creative team.
          </Paragraph.Big>
        </motion.div>
        <motion.div {...rise(0.31)} className="mt-[38px] landscape:w-full">
          <Button href="#contact">Book a Demo</Button>
        </motion.div>
      </div>

      <HeroStack className="mx-auto max-w-[34.66rem]" />
    </Section>
  )
}
