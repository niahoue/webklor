import { motion } from 'framer-motion';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { cardHoverVariants, itemVariants } from '../utils/animations';

/**
 * Composant Card réutilisable avec animations
 * Évite la duplication de structure de cartes dans l'application
 */
const AnimatedCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  as = 'div',
  ...props 
}) => {
  const getCardVariant = () => {
    switch (variant) {
      case 'service':
        return 'h-100 shadow-sm border-0 bg-light rounded-lg';
      case 'stat':
        return 'text-center h-100 shadow-sm border-0';
      case 'portfolio':
        return 'portfolio-item border-0 shadow-sm h-100';
      case 'blog':
        return 'blog-card h-100 border-0 shadow-sm';
      case 'admin':
        return 'border-0 shadow-sm h-100 admin-card';
      default:
        return 'h-100 border-0 shadow-sm';
    }
  };

  const cardClass = `${getCardVariant()} ${className}`;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={hover ? cardHoverVariants.hover : {}}
      {...props}
    >
      <Card as={as} className={cardClass}>
        {children}
      </Card>
    </motion.div>
  );
};

AnimatedCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'service', 'stat', 'portfolio', 'blog', 'admin']),
  hover: PropTypes.bool,
  as: PropTypes.string
};

export default AnimatedCard;
