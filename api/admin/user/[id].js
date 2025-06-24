// your-project-root/api/admin/users/[id].js
const dbConnect = require('../../../utils/dbConnect');
const User = require('../../../server/models/user.model');
const { protect, restrictTo } = require('../../../utils/authServerLess');

module.exports = async (req, res) => {
  await dbConnect();

  const { id } = req.query; // Récupérer l'ID depuis req.query

  // Logique commune pour l'authentification et l'autorisation
  // Nous les exécutons une fois, et si elles échouent, la fonction s'arrête.
  const authenticatedUser = await protect(req, res);
  if (!authenticatedUser) {
    return; // protect a déjà envoyé la réponse d'erreur
  }
  const isAuthorized = restrictTo(req, res, ['admin']);
  if (!isAuthorized) {
    return; // restrictTo a déjà envoyé la réponse d'erreur
  }

  // Distribution de la requête en fonction de la méthode HTTP
  if (req.method === 'GET') {
    // Logique pour GET /api/admin/users/:id
    try {
      const user = await User.findById(id).select('-password');

      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur par ID (Serverless):', error);
      res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la récupération de l\'utilisateur', error: error.message });
    }

  } else if (req.method === 'PUT') {
    // Logique pour PUT /api/admin/users/:id (updateUser)
    try {
      const { name, email, role } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      // Empêcher l'utilisateur de modifier son propre rôle s'il n'est pas "admin" et tente de changer son rôle
      // Ou si un non-admin tente de changer son propre rôle
      if (req.user.id.toString() === id && role && req.user.role !== role) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas modifier votre propre rôle.'
        });
      }

      // Vérifier l'unicité de l'email si il est modifié
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.id.toString() !== id) { // S'assurer que ce n'est pas le même utilisateur
          return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' });
        }
      }

      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (email) updatedFields.email = email;
      // Seul un admin peut modifier le rôle et seulement si le rôle est valide
      if (req.user.role === 'admin' && role && ['admin', 'editor', 'user'].includes(role)) {
        updatedFields.role = role;
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true, runValidators: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: updatedUser
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur (Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur',
        error: error.message
      });
    }

  } else if (req.method === 'DELETE') {
    // Logique pour DELETE /api/admin/users/:id (deleteUser)
    try {
      // Empêcher l'utilisateur de se supprimer lui-même
      if (req.user.id.toString() === id) { // Utilisez .toString() pour comparer les ObjectIDs
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte.'
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      await User.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur (Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression de l\'utilisateur',
        error: error.message
      });
    }

  } else {
    // Méthode non autorisée pour cette route
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};