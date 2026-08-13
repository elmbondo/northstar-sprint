import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    ...(process.env.VITE_API_BASE_URL
      ? {
          proxy: {
            '/api': {
              target: process.env.VITE_API_BASE_URL,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : {})
  }
});
