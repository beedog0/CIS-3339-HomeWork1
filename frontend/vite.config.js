import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    // in dev mode, forward API calls to the Express server
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
