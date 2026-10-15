import type { Logo, Project, Testimonial } from './types'
import projectsData from './projects.json'
import testimonialsData from './testimonials.json'
import logosData from './logos.json'

/** Typed content collections — the single import point for every section. */
export const projects = projectsData as Project[]
export const testimonials = testimonialsData as Testimonial[]
export const logos = logosData as Logo[]
export const showcasedProjects = projects.slice(0, 6)

/** URL-safe id for a project's deep link (`#work-<slug>`), e.g. "Cherry Time" → "cherry-time". */
export const projectSlug = (project: Project) =>
  project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export {
  benefitCards,
  currencies,
  faqItems,
  heroCards,
  pricingPlans,
  processSteps,
  services,
  socials,
} from './sections'

export type { CaseStudy, Logo, Project, Testimonial, WallTile } from './types'
