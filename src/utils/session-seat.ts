/**
 * The CTA band's chair changes with every new browser session: each new tab
 * or window gets a fresh seat, and it stays put while the visitor reloads and
 * browses. Seats are dealt from a shuffled deck kept on the device, so a
 * returning visitor sees all eight before any comes back, and never the same
 * seat two sessions running. Where storage is blocked, it's a random pick.
 *
 * The names follow Figma's Seats set (221:1886), one seat per creative role;
 * the images are `/images/cta/seats/<seat>-{background,foreground}.avif`.
 */
export const SEATS = ['director', 'manager', 'copywriter', 'illustrator', 'designer', 'animator', 'strategist', 'developer'] as const
export type Seat = (typeof SEATS)[number]

/** sessionStorage: this session's seat. */
const SESSION_KEY = 'cs-seat'
/** localStorage: `{ deck, last }`, the seats still to deal and the last one dealt. */
const DECK_KEY = 'cs-seat-deck'

const isSeat = (value: unknown): value is Seat => SEATS.includes(value as Seat)
const randomSeat = () => SEATS[Math.floor(Math.random() * SEATS.length)]

function shuffled(): Seat[] {
  const deck: Seat[] = [...SEATS]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function savedDeck(): { deck: Seat[], last?: Seat } {
  try {
    const { deck, last } = JSON.parse(localStorage.getItem(DECK_KEY) ?? '{}')
    return { deck: Array.isArray(deck) ? deck.filter(isSeat) : [], last: isSeat(last) ? last : undefined }
  } catch {
    return { deck: [] }
  }
}

/** The next seat off the deck. A fresh deck never opens on the seat the last one ended on. */
function deal(): Seat {
  const saved = savedDeck()
  let deck = saved.deck
  if (deck.length === 0) {
    deck = shuffled()
    if (deck[0] === saved.last) [deck[0], deck[1]] = [deck[1], deck[0]]
  }
  const [seat, ...rest] = deck
  localStorage.setItem(DECK_KEY, JSON.stringify({ deck: rest, last: seat }))
  return seat
}

let current: Seat | undefined

/** This session's seat. Browser only; worked out once per page load, then cached. */
export function sessionSeat(): Seat {
  if (current) return current
  try {
    const kept = sessionStorage.getItem(SESSION_KEY)
    current = isSeat(kept) ? kept : deal()
    sessionStorage.setItem(SESSION_KEY, current)
  } catch {
    // Storage blocked (private mode, site data turned off).
    current ??= randomSeat()
  }
  return current
}
