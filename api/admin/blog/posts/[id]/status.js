// your-project-root/api/admin/blog/posts/[id]/status.js
const dbConnect = require('../../../../../utils/dbConnect');
const Post = require('../../../../../server/models/post.model');
const { protect, restrictTo } = require('../../../../../utils/authServerLess');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'PUT') {
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
    const { id } = req.query;
    const { status } = req.body;

    const validStatuses = ['publié', 'brouillon', 'archivé'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Les statuts valides sont : ${validStatuses.join(', ')}`
      });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
    .populate('category', 'name slug')
    .populate('author', 'name');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: `Statut de l'article changé vers "${status}" avec succès`,
      data: post
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut de l\'article (Admin - Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors du changement de statut',
      error: error.message
    });
  }
};