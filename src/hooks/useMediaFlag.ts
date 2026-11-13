import { useCallback, useSyncExternalStore } from 'react'

/**
 * SSR-safe `matchMedia` boolean. Returns `defaultValue` during prerender and
 * the first client render (so server and client markup match), then reads the
 * real media query directly and subscribes to changes.
 *
 *   const isMobile = useMediaFlag('(max-width: 48rem)')   // false until mounted
 *   const finePointer = useMediaFlag('(pointer: fine)')
 */
export function useMediaFlag(query: string, defaultValue = false): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia(query)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])
  const read = useCallback(() => window.matchMedia(query).matches, [query])
  const server = useCallback(() => defaultValue, [defaultValue])
  return useSyncExternalStore(subscribe, read, server)
}
