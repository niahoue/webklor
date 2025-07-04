import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Définir NODE_ENV automatiquement
  const isProduction = mode === 'production';
  
  return {
    // Définir les variables d'environnement
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      __DEV__: !isProduction
    },
    
    plugins: [
      react({
        // Optimisation React avec SWC pour de meilleures performances
        jsxRuntime: 'automatic',
        // Babel config simplifiée - les prop-types sont automatiquement supprimés en production
        babel: {
          plugins: []
        }
      })
    ],
  server: {
    port: 5174,
    strictPort: false,    proxy: {
      '/api': {
        target: 'http://localhost:5001',
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
  base: '/',
  
  // Optimisations de performance
  build: {
    // Code splitting amélioré
    rollupOptions: {
      output: {        manualChunks: {
          // Séparer les dépendances vendor
          vendor: ['react', 'react-dom'],
          bootstrap: ['bootstrap', 'react-bootstrap'],
          motion: ['framer-motion'],
          router: ['react-router-dom'],
          helmet: ['react-helmet-async']
        },
        // Optimisation des noms de fichiers pour le cache
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${extType}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${extType}`;
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${extType}`;
          }
          return `assets/[name]-[hash].${extType}`;
        }
      }
    },
    // Compression et optimisation
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    },
    // Optimisation des chunks
    chunkSizeWarningLimit: 1000,
    // Optimisation des images et assets
    assetsInlineLimit: 4096, // 4kb
    // Target pour de meilleures optimisations
    target: 'esnext',
    // Source maps pour la production (optionnel)
    sourcemap: false
  },
  
  // Optimisation des assets
  assetsInclude: ['**/*.webp', '**/*.avif'],
  
  // Préprocessing CSS
  css: {
    devSourcemap: false,
    // Optimisations CSS
    modules: {
      localsConvention: 'camelCase'
    }
  },

  // Optimisations de développement
  esbuild: {
    // Optimisation des imports
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  // Configuration des dependances optimisées
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'react-bootstrap',
      'bootstrap',
      'framer-motion',
      'react-helmet-async'
    ],
    // Force la pre-bundling des dépendances critiques
    force: false
  }
  }; // Fermeture de l'objet de configuration
}); // Fermeture de la fonction defineConfig