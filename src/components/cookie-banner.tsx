import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { track, updateConsent } from '../utils/analytics'
import { cn } from '../utils/cn'

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

const PILL = 'h-11 rounded-full border border-ink px-[18px] text-[0.9375rem] font-medium leading-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'

/**
 * Cookie consent card, pinned bottom-left. Shows until the visitor accepts or
 * declines analytics cookies — the two get equal weight — and the choice feeds
 * Google Consent Mode. Any `[data-cookie-settings]` control (the footer link)
 * reopens it. Prerendered closed, so returning visitors never see it flash.
 */
export default function CookieBanner() {
  const choice = useSyncExternalStore(subscribe, read, () => null)
  const [reopened, setReopened] = useState(false)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest('[data-cookie-settings]')) setReopened(true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const open = choice === 'unset' || reopened
  const decide = (next: Choice) => {
    choose(next)
    setReopened(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          id="cookie-banner"
          role="region"
          aria-labelledby="cookie-banner-title"
          className="fixed bottom-5 left-5 z-[60] w-[24rem] rounded-card border border-line bg-paper p-6 text-ink shadow-[0_30px_60px_-30px_rgba(33,44,38,0.45)] portrait:inset-x-3 portrait:bottom-3 portrait:w-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 id="cookie-banner-title" className="text-h4 font-bold">
            We value your privacy
          </h2>
          <p className="mt-2.5 text-p-sm">
            We use analytics cookies to understand how visitors find and use this site, so we can keep improving it. They’re only set if you accept.
          </p>
          <div className="mt-5 flex gap-2.5 [&>button]:flex-1">
            <button
              type="button"
              id="cookie-accept"
              onClick={() => decide('granted')}
              className={cn(PILL, 'bg-ink text-paper')}
            >
              Accept
            </button>
            <button
              type="button"
              id="cookie-decline"
              onClick={() => decide('denied')}
              className={cn(PILL, 'text-ink hover:bg-chalk')}
            >
              Decline
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
