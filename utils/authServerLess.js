// your-project-root/utils/authServerless.js
const jwt = require('jsonwebtoken');
const User = require('../server/models/user.model'); // Assurez-vous que le chemin est correct
const { promisify } = require('util');
const dbConnect = require('./dbConnect'); // Pour s'assurer que la BDD est connectée

/**
 * Fonction utilitaire pour protéger les routes.
 * Se comporte comme un middleware mais gère la réponse directement.
 *
 * @param {Object} req - Objet de requête HTTP (req.headers, etc.)
 * @param {Object} res - Objet de réponse HTTP
 * @returns {Promise<Object|null>} - Retourne l'utilisateur si authentifié, sinon retourne res.status et null.
 */
async function protect(req, res) {
  await dbConnect(); // Assurez-vous que la connexion à la BDD est établie

  let token;

  // 1. Vérifier si le token est présent dans les headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Si aucun token n'est trouvé
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.'
    });
    return null; // Important : Indiquer que la validation a échoué
  }

  try {
    // 3. Vérifier le token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 4. Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'L\'utilisateur associé à ce token n\'existe plus.'
      });
      return null;
    }

    // Si tout est bon, attacher l'utilisateur à l'objet de requête pour le contrôleur
    req.user = currentUser; // Attache l'objet user complet, pas seulement le decoded JWT
    return currentUser; // Retourne l'utilisateur pour une utilisation directe
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Token invalide. Veuillez vous reconnecter.'
      });
    } else if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Votre session a expiré. Veuillez vous reconnecter.'
      });
    } else {
      console.error('Erreur d\'authentification (Serverless Protect):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'authentification',
        error: error.message
      });
    }
    return null;
  }
}

/**
 * Fonction utilitaire pour restreindre l'accès selon le rôle.
 *
 * @param {Object} req - Objet de requête HTTP (req.user doit être déjà défini par `protect`)
 * @param {Object} res - Objet de réponse HTTP
 * @param {Array<String>} allowedRoles - Tableau de rôles autorisés (ex: ['admin', 'editor'])
 * @returns {boolean} - True si l'utilisateur a un rôle autorisé, false sinon (et envoie la réponse d'erreur).
 */
function restrictTo(req, res, allowedRoles) {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action'
    });
    return false;
  }
  return true;
}

module.exports = { protect, restrictTo };