import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiHostname = process.env.VITE_API_HOSTNAME || 'http://localhost:5000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/generate_question': {
        target: apiHostname,  // Flask server URL
        changeOrigin: true,
        secure: false,
      },
      '/essay_feedback': {
        target: apiHostname,  // Flask server URL
        changeOrigin: true,
        secure: false,
      },
      '/essay_overall_feedback': {
        target: apiHostname,  // Flask server URL
        changeOrigin: true,
        secure: false,
      },
      // TODO other API endpoints
    }
  }
})
