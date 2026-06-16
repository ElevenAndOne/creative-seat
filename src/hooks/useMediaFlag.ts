import { useEffect, useState } from 'react'

/**
 * SSR-safe `matchMedia` boolean. Returns `defaultValue` during prerender and
 * the first client render (so server and client markup match), then reads the
 * real media query in an effect and subscribes to changes.
 *
 *   const isMobile = useMediaFlag('(max-width: 48rem)')   // false until mounted
 *   const finePointer = useMediaFlag('(pointer: fine)')
 */
export function useMediaFlag(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
