// your-project-root/api/auth/reset-password/[token].js
const dbConnect = require('../../utils/dbConnect');
const User = require('../../server/models/user.model');
const crypto = require('crypto');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { token } = req.query; // Paramètre dynamique via le nom du fichier [token].js
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token et nouveau mot de passe sont requis'
      });
    }

    // Hasher le token pour le comparer avec celui stocké en base
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Rechercher l'utilisateur avec le token non expiré
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    // Mettre à jour le mot de passe et supprimer les champs de réinitialisation
    user.password = password; // Le setter de votre modèle User doit gérer le hashage
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Générer un nouveau token JWT pour la connexion automatique
    // Assurez-vous que user.generateAuthToken() est bien défini dans votre modèle User
    const authToken = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      token: authToken
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la réinitialisation du mot de passe',
      error: error.message
    });
  }
};