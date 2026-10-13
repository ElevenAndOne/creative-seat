export const benefitCards = [
  {
    src: '/images/sections/benefit-capacity.avif',
    title: 'More creative capacity',
    body: 'Spin up extra hands the moment a campaign demands it and scale back just as easily — capacity that flexes with your roadmap.',
    tone: 'glass',
    focus: 'center',
  },
  {
    src: '/images/sections/benefit-workflow.avif',
    title: 'Streamlined workflow',
    body: 'Brief once and track everything in a single place, with a dedicated project manager keeping every task moving from kickoff to delivery.',
    tone: 'glass',
    focus: 'center 20%',
  },
  {
    src: '/images/sections/benefit-subscription.avif',
    title: 'One simple subscription',
    body: 'A full creative team for one predictable monthly fee — no per-project quotes, retainers, or surprise invoices.',
    tone: 'lime',
    focus: 'center 77%',
  },
] as const

export const processSteps = [
  {
    icon: '/images/icons/step-submit.svg',
    title: 'Submit',
    subtitle: 'your brief',
    body: 'Tell us your priorities, timelines and requirements via the Creative Seat request system, freeing up your team to focus on the bigger picture without added pressure.',
  },
  {
    icon: '/images/icons/step-activate.svg',
    title: 'Activate',
    subtitle: 'your team',
    body: 'A consistent team of specialists are assigned around the work you need and a streamlined production workflow is created to ensure tasks move quickly and accurately.',
  },
  {
    icon: '/images/icons/step-review.svg',
    title: 'Review',
    subtitle: 'and refine',
    body: 'Feedback stays centralised and easy to manage across every stage of production. Strong first drafts and clear communication help projects move forward with few delays.',
  },
  {
    icon: '/images/icons/step-approve.svg',
    title: 'Approve',
    subtitle: '+ keep moving',
    body: 'Your approved final assets are delivered for launch across the required channels. As new priorities emerge, your team is ready to get on the next project.',
  },
]

export const faqItems = [
  {
    question: 'How does Creative Seat work day-to-day?',
    answer: 'Creative Seat works as an extension of your team. You submit requests, set priorities, and your dedicated project manager coordinates the right specialists to take projects from brief to delivery through one simple workflow. Over time, your team develops a deeper understanding of your brand, helping work move faster and with greater consistency.',
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

export const services = [
  'Ad Creative',
  'Social Assets',
  'Video Production',
  'photography',
  'Motion Graphics',
  'Presentations',
  'Web + UI Design',
  'Illustration',
  'Apps + Software',
  'Brand Development',
  'Email Design',
  'Copywriting',
  'Campaign Strategy',
  'AI Assisted Creative',
]

/** Hero fan of work, back to front: the two outer cards, the two inner ones, then the centrepiece. */
export const heroCards = [
  { src: '/images/hero/hero-right-back.avif', slot: 'right-back' },
  { src: '/images/hero/hero-right-mid.avif', slot: 'right-mid' },
  { src: '/images/hero/hero-left-back.avif', slot: 'left-back' },
  { src: '/images/hero/hero-left-mid.avif', slot: 'left-mid' },
  { src: '/images/hero/hero-center.avif', slot: 'center' },
] as const

export const socials = [
  { name: 'Facebook', icon: '/images/icons/facebook.svg', size: 'size-4' },
  { name: 'Instagram', icon: '/images/icons/instagram.svg', size: 'size-4' },
  { name: 'YouTube', icon: '/images/icons/youtube.svg', size: 'size-[18px]' },
]
