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
        secure: false // Bon pour Codespaces
      },
    },
  },
})