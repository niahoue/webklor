// your-project-root/api/admin/users/index.js
const dbConnect = require('../../../utils/dbConnect');
const User = require('../../../server/models/user.model');
const { protect, restrictTo } = require('../../../utils/authServerLess');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // 1. Protection (authentification)
  const authenticatedUser = await protect(req, res);
  if (!authenticatedUser) {
    return; // protect a déjà envoyé la réponse d'erreur
  }

  // 2. Restriction (autorisation par rôle)
  // Seuls les 'admin' peuvent accéder à cette route
  const isAuthorized = restrictTo(req, res, ['admin']);
  if (!isAuthorized) {
    return; // restrictTo a déjà envoyé la réponse d'erreur
  }

  // 3. Logique du contrôleur (tirée de auth.controller.js - getAllUsers)
  try {
    const { page = 1, limit = 10, search, role } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: users
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};