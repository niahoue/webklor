import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';
import { SITE_CONFIG, MAIN_NAVIGATION, SERVICES } from '../utils/constants';

/**
 * Composant Footer
 * Pied de page présent sur toutes les pages du site
 */
const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        {/* Section newsletter */}
        <Row className="mb-5">
          <Col lg={6} className="mx-auto">
            <div className="bg-dark-subtle p-4 rounded">
              <h4 className="text-white text-center mb-3">Restez informés</h4>
              <NewsletterSignup variant="simple" />
            </div>
          </Col>
        </Row>
        
        <Row>
          {/* Logo et description */}
          <Col lg={4} className="mb-4 mb-lg-0">
            <Link to="/" className="d-inline-block mb-3">
              <span className="logo-text h3">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mb-4">
              {SITE_CONFIG.description}
            </p>
            <div className="social-links">
              <a href={SITE_CONFIG.socialLinks.facebook} className="me-3 text-light"><i className="bi bi-facebook"></i></a>
              <a href={SITE_CONFIG.socialLinks.twitter} className="me-3 text-light"><i className="bi bi-twitter"></i></a>
              <a href={SITE_CONFIG.socialLinks.instagram} className="me-3 text-light"><i className="bi bi-instagram"></i></a>
              <a href={SITE_CONFIG.socialLinks.linkedin} className="me-3 text-light"><i className="bi bi-linkedin"></i></a>
            </div>
          </Col>
          
          {/* Liens rapides */}
          <Col lg={2} md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3 text-white">Liens rapides</h5>
            <ul className="list-unstyled">
              {MAIN_NAVIGATION.map((item) => (
                <li key={item.path} className="mb-2">
                  <Link to={item.path} className="text-light text-decoration-none">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          
          {/* Services */}
          <Col lg={3} md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3 text-white">Nos services</h5>
            <ul className="list-unstyled">
              {SERVICES.map((service) => (
                <li key={service.title} className="mb-2">
                  <a href="/services" className="text-light text-decoration-none">
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
          
          {/* Contact */}
          <Col lg={3} md={4}>
            <h5 className="mb-3 text-white">Contact</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-geo-alt me-2"></i>
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-envelope me-2"></i>
                <span>{SITE_CONFIG.email}</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-telephone me-2"></i>
                <span>{SITE_CONFIG.phone}</span>
              </li>
              <li className="d-flex align-items-center">
                <i className="bi bi-clock me-2"></i>
                <span>{SITE_CONFIG.hours}</span>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4 bg-light" />
        
        {/* Copyright */}
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">&copy; {new Date().getFullYear()} WebKlor. Tous droits réservés.</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item"><Link to="/mentions-legales" className="text-light text-decoration-none">Mentions légales</Link></li>
              <li className="list-inline-item mx-3">|</li>
              <li className="list-inline-item"><Link to="/politique-confidentialite" className="text-light text-decoration-none">Politique de confidentialité</Link></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
