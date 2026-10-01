import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/demos/forest-access/',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
})
