// your-project-root/api/auth/logout.js
const dbConnect = require('../../utils/dbConnect');
const { protect } = require('../../utils/authServerLess'); // Notre utilitaire protect serverless

module.exports = async (req, res) => {
  // 1. Assurer la connexion à la base de données
  await dbConnect();

  // 2. Gérer uniquement la méthode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // 3. Appliquer la protection.
  const authenticatedUser = await protect(req, res);

  // Si l'authentification a échoué
  if (!authenticatedUser) {
    return;
  }

  // 4. Logique du contrôleur (tirée de auth.controller.js - logout)
  try {
    // Pour une API stateless (sans sessions), la "déconnexion" côté serveur
    // consiste simplement à invalider le token côté client (en le supprimant du stockage local/cookies).
    // Donc, il suffit d'envoyer un message de succès.
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la déconnexion',
      error: error.message
    });
  }
};