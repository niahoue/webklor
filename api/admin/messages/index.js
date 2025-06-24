// your-project-root/api/admin/messages/index.js
const dbConnect = require('../../../utils/dbConnect');
const Message = require('../../../server/models/message.model');
const { protect, restrictTo } = require('../../../utils/authServerLess');

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
    if (status && ['lu', 'non lu', 'archivé'].includes(status)) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: messages
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages (Admin - Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des messages',
      error: error.message
    });
  }
};