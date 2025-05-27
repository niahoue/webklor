import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import PropTypes from 'prop-types';
import { containerVariants, itemVariants } from '../utils/animations';

/**
 * Composant d'en-tête de page réutilisable avec animations
 * Évite la duplication de structure d'en-tête dans les pages
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  backgroundClass = 'bg-primary text-light',
  centered = true 
}) => {
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className={`page-header ${backgroundClass} py-5`}>
      <Container>
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={containerVariants}
          className={`py-5 ${centered ? 'text-center' : ''}`}
        >
          <motion.h1 variants={itemVariants} className="display-4 fw-bold">
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p variants={itemVariants} className="lead">
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </Container>
    </section>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  backgroundClass: PropTypes.string,
  centered: PropTypes.bool
};

export default PageHeader;
