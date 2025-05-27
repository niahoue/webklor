/* Composant AccessibilityCheck
 * Vérifie et améliore l'accessibilité des éléments du site
 */
import { useEffect } from 'react';

const AccessibilityCheck = () => {
  useEffect(() => {
    // Ajoute des attributs ARIA manquants aux éléments interactifs
    const addAriaAttributes = () => {
      // Ajouter role="button" aux éléments qui agissent comme des boutons
      document.querySelectorAll('.btn').forEach(btn => {
        if (!btn.getAttribute('role')) {
          btn.setAttribute('role', 'button');
        }
      });

      // Ajouter aria-label aux liens de réseaux sociaux
      document.querySelectorAll('.social-links a').forEach(link => {
        if (!link.getAttribute('aria-label')) {
          const icon = link.querySelector('i');
          if (icon && icon.className) {
            const socialNetwork = icon.className.includes('facebook') ? 'Facebook' :
                                 icon.className.includes('twitter') ? 'Twitter' :
                                 icon.className.includes('instagram') ? 'Instagram' :
                                 icon.className.includes('linkedin') ? 'LinkedIn' : 'Réseau social';
            link.setAttribute('aria-label', socialNetwork);
          }
        }
      });

      // Ajouter aria-required="true" aux champs de formulaire obligatoires
      document.querySelectorAll('input, textarea, select').forEach(field => {
        if (field.required && !field.getAttribute('aria-required')) {
          field.setAttribute('aria-required', 'true');
        }
      });
    };

    // Améliore la navigation au clavier
    const enhanceKeyboardNavigation = () => {
      // Ajouter tabindex="0" aux éléments interactifs qui n'en ont pas
      document.querySelectorAll('.card, .portfolio-item').forEach(item => {
        if (!item.getAttribute('tabindex')) {
          item.setAttribute('tabindex', '0');
        }
      });
    };

    // Exécuter les vérifications après le chargement de la page
    addAriaAttributes();
    enhanceKeyboardNavigation();

    // Réexécuter les vérifications lors des changements de route
    return () => {
      // Nettoyage si nécessaire
    };
  }, []);

  return null; // Ce composant ne rend rien visuellement
};

export default AccessibilityCheck;
