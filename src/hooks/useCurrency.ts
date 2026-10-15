import { useSyncExternalStore } from 'react'
import { currencies } from '../content'

export type Currency = (typeof currencies)[number]

/** UK time zones, Crown Dependencies included. */
const GBP_ZONES = new Set(['Europe/London', 'Europe/Belfast', 'Europe/Guernsey', 'Europe/Isle_of_Man', 'Europe/Jersey'])
/** Euro areas whose time zones sit outside `Europe/*`. */
const EUR_ZONES = /^(Atlantic\/(Azores|Madeira|Canary)|Africa\/Ceuta|Asia\/(Nicosia|Famagusta))$/
const EUR_REGIONS = new Set(['AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI', 'SK'])

/**
 * Best guess at the visitor's currency from where their device says it is —
 * its time zone, or failing that its language region (`en-GB`). It stands in
 * for IP geolocation on a static site: no request, no third party, nothing to
 * consent to. UK → GBP, the rest of Europe → EUR, everywhere else → USD.
 */
function detect(): Currency {
  let zone = ''
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
  } catch {
    // No Intl time zone support — fall through to the language region.
  }
  if (GBP_ZONES.has(zone)) return 'GBP'
  if (zone.startsWith('Europe/') || EUR_ZONES.test(zone)) return 'EUR'
  if (zone && !zone.startsWith('Etc/') && zone !== 'UTC') return 'USD'

  const region = navigator.language.split('-')[1]?.toUpperCase()
  if (region === 'GB') return 'GBP'
  if (region && EUR_REGIONS.has(region)) return 'EUR'
  return 'USD'
}

let detected: Currency | null = null
const read = () => (detected ??= detect())
// The answer never changes during a visit, so there's nothing to subscribe to.
const subscribe = () => () => {}

/**
 * The visitor's currency, or `null` until it's known: during prerender and the
 * hydrating render (so the markup matches), resolved straight after. Callers
 * hold the price's space but keep it hidden while it's null, so a visitor only
 * ever sees their own currency.
 */
export function useCurrency(): Currency | null {
  return useSyncExternalStore(subscribe, read, () => null)
}
