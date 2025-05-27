import { motion } from 'framer-motion';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { containerVariants, itemVariants } from '../utils/animations';

/**
 * Composant CTA (Call to Action) réutilisable
 * Évite la duplication de sections CTA dans les pages
 */
const CTASection = ({ 
  title = "Prêt à transformer votre présence en ligne?",
  subtitle = "Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis personnalisé.",
  buttonText = "Demander un devis gratuit",
  buttonPath = "/contact",
  backgroundClass = "bg-primary text-light",
  buttonVariant = "light"
}) => {
  const navigate = useNavigate();

  return (
    <section className={`cta ${backgroundClass} text-center py-5`}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="fw-bold mb-4">
                {title}
              </motion.h2>
              <motion.p variants={itemVariants} className="lead mb-4">
                {subtitle}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button 
                  variant={buttonVariant}
                  size="lg" 
                  className="rounded-pill"
                  onClick={() => navigate(buttonPath)}
                >
                  {buttonText}
                </Button>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

CTASection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  buttonText: PropTypes.string,
  buttonPath: PropTypes.string,
  backgroundClass: PropTypes.string,
  buttonVariant: PropTypes.string
};

export default CTASection;
