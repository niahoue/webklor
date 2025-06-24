// your-project-root/api/posts/recent.js
const dbConnect = require('../../utils/dbConnect');
const Post = require('../../server/models/post.model');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const limit = parseInt(req.query.limit) || 5;

    const recentPosts = await Post.find({ status: 'publié' }) // Seulement les publiés
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title slug status createdAt views author');

    res.status(200).json({
      success: true,
      data: recentPosts
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles récents (public):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des articles récents',
      error: error.message
    });
  }
};