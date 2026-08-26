import { motion, useReducedMotion } from 'motion/react'
import AnimatedGradient from '../components/animated-gradient'
import Button from '../components/autton'
import { Section } from '../components/base/section'
import Em from '../components/em'
import Heading from '../components/heading'
import HeroGrid from '../components/hero-grid/HeroGrid'
import Paragraph from '../components/paragraph'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const reduce = useReducedMotion() ?? false

  // Copy rises in just ahead of the cards; skipped entirely under reduced motion.
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE, delay } }

  return (
    <Section
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-brand-radial pt-[5.5rem] text-white"
      pad="none"
      innerClassName="grid grid-cols-[0.9fr_1.1fr] items-center gap-xlg py-xlg tablet:grid-cols-1 tablet:gap-xxlg"
    >
      {/* Living gradient: drifting brand-colour blobs over the static radial. */}
      <AnimatedGradient />

      <div className="flex flex-col">
        <motion.div {...rise(0.05)}>
          <Heading.H1>
            Increase your brands creative <Em className="text-lime">capability.</Em>
          </Heading.H1>
        </motion.div>
        <motion.div {...rise(0.18)} className="mt-xbg max-w-[30rem]">
          <Paragraph className="leading-[1.7] text-white/85">
            Scale your brands content production through a simple subscription to your very own specialised creative team.
          </Paragraph>
        </motion.div>
        <motion.div {...rise(0.31)} className="mt-xlg self-start">
          <Button href="#contact">Book a Demo</Button>
        </motion.div>
      </div>

      <HeroGrid />
    </Section>
  )
}
