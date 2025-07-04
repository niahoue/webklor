import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Alert, Button, Card } from 'react-bootstrap';
import SEO from '../components/SEO';
import { apiGet } from '../services/api';

/**
 * Page de confirmation d'abonnement à la newsletter
 */
const ConfirmSubscription = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmSubscription = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/api/newsletters/confirm/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Une erreur est survenue lors de la confirmation.');
        }

        setSuccess(true);
      } catch (err) {
        console.error('Erreur de confirmation:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      confirmSubscription();
    }
  }, [token]);

  return (
    <Container className="py-5">
      <SEO 
        title="Confirmation d'abonnement à la newsletter" 
        description="Confirmez votre abonnement à la newsletter de WebKlor pour recevoir nos dernières actualités."
        type="website"
      />
      
      <Card className="shadow-sm p-4 text-center">
        <Card.Body>
          <h2 className="mb-4">Confirmation d'abonnement</h2>
          
          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-3">Nous confirmons votre abonnement...</p>
            </div>
          )}
          
          {!loading && success && (
            <>
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <Alert variant="success">
                <h4>Abonnement confirmé !</h4>
                <p className="mb-0">Merci d'avoir confirmé votre abonnement à notre newsletter. Vous recevrez désormais nos dernières actualités et promotions.</p>
              </Alert>
              <div className="mt-4">
                <Link to="/">
                  <Button variant="primary">Retour à l'accueil</Button>
                </Link>
              </div>
            </>
          )}
          
          {!loading && error && (
            <>
              <div className="mb-4">
                <i className="bi bi-exclamation-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              <Alert variant="danger">
                <h4>Une erreur est survenue</h4>
                <p className="mb-0">{error}</p>
              </Alert>
              <div className="mt-4">
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

export default ConfirmSubscription;
