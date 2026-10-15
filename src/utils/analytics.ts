declare global {
  interface Window {
    /** The Google tag, defined inline in layouts/base.astro. */
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Send a GA4 event. A no-op when the Google tag is missing (blocked, or a test
 * run). Until the visitor accepts analytics cookies, Consent Mode turns these
 * into cookieless pings.
 *
 *   track('select_currency', { currency: 'GBP' })
 */
export function track(event: string, params?: Record<string, unknown>) {
  window.gtag?.('event', event, params)
}

/** Grant or withdraw analytics cookies for the Google tag (Consent Mode v2). */
export function updateConsent(granted: boolean) {
  window.gtag?.('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' })
}
