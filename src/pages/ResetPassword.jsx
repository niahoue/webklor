// filepath: src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { apiPost } from '../services/api'; // Assurez-vous que apiPost est correctement exporté de api.js
import SEO from '../components/SEO'; // Supposant que vous avez un composant SEO
import LazyImage from '../components/LazyImage'; // Supposant que vous avez un composant LazyImage
import { Link } from 'react-router-dom';

/**
 * Composant de page de réinitialisation de mot de passe
 * @returns {JSX.Element}
 */
const ResetPassword = () => {
  const { token } = useParams(); // Récupère le token depuis l'URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Si le token n'est pas présent dans l'URL, rediriger ou afficher une erreur
    if (!token) {
      setError('Token de réinitialisation manquant.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    if (password.length < 8) { // Validation basée sur le modèle User
        setError('Le mot de passe doit contenir au moins 8 caractères.');
        setLoading(false);
        return;
    }

    try {
      // Appelle l'endpoint de réinitialisation de mot de passe avec le token et le nouveau mot de passe
      const response = await apiPost(`/api/auth/reset-password/${token}`, { password });
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login'); // Rediriger vers la page de connexion après succès
        }, 3000);
      } else {
        setError(response.message || 'Une erreur est survenue lors de la réinitialisation.');
      }
    } catch (err) {
      setError(err.message || 'Erreur réseau ou du serveur. Le lien pourrait être invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Réinitialiser le mot de passe" 
        description="Page de réinitialisation de mot de passe pour le tableau de bord WebKlor." 
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
                    <h4 className="mb-0">Réinitialiser votre mot de passe</h4>
                    <p className="text-muted">Entrez et confirmez votre nouveau mot de passe.</p>
                  </div>

                  {success && (
                    <Alert variant="success" className="mb-3">
                      Votre mot de passe a été réinitialisé avec succès. Vous serez redirigé(e) vers la page de connexion.
                    </Alert>
                  )}
                  {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formNewPassword">
                      <Form.Label>Nouveau Mot de Passe</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Entrez votre nouveau mot de passe"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading || success}
                        />
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Afficher/Masquer le mot de passe"
                        >
                          <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </Button>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Doit contenir au moins 8 caractères.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                      <Form.Label>Confirmer le Mot de Passe</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirmez votre nouveau mot de passe"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={loading || success}
                        />
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label="Afficher/Masquer le mot de passe de confirmation"
                        >
                          <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                        </Button>
                      </InputGroup>
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
                          Réinitialisation en cours...
                        </>
                      ) : (
                        'Réinitialiser le mot de passe'
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

export default ResetPassword;