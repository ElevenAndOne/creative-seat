import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // vite-react-ssg's `dev` CLI ignores the --port flag, so pin the port here.
  // Ship Studio expects this app on 3000; strictPort fails loudly if it's taken
  // rather than silently sliding to another port.
  server: {
    port: 3000,
    strictPort: true,
  },
})
