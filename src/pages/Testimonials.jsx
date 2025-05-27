import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { containerVariants, itemVariants } from '../utils/animations';
import { TESTIMONIALS, COMPANY_STATS } from '../utils/constants';

/**
 * Page Témoignages
 * Présente les avis et retours d'expérience des clients de WebKlor
 */
const Testimonials = () => {
  const navigate = useNavigate();
  
  // Configuration SEO de la page
  const seoData = {
    title: "Témoignages Clients",
    description: "Découvrez ce que nos clients disent de notre collaboration et de nos services en création de sites web, SEO et marketing digital.",
    keywords: "témoignages, avis clients, retours d'expérience, satisfaction client, WebKlor",
    canonicalUrl: "https://www.webklor.com/temoignages"
  };
  // Configuration des animations au défilement
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <main>
      <SEO {...seoData} />
      
      <PageHeader 
        title="Témoignages Clients"
        subtitle="Découvrez ce que nos clients disent de notre collaboration"
      />

      {/* Section Témoignages */}
      <section className="testimonials-section py-5">
        <Container>
          <motion.div
            ref={testimonialsRef}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row>
              {TESTIMONIALS.map((testimonial) => (
                <Col lg={4} md={6} key={testimonial.id} className="mb-4">
                  <motion.div variants={itemVariants}>
                    <Card className="testimonial-card h-100 border-0 shadow-sm">
                      <Card.Body className="p-4">
                        <div className="d-flex mb-4">
                          <div className="testimonial-image me-3">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name}
                              className="rounded-circle"
                              width="60"
                              height="60"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <div>
                            <h3 className="h5 mb-1">{testimonial.name}</h3>
                            <p className="text-muted mb-0">{testimonial.company}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-warning">
                              {i < testimonial.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <p className="testimonial-text">"{testimonial.text}"</p>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Statistiques */}
      <section className="stats-section bg-light py-5">
        <Container>
          <motion.div
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="text-center">
              {COMPANY_STATS.map((stat, index) => (
                <Col lg={3} md={6} key={index} className="mb-4 mb-lg-0">
                  <motion.div variants={itemVariants}>
                    <div className="stat-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
                      <span className="display-5 fw-bold">{stat.number}</span>
                    </div>
                    <h3 className="h5">{stat.label}</h3>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Témoignage Vidéo */}
      <section className="video-testimonial py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="fw-bold mb-4">Ils parlent de nous</h2>
              <div className="ratio ratio-16x9 shadow-lg rounded-lg overflow-hidden">
                <div className="bg-dark d-flex align-items-center justify-content-center">
                  <div className="text-center text-white p-4">
                    <i className="bi bi-play-circle display-1 mb-3"></i>
                    <h3 className="h5">Témoignage vidéo de nos clients</h3>
                    <p>Cliquez pour lancer la vidéo</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Section CTA */}
      <section className="cta bg-accent text-dark text-center py-5 mt-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="fw-bold mb-4">Rejoignez nos clients satisfaits</h2>
              <p className="lead mb-4">Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir comment nous pouvons vous aider à atteindre vos objectifs.</p>
              <button 
                className="btn btn-dark btn-lg rounded-pill"
                onClick={() => navigate('/contact')}
              >
                Demander un devis gratuit
              </button>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Testimonials;
