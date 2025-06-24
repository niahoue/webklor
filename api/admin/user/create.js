// your-project-root/api/admin/users/create.js
const dbConnect = require('../../../utils/dbConnect');
const User = require('../../../server/models/user.model');
const { protect, restrictTo } = require('../../../utils/authServerLess');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const authenticatedUser = await protect(req, res);
  if (!authenticatedUser) {
    return;
  }

  const isAuthorized = restrictTo(req, res, ['admin']);
  if (!isAuthorized) {
    return;
  }

  try {
    const { name, email, password, role = 'editor' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires (nom, email, mot de passe)'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    if (!['admin', 'editor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide. Utilisez "admin" ou "editor"'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    user.password = undefined; // Masquer le mot de passe dans la réponse

    res.status(201).json({
      success: true,
      message: 'Administrateur/Éditeur créé avec succès',
      data: user
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur/éditeur (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la création de l\'administrateur/éditeur',
      error: error.message
    });
  }
};