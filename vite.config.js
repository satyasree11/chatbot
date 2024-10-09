import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // The address of your backend
        changeOrigin: true, // Changes the origin of the host header to the target URL
        secure: false, // Set to true if your backend uses HTTPS
      },
    },
  },
});
