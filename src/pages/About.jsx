import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import LazyImage from '../components/LazyImage';
import { containerVariants, itemVariants } from '../utils/animations';
import { COMPANY_VALUES } from '../utils/constants';
import '../styles/about.css';

/**
 * Page À propos
 * Présente l'histoire, la mission et l'équipe de WebKlor
 */
const About = () => {
  // Configuration SEO de la page
  const seoData = {
    title: "À Propos - WebKlor | Notre Équipe & Expertise Digitale",
    description: "Découvrez l'histoire de WebKlor, agence web spécialisée en création de sites internet professionnels depuis 2020. Notre équipe d'experts certifiés accompagne plus de 150 entreprises dans leur transformation digitale. Expertise reconnue en développement web, SEO et marketing digital.",
    keywords: "à propos webklor, histoire agence web, équipe développeurs experts, mission webklor, valeurs entreprise, expertise digitale, transformation digitale, agence web certifiée",
    canonicalUrl: "https://www.webklor.com/a-propos",
    schemaType: "organization"
  };
  // Configuration des animations au défilement
  const [missionRef, missionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [teamRef, teamInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <main>
      <SEO {...seoData} />
      
      {/* En-tête de page avec composant réutilisable */}
      <PageHeader 
        title="À propos de WebKlor"
        subtitle="Découvrez notre histoire, notre mission et notre équipe passionnée"
      />

      {/* Section Notre Histoire */}
      <section className="our-story py-5">
        <Container>
          <motion.div
            ref={missionRef}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="align-items-center">
              <Col lg={6}>
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Notre Histoire</h2>
                  <p className="mb-3">
                    Fondée en 2020, WebKlor est née de la passion commune de ses fondateurs pour le digital et le design. Notre objectif était simple : créer une agence qui combine expertise technique et créativité pour offrir des solutions digitales complètes et innovantes.
                  </p>
                  <p className="mb-3">
                    Au fil des années, nous avons évolué pour devenir un acteur majeur dans le domaine de la création web et du marketing digital en Côte d'Ivoire, tout en conservant notre approche personnalisée et notre engagement envers l'excellence.
                  </p>
                  <p className="mb-3">
                    Aujourd'hui, notre équipe multidisciplinaire accompagne plus de 150 entreprises de toutes tailles dans leur transformation digitale, avec une attention particulière portée à chaque détail et une volonté constante d'innovation.
                  </p>
                  <p>
                    Nous sommes fiers d'avoir aidé nos clients à augmenter leur chiffre d'affaires de 40% en moyenne grâce à nos solutions digitales sur mesure et notre expertise reconnue en référencement naturel.
                  </p>
                </motion.div>
              </Col>
              <Col lg={6} className="mt-4 mt-lg-0">
                <motion.div variants={itemVariants}>
                  <LazyImage
                    src="/assets/images/moi1.png"
                    alt="L'équipe WebKlor en action"
                    className="img-fluid rounded-lg shadow-lg"
                    width="600"
                    height="400"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                  />
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Statistiques */}
      <section className="statistics bg-primary text-white py-5">
        <Container>
          <motion.div
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-3"
          >
            <Row className="text-center">
              <Col lg={3} md={6} className="mb-4 mb-lg-0">
                <motion.div variants={itemVariants}>
                  <div className="display-3 fw-bold mb-2">150+</div>
                  <h3 className="h5 mb-0">Clients Satisfaits</h3>
                  <p className="mb-0 opacity-75">Entreprises accompagnées</p>
                </motion.div>
              </Col>
              <Col lg={3} md={6} className="mb-4 mb-lg-0">
                <motion.div variants={itemVariants}>
                  <div className="display-3 fw-bold mb-2">200+</div>
                  <h3 className="h5 mb-0">Projets Réalisés</h3>
                  <p className="mb-0 opacity-75">Sites web et applications</p>
                </motion.div>
              </Col>
              <Col lg={3} md={6} className="mb-4 mb-md-0">
                <motion.div variants={itemVariants}>
                  <div className="display-3 fw-bold mb-2">4+</div>
                  <h3 className="h5 mb-0">Années d'Expérience</h3>
                  <p className="mb-0 opacity-75">Expertise digitale</p>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div variants={itemVariants}>
                  <div className="display-3 fw-bold mb-2">40%</div>
                  <h3 className="h5 mb-0">Croissance Moyenne</h3>
                  <p className="mb-0 opacity-75">CA clients après projet</p>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
      <section className="our-mission bg-light py-5">
        <Container>
          <motion.div
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <motion.h2 variants={itemVariants} className="fw-bold mb-4">
                  Notre Mission
                </motion.h2>
                <motion.p variants={itemVariants} className="lead mb-5">
                  Transformer votre vision en réalité numérique en combinant expertise technique, créativité et stratégie marketing.
                </motion.p>
              </Col>
            </Row>
            <Row>
              {COMPANY_VALUES.map((value, index) => (
                <Col md={6} lg={3} key={index} className="mb-4">
                  <motion.div
                    variants={itemVariants}
                    className="card h-100 border-0 shadow-sm"
                  >
                    <div className="card-body text-center p-4">
                      <div className="display-4 mb-3">{value.icon}</div>
                      <h3 className="h5">{value.title}</h3>
                      <p className="card-text">{value.description}</p>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Notre Processus */}
      <section className="our-process py-5">
        <Container>
          <motion.div
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="justify-content-center text-center mb-5">
              <Col lg={8}>
                <motion.h2 variants={itemVariants} className="fw-bold mb-4">
                  Notre Processus de Travail
                </motion.h2>
                <motion.p variants={itemVariants} className="lead">
                  Une méthodologie éprouvée en 5 étapes pour garantir le succès de votre projet digital
                </motion.p>
              </Col>
            </Row>
            <Row>
              {[
                {
                  step: "01",
                  title: "Écoute & Analyse",
                  description: "Nous analysons vos besoins, vos objectifs et votre marché pour comprendre vos enjeux.",
                  icon: "👂"
                },
                {
                  step: "02", 
                  title: "Stratégie & Conception",
                  description: "Nous élaborons une stratégie sur mesure et concevons l'architecture de votre solution.",
                  icon: "📋"
                },
                {
                  step: "03",
                  title: "Développement",
                  description: "Notre équipe technique développe votre projet en suivant les meilleures pratiques.",
                  icon: "⚙️"
                },
                {
                  step: "04",
                  title: "Tests & Optimisation",
                  description: "Nous testons minutieusement et optimisons les performances avant la mise en ligne.",
                  icon: "🔍"
                },
                {
                  step: "05",
                  title: "Lancement & Suivi",
                  description: "Nous accompagnons le lancement et assurons un suivi pour maximiser vos résultats.",
                  icon: "🚀"
                }
              ].map((process, index) => (
                <Col lg={2} md={4} sm={6} key={index} className="mb-4">
                  <motion.div variants={itemVariants} className="text-center">
                    <div className="position-relative mb-3">
                      <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                           style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                        {process.icon}
                      </div>
                      <span className="position-absolute top-0 start-100 translate-middle badge bg-secondary">
                        {process.step}
                      </span>
                    </div>
                    <h3 className="h6 fw-bold mb-2">{process.title}</h3>
                    <p className="small text-muted">{process.description}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>
      <section className="our-team py-5">
        <Container>
          <motion.div
            ref={teamRef}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="fw-bold">Notre Équipe</h2>
              <p className="lead">Des experts passionnés à votre service</p>
            </motion.div>
            <Row>
              {[
                {
                  name: "Sophie A Fatto",
                  role: "Web Designer ux/ui",
                  image: "/assets/images/collabo5.png",
                  description: "Experte en design et UX/UI avec plus de 10 ans d'expérience dans la création d'interfaces utilisateur intuitives et esthétiques."
                },
                {
                  name: "Thomas G Grebio",
                  role: "Développeur Web Senior",
                  image: "/assets/images/collabo2.png",
                  description: "Spécialiste en développement front-end et back-end, passionné par les technologies web modernes et l'optimisation des performances."
                },
                {
                  name: "Camille K Kouadio",
                  role: "Experte SEO & Marketing",
                  image: "/assets/images/collabo1.png",
                  description: "Stratège en référencement et marketing digital, avec une approche axée sur les données pour maximiser la visibilité en ligne."
                },
                {
                  name: "Ange Pacome Niahoue",
                  role: "Chef de Projet",
                  image: "/assets/images/moi.png",
                  description: "Coordinateur expérimenté qui assure la livraison de projets de qualité dans les délais, avec une communication transparente."
                }
              ].map((member, index) => (
                <Col lg={3} md={6} key={index} className="mb-4">
                  <motion.div variants={itemVariants}>
                    <Card className="border-0 shadow-sm h-100">
                      <LazyImage
                        src={member.image}
                        alt={member.name}
                        className="card-img-top"
                        width="300"
                        height="300"
                        sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, 25vw"
                        style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                      />
                      <Card.Body className="text-center">
                        <Card.Title as="h3" className="h5">{member.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-primary">{member.role}</Card.Subtitle>
                        <Card.Text>{member.description}</Card.Text>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Certifications et Partenariats */}
      <section className="certifications bg-light py-5">
        <Container>
          <motion.div
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="justify-content-center text-center mb-5">
              <Col lg={8}>
                <motion.h2 variants={itemVariants} className="fw-bold mb-4">
                  Certifications & Partenariats
                </motion.h2>
                <motion.p variants={itemVariants} className="lead">
                  Nos expertises reconnues et nos partenariats de confiance
                </motion.p>
              </Col>
            </Row>
            <Row className="align-items-center justify-content-center">
              <Col lg={3} md={4} sm={6} className="mb-4 text-center">
                <motion.div variants={itemVariants} className="p-3">
                  <div className="bg-white rounded-lg shadow-sm p-4 h-100 d-flex flex-column align-items-center">
                    <div className="mb-3" style={{ fontSize: '48px' }}>🏆</div>
                    <h3 className="h6 fw-bold mb-2">Google Certified</h3>
                    <p className="small text-muted mb-0">Google Analytics & Ads</p>
                  </div>
                </motion.div>
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-4 text-center">
                <motion.div variants={itemVariants} className="p-3">
                  <div className="bg-white rounded-lg shadow-sm p-4 h-100 d-flex flex-column align-items-center">
                    <div className="mb-3" style={{ fontSize: '48px' }}>📱</div>
                    <h3 className="h6 fw-bold mb-2">Meta Certified</h3>
                    <p className="small text-muted mb-0">Social Media Marketing</p>
                  </div>
                </motion.div>
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-4 text-center">
                <motion.div variants={itemVariants} className="p-3">
                  <div className="bg-white rounded-lg shadow-sm p-4 h-100 d-flex flex-column align-items-center">
                    <div className="mb-3" style={{ fontSize: '48px' }}>🔒</div>
                    <h3 className="h6 fw-bold mb-2">SSL Certified</h3>
                    <p className="small text-muted mb-0">Sécurité Web</p>
                  </div>
                </motion.div>
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-4 text-center">
                <motion.div variants={itemVariants} className="p-3">
                  <div className="bg-white rounded-lg shadow-sm p-4 h-100 d-flex flex-column align-items-center">
                    <div className="mb-3" style={{ fontSize: '48px' }}>⚡</div>
                    <h3 className="h6 fw-bold mb-2">Performance Expert</h3>
                    <p className="small text-muted mb-0">Optimisation Web</p>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Technologies */}
      <section className="technologies py-5">
        <Container>
          <motion.div
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="justify-content-center text-center mb-5">
              <Col lg={8}>
                <motion.h2 variants={itemVariants} className="fw-bold mb-4">
                  Technologies & Outils
                </motion.h2>
                <motion.p variants={itemVariants} className="lead">
                  Nous maîtrisons les dernières technologies pour créer des solutions performantes
                </motion.p>
              </Col>
            </Row>
            <Row>
              {[
                { name: "React", category: "Frontend", icon: "⚛️" },
                { name: "Node.js", category: "Backend", icon: "🟢" },
                { name: "WordPress", category: "CMS", icon: "📝" },
                { name: "Shopify", category: "E-commerce", icon: "🛒" },
                { name: "Google Analytics", category: "Analytics", icon: "📊" },
                { name: "Figma", category: "Design", icon: "🎨" }
              ].map((tech, index) => (
                <Col lg={2} md={4} sm={6} key={index} className="mb-4">
                  <motion.div variants={itemVariants} className="text-center">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body p-3">
                        <div className="mb-2" style={{ fontSize: '32px' }}>{tech.icon}</div>
                        <h3 className="h6 fw-bold mb-1">{tech.name}</h3>
                        <p className="small text-muted mb-0">{tech.category}</p>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Engagement Qualité */}
      <section className="quality-commitment bg-primary text-white py-5">
        <Container>
          <motion.div
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="justify-content-center text-center mb-5">
              <Col lg={8}>
                <motion.h2 variants={itemVariants} className="fw-bold mb-4">
                  Notre Engagement Qualité
                </motion.h2>
                <motion.p variants={itemVariants} className="lead opacity-90">
                  Des garanties concrètes pour votre tranquillité d'esprit
                </motion.p>
              </Col>
            </Row>
            <Row>
              <Col lg={3} md={6} className="mb-4">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="mb-3" style={{ fontSize: '48px' }}>✅</div>
                  <h3 className="h5 fw-bold mb-2">Garantie Satisfaction</h3>
                  <p className="opacity-90">100% satisfait ou remboursé</p>
                </motion.div>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="mb-3" style={{ fontSize: '48px' }}>🕐</div>
                  <h3 className="h5 fw-bold mb-2">Respect des Délais</h3>
                  <p className="opacity-90">Livraison dans les temps convenus</p>
                </motion.div>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="mb-3" style={{ fontSize: '48px' }}>🛡️</div>
                  <h3 className="h5 fw-bold mb-2">Maintenance Incluse</h3>
                  <p className="opacity-90">6 mois de maintenance gratuite</p>
                </motion.div>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <motion.div variants={itemVariants} className="text-center">
                  <div className="mb-3" style={{ fontSize: '48px' }}>📞</div>
                  <h3 className="h5 fw-bold mb-2">Support Réactif</h3>
                  <p className="opacity-90">Réponse sous 24h garantie</p>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
    </main>
  );
};

export default About;
