import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MAIN_NAVIGATION, SITE_CONFIG } from '../utils/constants';
import { linkVariants } from '../utils/animations';

/**
 * Composant de navigation principal redesigné
 * Navigation responsive avec contraste amélioré et visibilité optimisée
 */
const NavbarComponent = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Effet pour détecter le défilement et changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle du menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Fermer le menu mobile lors du clic sur un lien
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Effet pour fermer le menu mobile quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.webklor-navbar')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);
   return (
    <>
      {/* Overlay supprimé pour ne plus masquer le contenu */}

      <nav 
        className={`webklor-navbar ${scrolled ? 'webklor-navbar-scrolled' : 'webklor-navbar-transparent'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
          padding: '1rem 0',
          transition: 'all 0.3s ease',
          background: scrolled
            ? '#ffffff' 
            : 'transparent',
          backdropFilter: scrolled ? 'blur(15px)' : 'blur(10px)',
          borderBottom: scrolled 
            ? '1px solid rgba(0, 0, 0, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: scrolled 
            ? '0 4px 30px rgba(0, 0, 0, 0.15)' 
            : '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
      <div className="container">
        <div className="webklor-navbar-content">
          {/* Logo et brand */}
          <Link to="/" className="webklor-navbar-brand">
            <motion.div 
              className="webklor-navbar-logo"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <img
                src={SITE_CONFIG.logo}
                alt={`${SITE_CONFIG.name} logo`}
                style={{ 
                  height: '38px',
                  marginRight: '0.5rem',
                  background: 'rgba(255,255,255,0.9)', 
                  borderRadius: '10px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '2px'
                }}
              />
              <span 
                className="webklor-logo-text"
                style={{
                  fontWeight: '700',
                  fontSize: '1.5rem',
                  color: scrolled ? '#007bff' : '#fff',
                  textShadow: scrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {SITE_CONFIG.name}
              </span>
            </motion.div>
          </Link>

          {/* Menu desktop */}
          <div className="webklor-navbar-menu-desktop">
            {MAIN_NAVIGATION.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`webklor-navbar-link ${location.pathname === item.path ? 'webklor-navbar-link-active' : ''}`}
                style={{
                  color: scrolled ? '#007bff' : '#fff',
                  fontWeight: location.pathname === item.path ? '700' : '600',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  margin: '0 0.25rem',
                  transition: 'all 0.3s ease',
                  background: location.pathname === item.path 
                    ? (scrolled ? 'rgba(0, 123, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)')
                    : 'transparent',
                  border: location.pathname === item.path 
                    ? `1px solid ${scrolled ? 'rgba(0, 123, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)'}` 
                    : '1px solid transparent',
                  textShadow: scrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = scrolled 
                      ? 'rgba(0, 123, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 0.15)';
                    e.target.style.borderColor = scrolled 
                      ? 'rgba(0, 123, 255, 0.15)' 
                      : 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <motion.span
                  variants={linkVariants}
                  whileHover="hover"
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Bouton hamburger mobile */}
          <button
            className="webklor-navbar-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <div className="webklor-hamburger">
              <span className={mobileMenuOpen ? 'webklor-hamburger-line-1-open' : 'webklor-hamburger-line-1'}></span>
              <span className={mobileMenuOpen ? 'webklor-hamburger-line-2-open' : 'webklor-hamburger-line-2'}></span>
              <span className={mobileMenuOpen ? 'webklor-hamburger-line-3-open' : 'webklor-hamburger-line-3'}></span>
            </div>
          </button>
        </div>

        {/* Menu mobile */}
        <div 
          className={`webklor-navbar-menu-mobile ${mobileMenuOpen ? 'webklor-navbar-menu-mobile-open' : ''}`}
        >
          {MAIN_NAVIGATION.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={`webklor-navbar-link-mobile ${location.pathname === item.path ? 'webklor-navbar-link-mobile-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 991px) {
          .webklor-navbar-menu-desktop {
            display: none !important;
          }
          .webklor-navbar-toggle {
            display: block !important;
          }
          .webklor-navbar-menu-mobile {
            display: flex !important;
          }
        }
        
        @media (min-width: 992px) {
          .webklor-navbar-menu-desktop {
            display: flex !important;
            align-items: center;
          }
          .webklor-navbar-toggle {
            display: none !important;
          }
          .webklor-navbar-menu-mobile {
            display: none !important;
          }
        }

        .webklor-navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .webklor-navbar-brand {
          text-decoration: none;
        }

        .webklor-navbar-toggle:hover {
          background: rgba(255, 255, 255, 1) !important;
          border-color: #007bff !important;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.25) !important;
        }
      `}</style>
    </nav>
    </>
  );
};

export default NavbarComponent;
