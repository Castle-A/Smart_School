import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@support': path.resolve(__dirname, './src/support'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 5173,
    // ⬇️ AJOUTEZ CETTE LIGNE ⬇️
    allowedHosts: ['isis-unexcludable-unavailingly.ngrok-free.dev'],
    // OU pour autoriser TOUS les domains ngrok :
    // allowedHosts: ['.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    // Headers pour le frontend
    headers: {
      'ngrok-skip-browser-warning': '69420',
    }
  }
})