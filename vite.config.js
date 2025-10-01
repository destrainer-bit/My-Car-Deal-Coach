import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787'
    }
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      external: []
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
