import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Composant qui affiche la barre de navigation de manière conditionnelle
 * en fonction de l'URL actuelle
 * 
 * @returns {JSX.Element|null} La barre de navigation ou null si on est sur la page de login
 */
const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login'];
  const adminPathRegex = /^\/admin($|\/)/;
  
  // Ne pas afficher la navbar sur les pages spécifiées ou les pages d'administration
  if (hideNavbarPaths.includes(location.pathname) || adminPathRegex.test(location.pathname)) {
    return null;
  }
  
  // Afficher la navbar sur toutes les autres pages
  return <Navbar />;
};

export default ConditionalNavbar;
