import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Badge, Modal, Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPost, apiPut, apiDelete } from '../services/api';
import SEO from '../components/SEO';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * Page de gestion des abonnés à la newsletter
 */
const AdminSubscribers = () => {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
    recentSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, add, edit
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  
  // Pagination et filtres
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  // Formulaire
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    status: 'active'
  });

  // Chargement des données au montage du composant
  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [currentPage, filters]);

  /**
   * Récupère la liste des abonnés avec pagination et filtres
   */
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });
      
      const data = await apiGet(
        `/api/newsletters/subscribers/list?${queryParams}`, 
        { headers: getAuthHeader() }
      );
      
      setSubscribers(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        navigate('/login');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère les statistiques des abonnés
   */
  const fetchStats = async () => {
    try {
      const data = await apiGet('/api/newsletters/subscribers/stats', { headers: getAuthHeader() });
      setStats(data.data || stats);
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
    }
  };

  /**
   * Gestion des changements dans les filtres
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset à la première page
  };

  /**
   * Réinitialise les filtres
   */
  const resetFilters = () => {
    setFilters({
      status: '',
      search: ''
    });
    setCurrentPage(1);
  };

  /**
   * Ouverture du modal
   */
  const openModal = (mode, subscriber = null) => {
    setModalMode(mode);
    setSelectedSubscriber(subscriber);
    
    if (subscriber && mode === 'edit') {
      setFormData({
        email: subscriber.email,
        name: subscriber.name || '',
        status: subscriber.status
      });
    } else {
      setFormData({
        email: '',
        name: '',
        status: 'active'
      });
    }
    
    setShowModal(true);
  };

  /**
   * Fermeture du modal
   */
  const closeModal = () => {
    setShowModal(false);
    setSelectedSubscriber(null);
    setFormData({
      email: '',
      name: '',
      status: 'active'
    });
  };

  /**
   * Gestion des changements dans le formulaire
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Soumission du formulaire
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'add') {
        await apiPost('/api/newsletters/subscribe', formData, { headers: getAuthHeader() });
      } else if (modalMode === 'edit') {
        await apiPut(
          `/api/newsletters/subscribers/${selectedSubscriber._id}`, 
          formData, 
          { headers: getAuthHeader() }
        );
      }
      
      await fetchSubscribers();
      await fetchStats();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Suppression d'un abonné
   */
  const handleDeleteSubscriber = async (subscriberId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) {
      try {
        await apiDelete(
          `/api/newsletters/subscribers/${subscriberId}`, 
          { headers: getAuthHeader() }
        );
        await fetchSubscribers();
        await fetchStats();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  /**
   * Changement du statut d'un abonné
   */
  const handleStatusChange = async (subscriberId, newStatus) => {
    try {
      await apiPut(
        `/api/newsletters/subscribers/${subscriberId}/status`, 
        { status: newStatus }, 
        { headers: getAuthHeader() }
      );
      await fetchSubscribers();
      await fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Rendu du badge de statut
   */
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Actif</Badge>;
      case 'unsubscribed':
        return <Badge bg="danger">Désabonné</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">En attente</Badge>;
      default:
        return <Badge bg="secondary">Inconnu</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'editor']}>
      <SEO
        title="Gestion des abonnés newsletter | WebKlor"
        description="Interface d'administration pour la gestion des abonnés à la newsletter WebKlor"
        noindex={true}
      />
      
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="mb-0">Gestion des abonnés</h1>
              <p className="text-muted">Gérez les abonnés à la newsletter</p>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/admin')}
                className="me-2"
              >
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => navigate('/admin/newsletter')}
                className="me-2"
              >
                <i className="bi bi-envelope me-1"></i> Newsletters
              </Button>
              <Button
                variant="primary"
                onClick={() => openModal('add')}
              >
                <i className="bi bi-person-plus me-2"></i> Ajouter un abonné
              </Button>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Statistiques */}
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h2 className="h1 mb-2 text-primary">{stats.total}</h2>
                  <p className="mb-0">Total abonnés</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 shadow-sm bg-success text-white">
                <Card.Body>
                  <h2 className="h1 mb-2">{stats.active}</h2>
                  <p className="mb-0">Actifs</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 shadow-sm bg-danger text-white">
                <Card.Body>
                  <h2 className="h1 mb-2">{stats.unsubscribed}</h2>
                  <p className="mb-0">Désabonnés</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 shadow-sm bg-info text-white">
                <Card.Body>
                  <h2 className="h1 mb-2">{stats.recentSubscriptions}</h2>
                  <p className="mb-0">Récents (7j)</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filtres */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h4 className="card-title">Filtres</h4>
              <Row>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Statut</Form.Label>
                    <Form.Select 
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">Tous</option>
                      <option value="active">Actifs</option>
                      <option value="unsubscribed">Désabonnés</option>
                      <option value="pending">En attente</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Recherche</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      placeholder="Rechercher par email ou nom..."
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="mb-3 d-flex align-items-end">
                  <Button 
                    variant="outline-secondary"
                    onClick={resetFilters}
                    className="w-100"
                  >
                    Réinitialiser
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Liste des abonnés */}
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="card-title">Abonnés ({subscribers.length})</h4>
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Nom</th>
                        <th>Statut</th>
                        <th>Date d'inscription</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber._id}>
                          <td>{subscriber.email}</td>
                          <td>{subscriber.name || '-'}</td>
                          <td>{renderStatusBadge(subscriber.status)}</td>
                          <td>{new Date(subscriber.createdAt).toLocaleDateString('fr-FR')}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                onClick={() => openModal('view', subscriber)}
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => openModal('edit', subscriber)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              {subscriber.status === 'active' ? (
                                <Button 
                                  variant="outline-warning" 
                                  size="sm"
                                  onClick={() => handleStatusChange(subscriber._id, 'unsubscribed')}
                                >
                                  <i className="bi bi-person-dash"></i>
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => handleStatusChange(subscriber._id, 'active')}
                                >
                                  <i className="bi bi-person-check"></i>
                                </Button>
                              )}
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteSubscriber(subscriber._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    />
                    
                    {[...Array(totalPages).keys()].map(page => (
                      <Pagination.Item 
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => setCurrentPage(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Modal pour ajouter/éditer/voir un abonné */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' && 'Ajouter un abonné'}
            {modalMode === 'edit' && 'Modifier l\'abonné'}
            {modalMode === 'view' && 'Détails de l\'abonné'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === 'view' ? (
            selectedSubscriber && (
              <div>
                <p><strong>Email:</strong> {selectedSubscriber.email}</p>
                <p><strong>Nom:</strong> {selectedSubscriber.name || 'Non renseigné'}</p>
                <p><strong>Statut:</strong> {renderStatusBadge(selectedSubscriber.status)}</p>
                <p><strong>Date d'inscription:</strong> {new Date(selectedSubscriber.createdAt).toLocaleDateString('fr-FR')}</p>
                {selectedSubscriber.unsubscribedAt && (
                  <p><strong>Date de désabonnement:</strong> {new Date(selectedSubscriber.unsubscribedAt).toLocaleDateString('fr-FR')}</p>
                )}
              </div>
            )
          ) : (
            <Form onSubmit={handleFormSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="exemple@email.com"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Nom de l'abonné (optionnel)"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Statut</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="active">Actif</option>
                  <option value="unsubscribed">Désabonné</option>
                  <option value="pending">En attente</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Fermer
          </Button>
          {modalMode !== 'view' && (
            <Button variant="primary" onClick={handleFormSubmit}>
              {modalMode === 'add' ? 'Ajouter' : 'Modifier'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </ProtectedRoute>
  );
};

export default AdminSubscribers;
