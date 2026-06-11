import Accordion from '../components/accordion'
import Button from '../components/autton'
import Container from '../components/container'

const items = [
  {
    question: 'How does Creative Seat work day-to-day?',
    answer: 'Creative Seat works as an extension of your team. You submit requests, set priorities, and your dedicated project manager coordinates the right specialists to take projects from brief to delivery through one simple workflow.',
  },
  {
    question: 'Who will I be working with?',
    answer: 'You work with a dedicated project manager and a curated creative team matched to your subscription needs, including design, web, motion, content, and campaign specialists.',
  },
  {
    question: 'How quickly can projects be delivered?',
    answer: 'Timelines depend on project scope, but the subscription model removes onboarding drag and keeps the team ready for continuous creative production.',
  },
  {
    question: 'Can Creative Seat work with our existing marketing team?',
    answer: 'Yes. Creative Seat is designed to support internal marketing teams, giving them extra capacity, specialist execution, and a more consistent production rhythm.',
  },
  {
    question: 'How is Creative Seat different from hiring or a traditional agency?',
    answer: 'You get ongoing access to specialist creative support without the recruitment, management, retainer complexity, or slow project starts that often come with hiring or agency models.',
  },
]

export default function Faq() {
  return (
    <section id="resources" className="bg-paper py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <h2 className="max-w-[430px] text-5xl font-light leading-tight text-grape md:text-h2">Frequently asked questions</h2>
          <Button href="#contact" variant="black" className="mt-10">Get In Touch</Button>
        </div>
        <Accordion items={items} />
      </Container>
    </section>
  )
}
