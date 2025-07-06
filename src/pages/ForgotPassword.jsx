// filepath: src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { apiPost } from '../services/api'; // Assurez-vous que apiPost est correctement exporté de api.js
import SEO from '../components/SEO'; // Supposant que vous avez un composant SEO
import LazyImage from '../components/LazyImage'; // Supposant que vous avez un composant LazyImage
import { Link } from 'react-router-dom';

/**
 * Composant de page de demande de réinitialisation de mot de passe
 * @returns {JSX.Element}
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Appelle l'endpoint de réinitialisation de mot de passe défini dans auth.controller.js
      const response = await apiPost('/api/auth/forgot-password', { email });
      
      if (response.success) {
        setSuccess(true);
        setEmail(''); // Vider le champ email
      } else {
        setError(response.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      setError(err.message || 'Erreur réseau ou du serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Mot de passe oublié" 
        description="Page de récupération de mot de passe pour le tableau de bord WebKlor." 
      />
      <div className="login-page"> {/* Réutiliser le style de la page de connexion */}
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col md={8} lg={6} xl={5}>
              <Card className="shadow-lg login-card">
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <Link to="/">
                      <LazyImage
                        src="/assets/images/logo.png" // Assurez-vous que le chemin est correct
                        alt="Logo WebKlor"
                        className="login-logo mb-3"
                        width="150"
                        height="auto"
                      />
                    </Link>
                    <h4 className="mb-0">Mot de passe oublié ?</h4>
                    <p className="text-muted">Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
                  </div>

                  {success && (
                    <Alert variant="success" className="mb-3">
                      Un lien de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception (et vos spams).
                    </Alert>
                  )}
                  {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Adresse Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Entrez votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading || success}
                      />
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 py-2 login-btn"
                      disabled={loading || success}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Envoi en cours...
                        </>
                      ) : (
                        'Recevoir le lien de réinitialisation'
                      )}
                    </Button>
                  </Form>
                </Card.Body>
                <Card.Footer className="text-center">
                  <div className="copyright">
                    © {new Date().getFullYear()} WebKlor. Tous droits réservés.
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ForgotPassword;