import { useState, useEffect } from 'react';
import { Container, Button, Alert, Table, Badge, Tabs, Tab, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPost, apiPut, apiDelete } from '../services/api';

/**
 * Page d'administration des newsletters
 */
const AdminNewsletter = () => {
  const { getAuthHeader } = useAuth();
  // État pour stocker les newsletters et les abonnés
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('newsletters');
  
  // États pour le modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // view, edit, create
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });

  // Chargement des données
  useEffect(() => {
    fetchNewsletters();
    fetchSubscribers();
  }, []);

  /**
   * Récupération des newsletters
   */
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet('/api/newsletters', { headers: getAuthHeader() });
      setNewsletters(data.data || []);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        window.location.href = '/login';
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupération des abonnés
   */
  const fetchSubscribers = async () => {
    try {
      const data = await apiGet('/api/newsletters/subscribers/list', { headers: getAuthHeader() });
      setSubscribers(data.data || []);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        window.location.href = '/login';
      }
    }
  };

  /**
   * Ouverture du modal pour créer/éditer une newsletter
   */
  const openModal = (type, newsletter = null) => {
    setModalType(type);
    
    if (newsletter) {
      setSelectedNewsletter(newsletter);
      setFormData({
        subject: newsletter.subject,
        content: newsletter.content,
      });
    } else {
      setSelectedNewsletter(null);
      setFormData({
        subject: '',
        content: '',
      });
    }
    
    setShowModal(true);
  };

  /**
   * Fermeture du modal
   */
  const closeModal = () => {
    setShowModal(false);
    setSelectedNewsletter(null);
  };

  /**
   * Mise à jour du formulaire
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let url = '/api/newsletters';
      let method = 'POST';

      // Si modification d'une newsletter existante
      if (modalType === 'edit' && selectedNewsletter) {
        url = `/api/newsletters/${selectedNewsletter._id}`;
        method = 'PUT';
      }

      if (method === 'POST') {
        await apiPost(url, formData, { headers: getAuthHeader() });
      } else {
        await apiPut(url, formData, { headers: getAuthHeader() });
      }

      // Rafraîchir les données
      await fetchNewsletters();
      closeModal();
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        window.location.href = '/login';
      } else {
        setError(err.message);
      }
    }
  };

  /**
   * Suppression d'une newsletter
   */
  const deleteNewsletter = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette newsletter ?')) {
      return;
    }

    try {
      await apiDelete(`/api/newsletters/${id}`, { headers: getAuthHeader() });
      await fetchNewsletters();
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        window.location.href = '/login';
      } else {
        setError(err.message);
      }
    }
  };

  /**
   * Envoi d'une newsletter
   */
  const sendNewsletter = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir envoyer cette newsletter ?')) {
      return;
    }

    try {
      await apiPost(`/api/newsletters/${id}/send`, {}, { headers: getAuthHeader() });
      await fetchNewsletters();
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        window.location.href = '/login';
      } else {
        setError(err.message);
      }
    }
  };

  /**
   * Formatage de la date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Obtention de la couleur du badge en fonction du statut
   */
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'scheduled': return 'info';
      case 'sending': return 'warning';
      case 'sent': return 'success';
      case 'failed': return 'danger';
      default: return 'light';
    }
  };

  /**
   * Traduction du statut en français
   */
  const translateStatus = (status) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'scheduled': return 'Programmée';
      case 'sending': return 'En cours d\'envoi';
      case 'sent': return 'Envoyée';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'editor']}>
      <Container className="py-5">
        <SEO 
          title="Gestion des newsletters" 
          description="Administration des newsletters de WebKlor."
          noindex={true}
        />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestion des newsletters</h2>
            <div>
            <Link to="/admin" className="btn btn-outline-secondary me-2">
              <i className="bi bi-speedometer2 me-1"></i> Dashboard
            </Link>
            <Link to="/admin/blog" className="btn btn-outline-secondary me-2">
              <i className="bi bi-file-earmark-text me-1"></i> Articles
            </Link>
            {activeTab === 'newsletters' && (
              <Button variant="primary" onClick={() => openModal('create')}>
                <i className="bi bi-plus-circle me-2"></i>
                Créer une newsletter
              </Button>
            )}
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="newsletters" title="Newsletters">
            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement des newsletters...</p>
              </div>
            ) : newsletters.length === 0 ? (
              <div className="text-center p-5 bg-light rounded">
                <i className="bi bi-envelope-x" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3">Aucune newsletter</h4>
                <p className="text-muted">Vous n'avez pas encore créé de newsletter.</p>
                <Button variant="primary" onClick={() => openModal('create')}>
                  Créer votre première newsletter
                </Button>
              </div>
            ) : (
              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th>Sujet</th>
                    <th>Statut</th>
                    <th>Créée le</th>
                    <th>Envoyée le</th>
                    <th>Destinataires</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletters.map((newsletter) => (
                    <tr key={newsletter._id}>
                      <td>{newsletter.subject}</td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(newsletter.status)}>
                          {translateStatus(newsletter.status)}
                        </Badge>
                      </td>
                      <td>{formatDate(newsletter.createdAt)}</td>
                      <td>{newsletter.sentAt ? formatDate(newsletter.sentAt) : 'Non envoyée'}</td>
                      <td>
                        {newsletter.recipients.count > 0 ? (
                          <span>{newsletter.recipients.count}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => openModal('view', newsletter)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        
                        {['draft', 'scheduled'].includes(newsletter.status) && (
                          <>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-1"
                              onClick={() => openModal('edit', newsletter)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              className="me-1" 
                              onClick={() => sendNewsletter(newsletter._id)}
                            >
                              <i className="bi bi-send"></i>
                            </Button>
                            
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => deleteNewsletter(newsletter._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>
          
          <Tab eventKey="subscribers" title="Abonnés">
            {subscribers.length === 0 ? (
              <div className="text-center p-5 bg-light rounded">
                <i className="bi bi-people" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3">Aucun abonné</h4>
                <p className="text-muted">Vous n'avez pas encore d'abonnés à la newsletter.</p>
              </div>
            ) : (
              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Statut</th>
                    <th>Inscrit le</th>
                    <th>Confirmé le</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber._id}>
                      <td>{subscriber.email}</td>
                      <td>{subscriber.firstName || <span className="text-muted">-</span>}</td>
                      <td>{subscriber.lastName || <span className="text-muted">-</span>}</td>
                      <td>
                        <Badge bg={subscriber.isActive ? 'success' : 'danger'}>
                          {subscriber.isActive ? 'Actif' : 'Désabonné'}
                        </Badge>
                      </td>
                      <td>{formatDate(subscriber.createdAt)}</td>
                      <td>
                        {subscriber.confirmedAt ? formatDate(subscriber.confirmedAt) : (
                          <Badge bg="warning">Non confirmé</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>
        </Tabs>

        {/* Modal pour créer/éditer/visualiser une newsletter */}
        <Modal show={showModal} onHide={closeModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'create' && 'Créer une nouvelle newsletter'}
              {modalType === 'edit' && 'Modifier la newsletter'}
              {modalType === 'view' && 'Aperçu de la newsletter'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType === 'view' && selectedNewsletter ? (
              <div>
                <h3>{selectedNewsletter.subject}</h3>
                <hr />
                <div dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }}></div>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Sujet</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contenu</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    style={{ height: '300px' }}
                    required
                  />
                  <Form.Text className="text-muted">
                    Vous pouvez utiliser du HTML pour formater le contenu.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={closeModal} className="me-2">
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    {modalType === 'create' ? 'Créer' : 'Enregistrer'}
                  </Button>
                </div>
              </Form>
            )}
          </Modal.Body>
          {modalType === 'view' && (
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Fermer
              </Button>
            </Modal.Footer>
          )}
        </Modal>
      </Container>
    </ProtectedRoute>
  );
};

export default AdminNewsletter;
