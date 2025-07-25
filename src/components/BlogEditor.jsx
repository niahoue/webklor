import { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPost, apiPut } from '../services/api';
import LazyImage from './LazyImage';

/**
 * Composant d'édition d'articles de blog
 * Utilisé pour créer ou modifier un article
 * @returns {JSX.Element}
 */
const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewPost = !id;
  const formRef = useRef(null);
  const { getAuthHeader } = useAuth();
  
  // États
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Développement Web',
    tags: '',
    author: 'Équipe WebKlor',
    featuredImage: '',
    status: 'brouillon',
    readTime: 5
  });
  
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Configuration de l'éditeur Quill
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];
  
  // Fonction pour charger les données de l'article (useCallback pour éviter les re-renders)
  const fetchPost = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Tentative de chargement de l\'article avec ID:', id);
      
      const response = await apiGet(`/api/admin/blog/posts/${id}`, { 
        headers: getAuthHeader() 
      });
      
      console.log('Réponse API:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors du chargement de l\'article');
      }
      
      const post = response.data;
      
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        category: post.category || 'Développement Web',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        author: post.author || 'Équipe WebKlor',
        featuredImage: post.featuredImage || '',
        status: post.status || 'brouillon',
        readTime: post.readTime || 5
      });
      
      setPreviewImage(post.featuredImage || '');
      
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      
      if (error.message && error.message.toLowerCase().includes('401')) {
        setError('Session expirée. Redirection vers la page de connexion...');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.message && error.message.toLowerCase().includes('404')) {
        setError('Article non trouvé.');
      } else {
        setError('Impossible de charger l\'article. ' + (error.message || 'Erreur inconnue'));
      }
    } finally {
      setLoading(false);
    }
  }, [id, getAuthHeader, navigate]);
  
  // Charger les données de l'article si en mode édition
  useEffect(() => {
    if (!isNewPost) {
      fetchPost();
    }
  }, [isNewPost, fetchPost]);
  
  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gérer les changements dans l'éditeur de texte
  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };
  
  // Gérer le changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          featuredImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation stricte des champs requis
    const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '').replace(/\s/g, '');
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.category.trim()) {
      setError('Veuillez remplir tous les champs obligatoires (titre, extrait, catégorie).');
      setLoading(false);
      return;
    }
    if (!formData.content || stripHtml(formData.content) === '') {
      setError('Le contenu de l\'article ne peut pas être vide.');
      setLoading(false);
      return;
    }
    
    try {
      // Préparer les données
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      console.log('Données à envoyer:', postData);
      
      // Déterminer l'URL et la méthode
      const url = isNewPost 
        ? `/api/admin/blog/posts` 
        : `/api/admin/blog/posts/${id}`;
        
      // Envoyer la requête
      let response;
      if (isNewPost) {
        response = await apiPost(url, postData, { headers: getAuthHeader() });
      } else {
        response = await apiPut(url, postData, { headers: getAuthHeader() });
      }
      
      console.log('Réponse sauvegarde:', response);
      
      setSuccess(`Article ${isNewPost ? 'créé' : 'mis à jour'} avec succès !`);
      
      // Rediriger vers la liste des articles après un délai
      setTimeout(() => {
        navigate('/admin/blog');
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      if (error.message && error.message.toLowerCase().includes('401')) {
        setError('Session expirée. Redirection vers la page de connexion...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Erreur lors de l\'enregistrement : ' + (error.message || 'Erreur inconnue'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Catégories disponibles
  const categories = [
    'Développement Web',
    'SEO',
    'Marketing Digital',
    'Design',
    'Technologie',
    'Astuces',
    'Actualités'
  ];
  
  // Afficher un indicateur de chargement pendant la récupération des données
  if (loading && !isNewPost && !formData.title) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3 text-muted">Chargement de l'article...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-transparent pt-4 pb-3">
              <h1 className="card-title h3 mb-0">
                {isNewPost ? 'Créer un nouvel article' : 'Modifier l\'article'}
              </h1>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form ref={formRef} onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    {/* Titre */}
                    <Form.Group className="mb-3">
                      <Form.Label>Titre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength="200"
                      />
                    </Form.Group>
                    
                    {/* Extrait */}
                    <Form.Group className="mb-3">
                      <Form.Label>Extrait (résumé) *</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        required
                        rows={3}
                        maxLength="500"
                      />
                      <Form.Text className="text-muted">
                        Maximum 500 caractères. Cet extrait sera affiché dans les listes d'articles.
                      </Form.Text>
                    </Form.Group>
                    
                    {/* Contenu */}
                    <Form.Group className="mb-3">
                      <Form.Label>Contenu *</Form.Label>
                      <div className="border rounded">
                        <ReactQuill
                          theme="snow"
                          value={formData.content}
                          onChange={handleContentChange}
                          modules={modules}
                          formats={formats}
                          style={{ height: '300px', marginBottom: '50px' }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    {/* Image à la une */}
                    <Form.Group className="mb-3">
                      <Form.Label>Image à la une</Form.Label>
                      <div className="mb-2">
                        {previewImage ? (
                          <LazyImage
                            src={previewImage}
                            alt="Aperçu"
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                            width="300"
                            height="200"
                            sizes="300px"
                          />
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                            <span className="text-muted">Aucune image</span>
                          </div>
                        )}
                      </div>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Form.Group>
                    
                    {/* Catégorie */}
                    <Form.Group className="mb-3">
                      <Form.Label>Catégorie *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    
                    {/* Tags */}
                    <Form.Group className="mb-3">
                      <Form.Label>Tags</Form.Label>
                      <Form.Control
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Séparer les tags par des virgules"
                      />
                      <Form.Text className="text-muted">
                        Ex: web design, tendances, responsive
                      </Form.Text>
                    </Form.Group>
                    
                    {/* Auteur */}
                    <Form.Group className="mb-3">
                      <Form.Label>Auteur</Form.Label>
                      <Form.Control
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    
                    {/* Temps de lecture */}
                    <Form.Group className="mb-3">
                      <Form.Label>Temps de lecture (minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        name="readTime"
                        value={formData.readTime}
                        onChange={handleChange}
                        min="1"
                      />
                    </Form.Group>
                    
                    {/* Statut */}
                    <Form.Group className="mb-3">
                      <Form.Label>Statut</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="brouillon">Brouillon</option>
                        <option value="publié">Publié</option>
                        <option value="archivé">Archivé</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="outline-secondary" 
                    className="me-2"
                    onClick={() => navigate('/admin/blog')}
                  >
                    Annuler
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Enregistrement...' : isNewPost ? 'Créer l\'article' : 'Mettre à jour'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogEditor;