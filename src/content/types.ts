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
  /** Card / grid thumbnail (link) — an image, or a video (.mp4/.webm/.mov) played as ambient b-roll. */
  cover: string
  /** Still frame for a video `cover`, shown before it loads. */
  poster?: string
  /** Modal media (list of links, images or videos) — adaptive grid: 1 = centered, multiple = grid. */
  images: string[]
  /** Optional curated case study for the project viewer; without one the viewer builds a simple wall from `images`. */
  caseStudy?: CaseStudy
}

/**
 * One tile on a case-study wall: an image or video path (or `"logo"` for a
 * static brand tile) and its box in Figma units, taken straight from the
 * project's artboard. Video tiles carry a still `poster` cut from the same box.
 */
export type WallTile = [src: string, x: number, y: number, w: number, h: number, poster?: string]

export interface CaseStudy {
  industry: string
  location: string
  /** Brand logo, drawn centred on `logoBg` for a `"logo"` tile on the wall. */
  logo?: string
  logoBg?: string
  /** Client / project write-up, one entry per paragraph. */
  blurb: string[]
  services: string[]
  /** The artboard: overall size plus every tile, in Figma units. It's scaled to the viewer's height. */
  wall: { width: number; height: number; tiles: WallTile[] }
}

export interface Testimonial {
  name: string
  /** Role + company, e.g. "Senior Designer, Onvlee Engineering". */
  subscript: string
  /** The quote. */
  testimony: string
  /** Brand logo (link). */
  logo: string
}

export interface Logo {
  name: string
  /** SVG/image link. */
  src: string
}
