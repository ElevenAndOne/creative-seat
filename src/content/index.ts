import type { Logo, Project, Testimonial } from './types'
import projectsData from './projects.json'
import testimonialsData from './testimonials.json'
import logosData from './logos.json'

/** Typed content collections — the single import point for every section. */
export const projects = projectsData as Project[]
export const testimonials = testimonialsData as Testimonial[]
export const logos = logosData as Logo[]
export const showcasedProjects = projects.slice(0, 6)
export const logoMarqueeTrack = [...logos, ...logos].map((logo, index) => ({
  ...logo,
  duplicate: index >= logos.length,
}))

export {
  automationItems,
  benefitCards,
  faqItems,
  processSteps,
  services,
  socials,
} from './sections'

export type { Logo, Project, Testimonial } from './types'
