import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Alert, Button, Card, Form } from 'react-bootstrap';
import SEO from '../components/SEO';

/**
 * Page de désabonnement de la newsletter
 */
const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(email);

  /**
   * Gestion de la soumission du formulaire de désabonnement
   */
  const handleUnsubscribe = async (e) => {
    e.preventDefault();

    if (!userEmail.trim()) {
      setError('Veuillez fournir votre adresse email.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/newsletters/unsubscribe?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors du désabonnement.');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Erreur de désabonnement:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <SEO 
        title="Se désabonner de la newsletter" 
        description="Page de désabonnement de la newsletter de WebKlor."
        type="website"
        noindex={true}
      />
      
      <Card className="shadow-sm p-4">
        <Card.Body>
          <h2 className="text-center mb-4">Se désabonner de la newsletter</h2>
          
          {!success ? (
            <>
              <p className="text-center text-muted mb-4">
                Nous sommes désolés de vous voir partir. 
                Veuillez confirmer votre adresse email pour vous désabonner de notre newsletter.
              </p>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleUnsubscribe}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                  />
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="danger" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Traitement en cours...' : 'Se désabonner'}
                  </Button>
                  
                  <Link to="/">
                    <Button variant="outline-secondary" className="w-100">Annuler</Button>
                  </Link>
                </div>
              </Form>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <Alert variant="success">
                <h4 className="text-center">Désabonnement confirmé</h4>
                <p className="text-center mb-0">
                  Vous avez été désabonné avec succès de notre newsletter.
                  <br />
                  Nous espérons vous revoir bientôt !
                </p>
              </Alert>
              <div className="text-center mt-4">
                <Link to="/">
                  <Button variant="primary">Retour à l'accueil</Button>
                </Link>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Unsubscribe;
