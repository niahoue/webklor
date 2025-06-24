// your-project-root/api/auth/register.js
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
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer un nouvel utilisateur
    const user = await User.create({
      name,
      email,
      password
    });

    // Générer un token JWT (assurez-vous que votre user.model a generateAuthToken)
    // IMPORTANT: Votre modèle User doit avoir une méthode `generateAuthToken`
    // et JWT_SECRET doit être dans vos variables d'environnement Vercel.
    const token = user.generateAuthToken();

    // Masquer le mot de passe dans la réponse
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      token,
      data: user
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'inscription',
      error: error.message
    });
  }
};