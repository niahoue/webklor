import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { containerVariants, itemVariants } from '../utils/animations';

/**
 * Page Portfolio
 * Présente les projets réalisés par WebKlor
 */
const Portfolio = () => {
  const navigate = useNavigate();
  
  // États pour gérer la modale de projet et le filtrage
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Tous");
  
  // Fonction pour ouvrir la modale avec le projet sélectionné
  const handleShowProjectModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };
  
  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  // Fonction pour filtrer les projets par catégorie
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };
  
  // Configuration SEO de la page
  const seoData = {
    title: "Notre Portfolio",
    description: "Découvrez nos réalisations et projets en création de sites web, applications, e-commerce et identité visuelle pour des clients de tous secteurs.",
    keywords: "portfolio, projets, réalisations, sites web, applications, e-commerce, identité visuelle, WebKlor",
    canonicalUrl: "https://www.webklor.com/portfolio"
  };
  // Configuration des animations au défilement
  const [projectsRef, projectsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Projets du portfolio
  const projects = [
    {
      id: 1,
      title: "E-commerce Luxe",
      category: "Site E-commerce",
      image: "/assets/images/ecommerce.png",
      description: "Boutique en ligne pour une marque de produits de luxe avec une expérience utilisateur fluide et élégante.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"]
    },
    {
      id: 2,
      title: "Application Immobilière",
      category: "Application Web",
      image: "/assets/images/Immobilière.png",
      description: "Plateforme de gestion immobilière permettant la recherche, la réservation et le suivi des biens.",
      technologies: ["Vue.js", "Firebase", "Google Maps API"]
    },
    {
      id: 3,
      title: "Blog Culinaire",
      category: "Site Vitrine & Blog",
      image: "/assets/images/Blog.png",
      description: "Site vitrine et blog pour un chef cuisinier, avec galerie de recettes et système de réservation.",
      technologies: ["WordPress", "WooCommerce", "SEO Avancé"]
    },
    {
      id: 4,
      title: "Plateforme Éducative",
      category: "Application Web",
      image: "/assets/images/plateforme.png",
      description: "Plateforme d'apprentissage en ligne avec cours interactifs, quiz et suivi de progression.",
      technologies: ["React", "Express", "MySQL", "AWS"]
    },
    {
      id: 5,
      title: "Site Corporate Finance",
      category: "Site Vitrine",
      image: "/assets/images/Corporate.png",
      description: "Site institutionnel pour une société de conseil financier avec interface de prise de rendez-vous.",
      technologies: ["HTML5", "CSS3", "JavaScript", "PHP"]
    },
    {
      id: 6,
      title: "Application Santé",
      category: "Application Mobile",
      image: "/assets/images/Sante.png",
      description: "Application mobile de suivi de santé et bien-être avec tableaux de bord personnalisés.",
      technologies: ["React Native", "Node.js", "MongoDB"]
    }
  ];
  
  // Projets filtrés selon la catégorie sélectionnée
  const filteredProjects = activeCategory === "Tous" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  // Filtres de catégories
  const categories = ["Tous", "Site E-commerce", "Site Vitrine", "Site Vitrine & Blog", "Application Web", "Application Mobile"];

  return (
    <main>
      <SEO {...seoData} />
      
      <PageHeader 
        title="Notre Portfolio"
        subtitle="Découvrez nos réalisations et projets récents"
      />

      {/* Section Filtres et Projets */}
      <section className="portfolio-projects py-5">
        <Container>
          <motion.div
            ref={projectsRef}
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="py-5"
          >
            {/* Filtres de catégories */}
            <motion.div variants={itemVariants} className="text-center mb-5">
              <div className="btn-group">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`btn ${category === activeCategory ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Grille de projets */}
            <Row>
              {filteredProjects.map((project) => (
                <Col lg={4} md={6} key={project.id} className="mb-4">
                  <motion.div variants={itemVariants}>
                    <Card className="portfolio-item border-0 shadow-sm h-100">
                      <div className="portfolio-image-container" style={{ height: "200px", overflow: "hidden" }}>
                        <Card.Img 
                          variant="top" 
                          src={project.image} 
                          alt={project.title}
                          className="img-fluid"
                          style={{ objectFit: "cover", height: "100%", width: "100%" }}
                        />
                      </div>
                      <Card.Body>
                        <span className="badge bg-primary mb-2">{project.category}</span>
                        <Card.Title as="h3" className="h5">{project.title}</Card.Title>
                        <Card.Text>{project.description}</Card.Text>
                        <div className="mt-3">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="badge bg-light text-dark me-2 mb-2">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </Card.Body>
                      <Card.Footer className="bg-white border-0">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleShowProjectModal(project)}
                        >
                          Voir le projet
                        </button>
                      </Card.Footer>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Section CTA */}
      <section className="cta bg-secondary text-light text-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="fw-bold mb-4">Vous avez un projet en tête ?</h2>
              <p className="lead mb-4">Contactez-nous pour discuter de votre projet et découvrir comment nous pouvons vous aider à le concrétiser.</p>
              <button 
                className="btn btn-light btn-lg rounded-pill"
                onClick={() => navigate('/contact')}
              >
                Demander un devis gratuit
              </button>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Modal pour afficher les détails du projet */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg" 
        centered
        aria-labelledby="project-details-modal"
      >
        {selectedProject && (
          <>
            <Modal.Header closeButton>
              <Modal.Title id="project-details-modal">
                {selectedProject.title || 'Détails du projet'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center mb-4">
                {selectedProject.image && (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title || 'Image du projet'}
                    className="img-fluid rounded"
                    style={{ maxHeight: "300px" }}
                  />
                )}
              </div>
              <h4 className="mb-3">Description</h4>
              <p>{selectedProject.description || 'Aucune description disponible.'}</p>
              
              <h4 className="mb-3 mt-4">Catégorie</h4>
              <p><span className="badge bg-primary">{selectedProject.category || 'Non catégorisé'}</span></p>
              
              <h4 className="mb-3 mt-4">Technologies utilisées</h4>
              <div>
                {selectedProject.technologies && selectedProject.technologies.map((tech, index) => (
                  <span key={index} className="badge bg-light text-dark me-2 mb-2">
                    {tech}
                  </span>
                ))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Fermer
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  handleCloseModal();
                  navigate('/contact');
                }}
              >
                Contactez-nous pour ce projet
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </main>
  );
};

export default Portfolio;
