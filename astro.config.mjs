// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
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
