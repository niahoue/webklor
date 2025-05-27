import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { containerVariants, itemVariants } from '../utils/animations';
import { COMPANY_VALUES } from '../utils/constants';

/**
 * Page À propos
 * Présente l'histoire, la mission et l'équipe de WebKlor
 */
const About = () => {
  // Configuration SEO de la page
  const seoData = {
    title: "À propos",
    description: "Découvrez l'histoire, la mission et l'équipe de WebKlor, experts en création de sites web, SEO et marketing digital depuis plus de 10 ans.",
    keywords: "à propos, histoire WebKlor, équipe WebKlor, mission, valeurs, expertise digitale",
    canonicalUrl: "https://www.webklor.com/a-propos"
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
                    Au fil des années, nous avons évolué pour devenir un acteur majeur dans le domaine de la création web et du marketing digital, tout en conservant notre approche personnalisée et notre engagement envers l'excellence.
                  </p>
                  <p>
                    Aujourd'hui, notre équipe multidisciplinaire accompagne des entreprises de toutes tailles dans leur transformation digitale, avec une attention particulière portée à chaque détail et une volonté constante d'innovation.
                  </p>
                </motion.div>
              </Col>
              <Col lg={6} className="mt-4 mt-lg-0">
                <motion.div variants={itemVariants}>
                  <img
                    src="/assets/images/moi1.png"
                    alt="L'équipe WebKlor en action"
                    className="img-fluid rounded-lg shadow-lg"
                  />
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Notre Mission */}
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

      {/* Section Notre Équipe */}
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
                      <Card.Img variant="top" src={member.image} alt={member.name} />
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
    </main>
  );
};

export default About;
