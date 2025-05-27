import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Badge, Tabs, Tab, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';
import ProtectedRoute from '../components/ProtectedRoute';
import { apiGet, apiPut, apiDelete } from '../services/api';

/**
 * Page de gestion des commentaires
 */
const AdminComments = () => {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  
  // États pour le modal de détail
  const [selectedComment, setSelectedComment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, moderate

  // Chargement des commentaires
  useEffect(() => {
    fetchComments(activeTab);
  }, [activeTab]);
  /**
   * Récupère la liste des commentaires selon le statut
   */
  const fetchComments = async (status = 'pending') => {
    try {
      setLoading(true);
      setError(null);
      let url = '/api/admin/blog/comments';
      if (status === 'pending') {
        url = '/api/admin/blog/comments/pending';
      } else if (['approuvé', 'rejeté', 'en attente'].includes(status)) {
        url = `/api/admin/blog/comments?status=${status}`;
      }
      const data = await apiGet(url, { headers: getAuthHeader() });
      setComments(data.data || []);
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
   * Ouvre le modal pour voir/modérer un commentaire
   */
  const openModal = (mode, comment) => {
    setModalMode(mode);
    setSelectedComment(comment);
    setShowModal(true);
  };
  /**
   * Modère un commentaire (approuver ou rejeter)
   */
  const handleModerateComment = async (commentId, status) => {
    try {
      setError(null);
      await apiPut(`/api/admin/blog/comments/${commentId}`, { status }, { headers: getAuthHeader() });
      await fetchComments(activeTab);
      if (showModal) {
        setShowModal(false);
      }
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        navigate('/login');
      } else {
        setError(err.message);
      }
    }
  };

  /**
   * Supprime un commentaire
   */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible et supprimera également toutes les réponses à ce commentaire.')) {
      return;
    }
    try {
      await apiDelete(`/api/admin/blog/comments/${commentId}`, { headers: getAuthHeader() });
      await fetchComments(activeTab);
      if (showModal) {
        setShowModal(false);
      }
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        navigate('/login');
      } else {
        setError(err.message);
      }
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Formatter le statut pour l'affichage
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approuvé':
        return <Badge bg="success">Approuvé</Badge>;
      case 'rejeté':
        return <Badge bg="danger">Rejeté</Badge>;
      case 'en attente':
      default:
        return <Badge bg="warning" text="dark">En attente</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'editor']}>
      <SEO
        title="Modération des commentaires | WebKlor"
        description="Interface d'administration pour la modération des commentaires WebKlor"
        noindex={true}
      />
      
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="mb-0">Modération des commentaires</h1>
              <p className="text-muted">Gérez les commentaires du blog</p>
            </Col>
            <Col xs="auto">
              <Link to="/admin" className="btn btn-outline-secondary">
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Link>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="pending" title={<span><i className="bi bi-clock me-1"></i> En attente</span>}>
              {renderCommentsTable('en attente')}
            </Tab>
            <Tab eventKey="approved" title={<span><i className="bi bi-check-circle me-1"></i> Approuvés</span>}>
              {renderCommentsTable('approuvé')}
            </Tab>
            <Tab eventKey="rejected" title={<span><i className="bi bi-x-circle me-1"></i> Rejetés</span>}>
              {renderCommentsTable('rejeté')}
            </Tab>
          </Tabs>
        </Container>
      </section>

      {/* Modal pour voir/modérer un commentaire */}
      {selectedComment && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalMode === 'moderate' ? 'Modérer le commentaire' : 'Détails du commentaire'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>{selectedComment.name}</h5>
                {getStatusBadge(selectedComment.status)}
              </div>
              
              <p className="mb-1">
                <strong>Email:</strong> {selectedComment.email}
              </p>
              <p className="mb-1">
                <strong>Date:</strong> {formatDate(selectedComment.createdAt)}
              </p>
              <p className="mb-1">
                <strong>Article:</strong>{' '}
                {selectedComment.post ? (
                  <Link to={`/blog/${selectedComment.post.slug}`} target="_blank">
                    {selectedComment.post.title}
                  </Link>
                ) : 'Article inconnu'}
              </p>
              
              <div className="mt-3">
                <strong>Commentaire:</strong>
                <Card className="mt-2">
                  <Card.Body>
                    {selectedComment.content}
                  </Card.Body>
                </Card>
              </div>
              
              {selectedComment.parentComment && (
                <div className="mt-3">
                  <strong>En réponse à:</strong>
                  <Card className="mt-2 bg-light">
                    <Card.Body>
                      {selectedComment.parentComment.content}
                    </Card.Body>
                    <Card.Footer className="bg-light border-0">
                      <small className="text-muted">Par {selectedComment.parentComment.name}</small>
                    </Card.Footer>
                  </Card>
                </div>
              )}
            </div>
            
            {modalMode === 'moderate' && (
              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="danger"
                  onClick={() => handleModerateComment(selectedComment._id, 'rejeté')}
                >
                  <i className="bi bi-x-circle me-2"></i> Rejeter
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleModerateComment(selectedComment._id, 'approuvé')}
                >
                  <i className="bi bi-check-circle me-2"></i> Approuver
                </Button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedComment.status === 'en attente' && modalMode === 'view' && (
              <div className="me-auto">
                <Button
                  variant="warning"
                  onClick={() => setModalMode('moderate')}
                >
                  <i className="bi bi-shield-check me-2"></i> Modérer
                </Button>
              </div>
            )}
            
            <Button 
              variant="outline-danger" 
              onClick={() => handleDeleteComment(selectedComment._id)}
            >
              <i className="bi bi-trash me-2"></i> Supprimer
            </Button>
            
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </ProtectedRoute>
  );

  /**
   * Affiche la table des commentaires selon le statut
   */
  function renderCommentsTable(status) {
    return (
      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-3 text-muted">Chargement des commentaires...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-chat-dots" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              <h4 className="mt-3">Aucun commentaire {status === 'approuvé' ? 'approuvé' : status === 'rejeté' ? 'rejeté' : 'en attente'}</h4>
              <p className="text-muted">
                {status === 'en attente' 
                  ? 'Tous les commentaires ont été modérés.' 
                  : status === 'approuvé' 
                    ? 'Aucun commentaire n\'a encore été approuvé.'
                    : 'Aucun commentaire n\'a encore été rejeté.'
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead className="table-light">
                  <tr>
                    <th>Auteur</th>
                    <th>Article</th>
                    <th>Commentaire</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment._id}>
                      <td>
                        <div>
                          <strong>{comment.name}</strong>
                          <div><small>{comment.email}</small></div>
                        </div>
                      </td>
                      <td>
                        {comment.post ? (
                          <Link to={`/blog/${comment.post.slug}`} target="_blank" className="text-primary">
                            {comment.post.title}
                          </Link>
                        ) : 'Article inconnu'}
                      </td>
                      <td>
                        <div className="comment-preview">
                          {comment.content.length > 100
                            ? `${comment.content.substring(0, 100)}...`
                            : comment.content}
                        </div>
                      </td>
                      <td>{formatDate(comment.createdAt)}</td>
                      <td>{getStatusBadge(comment.status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openModal('view', comment)}
                            title="Voir le détail"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          
                          {comment.status === 'en attente' && (
                            <>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleModerateComment(comment._id, 'approuvé')}
                                title="Approuver"
                              >
                                <i className="bi bi-check"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleModerateComment(comment._id, 'rejeté')}
                                title="Rejeter"
                              >
                                <i className="bi bi-x"></i>
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                            title="Supprimer"
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
        </Card.Body>
      </Card>
    );
  }
};

export default AdminComments;
