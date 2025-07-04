import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import { Spinner } from 'react-bootstrap';


// Contextes
import { AuthProvider } from './contexts/AuthContext';

// Composants essentiels (non lazy-loaded)
import ConditionalNavbar from './components/ConditionalNavbar';
import ConditionalFooter from './components/ConditionalFooter';
import AccessibilityCheck from './components/AccessibilityCheck';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ResourcePreloader from './components/ResourcePreloader';
import ThirdPartyScripts from './components/ThirdPartyScripts';

// Pages avec lazy loading pour optimiser le bundle
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const BrandKit = lazy(() => import('./pages/BrandKit'));
const LegalNotices = lazy(() => import('./pages/LegalNotices'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Login = lazy(() => import('./pages/Login'));
const ConfirmSubscription = lazy(() => import('./pages/ConfirmSubscription'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));

// Test component
const TestCard = lazy(() => import('./components/TestCard'));
const TestTestimonials = lazy(() => import('./components/TestTestimonials'));

// Pages admin avec lazy loading
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminBlog = lazy(() => import('./pages/AdminBlog'));
const AdminNewsletter = lazy(() => import('./pages/AdminNewsletter'));
const AdminSubscribers = lazy(() => import('./pages/AdminSubscribers'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminComments = lazy(() => import('./pages/AdminComments'));
const BlogEditor = lazy(() => import('./components/BlogEditor'));

import { pageVariants } from './utils/animations';

// Composant de chargement pour le Suspense
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
    <Spinner animation="border" variant="primary" role="status">
      <span className="visually-hidden">Chargement...</span>
    </Spinner>
  </div>
);

/**
 * Composant principal de l'application
 * Gère le routage et la structure globale du site
 */
function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <ResourcePreloader />
          <ThirdPartyScripts />
          <div className="app">
            <ConditionalNavbar />
            <AccessibilityCheck />
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Suspense fallback={<LoadingSpinner />}>
            
                <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/temoignages" element={<Testimonials />} />
                <Route path="/test-card" element={<TestCard />} />
                <Route path="/test-testimonials" element={<TestTestimonials />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/kit-de-marque" element={<BrandKit />} />
                <Route path="/mentions-legales" element={<LegalNotices />} />
                <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
                <Route path="/login" element={<Login />} />
                <Route path="/confirm-subscription/:token" element={<ConfirmSubscription />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
              
              {/* Routes protégées d'administration */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/blog/new" element={<BlogEditor />} />
                <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
                <Route path="/admin/newsletter" element={<AdminNewsletter />} />
                <Route path="/admin/subscribers" element={<AdminSubscribers />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/comments" element={<AdminComments />} />
              </Route>              </Routes>
            </Suspense>
          </motion.div>
          <ConditionalFooter />
        </div>
      </AuthProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
