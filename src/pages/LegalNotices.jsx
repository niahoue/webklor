import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { containerVariants, itemVariants } from '../utils/animations';
import { SITE_CONFIG } from '../utils/constants';

/**
 * Page Mentions Légales
 * Contient toutes les informations légales obligatoires pour le site WebKlor
 */
const LegalNotices = () => {
  // Configuration SEO de la page
  const seoData = {
    title: "Mentions Légales",
    description: "Mentions légales du site WebKlor - Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.",
    keywords: "mentions légales, éditeur, hébergeur, responsabilité, conditions utilisation",
    canonicalUrl: "https://www.webklor.com/mentions-legales",
    noindex: false
  };

  // Configuration des animations au défilement
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <SEO {...seoData} />
      
      <PageHeader
        title="Mentions Légales"
        subtitle="Informations légales et conditions d'utilisation du site WebKlor"
        backgroundClass="bg-dark text-light"
      />

      <motion.section
        ref={contentRef}
        initial="hidden"
        animate={contentInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-5"
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              
              {/* Identification de l'éditeur */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-building me-2"></i>
                      Identification de l'éditeur
                    </h2>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Dénomination sociale :</strong> {SITE_CONFIG.name}</p>
                        <p><strong>Adresse :</strong> {SITE_CONFIG.address}</p>
                        <p><strong>Téléphone :</strong> {SITE_CONFIG.phone}</p>
                        <p><strong>Email :</strong> {SITE_CONFIG.email}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Forme juridique :</strong> Entreprise individuelle</p>
                        <p><strong>Pays :</strong> Côte d'Ivoire</p>
                        <p><strong>Directeur de la publication :</strong> Niahoué Ange Pacome</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Hébergement */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-server me-2"></i>
                      Hébergement
                    </h2>
                    <p>
                      Ce site est hébergé par des services d'hébergement web professionnels 
                      conformes aux standards internationaux de sécurité et de disponibilité.
                    </p>
                    <p>
                      <strong>Localisation des serveurs :</strong> Union Européenne<br />
                      <strong>Certification :</strong> Conforme RGPD
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Propriété intellectuelle */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-shield-check me-2"></i>
                      Propriété intellectuelle
                    </h2>
                    <p>
                      L'ensemble de ce site relève de la législation sur le droit d'auteur 
                      et la propriété intellectuelle. Tous les droits de reproduction sont réservés, 
                      y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>
                    <p>
                      La reproduction de tout ou partie de ce site sur un support électronique 
                      quel qu'il soit est formellement interdite sauf autorisation expresse de l'éditeur.
                    </p>
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Les marques et logos présents sur le site sont déposés par {SITE_CONFIG.name} ou éventuellement par ses partenaires.
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Responsabilité */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Limitation de responsabilité
                    </h2>
                    <p>
                      Les informations contenues sur ce site sont aussi précises que possible 
                      et le site remis à jour à différentes périodes de l'année, mais peut 
                      toutefois contenir des inexactitudes ou des omissions.
                    </p>
                    <p>
                      Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, 
                      merci de bien vouloir le signaler par email, à l'adresse {SITE_CONFIG.email}, 
                      en décrivant le problème de la manière la plus précise possible.
                    </p>
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <h5 className="h6 text-secondary">Disponibilité du site</h5>
                        <p className="small">
                          Nous nous efforçons de maintenir accessible le site 24h/24 et 7j/7, 
                          mais nous ne pouvons être tenus responsables en cas d'indisponibilité.
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5 className="h6 text-secondary">Liens externes</h5>
                        <p className="small">
                          Notre site peut contenir des liens vers d'autres sites. 
                          Nous ne sommes pas responsables du contenu de ces sites externes.
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Données personnelles */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-person-lock me-2"></i>
                      Protection des données personnelles
                    </h2>
                    <p>
                      Conformément à la loi "Informatique et Libertés" et au Règlement Général 
                      sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, 
                      de rectification et de suppression des données vous concernant.
                    </p>
                    <p>
                      Pour exercer ce droit, contactez-nous à l'adresse : {SITE_CONFIG.email}
                    </p>
                    <div className="alert alert-primary">
                      <i className="bi bi-info-circle me-2"></i>
                      Pour plus de détails sur le traitement de vos données, consultez notre 
                      <a href="/politique-confidentialite" className="alert-link ms-1">
                        Politique de Confidentialité
                      </a>.
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Cookies */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-gear me-2"></i>
                      Utilisation des cookies
                    </h2>
                    <p>
                      Ce site utilise des cookies pour améliorer l'expérience utilisateur 
                      et analyser le trafic. En continuant à naviguer, vous acceptez 
                      l'utilisation de cookies.
                    </p>
                    <div className="row">
                      <div className="col-md-4">
                        <h6 className="text-secondary">Cookies essentiels</h6>
                        <p className="small">Nécessaires au fonctionnement du site</p>
                      </div>
                      <div className="col-md-4">
                        <h6 className="text-secondary">Cookies analytiques</h6>
                        <p className="small">Mesure d'audience et statistiques</p>
                      </div>
                      <div className="col-md-4">
                        <h6 className="text-secondary">Cookies marketing</h6>
                        <p className="small">Personnalisation de la publicité</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Droit applicable */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-scales me-2"></i>
                      Droit applicable et juridiction
                    </h2>
                    <p>
                      Tout litige en relation avec l'utilisation du site {SITE_CONFIG.url} est soumis au droit ivoirien.
                       Il est fait attribution exclusive de 
                      juridiction aux tribunaux compétents d'Abidjan.
                    </p>
                    <div className="text-muted small mt-3">
                      <p className="mb-1">
                        <strong>Dernière mise à jour :</strong> 26 mai 2025
                      </p>
                      <p className="mb-0">
                        Ces mentions légales peuvent être modifiées à tout moment. 
                        Nous vous invitons à les consulter régulièrement.
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Contact */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-sm border-0 bg-light">
                  <Card.Body className="p-4 text-center">
                    <h3 className="h5 text-primary mb-3">
                      <i className="bi bi-envelope me-2"></i>
                      Vous avez une question ?
                    </h3>
                    <p className="mb-3">
                      Pour toute question concernant ces mentions légales, 
                      n'hésitez pas à nous contacter.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <a 
                        href={`mailto:${SITE_CONFIG.email}`} 
                        className="btn btn-primary"
                      >
                        <i className="bi bi-envelope me-2"></i>
                        Nous contacter
                      </a>
                      <a 
                        href="/contact" 
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-chat-dots me-2"></i>
                        Formulaire de contact
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

            </Col>
          </Row>
        </Container>
      </motion.section>
    </>
  );
};

export default LegalNotices;
