import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/generate_question': {
        target: 'http://localhost:5000',  // Flask server URL
        changeOrigin: true,
        secure: false,
      },
      // TODO other API endpoints
    }
  }
})
