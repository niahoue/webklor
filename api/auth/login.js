// your-project-root/api/auth/login.js
const dbConnect = require('../../utils/dbConnect');
const User = require('../../server/models/user.model'); // Assurez-vous que le chemin est correct
const config = require('../../server/config/config'); // Pour JWT_SECRET et autres

module.exports = async (req, res) => {
  // 1. Assurer la connexion à la base de données
  await dbConnect();

  // 2. Gérer uniquement la méthode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // 3. Logique du contrôleur (tirée de auth.controller.js)
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur a fourni un email et un mot de passe
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Rechercher l'utilisateur et inclure explicitement le mot de passe
    const user = await User.findOne({ email }).select('+password');

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le mot de passe est correct (assurez-vous que votre user.model a comparePassword)
    // IMPORTANT: Votre modèle User doit avoir une méthode `comparePassword`
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer un token JWT
    const token = user.generateAuthToken();

    // Masquer le mot de passe dans la réponse
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      data: user
    });
  } catch (error) {
    console.error('Erreur lors de la connexion (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la connexion',
      error: error.message
    });
  }
};