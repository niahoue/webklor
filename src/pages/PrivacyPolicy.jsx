import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { containerVariants, itemVariants } from '../utils/animations';
import { SITE_CONFIG } from '../utils/constants';

/**
 * Page Politique de Confidentialité
 * Détaille la collecte, l'utilisation et la protection des données personnelles
 */
const PrivacyPolicy = () => {  // Configuration SEO de la page
  const seoData = {
    title: "Politique de Confidentialité WebKlor | Protection des Données RGPD",
    description: "Politique de confidentialité complète de WebKlor conforme au RGPD. Découvrez comment nous collectons, utilisons, stockons et protégons vos données personnelles. Transparence totale sur nos pratiques de protection de la vie privée et droits des utilisateurs.",
    keywords: "politique confidentialité webklor, protection données personnelles, RGPD conforme, vie privée numérique, sécurité données, droits utilisateurs, cookies",
    canonicalUrl: "https://www.webklor.com/politique-confidentialite",
    noindex: false,
    schemaType: "policy"
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
        title="Politique de Confidentialité"
        subtitle="Notre engagement pour la protection de vos données personnelles"
        backgroundClass="bg-primary text-light"
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
              
              {/* Introduction */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0 bg-primary text-white">
                  <Card.Body className="p-4">
                    <h2 className="h4 mb-4">
                      <i className="bi bi-shield-lock me-2"></i>
                      Notre engagement pour votre vie privée
                    </h2>
                    <p className="mb-3">
                      Chez {SITE_CONFIG.name}, nous accordons une importance primordiale à la protection 
                      de vos données personnelles. Cette politique de confidentialité vous informe 
                      de la manière dont nous collectons, utilisons et protégeons vos informations.
                    </p>
                    <div className="alert alert-light text-dark">
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Dernière mise à jour :</strong> 26 mai 2025
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Responsable du traitement */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-person-badge me-2"></i>
                      Responsable du traitement des données
                    </h2>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Entreprise :</strong> {SITE_CONFIG.name}</p>
                        <p><strong>Adresse :</strong> {SITE_CONFIG.address}</p>
                        <p><strong>Email :</strong> {SITE_CONFIG.email}</p>
                        <p><strong>Téléphone :</strong> {SITE_CONFIG.phone}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Responsable :</strong> Niahoué Ange Pacome</p>
                        <p><strong>Fonction :</strong> Directeur</p>
                        <p><strong>Contact DPO :</strong> {SITE_CONFIG.email}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Données collectées */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-collection me-2"></i>
                      Données que nous collectons
                    </h2>
                    
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <h5 className="h6 text-secondary">
                          <i className="bi bi-person-circle me-2"></i>
                          Données d'identification
                        </h5>
                        <ul className="list-unstyled">
                          <li>• Nom et prénom</li>
                          <li>• Adresse email</li>
                          <li>• Numéro de téléphone</li>
                          <li>• Adresse postale</li>
                          <li>• Nom de l'entreprise</li>
                        </ul>
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <h5 className="h6 text-secondary">
                          <i className="bi bi-laptop me-2"></i>
                          Données techniques
                        </h5>
                        <ul className="list-unstyled">
                          <li>• Adresse IP</li>
                          <li>• Type de navigateur</li>
                          <li>• Système d'exploitation</li>
                          <li>• Pages visitées</li>
                          <li>• Données de connexion</li>
                        </ul>
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Nous ne collectons que les données strictement nécessaires à nos services.
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Finalités du traitement */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-target me-2"></i>
                      Pourquoi nous utilisons vos données
                    </h2>
                    
                    <Table responsive className="table-borderless">
                      <thead className="table-light">
                        <tr>
                          <th>Finalité</th>
                          <th>Base légale</th>
                          <th>Durée de conservation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Gestion des demandes de contact</strong><br />
                            <small className="text-muted">Répondre à vos questions et demandes</small>
                          </td>
                          <td>Intérêt légitime</td>
                          <td>3 ans</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Newsletter</strong><br />
                            <small className="text-muted">Envoi d'informations et actualités</small>
                          </td>
                          <td>Consentement</td>
                          <td>Jusqu'au désabonnement</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Gestion des projets</strong><br />
                            <small className="text-muted">Suivi et réalisation de vos projets</small>
                          </td>
                          <td>Exécution du contrat</td>
                          <td>5 ans après fin du projet</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Statistiques de visite</strong><br />
                            <small className="text-muted">Amélioration de nos services</small>
                          </td>
                          <td>Intérêt légitime</td>
                          <td>13 mois</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Vos droits */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-person-check me-2"></i>
                      Vos droits sur vos données
                    </h2>
                    
                    <p className="mb-4">
                      Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
                    </p>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-eye text-primary me-3 mt-1"></i>
                          <div>
                            <h6 className="mb-1">Droit d'accès</h6>
                            <p className="small text-muted mb-0">
                              Obtenir une copie de vos données personnelles
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-pencil text-primary me-3 mt-1"></i>
                          <div>
                            <h6 className="mb-1">Droit de rectification</h6>
                            <p className="small text-muted mb-0">
                              Corriger ou mettre à jour vos informations
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-trash text-primary me-3 mt-1"></i>
                          <div>
                            <h6 className="mb-1">Droit à l'effacement</h6>
                            <p className="small text-muted mb-0">
                              Demander la suppression de vos données
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-pause text-primary me-3 mt-1"></i>
                          <div>
                            <h6 className="mb-1">Droit à la limitation</h6>
                            <p className="small text-muted mb-0">
                              Limiter le traitement de vos données
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-arrow-right text-primary me-3 mt-1"></i>
                          <div>
                            <h6 className="mb-1">Droit à la portabilité</h6>
                            <p className="small text-muted mb-0">
                              Récupérer vos données dans un format lisible
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-hand-index text-primary me-3 mt-1"></i>
                          <div>
                            <h6 className="mb-1">Droit d'opposition</h6>
                            <p className="small text-muted mb-0">
                              Vous opposer au traitement de vos données
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="alert alert-success mt-4">
                      <i className="bi bi-envelope me-2"></i>
                      Pour exercer vos droits, contactez-nous à : 
                      <a href={`mailto:${SITE_CONFIG.email}`} className="alert-link ms-1">
                        {SITE_CONFIG.email}
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Sécurité des données */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-shield-check me-2"></i>
                      Sécurité de vos données
                    </h2>
                    
                    <p className="mb-4">
                      Nous mettons en œuvre des mesures techniques et organisationnelles 
                      appropriées pour protéger vos données personnelles :
                    </p>
                    
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <div className="text-center">
                          <i className="bi bi-lock-fill text-primary" style={{fontSize: '2rem'}}></i>
                          <h6 className="mt-2">Chiffrement SSL</h6>
                          <p className="small text-muted">
                            Toutes les communications sont chiffrées
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-md-4 mb-3">
                        <div className="text-center">
                          <i className="bi bi-server text-primary" style={{fontSize: '2rem'}}></i>
                          <h6 className="mt-2">Serveurs sécurisés</h6>
                          <p className="small text-muted">
                            Hébergement dans des centres de données certifiés
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-md-4 mb-3">
                        <div className="text-center">
                          <i className="bi bi-people-fill text-primary" style={{fontSize: '2rem'}}></i>
                          <h6 className="mt-2">Accès limité</h6>
                          <p className="small text-muted">
                            Seules les personnes autorisées accèdent aux données
                          </p>
                        </div>
                      </div>
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
                      Gestion des cookies
                    </h2>
                    
                    <p className="mb-4">
                      Notre site utilise différents types de cookies pour améliorer votre expérience :
                    </p>
                    
                    <Table responsive className="table-borderless">
                      <thead className="table-light">
                        <tr>
                          <th>Type de cookie</th>
                          <th>Finalité</th>
                          <th>Durée</th>
                          <th>Consentement requis</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Cookies essentiels</strong></td>
                          <td>Fonctionnement du site</td>
                          <td>Session</td>
                          <td><span className="badge bg-danger">Non</span></td>
                        </tr>
                        <tr>
                          <td><strong>Cookies analytiques</strong></td>
                          <td>Statistiques de visite</td>
                          <td>13 mois</td>
                          <td><span className="badge bg-success">Oui</span></td>
                        </tr>
                        <tr>
                          <td><strong>Cookies marketing</strong></td>
                          <td>Publicité personnalisée</td>
                          <td>12 mois</td>
                          <td><span className="badge bg-success">Oui</span></td>
                        </tr>
                        <tr>
                          <td><strong>Cookies préférences</strong></td>
                          <td>Mémorisation des choix</td>
                          <td>12 mois</td>
                          <td><span className="badge bg-success">Oui</span></td>
                        </tr>
                      </tbody>
                    </Table>
                    
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Vous pouvez modifier vos préférences cookies à tout moment 
                      via le lien en bas de page.
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Transferts de données */}
              <motion.div variants={itemVariants} className="mb-5">
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-globe me-2"></i>
                      Transferts de données
                    </h2>
                    
                    <p>
                      Vos données personnelles sont principalement traitées au sein de l'Union Européenne. 
                      Dans le cas où certaines données seraient transférées vers des pays tiers, 
                      nous nous assurons que des garanties appropriées sont mises en place.
                    </p>
                    
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <h6 className="text-secondary">Partenaires UE</h6>
                        <p className="small">
                          Hébergement et services techniques basés en Europe
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-secondary">Garanties</h6>
                        <p className="small">
                          Clauses contractuelles types et certifications adéquates
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Contact et réclamations */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-sm border-0 bg-light">
                  <Card.Body className="p-4">
                    <h2 className="h4 text-primary mb-4">
                      <i className="bi bi-headset me-2"></i>
                      Contact et réclamations
                    </h2>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h6 className="text-secondary">Nous contacter</h6>
                        <p className="small mb-2">
                          Pour toute question concernant cette politique ou vos données :
                        </p>
                        <p className="small">
                          <i className="bi bi-envelope me-2"></i>
                          <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a><br />
                          <i className="bi bi-telephone me-2"></i>
                          {SITE_CONFIG.phone}
                        </p>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <h6 className="text-secondary">Autorité de contrôle</h6>
                        <p className="small mb-2">
                          En cas de litige, vous pouvez saisir l'autorité compétente :
                        </p>
                        <p className="small">
                          <strong>Autorité de Régulation des Télécommunications</strong><br />
                          République de Côte d'Ivoire
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <a 
                        href={`mailto:${SITE_CONFIG.email}?subject=Demande RGPD`} 
                        className="btn btn-primary me-2"
                      >
                        <i className="bi bi-envelope me-2"></i>
                        Exercer mes droits
                      </a>
                      <a 
                        href="/contact" 
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-chat-dots me-2"></i>
                        Nous contacter
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

export default PrivacyPolicy;
