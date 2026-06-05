import { defineConfig } from 'vite'
// @ts-ignore
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
    port: 3003,
    host: true, // Nécessaire pour Docker
    allowedHosts: [
      'isis-unexcludable-unavailingly.ngrok-free.dev',
      'localhost',
      '.ngrok-free.dev'
    ],
    proxy: {
      '/api': {
        target: 'http://smartschool-api:3010', // Utilise le nom du service Docker
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://smartschool-api:3010',
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'ngrok-skip-browser-warning': '69420',
    }
  }
})