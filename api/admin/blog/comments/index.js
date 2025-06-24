// your-project-root/api/admin/blog/comments/index.js
const dbConnect = require('../../../../utils/dbConnect');
const Comment = require('../../../../server/models/comment.model');
const { protect, restrictTo } = require('../../../../utils/authServerLess');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const authenticatedUser = await protect(req, res);
  if (!authenticatedUser) {
    return;
  }

  const isAuthorized = restrictTo(req, res, ['admin', 'editor']);
  if (!isAuthorized) {
    return;
  }

  try {
    const { status, postId, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status && ['approuvé', 'en attente', 'rejeté'].includes(status)) {
      query.status = status;
    }
    if (postId) {
      query.post = postId;
    }
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { authorName: { $regex: search, $options: 'i' } },
        { authorEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const comments = await Comment.find(query)
      .populate('post', 'title slug') // Populer l'article lié
      .populate({
        path: 'parentComment',
        select: 'authorName content createdAt'
      })
      .populate({
          path: 'replies',
          select: 'authorName content createdAt status',
          populate: { path: 'author', select: 'name' } // Populate l'auteur des réponses
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: comments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires (Admin - Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des commentaires',
      error: error.message
    });
  }
};