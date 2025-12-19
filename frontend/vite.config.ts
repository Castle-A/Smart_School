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
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/members': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/teachers': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/classes': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/profile': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/permissions': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/subjects': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/analytics': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/admin-requests': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/student-comments': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/students': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/notifications': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    // Headers pour le frontend
    headers: {
      'ngrok-skip-browser-warning': '69420',
    }
  }
})