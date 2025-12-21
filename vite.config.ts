import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 56863,
    host: true
  },
  base: '/leetcode-72-edit-distance/'
})
