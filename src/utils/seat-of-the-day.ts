/**
 * The CTA band's chair changes every day. Each run of eight days shows all
 * eight seats once, in an order shuffled from the date, so every visitor sees
 * the same seat on a given day, no seat comes up two days running, and the
 * order doesn't look like a cycle. The day turns over at the visitor's own
 * midnight.
 *
 * The names follow Figma's Seats set (221:1886), one seat per creative role;
 * the images are `/images/cta/seats/<seat>-{shadow,chair}-{600,1200}.webp`.
 */
export const SEATS = ['director', 'manager', 'copywriter', 'illustrator', 'designer', 'animator', 'strategist', 'developer'] as const
export type Seat = (typeof SEATS)[number]

const DAY_MS = 86_400_000

/** Whole days since 1 January 1970, counted on the visitor's own calendar. */
const localDay = (date: Date) => Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS)

/** mulberry32: a tiny seeded generator, so a run always shuffles the same way. */
function generator(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The seats in the order run `run` shows them (Fisher–Yates). */
function shuffled(run: number): Seat[] {
  const next = generator(run)
  const order: Seat[] = [...SEATS]
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export function seatOfTheDay(date = new Date()): Seat {
  const day = localDay(date)
  const run = Math.floor(day / SEATS.length)
  const order = shuffled(run)
  // A run may open on the seat the last run closed on: show it a day later instead.
  if (order[0] === shuffled(run - 1)[SEATS.length - 1]) [order[0], order[1]] = [order[1], order[0]]
  return order[day % SEATS.length]
}
