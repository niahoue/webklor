import { motion } from 'framer-motion';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import AnimatedCard from '../components/AnimatedCard';
import LazyImage from '../components/LazyImage';
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
    title: "Agence Web Professionnelle - Création Sites Internet & SEO",
    description: "WebKlor, agence web experte depuis 2020. Création de sites internet professionnels, référencement SEO, marketing digital, développement d'applications sur mesure. Plus de 150 projets réalisés. Devis gratuit sous 24h. Accompagnement complet de A à Z.",
    keywords: "agence web professionnelle, création site internet, développement web, référencement SEO, marketing digital, site web professionnel, application web, e-commerce, maintenance web, webklor, agence digitale france",
    canonicalUrl: "https://www.webklor.com",
    schemaType: "website"
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
                <motion.h1 variants={itemVariants} className="display-4 fw-bold mb-4 text-dark">
                  Transformez Votre Présence Digitale avec 
                  <span className="d-block" style={{ color: '#FFC107' }}>WebKlor</span>
                </motion.h1>
                <motion.p variants={itemVariants} className="lead mb-4 fs-5 text-dark">
                  Agence web d'excellence depuis 2020. Nous créons des expériences digitales exceptionnelles qui 
                  <strong> propulsent votre business</strong> vers le succès. Plus de 150 entreprises nous font déjà confiance.
                </motion.p>
                <motion.div variants={itemVariants} className="mb-4">
                  <div className="row g-2">
                    <div className="col-sm-6">
                      <div className="badge bg-light text-dark px-3 py-2 w-100 d-flex align-items-center">
                        <i className="bi bi-rocket-takeoff me-2 text-primary"></i>
                        Sites Web Performants
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="badge bg-light text-dark px-3 py-2 w-100 d-flex align-items-center">
                        <i className="bi bi-graph-up-arrow me-2 text-success"></i>
                        SEO Optimisé
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="badge bg-light text-dark px-3 py-2 w-100 d-flex align-items-center">
                        <i className="bi bi-laptop me-2 text-info"></i>
                        Applications Sur Mesure
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="badge bg-light text-dark px-3 py-2 w-100 d-flex align-items-center">
                        <i className="bi bi-palette me-2 text-warning"></i>
                        Design Moderne
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="d-flex flex-column flex-sm-row gap-3">
                  <Button 
                    variant="light" 
                    size="lg" 
                    className="rounded-pill fw-bold px-4 py-3"
                    onClick={() => navigate('/services')}
                  >
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Découvrir nos services
                  </Button>
                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    className="rounded-pill px-4 py-3"
                    onClick={() => navigate('/contact')}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Devis gratuit
                  </Button>
                </motion.div>
              </Col>
              <Col lg={6} className="mt-5 mt-lg-0">
                <motion.div
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="hero-image-container">
                    <LazyImage
                      src="/assets/images/1000059598.png"
                      alt="WebKlor - Agence web professionnelle spécialisée en création de sites internet, SEO et marketing digital"
                      className="img-fluid hero-image w-100"
                      priority={true}
                      width="600"
                      height="450"
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                      style={{ 
                        objectFit: 'contain',
                        objectPosition: 'center',
                        aspectRatio: '4/3'
                      }}
                    />
                  </div>
                  <motion.div 
                    variants={itemVariants}
                    className="mt-4 text-center"
                  >
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <div className="badge bg-light text-primary px-3 py-2 rounded-pill">
                        <i className="bi bi-check-circle me-2"></i>
                        +150 Projets Réalisés
                      </div>
                      <div className="badge bg-light text-primary px-3 py-2 rounded-pill">
                        <i className="bi bi-clock me-2"></i>
                        Devis en 24h
                      </div>
                      <div className="badge bg-light text-primary px-3 py-2 rounded-pill">
                        <i className="bi bi-shield-check me-2"></i>
                        Garantie Satisfaction
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Confiance */}
      <section className="trust-section py-4 bg-light">
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Row className="align-items-center">
              <Col lg={3} md={6} className="mb-3 mb-lg-0">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="text-primary mb-2">
                    <i className="bi bi-award fs-1"></i>
                  </div>
                  <h6 className="fw-bold mb-1">Expertise Reconnue</h6>
                  <small className="text-muted">5 ans d'expérience</small>
                </motion.div>
              </Col>
              <Col lg={3} md={6} className="mb-3 mb-lg-0">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="text-success mb-2">
                    <i className="bi bi-people fs-1"></i>
                  </div>
                  <h6 className="fw-bold mb-1">150+ Clients</h6>
                  <small className="text-muted">Satisfaits dans le monde</small>
                </motion.div>
              </Col>
              <Col lg={3} md={6} className="mb-3 mb-lg-0">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="text-warning mb-2">
                    <i className="bi bi-lightning fs-1"></i>
                  </div>
                  <h6 className="fw-bold mb-1">Livraison Rapide</h6>
                  <small className="text-muted">Respect des délais</small>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div variants={itemVariants} className="text-center">
                  <div className="text-info mb-2">
                    <i className="bi bi-headset fs-1"></i>
                  </div>
                  <h6 className="fw-bold mb-1">Support 24/7</h6>
                  <small className="text-muted">Assistance continue</small>
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
              <h2 className="fw-bold display-5 mb-4">Nos Services Digitaux Complets</h2>
              <p className="lead text-muted mx-auto" style={{maxWidth: '800px'}}>
                De la conception à la maintenance, nous vous accompagnons dans tous vos projets digitaux. 
                Découvrez notre gamme complète de services pour développer votre présence en ligne et 
                atteindre vos objectifs business.
              </p>
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

      {/* Section Pourquoi choisir WebKlor */}
      <section className="why-choose py-5 bg-light">
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="py-5"
          >
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="fw-bold display-5 mb-4">Pourquoi Choisir WebKlor ?</h2>
              <p className="lead text-muted mx-auto" style={{maxWidth: '800px'}}>
                Notre expertise technique combinée à notre approche centrée sur vos objectifs 
                business fait de nous le partenaire idéal pour votre transformation digitale.
              </p>
            </motion.div>
            
            <Row className="g-4">
              <Col md={4}>
                <motion.div variants={itemVariants} className="text-center h-100">
                  <div className="mb-4">
                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-trophy text-white fs-2"></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-3">Expertise Reconnue</h4>
                  <p className="text-muted">
                    Plus de 5 ans d'expérience en développement web et marketing digital. 
                    Notre équipe maîtrise les dernières technologies et tendances du secteur.
                  </p>
                </motion.div>
              </Col>
              
              <Col md={4}>
                <motion.div variants={itemVariants} className="text-center h-100">
                  <div className="mb-4">
                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-people text-white fs-2"></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-3">Approche Personnalisée</h4>
                  <p className="text-muted">
                    Chaque projet est unique. Nous analysons vos besoins spécifiques pour 
                    créer des solutions sur mesure adaptées à votre secteur d'activité.
                  </p>
                </motion.div>
              </Col>
              
              <Col md={4}>
                <motion.div variants={itemVariants} className="text-center h-100">
                  <div className="mb-4">
                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-headset text-white fs-2"></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-3">Support Continu</h4>
                  <p className="text-muted">
                    Accompagnement complet de la conception au lancement, puis maintenance 
                    et évolutions. Notre support technique est disponible quand vous en avez besoin.
                  </p>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Contenu SEO Enrichi */}
      <section className="seo-content py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} className="mb-5">
                  <h2 className="fw-bold mb-4 text-center">WebKlor : Votre Partenaire Digital de Confiance depuis 2020</h2>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <h3 className="h5 fw-bold text-primary mb-3">Expertise Technique Avancée</h3>
                      <p className="text-muted">
                        Notre équipe d'experts maîtrise les technologies web les plus récentes : React.js, Node.js, 
                        MongoDB, et les derniers frameworks de développement. Nous créons des solutions digitales 
                        performantes, sécurisées et évolutives qui répondent aux exigences les plus élevées du 
                        marché français et international.
                      </p>
                    </div>
                    <div className="col-md-6 mb-4">
                      <h3 className="h5 fw-bold text-primary mb-3">Référencement SEO de Pointe</h3>
                      <p className="text-muted">
                        Chaque site web que nous développons intègre dès sa conception les meilleures pratiques 
                        SEO : optimisation technique, structure de données, performance web, compatibilité mobile 
                        et stratégie de contenu. Nos clients bénéficient d'une visibilité accrue sur Google et 
                        des moteurs de recherche.
                      </p>
                    </div>
                    <div className="col-md-6 mb-4">
                      <h3 className="h5 fw-bold text-primary mb-3">Solutions E-commerce Performantes</h3>
                      <p className="text-muted">
                        Nous concevons des boutiques en ligne qui convertissent : interface utilisateur intuitive, 
                        parcours d'achat optimisé, intégration des moyens de paiement sécurisés, gestion des stocks 
                        automatisée. Nos solutions e-commerce génèrent des résultats mesurables et durables pour 
                        votre activité commerciale.
                      </p>
                    </div>
                    <div className="col-md-6 mb-4">
                      <h3 className="h5 fw-bold text-primary mb-3">Accompagnement Personnalisé</h3>
                      <p className="text-muted">
                        Chaque projet bénéficie d'un accompagnement sur mesure : analyse approfondie de vos besoins, 
                        conseil stratégique, formation à l'utilisation, maintenance préventive et évolutive. 
                        Notre relation client se construit dans la durée pour garantir le succès de votre 
                        transformation digitale.
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center mt-5 p-4 bg-light rounded">
                    <h3 className="h4 fw-bold text-primary mb-3">Pourquoi Plus de 150 Entreprises Nous Font Confiance ?</h3>
                    <p className="mb-3">
                      <strong>Méthodologie éprouvée :</strong> Approche agile, livrables réguliers, communication transparente et respect des délais.<br />
                      <strong>Expertise certifiée :</strong> Équipe formée aux dernières technologies et bonnes pratiques du web.<br />
                      <strong>Résultats concrets :</strong> Augmentation du trafic, amélioration du taux de conversion, satisfaction client mesurée.<br />
                      <strong>Support réactif :</strong> Assistance technique 24/7, suivi post-lancement, évolutions continues.<br />
                      <strong>Résultats mesurables :</strong> Chaque projet est suivi par des KPIs précis et des rapports détaillés.
                    </p>
                    <p className="text-muted mb-0">
                      De la startup innovante à la grande entreprise, nous adaptons nos solutions à votre secteur 
                      d'activité et vos objectifs business. Notre expertise couvre tous les domaines du digital : 
                      développement web, mobile, SEO, marketing automation, analytics et transformation digitale globale.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Section CTA */}
      <section className="cta bg-primary text-light text-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="fw-bold mb-4">Prêt à Propulser Votre Entreprise en Ligne ?</h2>
              <p className="lead mb-4">
                Rejoignez plus de 150 entreprises qui nous font confiance. Obtenez un devis gratuit 
                et personnalisé sous 24h pour votre projet digital.
              </p>
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
