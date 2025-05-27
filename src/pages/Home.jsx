import { motion } from 'framer-motion';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import AnimatedCard from '../components/AnimatedCard';
import { containerVariants, itemVariants } from '../utils/animations';
import { SERVICES, COMPANY_STATS } from '../utils/constants';

/**
 * Page d'accueil
 * Présente les services principaux et l'identité de WebKlor
 */
const Home = () => {
  const navigate = useNavigate();
  
  // Configuration SEO de la page
  const seoData = {
    title: "Accueil",
    description: "WebKlor - Experts en création de sites web, SEO, marketing digital, création de logo et flyers, maintenance de site web. Transformez votre vision en réalité numérique.",
    keywords: "création site web, SEO, marketing digital, logo, flyers, maintenance web, WebKlor",
    canonicalUrl: "https://www.webklor.com"
  };
  // Configuration des animations au défilement
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [servicesRef, servicesInView] = useInView({
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
      {/* Section Hero */}
      <section className="hero bg-primary text-light py-5">
        <Container>
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="align-items-center py-5">
              <Col lg={6}>
                <motion.h1 variants={itemVariants} className="display-4 fw-bold mb-4">
                  Transformez votre vision en réalité numérique
                </motion.h1>
                <motion.p variants={itemVariants} className="lead mb-4">
                  Experts en création de sites web, SEO, marketing digital et identité visuelle pour propulser votre entreprise vers le succès.
                </motion.p>
                <motion.div variants={itemVariants}>
                  <Button 
                    variant="light" 
                    size="lg" 
                    className="me-3 rounded-pill"
                    onClick={() => navigate('/services')}
                  >
                    Nos services
                  </Button>
                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    className="rounded-pill"
                    onClick={() => navigate('/contact')}
                  >
                    Contactez-nous
                  </Button>
                </motion.div>
              </Col>
              <Col lg={6} className="mt-5 mt-lg-0">
                <motion.div
                  variants={itemVariants}
                  className="text-center"
                >
                  <img
                    src="./assets/images/1000059598.png"
                    alt="WebKlor - Expertise digitale"
                    className="img-fluid rounded-lg shadow-lg"
                  />
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Services */}
      <section className="services py-5">
        <Container>
          <motion.div
            ref={servicesRef}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="fw-bold">Nos Services</h2>
              <p className="lead">Des solutions digitales complètes pour votre entreprise</p>
            </motion.div>

            <Row>
              {SERVICES.map((service, index) => (
                <Col md={6} lg={3} key={index} className="mb-4">
                  <AnimatedCard variant="service">
                    <div className="card-body text-center p-4">
                      <div className={`icon-box bg-${service.color} text-white rounded-circle mx-auto mb-4`} style={{ width: "60px", height: "60px", lineHeight: "60px", fontSize: "24px" }}>
                        {service.icon}
                      </div>
                      <h3 className="h5 card-title">{service.title}</h3>
                      <p className="card-text">{service.description}</p>
                    </div>
                  </AnimatedCard>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Statistiques */}
      <section className="stats bg-light py-5">
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
                <Col md={3} key={index} className="mb-4 mb-md-0">
                  <motion.div variants={itemVariants}>
                    <h2 className="display-4 fw-bold text-primary">{stat.number}</h2>
                    <p className="lead">{stat.label}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section CTA */}
      <section className="cta bg-primary text-light text-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="fw-bold mb-4">Prêt à transformer votre présence en ligne?</h2>
              <p className="lead mb-4">Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis personnalisé.</p>
              <Button 
                variant="light" 
                size="lg" 
                className="rounded-pill"
                onClick={() => navigate('/contact')}
              >
                Demander un devis gratuit
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Home;
