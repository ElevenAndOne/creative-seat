/**
 * Content collection types — the "CMS" schema. Each JSON file under this folder
 * holds a list of one of these shapes; src/content/index.ts loads + types them.
 */

export interface Project {
  /** Display name, e.g. "Treatwell". */
  title: string
  /** Industry / sector, shown small + uppercase, e.g. "Health Beauty". */
  category: string
  /** Modal paragraph describing the work. */
  description: string
  /** Disciplines / services — rendered as pills in the modal, joined in the work grid. */
  tags: string[]
  /** Card / grid thumbnail (link). */
  cover: string
  /** Modal images (list of links) — adaptive grid: 1 = centered, multiple = grid. */
  images: string[]
  /** Optional: span two columns in the work-showcase grid. */
  wide?: boolean
}

export interface Testimonial {
  name: string
  /** Role + company, e.g. "Senior Designer, Onvlee Engineering". */
  subscript: string
  /** The quote. */
  testimony: string
  /** Brand logo (link). */
  logo: string
  /** Optional avatar image (link). */
  avatar?: string
}

export interface Logo {
  name: string
  /** SVG/image link. */
  src: string
}
