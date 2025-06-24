// your-project-root/api/admin/blog/comments/[id]/status.js
const dbConnect = require('../../../../../utils/dbConnect');
const Comment = require('../../../../../server/models/comment.model');
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
    const { id } = req.query; // ID du commentaire
    const { status } = req.body;

    const validStatuses = ['approuvé', 'en attente', 'rejeté'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Les statuts valides sont : ${validStatuses.join(', ')}`
      });
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
    .populate('post', 'title slug'); // Populer l'article pour le contexte

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Commentaire non trouvé.' });
    }

    res.status(200).json({
      success: true,
      message: `Statut du commentaire changé vers "${status}" avec succès.`,
      data: comment
    });
  } catch (error) {
    console.error('Erreur lors de la modération du commentaire (Admin - Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la modération du commentaire',
      error: error.message
    });
  }
};