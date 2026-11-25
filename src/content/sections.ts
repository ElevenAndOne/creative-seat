/**
 * Benefit cards: a photo (or, with `video`, an ambient loop whose poster is
 * `src`) over a Soft Volt caption band. `em`, when set, is the phrase of the
 * title set in serif italic; `body` opens under the title on hover or focus.
 */
export const benefitCards = [
  {
    src: '/images/benefits/capacity.webp',
    title: 'More creative capacity',
    body: 'Spin up extra hands the moment a campaign demands it and scale back just as easily — capacity that flexes with your roadmap.',
    em: 'creative capacity',
    focus: 'center',
  },
  {
    src: '/images/benefits/workflow-poster.webp',
    video: { webm: '/videos/benefit-workflow.webm', mp4: '/videos/benefit-workflow.mp4' },
    title: 'Streamlined workflow',
    body: 'Brief once and track everything in a single place, with a dedicated project manager keeping every task moving from kickoff to delivery.',
    focus: 'center 25%',
  },
  {
    src: '/images/benefits/subscription.webp',
    title: 'One simple subscription',
    body: 'A full creative team for one predictable monthly fee — no per-project quotes, retainers, or surprise invoices.',
    focus: 'center 41%',
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
 * The hero's strip of work (sections/hero.tsx), in the Figma frame's order
 * (Creative Seat, node 2269:231). Figma draws each card at 520 × 540; the
 * files are 584 × 606, covering a 280 × 303 tile at 2×.
 *
 * A tile is a still (the logo already in the picture) or a muted loop, WebM
 * first with an MP4 fallback, under a poster frame. Video cards keep the
 * client's logo out of the video, as a vector laid over it: placed in % of
 * the tile, so it stays crisp at every tile size. `loop: false` plays once
 * and holds the last frame, for pieces that build up rather than cycle.
 *
 * The videos are Figma's own renditions (its HLS streams), not the original
 * masters: Onvlee is cropped to the card as Figma frames it and runs its full
 * 19s (three hard-cut shots, so it loops on a cut); Sojern is 520 × 540, the
 * largest Figma holds. TFG Money builds up from an empty frame, so it plays
 * once and holds.
 */
type TileLogo = { src: string, left: string, top: string, width: string }
export type HeroTile =
  | { kind: 'image', src: string, logo?: TileLogo }
  | { kind: 'video', poster: string, webm: string, mp4: string, loop?: boolean, logo?: TileLogo }

const HERO = '/images/hero/v2'
/** A video tile's poster and its two encodes, by slug. */
const clip = (slug: string) => ({ poster: `${HERO}/${slug}-poster.avif`, webm: `/videos/hero/${slug}.webm`, mp4: `/videos/hero/${slug}.mp4` })
export const heroTiles: HeroTile[] = [
  { kind: 'image', src: `${HERO}/bushnell-golf.avif` },
  { kind: 'image', src: `${HERO}/daniel-wellington.avif` },
  { kind: 'video', ...clip('tfg-money'), loop: false, logo: { src: `${HERO}/tfg-money-logo.svg`, left: '24.16%', top: '10.19%', width: '51.5%' } },
  { kind: 'video', ...clip('onvlee'), logo: { src: `${HERO}/onvlee-logo.svg`, left: '22.03%', top: '10.99%', width: '55.91%' } },
  { kind: 'video', ...clip('project-white-hart'), logo: { src: `${HERO}/project-white-hart-logo.webp`, left: '28.87%', top: '20.62%', width: '42.48%' } },
  { kind: 'image', src: `${HERO}/dutoit.avif` },
  { kind: 'image', src: `${HERO}/cherry-time.avif` },
  { kind: 'image', src: `${HERO}/norrsken.avif` },
  { kind: 'image', src: `${HERO}/devroux.avif` },
  { kind: 'video', ...clip('sojern'), logo: { src: `${HERO}/sojern-logo.svg`, left: '20.14%', top: '9.26%', width: '59.72%' } },
  { kind: 'image', src: `${HERO}/piedmont-earth-day.avif` },
  { kind: 'image', src: `${HERO}/holiday.avif` },
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

/**
 * The credit calculator's services (sections/credit-calculator.tsx), smallest
 * first: what one costs in credits, the unit it's counted in, the most its
 * slider goes up to, and the chair it brings to the summary (one of the
 * CHAIRS crops in that file).
 *
 * Six deliverables that show the studio's breadth. Each is priced as a whole,
 * finished deliverable at about one credit per hour of design time (a full
 * seat's 120 credits is a designer's month), on the 1-2-3-5-8-13-20-40 scale
 * of the 11&1 Services credit grid. That grid's "Typical" values are medians
 * of ClickUp tasks, where a "Website" task runs from a one-hour fix to a
 * rebuild — so they price pieces of work, not the deliverables listed here.
 * Every figure below still sits inside its type's range on the grid.
 */
export const creditServices = [
  { id: 'social', name: 'Social media posts', unit: 'post', credits: 2, max: 20, chair: 'flower' },
  { id: 'paid-ads', name: 'Paid ads', unit: 'ad', credits: 3, max: 12, chair: 'panton' },
  { id: 'illustration', name: 'Illustration', unit: 'illustration', credits: 8, max: 8, chair: 'fluffy-yellow' },
  { id: 'video', name: 'Video production', unit: 'video', credits: 13, max: 6, chair: 'director' },
  { id: 'landing-page', name: 'Landing pages', unit: 'page', credits: 20, max: 4, chair: 'fluffy-blue' },
  { id: 'branding', name: 'Brand identity', unit: 'identity', credits: 40, max: 2, chair: 'shell' },
] as const satisfies {
  id: string
  name: string
  unit: string
  credits: number
  max: number
  chair: string
}[]

/** The footer's social buttons — 11&1's own accounts, as linked from 11and1.com. */
export const socials = [
  { name: 'Facebook', href: 'https://www.facebook.com/11and1/', icon: '/images/icons/facebook.svg', size: 'size-4' },
  { name: 'Instagram', href: 'https://www.instagram.com/_creativeseat/', icon: '/images/icons/instagram.svg', size: 'size-4' },
]

/**
 * The book-a-demo call, in the order it runs. `from` / `to` are minutes in —
 * the agenda draws them on a 30-minute ruler.
 */
export const demoAgenda = [
  {
    from: 0,
    to: 10,
    title: 'Your queue',
    body: 'Tell us what’s waiting: the campaigns, channels and brands you’re juggling, and where work tends to get stuck.',
  },
  {
    from: 10,
    to: 20,
    title: 'A seat, live',
    body: 'We walk through how a seat runs day to day — briefing in ClickUp, feedback in the tools you already use, and what 60 or 120 credits a month gets done.',
  },
  {
    from: 20,
    to: 30,
    title: 'Your first month',
    body: 'We suggest a half or full seat and what we’d take on first, so you leave with a plan rather than a pitch deck.',
  },
]

/** The studio inbox — offered when online booking can't go through, and in llms.txt. */
export const contact = {
  email: 'trystin@11and1.com',
}
