import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'
const STORAGE_KEY = 'cs-motion-paused'
const listeners = new Set<() => void>()
let userPaused = false
let media: MediaQueryList | undefined
let restored = false

const isReduced = () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
const isPaused = () => userPaused || isReduced()
const serverPaused = () => true
const serverReduced = () => false

function notify() {
  document.documentElement.dataset.animationsPaused = String(isPaused())
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) {
    if (!restored) {
      restored = true
      try {
        userPaused = sessionStorage.getItem(STORAGE_KEY) === 'true'
      } catch {
        // Blocked storage still allows a pause for the current page.
      }
    }
    media = window.matchMedia(QUERY)
    media.addEventListener('change', notify)
    notify()
  }
  return () => {
    listeners.delete(listener)
    if (!listeners.size) {
      media?.removeEventListener('change', notify)
      media = undefined
    }
  }
}

/**
 * The visitor's actual preference, read straight from storage and the media
 * query. `useAnimationsPaused` reports paused on the hydration render (the
 * server can't know), so an effect that runs in that first commit can use
 * this to avoid acting on the placeholder.
 */
export function readAnimationsPaused() {
  if (typeof window === 'undefined') return true
  let stored = userPaused
  if (!restored) {
    try {
      stored = sessionStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      // Blocked storage: fall back to the in-memory value.
    }
  }
  return stored || isReduced()
}

/** One ambient-motion preference shared by the independently hydrated islands. */
export function useAnimationsPaused() {
  return useSyncExternalStore(subscribe, isPaused, serverPaused)
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, isReduced, serverReduced)
}

export function setAnimationsPaused(paused: boolean) {
  userPaused = paused
  try {
    sessionStorage.setItem(STORAGE_KEY, String(paused))
  } catch {
    // Keep the current page's preference in memory.
  }
  notify()
}
