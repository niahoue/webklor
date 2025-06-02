import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Badge, Spinner, Pagination } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import LazyImage from '../components/LazyImage';
import { containerVariants, itemVariants } from '../utils/animations';

/**
 * Page Blog
 * Présente les articles et actualités de WebKlor
 */
const Blog = () => {
  // États
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Configuration SEO de la page
  const seoData = {
    title: "Blog WebKlor | Actualités Web, SEO & Marketing Digital",
    description: "Articles d'experts sur le développement web, référencement SEO, marketing digital et dernières tendances technologiques. Guides pratiques, conseils professionnels, astuces techniques et analyses approfondies pour optimiser votre présence digitale. Contenu mis à jour régulièrement par l'équipe WebKlor.",
    keywords: "blog développement web, actualités SEO, conseils marketing digital, guides techniques web, tendances technologiques, astuces webmaster, tutoriels développement, stratégies digitales",
    canonicalUrl: "https://www.webklor.com/blog",
    schemaType: "blog"
  };
  
  // Configuration des animations au défilement
  const [articlesRef, articlesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Charger les articles
  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Construire l'URL avec les paramètres
      let url = `/api/blog/posts?page=${currentPage}&limit=6`;
      
      // Ajouter le filtre par catégorie si spécifié (sauf pour "Tous")
      if (selectedCategory !== 'Tous') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des articles');
      }
      
      setPosts(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les articles. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Gérer le changement de catégorie
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Revenir à la première page lors du changement de filtre
  };

  // Catégories de blog
  const categories = ["Tous", "Développement Web", "SEO", "Marketing Digital", "Design", "Technologie", "Astuces", "Actualités"];

  return (
    <main>
      <SEO {...seoData} />
      
      <PageHeader 
        title="Blog & Actualités"
        subtitle="Conseils, tendances et actualités du monde digital"
      />

      {/* Section Articles de Blog */}
      <section className="blog-posts py-5">
        <Container>
          <motion.div
            ref={articlesRef}
            initial="hidden"
            animate={articlesInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            {/* Filtres par catégorie */}
            <motion.div variants={itemVariants} className="text-center mb-5">
              <div className="blog-categories">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`btn ${category === selectedCategory ? 'btn-primary' : 'btn-outline-primary'} me-2 mb-2`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Chargement */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Chargement des articles...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                <p>{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-journal-x display-1 text-muted"></i>
                <h3 className="mt-3">Aucun article trouvé</h3>
                <p>Aucun article n'est disponible dans cette catégorie pour le moment.</p>
              </div>
            ) : (
              <>
                {/* Articles */}
                <Row>
                  {posts.map((post) => (
                    <Col lg={4} md={6} key={post._id} className="mb-4">
                      <motion.div variants={itemVariants}>
                        <Card className="blog-card h-100 border-0 shadow-sm">
                          <div className="blog-image-container" style={{ height: "200px", overflow: "hidden" }}>
                            <LazyImage 
                              src={post.featuredImage} 
                              alt={post.title}
                              className="img-fluid"
                              style={{ objectFit: "cover", height: "100%", width: "100%" }}
                              width="350"
                              height="200"
                              sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw"
                            />
                          </div>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <Badge bg="primary">{post.category}</Badge>
                              <small className="text-muted">{formatDate(post.createdAt)}</small>
                            </div>
                            <Card.Title as="h3" className="h5 mb-3">{post.title}</Card.Title>
                            <Card.Text>{post.excerpt}</Card.Text>
                          </Card.Body>
                          <Card.Footer className="bg-white border-0 pt-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">Par {post.author}</small>
                              <Link to={`/blog/${post.slug}`} className="btn btn-sm btn-outline-primary">Lire plus</Link>
                            </div>
                          </Card.Footer>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div variants={itemVariants} className="d-flex justify-content-center mt-5">
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
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </Container>
      </section>

      {/* Section Newsletter */}
      <section className="newsletter bg-light py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="fw-bold mb-4">Restez informé</h2>
              <p className="lead mb-4">Abonnez-vous à notre newsletter pour recevoir nos derniers articles et actualités directement dans votre boîte mail.</p>
              <div className="input-group mb-3 newsletter-form">
                <input type="email" className="form-control form-control-lg" placeholder="Votre adresse email" aria-label="Adresse email" />
                <button className="btn btn-primary" type="button">S'abonner</button>
              </div>
              <small className="text-muted">Nous respectons votre vie privée. Désabonnez-vous à tout moment.</small>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Blog;
