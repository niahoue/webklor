import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPost, apiPut, apiDelete } from '../services/api';
import SEO from '../components/SEO';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * Page de gestion des utilisateurs administrateurs
 */
const AdminUsers = () => {
  const navigate = useNavigate();
  const { getAuthHeader, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add, edit
  const [selectedUser, setSelectedUser] = useState(null);

  // Formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor',
  });

  // Chargement des utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Récupère la liste des utilisateurs administrateurs
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet('/api/auth/users', { headers: getAuthHeader() });
      setUsers(data.data || []);
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
   * Ouvre le modal pour ajouter/modifier un utilisateur
   */
  const openModal = (mode, user = null) => {
    setModalMode(mode);
    
    if (mode === 'edit' && user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'editor',
      });
    }
    
    setShowModal(true);
  };

  /**
   * Gère les modifications des champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let url = '/api/auth/register';
      let method = 'POST';
      if (modalMode === 'edit' && selectedUser) {
        url = `/api/auth/users/${selectedUser._id}`;
        method = 'PUT';
      }
      let data;
      if (method === 'POST') {
        data = await apiPost(url, formData, { headers: getAuthHeader() });
      } else {
        data = await apiPut(url, formData, { headers: getAuthHeader() });
      }
      await fetchUsers();
      setShowModal(false);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        navigate('/login');
      } else {
        setError(err.message);
      }
    }
  };

  /**
   * Suppression d'un utilisateur
   */
  const handleDelete = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    try {
      await apiDelete(`/api/auth/users/${userId}`, { headers: getAuthHeader() });
      await fetchUsers();
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('401')) {
        navigate('/login');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SEO
        title="Gestion des utilisateurs | WebKlor"
        description="Interface d'administration pour la gestion des utilisateurs WebKlor"
        noindex={true}
      />
      
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="mb-0">Gestion des utilisateurs</h1>
              <p className="text-muted">Gérez les comptes administrateurs</p>
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
                variant="primary"
                onClick={() => openModal('add')}
              >
                <i className="bi bi-person-plus me-2"></i> Ajouter un utilisateur
              </Button>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="shadow-sm">
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <p className="mt-3 text-muted">Chargement des utilisateurs...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-people" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  <h4 className="mt-3">Aucun utilisateur trouvé</h4>
                  <p className="text-muted">Commencez par ajouter un utilisateur administrateur</p>
                  <Button
                    variant="primary"
                    onClick={() => openModal('add')}
                  >
                    <i className="bi bi-person-plus me-2"></i> Ajouter un utilisateur
                  </Button>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead className="table-light">
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Date de création</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={user.role === 'admin' ? 'danger' : 'info'}>
                            {user.role === 'admin' ? 'Admin' : 'Éditeur'}
                          </Badge>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleString('fr-FR')}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => openModal('edit', user)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          {/* Ne pas permettre de supprimer son propre compte ou le dernier admin */}
                          {currentUser.id !== user._id && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(user._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Modal pour ajouter/modifier un utilisateur */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Ajouter un utilisateur' : 'Modifier l\'utilisateur'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>
                {modalMode === 'add' ? 'Mot de passe' : 'Nouveau mot de passe'}
                {modalMode === 'edit' && <span className="text-muted"> (laisser vide pour conserver)</span>}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={modalMode === 'add'}
                placeholder={modalMode === 'edit' ? 'Laisser vide pour conserver' : ''}
              />
              {modalMode === 'add' && (
                <Form.Text className="text-muted">
                  Au moins 8 caractères, avec majuscules, minuscules et chiffres.
                </Form.Text>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="editor">Éditeur</option>
                <option value="admin">Administrateur</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Les administrateurs ont accès à toutes les fonctionnalités. Les éditeurs peuvent seulement gérer le contenu.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {modalMode === 'add' ? 'Ajouter' : 'Enregistrer les modifications'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </ProtectedRoute>
  );
};

export default AdminUsers;
