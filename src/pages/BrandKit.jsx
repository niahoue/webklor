import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import LazyImage from '../components/LazyImage';
import { containerVariants, itemVariants } from '../utils/animations';

/**
 * Page Kit de Marque
 * Présente les éléments de l'identité visuelle de WebKlor
 */
const BrandKit = () => {
  // Configuration SEO de la page
  const seoData = {
    title: "Kit de Marque WebKlor | Identité Visuelle & Ressources Graphiques",
    description: "Explorez l'univers visuel de WebKlor : logo haute définition, palette de couleurs officielles, typographies utilisées, déclinaisons graphiques et guidelines d'utilisation. Ressources téléchargeables pour partenaires et médias. Identité de marque moderne et professionnelle.",
    keywords: "kit de marque webklor, identité visuelle agence web, logo webklor, palette couleurs, typographie brand, charte graphique, ressources graphiques, guidelines marque",
    canonicalUrl: "https://www.webklor.com/kit-de-marque",
    schemaType: "brand"
  };
  // Configuration des animations au défilement
  const [elementsRef, elementsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [colorsRef, colorsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <main>
      <SEO {...seoData} />
      
      <PageHeader 
        title="Kit de Marque WebKlor"
        subtitle="Les éléments qui composent notre identité visuelle"
      />

      {/* Section Logo et Typographie */}
      <section className="brand-elements py-5">
        <Container>
          <motion.div
            ref={elementsRef}
            initial="hidden"
            animate={elementsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <Row className="mb-5">
              <Col lg={6} className="mb-4 mb-lg-0">
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Notre Logo</h2>
                  <p className="mb-4">
                    Le logo WebKlor est l'élément central de notre identité visuelle. Il représente notre engagement envers l'innovation, la créativité et l'excellence dans le domaine digital.
                  </p>
                  <div className="logo-showcase bg-light p-5 text-center rounded-lg shadow-sm mb-4">
                    <LazyImage
                      src="/assets/images/1000059595.png"
                      alt="Logo WebKlor"
                      className="img-fluid"
                      style={{ maxWidth: "250px" }}
                      width="250"
                      height="100"
                      sizes="250px"
                      priority={true}
                    />
                  </div>
                  <div className="logo-showcase bg-primary p-5 text-center rounded-lg shadow-sm">
                    <LazyImage
                      src="/assets/images/1000059595.png"
                      alt="Logo WebKlor sur fond coloré"
                      className="img-fluid"
                      style={{ maxWidth: "250px" }}
                      width="250"
                      height="100"
                      sizes="250px"
                    />
                  </div>
                </motion.div>
              </Col>
              <Col lg={6}>
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Notre Typographie</h2>
                  <p className="mb-4">
                    Nous utilisons deux polices principales qui reflètent notre personnalité de marque : Montserrat pour le texte courant et Pacifico pour les accents stylistiques.
                  </p>
                  <div className="typography-showcase mb-4">
                    <h3 className="h5 mb-2">Montserrat</h3>
                    <div className="bg-light p-4 rounded-lg shadow-sm">
                      <p className="display-4 mb-2" style={{ fontFamily: 'Montserrat' }}>Aa</p>
                      <p className="mb-1" style={{ fontFamily: 'Montserrat', fontWeight: 300 }}>Montserrat Light</p>
                      <p className="mb-1" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>Montserrat Regular</p>
                      <p className="mb-1" style={{ fontFamily: 'Montserrat', fontWeight: 500 }}>Montserrat Medium</p>
                      <p className="mb-1" style={{ fontFamily: 'Montserrat', fontWeight: 600 }}>Montserrat Semi-Bold</p>
                      <p className="mb-0" style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>Montserrat Bold</p>
                    </div>
                  </div>
                  <div className="typography-showcase">
                    <h3 className="h5 mb-2">Pacifico</h3>
                    <div className="bg-light p-4 rounded-lg shadow-sm">
                      <p className="display-4 mb-2" style={{ fontFamily: 'Pacifico' }}>Aa</p>
                      <p className="mb-0" style={{ fontFamily: 'Pacifico' }}>Pacifico Regular</p>
                    </div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Palette de Couleurs */}
      <section className="color-palette bg-light py-5">
        <Container>
          <motion.div
            ref={colorsRef}
            initial="hidden"
            animate={colorsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="fw-bold">Notre Palette de Couleurs</h2>
              <p className="lead">Les couleurs qui définissent l'identité visuelle de WebKlor</p>
            </motion.div>

            <Row>
              <Col md={6} lg={3} className="mb-4">
                <motion.div variants={itemVariants}>
                  <div className="color-card h-100">
                    <div className="color-sample rounded-top" style={{ backgroundColor: "#007BFF", height: "150px" }}></div>
                    <div className="color-info p-3 bg-white rounded-bottom shadow-sm">
                      <h3 className="h5">Bleu Principal</h3>
                      <p className="mb-1">HEX: #007BFF</p>
                      <p className="mb-0">RGB: 0, 123, 255</p>
                    </div>
                  </div>
                </motion.div>
              </Col>
              <Col md={6} lg={3} className="mb-4">
                <motion.div variants={itemVariants}>
                  <div className="color-card h-100">
                    <div className="color-sample rounded-top" style={{ backgroundColor: "#28A745", height: "150px" }}></div>
                    <div className="color-info p-3 bg-white rounded-bottom shadow-sm">
                      <h3 className="h5">Vert</h3>
                      <p className="mb-1">HEX: #28A745</p>
                      <p className="mb-0">RGB: 40, 167, 69</p>
                    </div>
                  </div>
                </motion.div>
              </Col>
              <Col md={6} lg={3} className="mb-4">
                <motion.div variants={itemVariants}>
                  <div className="color-card h-100">
                    <div className="color-sample rounded-top" style={{ backgroundColor: "#FFC107", height: "150px" }}></div>
                    <div className="color-info p-3 bg-white rounded-bottom shadow-sm">
                      <h3 className="h5">Orange</h3>
                      <p className="mb-1">HEX: #FFC107</p>
                      <p className="mb-0">RGB: 255, 193, 7</p>
                    </div>
                  </div>
                </motion.div>
              </Col>
              <Col md={6} lg={3} className="mb-4">
                <motion.div variants={itemVariants}>
                  <div className="color-card h-100">
                    <div className="color-sample rounded-top" style={{ backgroundColor: "#F8F9FA", height: "150px", border: "1px solid #dee2e6" }}></div>
                    <div className="color-info p-3 bg-white rounded-bottom shadow-sm">
                      <h3 className="h5">Gris Clair</h3>
                      <p className="mb-1">HEX: #F8F9FA</p>
                      <p className="mb-0">RGB: 248, 249, 250</p>
                    </div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Éléments du Kit de Marque */}
      <section className="brand-kit-elements py-5">
        <Container>
          <motion.div
            initial="hidden"
            animate={elementsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="fw-bold">Éléments du Kit de Marque</h2>
              <p className="lead">Applications de notre identité visuelle sur différents supports</p>
            </motion.div>

            <Row>
              <Col lg={6} className="mb-5">
                <motion.div variants={itemVariants}>
                  <h3 className="h4 mb-3">Carte de Visite</h3>
                  <div className="bg-light p-4 rounded-lg shadow-sm text-center">
                    <LazyImage
                      src="/assets/images/1000059597.png"
                      alt="Carte de visite WebKlor"
                      className="img-fluid rounded-lg shadow-sm"
                      style={{ maxWidth: "350px" }}
                      width="350"
                      height="200"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                  </div>
                </motion.div>
              </Col>
              <Col lg={6} className="mb-5">
                <motion.div variants={itemVariants}>
                  <h3 className="h4 mb-3">Bannière Web</h3>
                  <div className="bg-light p-4 rounded-lg shadow-sm text-center">
                    <LazyImage
                      src="/assets/images/1000059598.png"
                      alt="Bannière WebKlor"
                      className="img-fluid rounded-lg shadow-sm"
                      width="600"
                      height="300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </motion.div>
              </Col>
              <Col lg={6} className="mb-5 mb-lg-0">
                <motion.div variants={itemVariants}>
                  <h3 className="h4 mb-3">Photo de Profil</h3>
                  <div className="bg-light p-4 rounded-lg shadow-sm text-center">
                    <LazyImage
                      src="/assets/images/1000059597.png"
                      alt="Photo de profil WebKlor"
                      className="img-fluid rounded-circle shadow-sm"
                      style={{ maxWidth: "200px" }}
                      width="200"
                      height="200"
                      sizes="200px"
                    />
                  </div>
                </motion.div>
              </Col>
              <Col lg={6}>
                <motion.div variants={itemVariants}>
                  <h3 className="h4 mb-3">Post Carré pour Réseaux Sociaux</h3>
                  <div className="bg-light p-4 rounded-lg shadow-sm text-center">
                    <LazyImage
                      src="/assets/images/1000061493.png"
                      alt="Post carré WebKlor"
                      className="img-fluid rounded-lg shadow-sm"
                      style={{ maxWidth: "350px" }}
                      width="350"
                      height="350"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                  </div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
    </main>
  );
};

export default BrandKit;
