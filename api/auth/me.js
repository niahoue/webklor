// your-project-root/api/auth/me.js
const dbConnect = require('../../utils/dbConnect');
const User = require('../../server/models/user.model'); // Assurez-vous que le chemin est correct
const { protect } = require('../../utils/authServerLess'); // Notre utilitaire protect serverless

module.exports = async (req, res) => {
  // 1. Assurer la connexion à la base de données
  await dbConnect();

  // 2. Gérer uniquement la méthode GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // 3. Appliquer la protection. `protect` va soit renvoyer une erreur via `res` et retourner null,
  //    soit attacher `req.user` et retourner l'objet utilisateur.
  const authenticatedUser = await protect(req, res);

  // Si l'authentification a échoué (protect a déjà envoyé une réponse d'erreur)
  if (!authenticatedUser) {
    return; // Arrêter l'exécution ici
  }

  // 4. Logique du contrôleur (tirée de auth.controller.js - getMe)
  try {
    // `req.user` est maintenant disponible grâce à `protect`
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération du profil',
      error: error.message
    });
  }
};