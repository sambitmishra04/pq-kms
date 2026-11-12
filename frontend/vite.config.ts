import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/state': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/audit': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/metrics': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/revocations': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/enrol': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/session': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/message': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/revoke': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
