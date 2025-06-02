import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import LazyImage from '../components/LazyImage';
import { containerVariants, itemVariants } from '../utils/animations';
import { WORK_PROCESS } from '../utils/constants';

/**
 * Page Services
 * Présente en détail les services offerts par WebKlor
 */
const Services = () => {
  // Configuration SEO de la page
  const seoData = {
    title: "Services Web Professionnels - Création Sites & Développement Applications",
    description: "Services complets de création de sites web professionnels, développement d'applications, e-commerce, SEO et marketing digital. Solutions sur mesure pour entreprises et professionnels. Devis gratuit, accompagnement expert de A à Z.",
    keywords: "services web professionnels, création site internet sur mesure, développement application web, e-commerce professionnel, SEO technique, marketing digital, maintenance web, conception web, sites responsives",
    canonicalUrl: "https://www.webklor.com/services",
    schemaType: "service"
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
                  <LazyImage
                    src="/assets/images/devop.png"
                    alt="Création de sites web professionnels"
                    className="img-fluid rounded-lg shadow-lg"
                    width="600"
                    height="400"
                    sizes="(max-width: 768px) 100vw, 50vw"
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
                  <LazyImage
                    src="/assets/images/designer.png"
                    alt="Création d'identité visuelle"
                    className="img-fluid rounded-lg shadow-lg"
                    width="600"
                    height="400"
                    sizes="(max-width: 768px) 100vw, 50vw"
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
                  <LazyImage
                    src="/assets/images/1000061493.png"
                    alt="Maintenance de sites web"
                    className="img-fluid rounded-lg shadow-lg"
                    width="600"
                    height="400"
                    sizes="(max-width: 768px) 100vw, 50vw"
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

      {/* Section Contenu SEO Enrichi */}
      <section className="seo-content-enriched py-5 bg-light">
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="py-4"
          >
            <Row>
              <Col lg={8} className="mx-auto">
                <motion.div variants={itemVariants} className="text-center mb-5">
                  <h2 className="fw-bold mb-4">Expertise Technique et Solutions Digitales Complètes</h2>
                  <p className="lead">
                    WebKlor combine expertise technique avancée et vision stratégique pour délivrer des solutions digitales qui transforment votre présence en ligne et accélèrent votre croissance business.
                  </p>
                </motion.div>

                <Row className="g-4">
                  <Col md={6}>
                    <motion.div variants={itemVariants} className="h-100">
                      <h3 className="h4 fw-bold mb-3">🚀 Développement Web Avancé</h3>
                      <p className="mb-3">
                        Notre équipe maîtrise les technologies web les plus récentes : React, Node.js, PHP, Laravel, WordPress, Shopify et WooCommerce. Nous développons des applications web performantes, scalables et sécurisées, optimisées pour le référencement naturel et la conversion.
                      </p>
                      <ul className="list-unstyled">
                        <li>• Architecture moderne et évolutive</li>
                        <li>• Performance et vitesse de chargement optimales</li>
                        <li>• Sécurité renforcée et conformité RGPD</li>
                        <li>• Intégration API et systèmes tiers</li>
                      </ul>
                    </motion.div>
                  </Col>
                  
                  <Col md={6}>
                    <motion.div variants={itemVariants} className="h-100">
                      <h3 className="h4 fw-bold mb-3">🎯 Stratégie SEO et Marketing Digital</h3>
                      <p className="mb-3">
                        Nos experts SEO certifiés optimisent votre visibilité sur Google grâce à une approche technique et éditoriale complète. Nous combinons SEO on-page, link building, content marketing et analytics pour maximiser votre ROI digital.
                      </p>
                      <ul className="list-unstyled">
                        <li>• Audit SEO technique complet</li>
                        <li>• Optimisation Core Web Vitals</li>
                        <li>• Stratégie de contenu et mots-clés</li>
                        <li>• Campagnes Google Ads et Social Media</li>
                      </ul>
                    </motion.div>
                  </Col>

                  <Col md={6}>
                    <motion.div variants={itemVariants} className="h-100">
                      <h3 className="h4 fw-bold mb-3">🛒 E-commerce et Solutions Métier</h3>
                      <p className="mb-3">
                        Nous concevons des boutiques en ligne sur mesure avec WooCommerce, Shopify ou PrestaShop, intégrant systèmes de paiement sécurisés, gestion des stocks, CRM et outils d'analyse pour optimiser vos ventes en ligne et votre gestion commerciale.
                      </p>
                      <ul className="list-unstyled">
                        <li>• Boutiques e-commerce conversion-optimisées</li>
                        <li>• Systèmes de paiement multi-devises</li>
                        <li>• Intégration ERP et logistique</li>
                        <li>• Marketplace et places de marché</li>
                      </ul>
                    </motion.div>
                  </Col>

                  <Col md={6}>
                    <motion.div variants={itemVariants} className="h-100">
                      <h3 className="h4 fw-bold mb-3">🛠️ Maintenance et Support Technique</h3>
                      <p className="mb-3">
                        Nos contrats de maintenance garantissent la pérennité de votre site web : mises à jour sécuritaires, sauvegardes automatiques, monitoring 24/7, support technique réactif et évolutions fonctionnelles pour maintenir votre avantage concurrentiel.
                      </p>
                      <ul className="list-unstyled">
                        <li>• Monitoring proactif et alertes</li>
                        <li>• Mises à jour sécuritaires automatiques</li>
                        <li>• Support technique prioritaire</li>
                        <li>• Évolutions et nouvelles fonctionnalités</li>
                      </ul>
                    </motion.div>
                  </Col>
                </Row>

                <motion.div variants={itemVariants} className="text-center mt-5">
                  <p className="lead">
                    <strong>Plus de 150 projets réalisés</strong> pour des entreprises de tous secteurs : santé, immobilier, e-commerce, services B2B, startups et grands comptes. 
                    Nos clients bénéficient d'une <strong>amélioration moyenne de 300% de leur trafic organique</strong> et d'un <strong>taux de conversion augmenté de 45%</strong> grâce à nos optimisations techniques et UX.
                  </p>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
    </main>
  );
};

export default Services;
