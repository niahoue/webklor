import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { MAIN_NAVIGATION, SITE_CONFIG } from '../utils/constants';
import { linkVariants } from '../utils/animations';

/**
 * Composant de navigation principal
 * Inclut des animations au survol et indique la page active
 */
const NavbarComponent = () => {
  const [scrolled, setScrolled] = useState(false);
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
  
  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`py-3 ${scrolled ? 'bg-white shadow-md navbar-scrolled' : 'bg-transparent navbar-transparent'}`}
      style={{ transition: 'all 0.3s ease' }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <motion.div 
            className="d-flex align-items-center logo-container navbar-logo-box"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={SITE_CONFIG.logo}
              alt={`${SITE_CONFIG.name} logo`}
              className="navbar-logo-img me-2"
              height="38"
              style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            />
            <span className="logo-text">{SITE_CONFIG.name}</span>
          </motion.div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {MAIN_NAVIGATION.map((item) => (
              <Nav.Link 
                as={Link} 
                to={item.path} 
                key={item.path}
                className={`mx-2 ${location.pathname === item.path ? 'active fw-bold' : ''}`}
              >
                <motion.span
                  variants={linkVariants}
                  whileHover="hover"
                >
                  {item.label}
                </motion.span>
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
