// filepath: c:\Users\Niahoue\Documents\webklor-livraison\src\pages\Login.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';
import SEO from '../components/SEO';

/**
 * Composant de page de connexion
 * @returns {JSX.Element}
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate, isAuthenticated]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Rediriger vers le tableau de bord principal
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Connexion | Administration WebKlor"
        description="Accès à l'espace d'administration WebKlor"
        noindex={true}
      />
      <div className="login-page">
        <Container>
          <Row className="justify-content-center align-items-center vh-100">
            <Col md={6} lg={5}>
              <Card className="login-card">
                <Card.Header className="text-center">
                  <div className="logo-container">
                    <img src="/assets/images/logo.png" alt="Logo WebKlor" className="img-fluid" />
                  </div>
                  <h1>Administration WebKlor</h1>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={handleSubmit} className="login-form">
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Entrez votre email"
                        autoComplete="username"
                        aria-label="Adresse email"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4 position-relative">
                      <Form.Label className="d-flex justify-content-between align-items-center">
                        <span>Mot de passe</span>
                        <Link to="/forgot-password" className="forgot-password-link">
                          Mot de passe oublié ?
                        </Link>
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Entrez votre mot de passe"
                          autoComplete="current-password"
                          aria-label="Mot de passe"
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 py-2 login-btn"
                      disabled={loading}
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
                          Connexion en cours...
                        </>
                      ) : (
                        'Se connecter'
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

export default Login;
