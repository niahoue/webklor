import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { apiGet, apiPost, apiPut } from '../services/api';
/**
 * Composant de formulaire d'abonnement à la newsletter
 */
const NewsletterSignup = ({ variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);

  /**
   * Gestion de la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Veuillez fournir votre adresse email.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiPost('/api/newsletters/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de l\'abonnement.');
      }

      setMessage(data.message);
      setShowForm(false);
      // Réinitialiser le formulaire
      setEmail('');
      setFirstName('');
      setLastName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Variante simple (juste l'email)
  if (variant === 'simple') {
    return (
      <div className="newsletter-signup simple-variant">
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        
        {showForm && (
          <Form onSubmit={handleSubmit} className="d-flex">
            <Form.Group className="flex-grow-1 me-2">
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Envoi...' : 'S\'abonner'}
            </Button>
          </Form>
        )}
      </div>
    );
  }

  // Variante complète (avec nom et prénom)
  return (
    <div className="newsletter-signup default-variant">
      <h3>Abonnez-vous à notre newsletter</h3>
      <p className="text-muted mb-4">Restez informé des dernières nouvelles et promotions.</p>
      
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {showForm && (
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                />
              </Form.Group>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Votre nom"
                />
              </Form.Group>
            </div>
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-100"
          >
            {loading ? 'Envoi en cours...' : 'S\'abonner à la newsletter'}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default NewsletterSignup;
