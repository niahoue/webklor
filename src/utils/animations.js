/**
 * Utilitaires d'animation centralisés pour Framer Motion
 * Évite la duplication de code d'animation dans les composants
 */

// Variantes de conteneur communes
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Variantes d'éléments communes
export const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Variantes pour les transitions de page
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

// Variantes pour les liens de navigation
export const linkVariants = {
  hover: {
    scale: 1.05,
    color: '#007BFF',
    transition: { duration: 0.2 }
  }
};

// Animation de fade simple
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Animation de slide depuis la gauche
export const slideFromLeftVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Animation de slide depuis la droite
export const slideFromRightVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Animation pour les cartes
export const cardHoverVariants = {
  hover: {
    y: -5,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
};

// Animation pour les boutons
export const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95
  }
};
