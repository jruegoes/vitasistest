/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://playground-auth.true-bar.si',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, '')
      }
    }
  },
  test: {
    environment: 'jsdom', // Since you're using React
    globals: true, // Allows using test functions without importing them
    setupFiles: ['./src/tests/setup.ts'], // Updated setup file path
  }
})
