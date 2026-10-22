declare global {
  interface Window {
    /** Google Tag Manager's data layer, set up inline in layouts/base.astro. */
    dataLayer?: unknown[]
    /** Pushes consent commands to the data layer, defined inline in layouts/base.astro. */
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Push an event to the data layer for GTM triggers. Harmless when GTM is
 * missing (blocked, or a test run). Until the visitor accepts analytics
 * cookies, Consent Mode keeps GTM's Google tags cookieless.
 *
 *   track('select_currency', { currency: 'GBP' })
 */
export function track(event: string, params?: Record<string, unknown>) {
  window.dataLayer?.push({ event, ...params })
}

/** Grant or withdraw analytics cookies for GTM's Google tags (Consent Mode v2). */
export function updateConsent(granted: boolean) {
  window.gtag?.('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' })
}
