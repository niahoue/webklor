import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiDelete } from '../services/api';
import SEO from '../components/SEO';

/**
 * Page d'administration du blog
 * Permet de gérer les articles (liste, ajout, modification, suppression)
 * @returns {JSX.Element}
 */
const AdminBlog = () => {
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();
  
  // États pour les articles et la pagination
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    archivedPosts: 0,
    popularPosts: [],
    categories: []
  });
  
  // États pour la pagination et les filtres
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });
  
  // Configuration SEO de la page
  const seoData = {
    title: "Administration du Blog",
    description: "Interface d'administration pour gérer les articles du blog WebKlor",
    noindex: true // Pour éviter l'indexation par les moteurs de recherche
  };
  
  // Fonction pour récupérer les statistiques
  const fetchStats = async () => {
    try {
      const data = await apiGet('http://localhost:5000/api/admin/blog/stats', { headers: getAuthHeader() });
      setStats(data.data);
    } catch (error) {
      if (error.message && error.message.toLowerCase().includes('401')) {
        navigate('/login');
      } else {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    }
  };
  
  // Fonction pour récupérer les articles
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Construire l'URL avec les paramètres de filtre et pagination
      let url = `http://localhost:5000/api/admin/blog/posts?page=${currentPage}`;
      
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.category) url += `&category=${filters.category}`;
      if (filters.search) url += `&search=${filters.search}`;
      
      const data = await apiGet(url, { headers: getAuthHeader() });
      setPosts(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error.message && error.message.toLowerCase().includes('401')) {
        navigate('/login');
      } else {
        setError(error.message || 'Une erreur est survenue lors du chargement des articles');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour supprimer un article
  const handleDeletePost = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await apiDelete(`http://localhost:5000/api/admin/blog/posts/${id}`, { headers: getAuthHeader() });
        fetchPosts();
        fetchStats();
        alert('Article supprimé avec succès');
      } catch (error) {
        if (error.message && error.message.toLowerCase().includes('401')) {
          navigate('/login');
        } else {
          alert(error.message || 'Une erreur est survenue lors de la suppression de l\'article');
        }
      }
    }
  };
  
  // Fonction pour changer les filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Appliquer les filtres et revenir à la première page
  const applyFilters = () => {
    setCurrentPage(1);
    fetchPosts();
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      status: '',
      category: '',
      search: ''
    });
    setCurrentPage(1);
    fetchPosts();
  };
  
  // Charger les données lors du montage du composant
  useEffect(() => {
    fetchStats();
    fetchPosts();
  }, [currentPage]);
  
  return (    <main className="admin-blog">
      <SEO {...seoData} />
      
      <section className="py-5 bg-light">
        <Container>          <Row className="align-items-center mb-3">
            <Col>
              <h1 className="mb-0">Administration du Blog</h1>
            </Col>            <Col xs="auto">
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
                <i className="bi bi-envelope me-1"></i> Gérer les newsletters
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/admin/blog/new')}
                className="d-flex align-items-center"
              >
                <i className="bi bi-plus-lg me-2"></i>
                Nouvel article
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
      
      <section className="py-4">
        <Container>
          {/* Statistiques */}
          <Row className="mb-4">
            <Col md={3} className="mb-3 mb-md-0">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h2 className="h1 mb-2">{stats.totalPosts}</h2>
                  <p className="mb-0">Total des articles</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <Card className="text-center h-100 shadow-sm bg-success text-white">
                <Card.Body>
                  <h2 className="h1 mb-2">{stats.publishedPosts}</h2>
                  <p className="mb-0">Articles publiés</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <Card className="text-center h-100 shadow-sm bg-warning">
                <Card.Body>
                  <h2 className="h1 mb-2">{stats.draftPosts}</h2>
                  <p className="mb-0">Brouillons</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <Card className="text-center h-100 shadow-sm bg-secondary text-white">
                <Card.Body>
                  <h2 className="h1 mb-2">{stats.archivedPosts}</h2>
                  <p className="mb-0">Archives</p>
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
                      <option value="publié">Publié</option>
                      <option value="brouillon">Brouillon</option>
                      <option value="archivé">Archivé</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Catégorie</Form.Label>
                    <Form.Select 
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                    >
                      <option value="">Toutes</option>
                      {stats.categories.map((cat, index) => (
                        <option key={index} value={cat.category}>
                          {cat.category} ({cat.count})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Recherche</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      placeholder="Rechercher..."
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2">
                <Button 
                  variant="outline-secondary"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </Button>
                <Button 
                  variant="primary"
                  onClick={applyFilters}
                >
                  Appliquer
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          {/* Liste des articles */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <Card className="shadow-sm">
                <Card.Body>
                  <h4 className="card-title">Articles ({posts.length})</h4>
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Titre</th>
                          <th>Catégorie</th>
                          <th>Auteur</th>
                          <th>Date</th>
                          <th>Statut</th>
                          <th>Vues</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map((post) => (
                          <tr key={post._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                {post.featuredImage && (
                                  <img 
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="me-2"
                                    width="40"
                                    height="40"
                                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                                  />
                                )}
                                <div>
                                  <strong>{post.title}</strong>
                                  <div><small className="text-muted">{post.slug}</small></div>
                                </div>
                              </div>
                            </td>
                            <td>{post.category}</td>
                            <td>{post.author}</td>
                            <td>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</td>
                            <td>
                              <Badge bg={
                                post.status === 'publié' ? 'success' : 
                                post.status === 'brouillon' ? 'warning' : 
                                'secondary'
                              }>
                                {post.status}
                              </Badge>
                            </td>
                            <td>{post.views}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => navigate(`/admin/blog/edit/${post._id}`)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDeletePost(post._id)}
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
                </Card.Body>
              </Card>
              
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
            </>
          )}
        </Container>
      </section>
    </main>
  );
};

export default AdminBlog;
