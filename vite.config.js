import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = process.env.VITE_API_BASE_URL || env.VITE_API_BASE_URL

  // TASK 3: "If VITE_API_BASE_URL is missing during a production build, fail the build rather than silently using '/api'."
  if (command === 'build') {
    if (!apiBaseUrl || apiBaseUrl.trim() === '' || apiBaseUrl.trim() === '/api') {
      throw new Error(
        'CRITICAL BUILD FAILURE: VITE_API_BASE_URL is required for production builds. ' +
        'Static hosting (e.g. GitHub Pages) cannot proxy /api. ' +
        'Set VITE_API_BASE_URL=https://<REAL-DJANGO-BACKEND>/api'
      )
    }
  }

  return {
    base: './',
    plugins: [react()],
    server: {
      port: 3000,
      open: false,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    preview: {
      host: '0.0.0.0',
      port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
      allowedHosts: true,
    }
  }
})
