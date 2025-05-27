import { useLocation } from 'react-router-dom';
import Footer from './Footer';

/**
 * Composant qui affiche le pied de page de manière conditionnelle
 * en fonction de l'URL actuelle
 * 
 * @returns {JSX.Element|null} Le pied de page ou null si on est sur la page de login
 */
const ConditionalFooter = () => {
  const location = useLocation();
  const hideFooterPaths = ['/login'];
  const adminPathRegex = /^\/admin($|\/)/;
  
  // Ne pas afficher le footer sur les pages spécifiées ou les pages d'administration
  if (hideFooterPaths.includes(location.pathname) || adminPathRegex.test(location.pathname)) {
    return null;
  }
  
  // Afficher le footer sur toutes les autres pages
  return <Footer />;
};

export default ConditionalFooter;
