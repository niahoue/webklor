import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../services/api';
import SEO from '../components/SEO';
import AdminLayout from '../components/AdminLayout';
import '../styles/admin.css';

/**
 * Page principale du tableau de bord d'administration
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalSubscribers: 0,
    totalComments: 0,
    totalTestimonials: 0 // Nouveau: Nombre total de témoignages
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les statistiques globales du site
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const postsData = await apiGet('/api/admin/blog/stats', { headers: getAuthHeader() });
        const subscribersData = await apiGet('/api/newsletters/subscribers/list', { headers: getAuthHeader() });
        const commentsData = await apiGet('/api/admin/blog/comments', { headers: getAuthHeader() });
        // Nouvel appel API pour les témoignages
        const testimonialsData = await apiGet('/api/admin/testimonials', { headers: getAuthHeader() });

        setStats({
          totalPosts: postsData.data?.totalPosts || 0,
          totalSubscribers: subscribersData.count || 0,
          totalComments: commentsData.data?.length || 0,
          totalTestimonials: testimonialsData.count || 0 // Utilisation du 'count' de la réponse
        });
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes('401')) {
          navigate('/login');
        } else {
          setError('Une erreur est survenue lors du chargement des données');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getAuthHeader, navigate]);

  return (
    <>
      <SEO
        title="Tableau de bord administrateur | WebKlor"
        description="Tableau de bord d'administration WebKlor"
        noindex={true}
      />
      <AdminLayout title="Tableau de bord">
        <Container>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Cartes de statistiques */}
          <Row className="mb-5">
            <Col md={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100 admin-card stat-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">Articles</h5>
                    <div className="fs-1 text-primary stat-icon">
                      <i className="bi bi-file-earmark-text"></i>
                    </div>
                  </div>
                  <h2 className="mb-3 stat-value">{loading ? '...' : stats.totalPosts}</h2>
                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      as={Link}
                      to="/admin/blog"
                      className="w-100"
                    >
                      Gérer les articles
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100 admin-card stat-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">Newsletter</h5>
                    <div className="fs-1 text-success stat-icon">
                      <i className="bi bi-envelope"></i>
                    </div>
                  </div>
                  <h2 className="mb-3 stat-value">{loading ? '...' : stats.totalSubscribers}</h2>
                  <div className="mt-auto">
                    <Button
                      variant="success"
                      as={Link}
                      to="/admin/newsletter"
                      className="w-100 mb-2"
                    >
                      Gérer la newsletter
                    </Button>
                    <Button
                      variant="outline-success"
                      as={Link}
                      to="/admin/subscribers"
                      className="w-100"
                      size="sm"
                    >
                      Gérer les abonnés
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100 admin-card stat-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">Commentaires</h5>
                    <div className="fs-1 text-warning stat-icon">
                      <i className="bi bi-chat-dots"></i>
                    </div>
                  </div>
                  <h2 className="mb-3 stat-value">{loading ? '...' : stats.totalComments}</h2>
                  <div className="mt-auto">
                    <Button
                      variant="warning"
                      as={Link}
                      to="/admin/comments"
                      className="w-100"
                    >
                      Gérer les commentaires
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Nouvelle carte pour les Témoignages */}
            <Col md={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100 admin-card stat-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">Témoignages</h5>
                    <div className="fs-1 text-info stat-icon">
                      <i className="bi bi-star"></i> {/* Icône d'étoile pour les témoignages */}
                    </div>
                  </div>
                  <h2 className="mb-3 stat-value">{loading ? '...' : stats.totalTestimonials}</h2>
                  <div className="mt-auto">
                    <Button
                      variant="info"
                      as={Link}
                      to="/admin/testimonials"
                      className="w-100"
                    >
                      Gérer les témoignages
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Accès rapide */}
          <h4 className="mb-3">Accès rapide</h4>
          <Row>
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm h-100 admin-card">
                <Card.Body>
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="fs-1 mb-3 text-primary stat-icon">
                      <i className="bi bi-file-earmark-plus"></i>
                    </div>
                    <h5>Nouvel article</h5>
                    <p className="small text-muted">Créer un nouvel article pour le blog</p>
                    <Button
                      variant="outline-primary"
                      as={Link}
                      to="/admin/blog/new"
                      className="mt-auto w-100"
                    >
                      Créer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm h-100 admin-card">
                <Card.Body>
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="fs-1 mb-3 text-success stat-icon">
                      <i className="bi bi-envelope-plus"></i>
                    </div>
                    <h5>Nouvelle newsletter</h5>
                    <p className="small text-muted">Créer et envoyer une newsletter</p>
                    <Button
                      variant="outline-success"
                      onClick={() => navigate('/admin/newsletter')}
                      className="mt-auto w-100"
                    >
                      Créer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm h-100 admin-card">
                <Card.Body>
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="fs-1 mb-3 text-warning stat-icon">
                      <i className="bi bi-chat-left-text"></i>
                    </div>
                    <h5>Modération</h5>
                    <p className="small text-muted">Gérer les commentaires en attente</p>
                    <Button
                      variant="outline-warning"
                      onClick={() => navigate('/admin/comments')}
                      className="mt-auto w-100"
                    >
                      Modérer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Nouvelle carte pour la gestion des Témoignages dans Accès rapide */}
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm h-100 admin-card">
                <Card.Body>
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="fs-1 mb-3 text-info stat-icon">
                      <i className="bi bi-quote"></i> {/* Icône de citation pour la gestion des témoignages */}
                    </div>
                    <h5>Témoignages</h5>
                    <p className="small text-muted">Gérer les témoignages du site</p>
                    <Button
                      variant="outline-info"
                      onClick={() => navigate('/admin/testimonials')}
                      className="mt-auto w-100"
                    >
                      Gérer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm h-100 admin-card">
                <Card.Body>
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="fs-1 mb-3 text-info stat-icon">
                      <i className="bi bi-person-plus"></i>
                    </div>
                    <h5>Gestion utilisateurs</h5>
                    <p className="small text-muted">Gérer les comptes administrateurs</p>
                    <Button
                      variant="outline-info"
                      onClick={() => navigate('/admin/users')}
                      className="mt-auto w-100"
                    >
                      Gérer
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;