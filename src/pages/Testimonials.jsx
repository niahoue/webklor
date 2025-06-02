import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Carousel, Dropdown, Pagination } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import LazyImage from '../components/LazyImage';
import { containerVariants, itemVariants } from '../utils/animations';
import { TESTIMONIALS, COMPANY_STATS, TESTIMONIAL_STATS } from '../utils/constants';
import '../styles/testimonials.css';

/**
 * Page Témoignages
 * Présente les avis et retours d'expérience des clients de WebKlor
 */
const Testimonials = () => {
  const navigate = useNavigate();
  
  // États pour les filtres et interactions
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitRating, setSubmitRating] = useState(0);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'rating', 'alphabetical'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Nombre de témoignages par page (2x2)
  const [isLoading, setIsLoading] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    name: '',
    company: '',
    email: '',
    testimonial: '',
    rating: 0,
    acceptTerms: false
  });
  
  // Données des catégories pour filtrage
  const categories = ['Tous', 'E-commerce', 'Immobilier', 'Restaurant', 'Juridique', 'Éducation', 'Santé', 'Technologie', 'Logistique'];
  
  // Fonction pour filtrer et trier les témoignages
  const getFilteredAndSortedTestimonials = () => {
    let filtered = selectedCategory === 'Tous' 
      ? TESTIMONIALS 
      : TESTIMONIALS.filter(testimonial => {
          const categoryMap = {
            'E-commerce': 'E-commerce',
            'Immobilier': 'Immobilier', 
            'Restaurant': 'Restauration',
            'Juridique': 'Juridique',
            'Éducation': 'Éducation',
            'Santé': 'Santé',
            'Technologie': 'Technologie',
            'Logistique': 'Logistique'
          };
          return testimonial.sector === categoryMap[selectedCategory];
        });
        
    // Tri des résultats
    switch (sortBy) {
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'alphabetical':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
      default:
        return filtered.sort((a, b) => b.id - a.id);
    }
  };
  
  const allFilteredTestimonials = getFilteredAndSortedTestimonials();
  
  // Calcul de la pagination
  const totalPages = Math.ceil(allFilteredTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredTestimonials = allFilteredTestimonials.slice(startIndex, endIndex);
  
  // Reset de la page courante quand le filtre change
  const handleCategoryChange = (category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setCurrentPage(1);
    setTimeout(() => setIsLoading(false), 300);
  };
  
  const handleSortChange = (sort) => {
    setIsLoading(true);
    setSortBy(sort);
    setCurrentPage(1);
    setTimeout(() => setIsLoading(false), 300);
  };
  
  const handlePageChange = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    setTimeout(() => setIsLoading(false), 200);
  };
  
  // Configuration SEO de la page
  const seoData = {
    title: "Témoignages Clients - WebKlor | Avis Authentiques & Retours d'Expérience",
    description: "Découvrez les témoignages authentiques de nos clients satisfaits et leurs retours d'expérience détaillés sur nos services de création web, SEO et marketing digital. Plus de 150 entreprises nous font confiance depuis 2020. Avis vérifiés, projets réussis et relations durables.",
    keywords: "témoignages clients webklor, avis authentiques agence web, retours expérience développement web, satisfaction client, références vérifiées, projets réussis, collaboration agence digitale",
    canonicalUrl: "https://www.webklor.com/temoignages",
    schemaType: "testimonials"
  };
  // Configuration des animations au défilement
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuredRef, featuredInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Témoignages vedettes pour le carousel
  const featuredTestimonials = TESTIMONIALS.filter(t => t.rating === 5).slice(0, 3);
  
  // Fonction pour ouvrir le modal de détails
  const handleShowDetails = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowModal(true);
  };
  
  // Fonction pour gérer la soumission du formulaire
  const handleSubmitTestimonial = (e) => {
    e.preventDefault();
    // Ici on pourrait intégrer avec une API
    alert('Merci pour votre témoignage ! Il sera examiné et publié sous peu.');
    setShowSubmitModal(false);
    setSubmitForm({
      name: '',
      company: '',
      email: '',
      testimonial: '',
      rating: 0,
      acceptTerms: false
    });
    setSubmitRating(0);
  };
  
  // Fonction pour gérer les changements du formulaire
  const handleFormChange = (field, value) => {
    setSubmitForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Fonction pour gérer la notation
  const handleRatingClick = (rating) => {
    setSubmitRating(rating);
    handleFormChange('rating', rating);
  };
  
  // Animations personnalisées
  const cardHoverVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: { duration: 0.2 }
    }
  };
  
  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main>
      <SEO {...seoData} />
      
      <PageHeader 
        title="Témoignages Clients"
        subtitle="Découvrez ce que nos clients disent de notre collaboration"
      />

      {/* Section Carousel Témoignages Vedettes */}
      <section className="featured-testimonials py-5 bg-light">
        <Container>
          <motion.div
            ref={featuredRef}
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-4"
          >
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="fw-bold mb-3">Témoignages Vedettes</h2>
              <p className="lead text-muted">Nos clients les plus satisfaits partagent leur expérience</p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Carousel indicators={true} controls={true} interval={5000} className="testimonial-carousel">
                {featuredTestimonials.map((testimonial) => (
                  <Carousel.Item key={testimonial.id}>
                    <div className="text-center py-5">
                      <div className="mx-auto mb-4" style={{ width: "100px", height: "100px" }}>
                        <LazyImage 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="rounded-circle w-100 h-100"
                          style={{ objectFit: "cover" }}
                          sizes="100px"
                        />
                      </div>
                      <blockquote className="blockquote">
                        <p className="fs-4 fst-italic mb-4">"{testimonial.text}"</p>
                      </blockquote>
                      <footer className="blockquote-footer">
                        <strong>{testimonial.name}</strong>
                        <cite title="Company"> - {testimonial.company}</cite>
                      </footer>
                      <div className="mt-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-warning fs-5 me-1">
                            {i < testimonial.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Section Filtres et Témoignages */}
      <section className="testimonials-section py-5">
        <Container>
          <motion.div
            ref={testimonialsRef}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-4"
          >
            {/* Filtres par catégorie */}
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="fw-bold mb-4">Tous nos Témoignages</h2>
              <p className="lead text-muted mb-4">Filtrez par secteur d'activité pour découvrir des projets similaires au vôtre</p>
              
              <div className="d-flex flex-wrap justify-content-center testimonials-filters mb-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => handleCategoryChange(category)}
                    className="rounded-pill"
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              <div className="d-flex justify-content-center align-items-center mb-4">
                <Badge bg="info" className="me-3">
                  {allFilteredTestimonials.length} témoignage{allFilteredTestimonials.length > 1 ? 's' : ''} trouvé{allFilteredTestimonials.length > 1 ? 's' : ''}
                </Badge>
                
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <i className="bi bi-sort-down me-2"></i>
                    Trier par
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item 
                      active={sortBy === 'recent'}
                      onClick={() => handleSortChange('recent')}
                    >
                      <i className="bi bi-clock me-2"></i>
                      Plus récents
                    </Dropdown.Item>
                    <Dropdown.Item 
                      active={sortBy === 'rating'}
                      onClick={() => handleSortChange('rating')}
                    >
                      <i className="bi bi-star me-2"></i>
                      Meilleure note
                    </Dropdown.Item>
                    <Dropdown.Item 
                      active={sortBy === 'alphabetical'}
                      onClick={() => handleSortChange('alphabetical')}
                    >
                      <i className="bi bi-sort-alpha-down me-2"></i>
                      Alphabétique
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </motion.div>

            {/* Grille des témoignages */}
            <motion.div variants={staggerVariants}>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <p className="mt-3 text-muted">Chargement des témoignages...</p>
                </div>
              ) : (
                <Row>
                  {filteredTestimonials.map((testimonial) => {
                    return (
                  <Col lg={6} md={6} key={testimonial.id} className="mb-4">
                    <motion.div 
                      variants={cardHoverVariants}
                      initial="initial"
                      whileHover="hover"
                      className="d-flex"
                    >
                      <Card className="testimonial-card w-100 border-0 shadow-sm position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 w-100 h-2 bg-primary"></div>
                        <Card.Body className="p-4">
                          <div className="d-flex mb-4 align-items-center">
                            <div className="testimonial-image me-3 position-relative">
                              <LazyImage 
                                src={testimonial.image} 
                                alt={testimonial.name}
                                className="rounded-circle"
                                width="60"
                                height="60"
                                style={{ objectFit: "cover" }}
                                sizes="60px"
                              />
                              <div className="position-absolute bottom-0 end-0 bg-success rounded-circle" 
                                   style={{ width: "20px", height: "20px" }}
                                   title="Client vérifié">
                                <i className="bi bi-check-lg text-white d-flex align-items-center justify-content-center h-100"></i>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <h3 className="h5 mb-0">{testimonial.name}</h3>
                                <Badge bg="secondary" className="ms-2">{testimonial.sector}</Badge>
                              </div>
                              <p className="text-muted mb-2">{testimonial.company}</p>
                              <div className="d-flex align-items-center">
                                <div className="me-2">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-warning">
                                      {i < testimonial.rating ? "★" : "☆"}
                                    </span>
                                  ))}
                                </div>
                                <small className="text-muted">({testimonial.rating}/5)</small>
                              </div>
                            </div>
                          </div>
                          
                          {/* Texte du témoignage */}
                          <div className="testimonial-content">
                            <div className="testimonial-text">
                              {testimonial.text}
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleShowDetails(testimonial)}
                            >
                              <i className="bi bi-eye me-1"></i>
                              Voir plus
                            </Button>
                            <div className="text-end">
                              <small className="text-muted d-block">
                                <i className="bi bi-briefcase me-1"></i>
                                {testimonial.projectType}
                              </small>
                              <small className="text-muted">
                                <i className="bi bi-calendar3 me-1"></i>
                                {testimonial.year}
                              </small>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                    ); // Fermer le return
                })} {/* Fermer la fonction map */}
                </Row>
              )}
            </motion.div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div variants={itemVariants} className="d-flex justify-content-center mt-5">
                <Pagination>
                  <Pagination.First 
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Afficher seulement 5 pages autour de la page courante
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      );
                    } else if (
                      page === currentPage - 3 || 
                      page === currentPage + 3
                    ) {
                      return <Pagination.Ellipsis key={page} />;
                    }
                    return null;
                  })}
                  
                  <Pagination.Next 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last 
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </motion.div>
            )}
            
            {allFilteredTestimonials.length === 0 && (
              <motion.div variants={itemVariants} className="text-center py-5">
                <i className="bi bi-search display-4 text-muted mb-3"></i>
                <h3 className="h5 text-muted">Aucun témoignage trouvé</h3>
                <p className="text-muted">Essayez un autre filtre ou consultez tous les témoignages</p>
                <Button 
                  variant="primary" 
                  onClick={() => handleCategoryChange('Tous')}
                  className="rounded-pill"
                >
                  Voir tous les témoignages
                </Button>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* Section Statistiques de Satisfaction */}
      <section className="stats-section bg-primary text-white py-5">
        <Container>
          <motion.div
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-4"
          >
            <motion.div variants={itemVariants} className="text-center mb-5">
              <h2 className="fw-bold mb-3">Ce que disent nos chiffres</h2>
              <p className="lead opacity-75">La satisfaction de nos clients se mesure aussi en chiffres</p>
            </motion.div>
            
            <Row className="text-center mb-5">
              {TESTIMONIAL_STATS.map((stat, index) => (
                <Col lg={3} md={6} key={index} className="mb-4 mb-lg-0">
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="stat-item"
                  >
                    <div className={`bg-${stat.color} rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} 
                         style={{ width: "80px", height: "80px" }}>
                      <i className={`bi ${stat.icon} fs-2 text-white`}></i>
                    </div>
                    <h3 className="display-6 fw-bold mb-2">{stat.number}</h3>
                    <p className="opacity-75 mb-0">{stat.label}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
            
            {/* Statistiques secondaires */}
            <Row className="text-center">
              {COMPANY_STATS.slice(0, 2).map((stat, index) => (
                <Col md={6} key={index} className="mb-3 mb-md-0">
                  <motion.div 
                    variants={itemVariants}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <h4 className="display-6 fw-bold me-3 mb-0">{stat.number}</h4>
                    <p className="opacity-75 mb-0">{stat.label}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section Témoignage Vidéo */}
      <section className="video-testimonial py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Ils parlent de nous</h2>
                  <p className="lead mb-5 text-muted">Découvrez les témoignages vidéo de nos clients les plus satisfaits</p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="position-relative"
                >
                  <div className="ratio ratio-16x9 shadow-lg rounded-4 overflow-hidden">
                    <div className="bg-gradient-primary d-flex align-items-center justify-content-center position-relative">
                      <div className="position-absolute w-100 h-100 bg-dark opacity-50"></div>
                      <div className="text-center text-white p-4 position-relative z-1">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="d-inline-block"
                        >
                          <div className="bg-white bg-opacity-20 rounded-circle p-4 mb-3 d-inline-flex">
                            <i className="bi bi-play-fill display-1"></i>
                          </div>
                        </motion.div>
                        <h3 className="h4 mb-2">Témoignages Vidéo</h3>
                        <p className="mb-3">Découvrez l'expérience de nos clients</p>
                        <Button variant="light" className="rounded-pill">
                          <i className="bi bi-play-fill me-2"></i>
                          Voir les témoignages
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Section Partagez votre expérience */}
      <section className="share-experience bg-light py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Vous êtes un client satisfait ?</h2>
                  <p className="lead mb-4 text-muted">
                    Partagez votre expérience et aidez d'autres entreprises à découvrir nos services
                  </p>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="rounded-pill me-3"
                    onClick={() => setShowSubmitModal(true)}
                  >
                    <i className="bi bi-star me-2"></i>
                    Laisser un témoignage
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="lg" 
                    className="rounded-pill"
                    onClick={() => navigate('/contact')}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Nous contacter
                  </Button>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Section CTA */}
      <section className="cta bg-accent text-dark text-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <h2 className="fw-bold mb-4">Rejoignez nos clients satisfaits</h2>
                  <p className="lead mb-4">
                    Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir 
                    comment nous pouvons vous aider à atteindre vos objectifs.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <Button 
                      variant="dark" 
                      size="lg" 
                      className="rounded-pill"
                      onClick={() => navigate('/contact')}
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Demander un devis gratuit
                    </Button>
                    <Button 
                      variant="outline-dark" 
                      size="lg" 
                      className="rounded-pill"
                      onClick={() => navigate('/portfolio')}
                    >
                      <i className="bi bi-briefcase me-2"></i>
                      Voir nos réalisations
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Modal Détails du Témoignage */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg" 
        centered
        className="testimonial-modal"
      >
        {selectedTestimonial && (
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="w-100 text-center">
                <div className="d-flex align-items-center justify-content-center">
                  <LazyImage 
                    src={selectedTestimonial.image} 
                    alt={selectedTestimonial.name}
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                    style={{ objectFit: "cover" }}
                    sizes="50px"
                  />
                  <div className="text-start">
                    <h5 className="mb-0">{selectedTestimonial.name}</h5>
                    <small className="text-muted">{selectedTestimonial.company}</small>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-warning fs-4 me-1">
                    {i < selectedTestimonial.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              
              <blockquote className="blockquote">
                <p className="fs-5 mb-4">"{selectedTestimonial.text}"</p>
              </blockquote>
              
              <div className="bg-light rounded-3 p-4 mb-4">
                <h6 className="fw-bold mb-3">Détails du projet</h6>
                <Row className="text-start">
                  <Col md={6}>
                    <p><strong>Secteur :</strong> {selectedTestimonial.sector}</p>
                    <p><strong>Type de projet :</strong> {selectedTestimonial.projectType}</p>
                    <p><strong>Services :</strong> {selectedTestimonial.services?.join(', ')}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Durée :</strong> {selectedTestimonial.duration}</p>
                    <p><strong>Année :</strong> {selectedTestimonial.year}</p>
                    <p><strong>Résultats :</strong> {selectedTestimonial.results}</p>
                  </Col>
                </Row>
              </div>
              
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" onClick={() => navigate('/contact')}>
                  <i className="bi bi-chat-dots me-2"></i>
                  Discuter de mon projet
                </Button>
                <Button variant="outline-primary" onClick={() => navigate('/portfolio')}>
                  <i className="bi bi-briefcase me-2"></i>
                  Voir le portfolio
                </Button>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
      
      {/* Modal Soumettre un Témoignage */}
      <Modal 
        show={showSubmitModal} 
        onHide={() => setShowSubmitModal(false)} 
        size="lg" 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-star me-2"></i>
            Partagez votre expérience
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitTestimonial}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom complet *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Votre nom" 
                    value={submitForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Entreprise *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nom de votre entreprise" 
                    value={submitForm.company}
                    onChange={(e) => handleFormChange('company', e.target.value)}
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="votre@email.com" 
                value={submitForm.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Note sur 5 *</Form.Label>
              <div className="d-flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button 
                    key={star} 
                    variant={star <= submitRating ? "warning" : "outline-warning"}
                    size="sm"
                    className="border-0"
                    type="button"
                    onClick={() => handleRatingClick(star)}
                  >
                    ★
                  </Button>
                ))}
                <small className="text-muted ms-2 align-self-center">
                  {submitRating > 0 ? `${submitRating}/5` : 'Sélectionnez une note'}
                </small>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Votre témoignage *</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Partagez votre expérience avec WebKlor..." 
                value={submitForm.testimonial}
                onChange={(e) => handleFormChange('testimonial', e.target.value)}
                required 
              />
              <Form.Text className="text-muted">
                {submitForm.testimonial.length}/500 caractères
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="J'accepte que mon témoignage soit publié sur le site WebKlor" 
                checked={submitForm.acceptTerms}
                onChange={(e) => handleFormChange('acceptTerms', e.target.checked)}
                required 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitTestimonial}
            disabled={!submitForm.name || !submitForm.company || !submitForm.email || !submitForm.testimonial || submitRating === 0 || !submitForm.acceptTerms}
          >
            <i className="bi bi-send me-2"></i>
            Envoyer le témoignage
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default Testimonials;
