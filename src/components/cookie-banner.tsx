import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { track, updateConsent } from '../utils/analytics'
import { pillClass } from './pill'
import { useAnimationsPaused } from '../hooks/useMotionPreference'

/** Read inline by layouts/base.astro too, to restore consent before the Google tag configures. */
const STORAGE_KEY = 'cs-consent'

type Choice = 'granted' | 'denied'

// The visitor's choice, mirrored in memory so the banner still closes when
// storage is blocked (it just asks again next visit).
let remembered: Choice | null = null
const listeners = new Set<() => void>()

function read(): Choice | 'unset' {
  if (remembered) return remembered
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'granted' || saved === 'denied') return (remembered = saved)
  } catch {
    // Storage blocked — fall through and ask.
  }
  return 'unset'
}

function choose(choice: Choice) {
  remembered = choice
  try {
    localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // Storage blocked — the choice holds for this page view.
  }
  updateConsent(choice === 'granted')
  track('cookie_consent', { consent: choice })
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Cookie consent card, pinned bottom-left. Shows until the visitor accepts or
 * declines analytics cookies — the two get equal weight — and the choice feeds
 * Google Consent Mode. Any `[data-cookie-settings]` control (the footer link)
 * reopens it, taking focus to its first button and handing it back to that
 * control once the visitor chooses. Prerendered closed, so returning visitors
 * never see it flash.
 */
export default function CookieBanner() {
  const paused = useAnimationsPaused()
  const choice = useSyncExternalStore(subscribe, read, () => null)
  // Counts reopenings, so each click on a settings control moves focus in again.
  const [reopened, setReopened] = useState(0)
  const trigger = useRef<HTMLElement | null>(null)
  const first = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const control = (e.target as Element | null)?.closest<HTMLElement>('[data-cookie-settings]')
      if (!control) return
      trigger.current = control
      setReopened((n) => n + 1)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (reopened) first.current?.focus()
  }, [reopened])

  const open = choice === 'unset' || reopened > 0
  const decide = (next: Choice) => {
    choose(next)
    setReopened(0)
    trigger.current?.focus()
    trigger.current = null
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          id="cookie-banner"
          role="region"
          aria-labelledby="cookie-banner-title"
          className="fixed bottom-5 left-5 z-[60] w-[24rem] rounded-card border border-line bg-paper p-6 text-ink shadow-[0_30px_60px_-30px_rgba(33,44,38,0.45)] portrait:inset-x-3 portrait:bottom-3 portrait:w-auto"
          initial={paused ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: paused ? 0 : 24 }}
          transition={{ duration: paused ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 id="cookie-banner-title" className="text-h4 font-bold">
            We value your privacy
          </h2>
          <p className="mt-2.5 text-p-sm">
            We use analytics cookies to understand how visitors find and use this site, so we can keep improving it. They’re only set if you accept.
          </p>
          <div className="mt-5 flex gap-2.5 [&>button]:flex-1">
            <button
              ref={first}
              type="button"
              id="cookie-accept"
              onClick={() => decide('granted')}
              className={pillClass('primary')}
            >
              Accept
            </button>
            <button
              type="button"
              id="cookie-decline"
              onClick={() => decide('denied')}
              className={pillClass('outline')}
            >
              Decline
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
