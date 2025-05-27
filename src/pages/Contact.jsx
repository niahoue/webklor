import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { containerVariants, itemVariants } from '../utils/animations';
import { SITE_CONFIG } from '../utils/constants';

/**
 * Page Contact
 * Permet aux visiteurs de contacter WebKlor
 */
const Contact = () => {
  // État pour le formulaire
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consentGiven: false
  });
  
  // États pour la soumission et les alertes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({
    success: null,
    message: ''
  });

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique du formulaire
    if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
      setSubmitResult({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires.'
      });
      return;
    }
    
    if (!formData.consentGiven) {
      setSubmitResult({
        success: false,
        message: 'Vous devez accepter la politique de confidentialité.'
      });
      return;
    }
    
    // Soumission du formulaire
    setIsSubmitting(true);
    setSubmitResult({
      success: null,
      message: ''
    });
    
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Réinitialisation du formulaire en cas de succès
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          consentGiven: false
        });
        
        setSubmitResult({
          success: true,
          message: data.message || 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
        });
      } else {
        // Affichage de l'erreur
        setSubmitResult({
          success: false,
          message: data.message || 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.'
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setSubmitResult({
        success: false,
        message: 'Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet et réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Configuration SEO de la page
  const seoData = {
    title: "Contactez-nous",
    description: "Contactez l'équipe WebKlor pour discuter de votre projet de création de site web, SEO, marketing digital ou identité visuelle. Nous sommes à votre écoute.",
    keywords: "contact, devis, formulaire contact, coordonnées, WebKlor",
    canonicalUrl: "https://www.webklor.com/contact"
  };
  // Configuration des animations au défilement
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [infoRef, infoInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <main>
      <SEO {...seoData} />
      
      {/* En-tête de page avec composant réutilisable */}
      <PageHeader 
        title="Contactez-nous"
        subtitle="Discutons de votre projet et de la façon dont nous pouvons vous aider"
      />

      {/* Section Formulaire et Informations */}
      <section className="contact-section py-5">
        <Container>
          <Row className="py-5">
            {/* Formulaire de contact */}
            <Col lg={7} className="mb-5 mb-lg-0">
              <motion.div
                ref={formRef}
                initial="hidden"
                animate={formInView ? "visible" : "hidden"}
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Envoyez-nous un message</h2>
                  <p className="mb-4">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>
                </motion.div>

                {submitResult.message && (
                  <motion.div variants={itemVariants}>
                    <Alert variant={submitResult.success ? 'success' : 'danger'}>
                      {submitResult.message}
                    </Alert>
                  </motion.div>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <motion.div variants={itemVariants}>
                        <Form.Group controlId="formName">
                          <Form.Label>Nom complet</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="Votre nom" 
                            className="py-2" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </motion.div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <motion.div variants={itemVariants}>
                        <Form.Group controlId="formEmail">
                          <Form.Label>Adresse email</Form.Label>
                          <Form.Control 
                            type="email" 
                            placeholder="Votre email" 
                            className="py-2" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </motion.div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <motion.div variants={itemVariants}>
                        <Form.Group controlId="formPhone">
                          <Form.Label>Téléphone</Form.Label>
                          <Form.Control 
                            type="tel" 
                            placeholder="Votre téléphone" 
                            className="py-2" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </motion.div>
                    </Col>
                    <Col md={6} className="mb-3">
                      <motion.div variants={itemVariants}>
                        <Form.Group controlId="formSubject">
                          <Form.Label>Sujet</Form.Label>
                          <Form.Select 
                            className="py-2" 
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                          >
                            <option>Choisir un sujet</option>
                            <option>Création de site web</option>
                            <option>SEO & Marketing Digital</option>
                            <option>Identité visuelle</option>
                            <option>Maintenance web</option>
                            <option>Autre</option>
                          </Form.Select>
                        </Form.Group>
                      </motion.div>
                    </Col>
                  </Row>

                  <motion.div variants={itemVariants}>
                    <Form.Group className="mb-4" controlId="formMessage">
                      <Form.Label>Message</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={5} 
                        placeholder="Décrivez votre projet ou votre demande..." 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Form.Group className="mb-4" controlId="formConsent">
                      <Form.Check 
                        type="checkbox" 
                        label="J'accepte que mes données soient traitées conformément à la politique de confidentialité." 
                        name="consentGiven"
                        checked={formData.consentGiven}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg" 
                      className="rounded-pill px-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    </Button>
                  </motion.div>
                </Form>
              </motion.div>
            </Col>

            {/* Informations de contact */}
            <Col lg={5} className="ps-lg-5">
              <motion.div
                ref={infoRef}
                initial="hidden"
                animate={infoInView ? "visible" : "hidden"}
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Nos coordonnées</h2>
                  <p className="mb-4">N'hésitez pas à nous contacter directement par téléphone, email ou en visitant nos bureaux.</p>
                </motion.div>

                <motion.div variants={itemVariants} className="contact-info mb-4">
                  <div className="d-flex mb-3">
                    <div className="contact-icon bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", minWidth: "40px" }}>
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <div>
                      <h3 className="h5 mb-1">Adresse</h3>
                      <p className="mb-0">{SITE_CONFIG.address}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="contact-info mb-4">
                  <div className="d-flex mb-3">
                    <div className="contact-icon bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", minWidth: "40px" }}>
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div>
                      <h3 className="h5 mb-1">Email</h3>
                      <p className="mb-0">{SITE_CONFIG.email}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="contact-info mb-4">
                  <div className="d-flex mb-3">
                    <div className="contact-icon bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", minWidth: "40px" }}>
                      <i className="bi bi-telephone"></i>
                    </div>
                    <div>
                      <h3 className="h5 mb-1">Téléphone</h3>
                      <p className="mb-0">{SITE_CONFIG.phone}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="contact-info mb-5">
                  <div className="d-flex mb-3">
                    <div className="contact-icon bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", minWidth: "40px" }}>
                      <i className="bi bi-clock"></i>
                    </div>
                    <div>
                      <h3 className="h5 mb-1">Horaires d'ouverture</h3>
                      <p className="mb-0">{SITE_CONFIG.hours}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="h5 mb-3">Suivez-nous</h3>
                  <div className="social-links">
                    <a href={SITE_CONFIG.socialLinks.facebook} className="me-3 text-primary fs-4"><i className="bi bi-facebook"></i></a>
                    <a href={SITE_CONFIG.socialLinks.twitter} className="me-3 text-primary fs-4"><i className="bi bi-twitter"></i></a>
                    <a href={SITE_CONFIG.socialLinks.instagram} className="me-3 text-primary fs-4"><i className="bi bi-instagram"></i></a>
                    <a href={SITE_CONFIG.socialLinks.linkedin} className="me-3 text-primary fs-4"><i className="bi bi-linkedin"></i></a>
                  </div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Section Carte */}
      <section className="map-section">
        <div className="map-container ratio ratio-21x9" style={{ maxHeight: "400px" }}>
          <div className="bg-light d-flex align-items-center justify-content-center">
            <div className="text-center p-4">
              <h3 className="h5 mb-3">Notre localisation</h3>
              <p className="mb-0">{SITE_CONFIG.address}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
