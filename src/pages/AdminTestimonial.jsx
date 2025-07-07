import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter, Star, StarOff, User, Calendar, CheckCircle, XCircle, Clock, ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { Button, Form, Spinner, Alert, Modal, Table, Pagination, Badge } from 'react-bootstrap';
import { apiGet, apiPost, apiPut, apiDelete } from '../services/api'; 
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const AdminTestimonial = () => {
  // Initialiser useAuth et useNavigate
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();

  // États pour les témoignages
  const [testimonials, setTestimonials] = useState([]); 
  const [allTestimonials, setAllTestimonials] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // États pour les modals
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // États pour les témoignages sélectionnés
  const [editingTestimonial, setEditingTestimonial] = useState(null); // Témoignage en cours d'édition
  const [deletingTestimonial, setDeletingTestimonial] = useState(null); // Témoignage en cours de suppression
  const [viewingTestimonial, setViewingTestimonial] = useState(null); // Témoignage en cours de visualisation

  // États pour le formulaire d'ajout/édition
  const [formData, setFormData] = useState({
    name: '', // Correspond à 'author' côté backend
    email: '',
    company: '',
    position: '',
    content: '',
    rating: 5,
    isApproved: 'false', // Utilisé pour le statut dans le formulaire, valeur en chaîne pour <select>
  });

  // États pour le filtrage et la pagination
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'approuvé', 'en attente', 'rejeté'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Nombre d'éléments par page

  // Redirection si l'utilisateur n'est pas authentifié
  useEffect(() => {
    // Si getAuthHeader n'est pas disponible (utilisateur non authentifié), rediriger
    if (!getAuthHeader) {
      navigate('/login'); // Ou toute autre route de connexion/page d'accueil
    }
  }, [getAuthHeader, navigate]); // Dépend de getAuthHeader et navigate

  // --- Fonctions d'appel API ---

  // Fonction pour charger tous les témoignages depuis le backend
  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      // Utilisation de getAuthHeader pour les routes protégées
      const response = await apiGet('/api/admin/testimonials', {
        headers: getAuthHeader()
      });
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors du chargement des témoignages');
      }
      setAllTestimonials(response.data); // Stocke tous les témoignages bruts
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des témoignages:', err);
      setError(err.message || 'Impossible de charger les témoignages.');
      setLoading(false);
    }
  };

  // Fonction de sauvegarde (ajout ou modification du statut)
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (editingTestimonial) {
        // Logique de MODIFICATION (uniquement le statut d'approbation via l'API actuelle)
        // Convertir la chaîne 'true'/'false' du select en booléen
        const isApprovedStatus = formData.isApproved === 'true';
        response = await apiPut(`/api/admin/testimonials/${editingTestimonial._id}/status`, {
          isApproved: isApprovedStatus
        }, {
          headers: getAuthHeader() // Utilisation de getAuthHeader
        });
        if (!response.success) {
          throw new Error(response.message || 'Erreur lors de la mise à jour du statut du témoignage.');
        }
        setSuccess('Statut du témoignage mis à jour avec succès !');
      } else {
        // Logique d'AJOUT (utilise la route publique de soumission)
        // Pas besoin de getAuthHeader pour cette route publique
        response = await apiPost('/api/testimonials', {
          author: formData.name, // Mappe 'name' du formulaire à 'author' pour le backend
          email: formData.email,
          company: formData.company,
          position: formData.position,
          content: formData.content,
          rating: parseInt(formData.rating, 10), // Assure que le rating est un nombre
        });
        if (!response.success) {
          throw new Error(response.message || 'Erreur lors de l\'ajout du témoignage.');
        }
        setSuccess('Témoignage ajouté avec succès ! Il est en attente de modération.');
      }
      setShowModal(false); // Ferme le modal après succès
      fetchTestimonials(); // Rafraîchit la liste des témoignages
      setTimeout(() => setSuccess(null), 3000); // Masque le message de succès après 3 secondes
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du témoignage:', err);
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction de suppression
  const handleDeleteTestimonial = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Utilisation de getAuthHeader
      const response = await apiDelete(`/api/admin/testimonials/${deletingTestimonial._id}`, {
        headers: getAuthHeader()
      });
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la suppression du témoignage.');
      }
      setSuccess('Témoignage supprimé avec succès !');
      setShowDeleteModal(false); // Ferme le modal de suppression
      fetchTestimonials(); // Rafraîchit la liste
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la suppression du témoignage:', err);
      setError(err.message || 'Une erreur est survenue lors de la suppression.');
    } finally {
      setLoading(false);
    }
  };

  // --- Fonctions de gestion de l'UI ---

  // Gère les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Ouvre le modal d'ajout
  const openAddModal = () => {
    setEditingTestimonial(null); // Pas en mode édition
    setFormData({ // Réinitialise le formulaire
      name: '',
      email: '',
      company: '',
      position: '',
      content: '',
      rating: 5,
      isApproved: 'false',
    });
    setShowModal(true);
  };

  // Ouvre le modal d'édition
  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial); // Définit le témoignage à éditer
    setFormData({ // Remplit le formulaire avec les données existantes
      name: testimonial.author, // Mappe 'author' du backend à 'name' pour le formulaire
      email: testimonial.email,
      company: testimonial.company || '',
      position: testimonial.position || '',
      content: testimonial.content,
      rating: testimonial.rating,
      isApproved: testimonial.isApproved ? 'true' : 'false', // Convertit booléen en chaîne pour le <select>
    });
    setShowModal(true);
  };

  // Ouvre le modal de confirmation de suppression
  const openDeleteModal = (testimonial) => {
    setDeletingTestimonial(testimonial);
    setShowDeleteModal(true);
  };

  // Ouvre le modal de visualisation
  const openViewModal = (testimonial) => {
    setViewingTestimonial(testimonial);
    setShowViewModal(true);
  };

  // --- Logique de Filtrage et Pagination (Côté Client) ---
  // Note: Puisque votre backend ne supporte pas le filtrage/pagination côté serveur pour les témoignages,
  // nous filtrons et paginons les données après les avoir toutes récupérées.
  // Pour de très grands datasets, il serait plus performant d'ajouter ces fonctionnalités à l'API backend.

  // Charge les témoignages au montage du composant
  useEffect(() => {
    fetchTestimonials();
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois au chargement initial

  // Applique les filtres et la pagination lorsque les données brutes ou les critères changent
  useEffect(() => {
    let filtered = allTestimonials;

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => {
        // La propriété 'status' n'est pas toujours présente ou utilisée pour la modération.
        // On se base sur 'isApproved' pour 'approuvé' et 'en attente'.
        // Si vous avez un champ 'status' explicite dans votre modèle de témoignage pour 'rejeté', utilisez-le.
        if (statusFilter === 'approuvé') return t.isApproved === true;
        if (statusFilter === 'en attente') return t.isApproved === false;
        // Si 'rejeté' est un statut distinct géré par un champ 'status' dans le modèle
        // if (statusFilter === 'rejeté') return t.status === 'rejeté';
        return true; // Devrait être false ou géré par un cas spécifique
      });
    }

    // Filtrage par recherche (nom, contenu, email)
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.content && t.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Applique la pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setTestimonials(filtered.slice(startIndex, endIndex));
  }, [allTestimonials, statusFilter, searchQuery, currentPage, itemsPerPage]);

  // Calcule le nombre total de pages pour la pagination
  const totalPages = Math.ceil(
    (statusFilter !== 'all' || searchQuery ? testimonials.length : allTestimonials.length) / itemsPerPage
  );

  // --- Fonctions utilitaires ---

  // Formate la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Retourne le badge de statut approprié
  const getStatusBadge = (isApproved) => {
    if (isApproved) return <Badge bg="success">Approuvé</Badge>;
    return <Badge bg="warning">En attente</Badge>;
    // Si vous aviez un statut 'rejeté' explicite dans le backend:
    // if (status === 'rejeté') return <Badge bg="danger">Rejeté</Badge>;
  };

  // --- Rendu du composant ---

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Gestion des Témoignages</h1>

      {/* Messages de succès/erreur */}
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Liste des Témoignages</h5>
            <Button variant="primary" onClick={openAddModal}>
              <Plus className="me-2" size={18} /> Ajouter Témoignage
            </Button>
          </div>

          {/* Filtres et recherche */}
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Group>
                <Form.Label visuallyHidden>Filtrer par statut</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="approuvé">Approuvé</option>
                  <option value="en attente">En attente</option>
                  {/* <option value="rejeté">Rejeté</option> */} {/* Décommentez si votre backend gère un statut 'rejeté' explicitement */}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-8">
              <Form.Group className="d-flex">
                <Form.Label visuallyHidden>Rechercher</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Rechercher par nom, email ou contenu..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
                <Button variant="outline-secondary" className="ms-2">
                  <Search size={18} />
                </Button>
              </Form.Group>
            </div>
          </div>

          {/* Tableau des témoignages */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" className="mb-3" />
              <p>Chargement des témoignages...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <Alert variant="info" className="text-center">
              Aucun témoignage trouvé pour les critères sélectionnés.
            </Alert>
          ) : (
            <>
              <Table striped bordered hover responsive className="mb-3">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Contenu</th>
                    <th>Note</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((testimonial) => (
                    <tr key={testimonial._id}>
                      <td>
                        <User size={14} className="me-1 text-muted" />{testimonial.author}
                        {testimonial.company && <small className="d-block text-muted">({testimonial.company})</small>}
                      </td>
                      <td>{testimonial.email}</td>
                      <td>{testimonial.content.substring(0, 70)}...</td>
                      <td>
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} size={16} fill="#FFD700" stroke="#FFD700" />
                        ))}
                        {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                          <Star key={i + testimonial.rating} size={16} stroke="#FFD700" />
                        ))}
                      </td>
                      <td>{getStatusBadge(testimonial.isApproved)}</td>
                      <td>
                        <Calendar size={14} className="me-1 text-muted" />{formatDate(testimonial.createdAt)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="info" size="sm" onClick={() => openViewModal(testimonial)} title="Voir">
                            <Eye size={16} />
                          </Button>
                          <Button variant="warning" size="sm" onClick={() => openEditModal(testimonial)} title="Éditer le statut">
                            <Edit size={16} />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => openDeleteModal(testimonial)} title="Supprimer">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <Pagination className="justify-content-center">
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </>
          )}
        </div>
      </div>

      {/* Modal d'ajout/édition */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingTestimonial ? 'Modifier le témoignage' : 'Ajouter un témoignage'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <div className="text-center"><Spinner animation="border" size="sm" /> Enregistrement...</div>}
          {error && <Alert variant="danger">{error}</Alert>}
          {/* Note: Pour la modification, seul le statut est réellement mis à jour via l'API actuelle.
              Les autres champs du formulaire ci-dessous ne seront pas sauvegardés côté backend lors de l'édition.
              Si vous souhaitez permettre la modification de tous les champs, vous devrez ajouter
              une route PUT/PATCH dédiée dans testimonial.routes.js et un contrôleur dans testimonial.controller.js. */}
          <Form onSubmit={handleSaveTestimonial}>
            <Form.Group className="mb-3">
              <Form.Label>Nom de l'auteur *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Entreprise</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenu du témoignage *</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Note (sur 5) *</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
                required
                disabled={loading}
              />
            </Form.Group>

            {editingTestimonial && (
              <Form.Group className="mb-3">
                <Form.Label>Statut d'approbation</Form.Label>
                <Form.Select
                  name="isApproved"
                  value={formData.isApproved}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="true">Approuvé</option>
                  <option value="false">En attente</option>
                </Form.Select>
              </Form.Group>
            )}

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" className="me-2" /> : ''}
                {editingTestimonial ? 'Mettre à jour le statut' : 'Ajouter le témoignage'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          Êtes-vous sûr de vouloir supprimer le témoignage de <strong>{deletingTestimonial?.author}</strong> ? Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteTestimonial} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : ''}
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de visualisation */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails du Témoignage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingTestimonial && (
            <div>
              <p><strong>Nom :</strong> {viewingTestimonial.author}</p>
              <p><strong>Email :</strong> {viewingTestimonial.email}</p>
              {viewingTestimonial.company && <p><strong>Entreprise :</strong> {viewingTestimonial.company}</p>}
              {viewingTestimonial.position && <p><strong>Position :</strong> {viewingTestimonial.position}</p>}
              <p><strong>Note :</strong> {viewingTestimonial.rating} <Star size={16} fill="#FFD700" stroke="#FFD700" /></p>
              <p><strong>Contenu :</strong> {viewingTestimonial.content}</p>
              <p><strong>Statut :</strong> {getStatusBadge(viewingTestimonial.isApproved)}</p>
              <p><strong>Date de soumission :</strong> {formatDate(viewingTestimonial.createdAt)}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTestimonial;