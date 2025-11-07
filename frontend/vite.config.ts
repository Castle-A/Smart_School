import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // On autorise 'eval' et 'unsafe-inline' pour le développement
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
    },
  },
})
