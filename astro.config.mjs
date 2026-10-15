// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  // The production URL — canonical links, social cards, the sitemap, robots.txt,
  // llms.txt and structured data are all built from it.
  // PLACEHOLDER: confirm the real domain before launch.
  site: 'https://creativeseat.ai',
  integrations: [react()],
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
