import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Comments from '../components/Comments';
import LazyImage from '../components/LazyImage';
import { apiGet, apiPost, apiPut } from '../services/api';

/**
 * Composant d'affichage d'un article de blog
 * @returns {JSX.Element}
 */
const BlogPost = () => {
  const { slug } = useParams();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  // Charger l'article
  useEffect(() => {    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await apiGet(`/api/blog/posts/${slug}`);
       
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la récupération de l\'article');
        }
        
        setPost(data.data);
        
        // Récupérer les articles liés
        fetchRelatedPosts(data.data.category);
        
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger l\'article. ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
    // Récupérer les articles liés par catégorie
  const fetchRelatedPosts = async (category) => {
    try {
      const response = await apiGet(`/api/blog/posts?category=${category}&limit=3`);
      const data = await response.json();
      
      if (response.ok) {
        // Filtrer l'article actuel des résultats liés
        const filtered = data.data.filter(p => p.slug !== slug);
        setRelatedPosts(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des articles liés:', error);
    }
  };
  
  // Configuration SEO de la page
  const seoData = post ? {
    title: post.title + " | Blog WebKlor",
    description: post.excerpt,
    keywords: post.tags.join(', ') + ", blog, WebKlor",
    canonicalUrl: `https://www.webklor.com/blog/${slug}`
  } : {
    title: "Article de Blog | WebKlor",
    noindex: loading // Ne pas indexer la page pendant le chargement
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de l'article...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Link to="/blog" className="btn btn-outline-danger">
              Retour au blog
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }
  
  if (!post) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Article non trouvé</Alert.Heading>
          <p>L'article que vous recherchez n'existe pas ou a été supprimé.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Link to="/blog" className="btn btn-outline-warning">
              Retour au blog
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }
  
  return (
    <main>
      <SEO {...seoData} />
      
      {/* En-tête de l'article */}
      <section className="post-header py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Badge bg="primary" className="mb-3">{post.category}</Badge>
              <h1 className="display-5 fw-bold mb-3">{post.title}</h1>
              <div className="d-flex align-items-center text-muted mb-4">
                <span className="me-3">
                  <i className="bi bi-person me-2"></i>
                  {post.author}
                </span>
                <span className="me-3">
                  <i className="bi bi-calendar3 me-2"></i>
                  {formatDate(post.createdAt)}
                </span>
                <span className="me-3">
                  <i className="bi bi-clock me-2"></i>
                  {post.readTime} min de lecture
                </span>
                <span>
                  <i className="bi bi-eye me-2"></i>
                  {post.views} vues
                </span>
              </div>
              <p className="lead">{post.excerpt}</p>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Image principale */}
      {post.featuredImage && (
        <section className="post-featured-image py-4">
          <Container>
            <Row className="justify-content-center">              <Col lg={10}>
                <div className="featured-image-container" style={{ maxHeight: '500px', overflow: 'hidden' }}>
                  <LazyImage 
                    src={post.featuredImage} 
                    alt={post.title} 
                    className="img-fluid w-100 rounded shadow-sm"
                    style={{ objectFit: 'cover' }}
                    width="800"
                    height="500"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority={true}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
      
      {/* Contenu de l'article */}
      <section className="post-content py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>              <div className="blog-content">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
              
              {/* Section des commentaires */}
              <Comments postId={post._id} />
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags mt-5 pt-3 border-top">
                  <h5>Tags:</h5>
                  <div>
                    {post.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        bg="light" 
                        text="dark" 
                        className="me-2 mb-2 py-2 px-3"
                        style={{ fontSize: '0.9rem' }}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Partage social */}
              <div className="post-share mt-4 pt-3 border-top">
                <h5>Partager cet article:</h5>
                <div className="social-share d-flex gap-2">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="btn btn-sm btn-outline-primary">
                    <i className="bi bi-facebook me-1"></i> Facebook
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="btn btn-sm btn-outline-info">
                    <i className="bi bi-twitter me-1"></i> Twitter
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.excerpt)}`}
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-linkedin me-1"></i> LinkedIn
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Articles liés */}
      {relatedPosts.length > 0 && (
        <section className="related-posts py-5 bg-light">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <h3 className="mb-4">Articles liés</h3>
                <Row>
                  {relatedPosts.map((relatedPost) => (
                    <Col md={4} key={relatedPost._id} className="mb-4">                      <Card className="h-100 border-0 shadow-sm">
                        <div style={{ height: '160px', overflow: 'hidden' }}>
                          <LazyImage 
                            src={relatedPost.featuredImage} 
                            alt={relatedPost.title}
                            className="img-fluid"
                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                            width="300"
                            height="160"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                        </div>
                        <Card.Body>
                          <Badge bg="primary" className="mb-2">{relatedPost.category}</Badge>
                          <Card.Title as="h5">{relatedPost.title}</Card.Title>
                          <Card.Text className="text-truncate">{relatedPost.excerpt}</Card.Text>
                          <Link to={`/blog/${relatedPost.slug}`} className="btn btn-sm btn-outline-primary mt-2">
                            Lire plus
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
            
            <div className="text-center mt-4">
              <Link to="/blog" className="btn btn-primary">
                Voir tous les articles
              </Link>
            </div>
          </Container>
        </section>
      )}
    </main>
  );
};

export default BlogPost;
