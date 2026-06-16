import { projects, type Project } from '../../content'

/** One shared aspect ratio so every card is the same size (same width per column). */
export const TILE_ASPECT = '4 / 5'

export type ColumnConfig = {
  /** Drift direction: +1 scrolls down (vertical) / right (horizontal), -1 the reverse. */
  sign: 1 | -1
  /** Base drift speed in px/second. */
  speed: number
}

/** col1 down, col2 up (fastest), col3 down — alternating directions, varied speeds. */
export const COLUMN_CONFIG: ColumnConfig[] = [
  { sign: 1, speed: 28 },
  { sign: -1, speed: 40 },
  { sign: 1, speed: 22 },
]

/** Round-robin split of the projects collection into one list per column. */
export const columns: Project[][] = COLUMN_CONFIG.map((_, col) =>
  projects.filter((_, i) => i % COLUMN_CONFIG.length === col),
)

export type { Project } from '../../content'
