import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// Importation des styles avec optimisations
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/global.css'
import './styles/performance.css'
import App from './App.jsx'
import ScrollToTop from './components/ScrollToTop'

// Service Worker pour la mise en cache et l'optimisation des performances
import { registerSW } from './utils/serviceWorker'
import { initializePerformanceOptimizations } from './utils/performance'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)

// Enregistrer le Service Worker pour la mise en cache et l'optimisation des performances
registerSW();

// Initialiser toutes les optimisations de performance
initializePerformanceOptimizations();
