// @ts-check
import { defineConfig, envField } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  // The production URL — canonical links, social cards, the sitemap, robots.txt,
  // llms.txt and structured data are all built from it.
  // PLACEHOLDER: confirm the real domain before launch.
  site: 'https://creativeseat.ai',
  integrations: [react()],
  // Pages stay prerendered; only the booking API (src/pages/api/) opts out with
  // `prerender = false` and runs as Vercel functions.
  adapter: vercel(),
  // Book a demo (see .env.example). All optional, so the site builds without
  // them: availability comes from the mia calendar API, and bookings go to
  // Zapier once its webhook is set.
  env: {
    schema: {
      ZAPIER_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true, url: true }),
      CALENDAR_API_URL: envField.string({ context: 'server', access: 'public', default: 'https://mia-calendar-api.vercel.app', url: true }),
      BOOKING_TIME_ZONE: envField.string({ context: 'server', access: 'public', default: 'Africa/Johannesburg' }),
      BOOKING_HOURS: envField.string({ context: 'server', access: 'public', default: '09:00-17:00' }),
      BOOKING_BUFFER_MINUTES: envField.number({ context: 'server', access: 'public', default: 0, int: true, min: 0, max: 120 }),
    },
  },
  // Ship Studio expects this app on 3000; strictPort fails loudly if it's taken
  // rather than silently sliding to another port.
  server: {
    port: 3000,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      strictPort: true,
    },
  },
})
