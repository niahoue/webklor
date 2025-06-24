// your-project-root/api/admin/newsletter/index.js
const dbConnect = require('../../../utils/dbConnect');
const { Subscriber } = require('../../../server/models/newsletter.model');
const { protect, restrictTo } = require('../../../server/utils/authServerless');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'GET') {
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
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) {
      if (status === 'active') query.isActive = true;
      else if (status === 'unsubscribed') query.isActive = false;
      else if (status === 'pending') query.confirmationToken = { $ne: null }; // Ceux avec un token de confirmation
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscribers = await Subscriber.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Subscriber.countDocuments(query);

    res.status(200).json({
      success: true,
      count: subscribers.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: subscribers
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés (Admin - Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des abonnés',
      error: error.message
    });
  }
};