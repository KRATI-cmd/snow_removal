import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The three.js hero scene is a lazily loaded chunk (~150 kB gzip); it never blocks first paint.
  build: { chunkSizeWarningLimit: 700 },
})
