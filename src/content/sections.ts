/**
 * Benefit cards: a photo over a solid caption band. `em` is the phrase of the
 * title set in serif italic; `tone` picks the band — Soft Volt, Forest or Paper.
 */
export const benefitCards = [
  {
    src: '/images/sections/benefit-capacity.avif',
    title: 'More creative capacity',
    em: 'creative capacity',
    body: 'Spin up extra hands the moment a campaign demands it and scale back just as easily — capacity that flexes with your roadmap.',
    tone: 'accent',
    focus: 'center',
  },
  {
    src: '/images/sections/benefit-workflow.avif',
    title: 'Streamlined workflow',
    em: 'Streamlined',
    body: 'Brief once and track everything in a single place, with a dedicated project manager keeping every task moving from kickoff to delivery.',
    tone: 'deep',
    focus: 'center 20%',
  },
  {
    src: '/images/sections/benefit-subscription.avif',
    title: 'One simple subscription',
    em: 'simple subscription',
    body: 'A full creative team for one predictable monthly fee — no per-project quotes, retainers, or surprise invoices.',
    tone: 'light',
    focus: 'center 30%',
  },
] as const

export const processSteps = [
  {
    title: 'Submit',
    subtitle: 'your brief',
    art: '/images/process/submit.webp',
    body: 'Tell us your priorities, timelines and requirements via the Creative Seat request system, freeing up your team to focus on the bigger picture without added pressure.',
  },
  {
    title: 'Activate',
    subtitle: 'your team',
    art: '/images/process/team.webp',
    body: 'A consistent team of specialists are assigned around the work you need and a streamlined production workflow is created to ensure tasks move quickly and accurately.',
  },
  {
    title: 'Review',
    subtitle: 'and refine',
    art: '/images/process/review.webp',
    body: 'Feedback stays centralised and easy to manage across every stage of production. Strong first drafts and clear communication help projects move forward with few delays.',
  },
  {
    title: 'Approve',
    subtitle: '+ keep moving',
    art: '/images/process/approve.webp',
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
    answer: 'You get a dedicated designer from our studio, assigned to your seat and focused on your work. You brief through a shared channel and ClickUp, so you always know who has your project and where it stands. A delivery lead oversees the seat, keeps the queue in order and steps in if something needs more hands. Work is always done by a human designer. We use AI-assisted workflows where they help, but never in place of one.',
  },
  {
    question: 'How quickly can projects be delivered?',
    answer: 'Your designer works through your queue one project at a time, in the order you set. That focus is what keeps turnaround fast: no hand-offs, no waiting for a slot. A full seat delivers 120 credits of design time a month, a half seat 60, so smaller assets like social graphics, banners, edits, and short videos move quickly, and larger pieces take longer because they occupy the seat until done. For work with a tight deadline that benefits from several people at once, we can scale the seat up.',
  },
  {
    question: 'Can Creative Seat work with our existing marketing team?',
    answer: 'Yes. It’s built to slot in alongside your team rather than replace it. Your marketers brief the designer directly, give feedback in the tools you already use (we’ve worked in Frame.io, Figma, ClickUp, and shared Slack channels), and we adapt to your brand guidelines and approval process. Most clients treat the seat as an extension of their in-house team.',
  },
  {
    question: 'How is Creative Seat different from hiring or a traditional agency?',
    answer: 'Hiring means salary, recruitment time, software, and a single skill set you carry whether or not you have work. A traditional agency means scoping, quotes, and retainers priced per project. With Creative Seat, you pay a flat monthly rate for dedicated design capacity, scale it up or down as your workload changes (full or half seat), and you get the studio behind your designer: a delivery lead, quality control, and a team that can cover leave or peaks. No recruitment, no per-project quotes.',
  },
]

export const services = [
  'Ad creative',
  'Social assets',
  'Video production',
  'Photography',
  'Motion graphics',
  'Presentations',
  'Web + UI design',
  'Illustration',
  'Apps + software',
  'Brand development',
  'Email design',
  'Copywriting',
  'Campaign strategy',
  'AI assisted creative',
]

/**
 * Hero carousel of work, in the order each card reaches the centre of the fan —
 * so neighbours should contrast. 760 × 788 crops of the project imagery, sized
 * for the centre card at 2×.
 */
export const heroCards = [
  '/images/hero/cherry-time-shirt.avif',
  '/images/hero/onvlee-engineer.avif',
  '/images/hero/true-africa-ocean.avif',
  '/images/hero/holiday-peach.avif',
  '/images/hero/dfsa-apricots.avif',
  '/images/hero/cherry-time-pie.avif',
  '/images/hero/true-africa-lion.avif',
  '/images/hero/holiday-cans.avif',
  '/images/hero/daniel-wellington.avif',
  '/images/hero/dutoit-shallots.avif',
]

/** Currencies the pricing shows, picked from the visitor's region (see utils/currency). */
export const currencies = ['USD', 'GBP', 'EUR'] as const

const seatFeatures = [
  'Dedicated designer',
  'Work across all your brands / clients',
  'Rolling design requests & revisions',
  'Creative Direction (1 per 10 designers)',
  'Project Manager (1 per 10 designers)',
  'Project managed dashboard',
  'Available Monday to Friday',
  'Flexibility to pause anytime',
]

/** Monthly seat plans, left to right. Enterprise has no list price — it's quoted. */
export const pricingPlans = [
  {
    id: 'half-seat',
    name: 'Half seat',
    price: { USD: 2400, GBP: 1850, EUR: 2200 },
    credits: 60,
    report: 'Fortnightly Creative Intelligence Report (Silver Data)',
    features: [...seatFeatures.slice(0, 2), 'One brief focus at a time', ...seatFeatures.slice(2)],
  },
  {
    id: 'full-seat',
    name: 'Full seat',
    featured: true,
    price: { USD: 4300, GBP: 3250, EUR: 3850 },
    credits: 120,
    report: 'Weekly Creative Intelligence Report (Gold Data)',
    features: seatFeatures,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    report: 'Custom-designed for large teams, agencies, or brands.',
    features: [
      'Multiple dedicated designers',
      'Multi-team & multi-brand access',
      'Priority Creative Intelligence Reports (Platinum Data – real-time insights)',
      'Custom dashboards & team workspaces',
      'Senior Creative Direction & Strategy',
      'Dedicated Account Manager',
      'Advanced automation & data connectors',
      'Scalable credit bundles',
      'Flexible collaboration across time zones',
    ],
  },
] satisfies {
  id: string
  name: string
  featured?: boolean
  price?: Record<(typeof currencies)[number], number>
  credits?: number
  report: string
  features: string[]
}[]

export const socials = [
  { name: 'Facebook', icon: '/images/icons/facebook.svg', size: 'size-4' },
  { name: 'Instagram', icon: '/images/icons/instagram.svg', size: 'size-4' },
  { name: 'YouTube', icon: '/images/icons/youtube.svg', size: 'size-[18px]' },
]
