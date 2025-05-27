import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: false,
    proxy: {
      // Configuration du proxy pour rediriger les requêtes API vers le serveur backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 4174,
    strictPort: false
  },
  // Handle SPA routing (important for React Router)
  base: '/'
});