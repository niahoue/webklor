const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { promisify } = require('util');

/**
 * Middleware d'authentification
 * Vérifie que l'utilisateur est connecté
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express 
 * @param {Function} next - Fonction suivante à exécuter
 */
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Vérifier si le token est présent dans les headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Si aucun token n'est trouvé
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.'
      });
    }
    
    // Vérifier le token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'L\'utilisateur associé à ce token n\'existe plus.'
      });
    }
      // Stocker l'utilisateur dans req.user
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide. Veuillez vous reconnecter.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Votre session a expiré. Veuillez vous reconnecter.'
      });
    }
    
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'authentification',
      error: error.message
    });
  }
};

/**
 * Middleware de restriction d'accès
 * Restreint l'accès à certaines routes en fonction du rôle de l'utilisateur
 * 
 * @param  {...String} roles - Rôles autorisés
 * @returns {Function} - Middleware Express
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Si le rôle de l'utilisateur n'est pas inclus dans les rôles autorisés
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action'
      });
    }
    
    next();
  };
};
