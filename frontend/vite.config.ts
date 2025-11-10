import { defineConfig } from 'vite' // <-- CETTE LIGNE ÉTAIT MANQUANTE
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    proxy: {
      // 🔁 tout ce qui commence par /auth est proxifié vers le backend NestJS
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false, // Bon pour Codespaces
      },
      // proxy des appels API généraux utilisés par le frontend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // remove the `/api` prefix when proxying to the NestJS server
        // so a request to `/api/users` becomes `/users` on the backend
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})