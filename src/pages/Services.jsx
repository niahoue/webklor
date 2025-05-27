import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { containerVariants, itemVariants } from '../utils/animations';
import { WORK_PROCESS } from '../utils/constants';

/**
 * Page Services
 * Présente en détail les services offerts par WebKlor
 */
const Services = () => {
  // Configuration SEO de la page
  const seoData = {
    title: "Nos Services",
    description: "Découvrez nos services de création de sites web, SEO, marketing digital, identité visuelle et maintenance web pour propulser votre entreprise vers le succès.",
    keywords: "création site web, SEO, marketing digital, identité visuelle, logo, flyers, maintenance web, WebKlor",
    canonicalUrl: "https://www.webklor.com/services"
  };
  // Configuration des animations au défilement
  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [processRef, processInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <main>
      <SEO {...seoData} />
      
      {/* En-tête de page avec composant réutilisable */}
      <PageHeader 
        title="Nos Services"
        subtitle="Des solutions digitales complètes pour propulser votre entreprise"
      />

      {/* Section Services Détaillés */}
      <section className="services-detailed py-5">
        <Container>
          <motion.div
            ref={servicesRef}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="mb-5">
              <Col lg={6} className="mb-4 mb-lg-0">
                <motion.div variants={itemVariants}>
                  <img
                    src="/assets/images/devop.png"
                    alt="Création de sites web professionnels"
                    className="img-fluid rounded-lg shadow-lg"
                  />
                </motion.div>
              </Col>
              <Col lg={6}>
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Création de Sites Web</h2>
                  <p className="mb-3">
                    Nous concevons des sites web sur mesure qui reflètent l'identité de votre entreprise tout en offrant une expérience utilisateur optimale. Chaque site est développé avec les technologies les plus récentes pour garantir performance, sécurité et compatibilité sur tous les appareils.
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Sites vitrines élégants et professionnels</li>
                    <li className="mb-2">✓ Boutiques e-commerce complètes et sécurisées</li>
                    <li className="mb-2">✓ Applications web personnalisées</li>
                    <li className="mb-2">✓ Design responsive pour tous les appareils</li>
                    <li>✓ Intégration de systèmes de gestion de contenu</li>
                  </ul>
                </motion.div>
              </Col>
            </Row>

            <Row className="mb-5 mt-5 pt-5">
              <Col lg={6} className="order-lg-2 mb-4 mb-lg-0">
                <motion.div variants={itemVariants}>
                  <img
                    src="/assets/images/1000059597.png"
                    alt="Stratégies SEO et marketing digital"
                    className="img-fluid rounded-lg shadow-lg"
                  />
                </motion.div>
              </Col>
              <Col lg={6} className="order-lg-1">
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">SEO & Marketing Digital</h2>
                  <p className="mb-3">
                    Améliorez votre visibilité en ligne et attirez plus de clients grâce à nos stratégies de référencement et de marketing digital sur mesure. Nous utilisons des techniques éprouvées pour optimiser votre présence en ligne et générer un trafic qualifié.
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Audit SEO complet et optimisation on-page</li>
                    <li className="mb-2">✓ Stratégies de contenu et de mots-clés</li>
                    <li className="mb-2">✓ Campagnes publicitaires Google Ads et réseaux sociaux</li>
                    <li className="mb-2">✓ Analyse de performance et rapports détaillés</li>
                    <li>✓ Stratégies de marketing par e-mail</li>
                  </ul>
                </motion.div>
              </Col>
            </Row>

            <Row className="mb-5 mt-5 pt-5">
              <Col lg={6} className="mb-4 mb-lg-0">
                <motion.div variants={itemVariants}>
                  <img
                    src="/assets/images/designer.png"
                    alt="Création d'identité visuelle"
                    className="img-fluid rounded-lg shadow-lg"
                  />
                </motion.div>
              </Col>
              <Col lg={6}>
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Identité Visuelle</h2>
                  <p className="mb-3">
                    Démarquez-vous de la concurrence avec une identité visuelle forte et cohérente. Nous créons des éléments graphiques qui reflètent les valeurs et la personnalité de votre entreprise, renforçant ainsi votre image de marque.
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Création de logos uniques et mémorables</li>
                    <li className="mb-2">✓ Conception de chartes graphiques complètes</li>
                    <li className="mb-2">✓ Design de flyers, brochures et supports imprimés</li>
                    <li className="mb-2">✓ Création de bannières et visuels pour réseaux sociaux</li>
                    <li>✓ Conception de cartes de visite et papeterie d'entreprise</li>
                  </ul>
                </motion.div>
              </Col>
            </Row>

            <Row className="mt-5 pt-5">
              <Col lg={6} className="order-lg-2 mb-4 mb-lg-0">
                <motion.div variants={itemVariants}>
                  <img
                    src="/assets/images/1000061493.png"
                    alt="Maintenance de sites web"
                    className="img-fluid rounded-lg shadow-lg"
                  />
                </motion.div>
              </Col>
              <Col lg={6} className="order-lg-1">
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Maintenance Web</h2>
                  <p className="mb-3">
                    Assurez la pérennité et la sécurité de votre site web grâce à nos services de maintenance régulière. Nous veillons à ce que votre site reste performant, sécurisé et à jour avec les dernières technologies.
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Mises à jour régulières de sécurité</li>
                    <li className="mb-2">✓ Sauvegardes automatiques et restauration</li>
                    <li className="mb-2">✓ Surveillance des performances et optimisation</li>
                    <li className="mb-2">✓ Support technique réactif</li>
                    <li>✓ Mises à jour de contenu et ajout de fonctionnalités</li>
                  </ul>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Notre Processus */}
      <section className="our-process bg-light py-5">
        <Container>
          <motion.div
            ref={processRef}
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="fw-bold">Notre Processus</h2>
              <p className="lead">Une approche méthodique pour des résultats optimaux</p>
            </motion.div>

            <Row>
              {WORK_PROCESS.map((step, index) => (
                <Col md={6} lg={4} key={index} className="mb-4">
                  <motion.div
                    variants={itemVariants}
                    className="card h-100 border-0 shadow-sm"
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {step.number}
                        </div>
                        <h3 className="h5 mb-0">{step.title}</h3>
                      </div>
                      <p className="card-text">{step.description}</p>
                    </div>
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

export default Services;
