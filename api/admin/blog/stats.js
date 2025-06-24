// your-project-root/api/admin/blog/stats.js
const dbConnect = require('../../../utils/dbConnect');
const Post = require('../../../server/models/post.model');
const Comment = require('../../../server/models/comment.model');
const Subscriber = require('../../../server/models/newsletter.model').Subscriber; // Importez Subscriber
const User = require('../../../server/models/user.model'); // Pour totalUsers
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

  const isAuthorized = restrictTo(req, res, ['admin', 'editor']);
  if (!isAuthorized) {
    return;
  }

  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: 'publié' });
    const draftPosts = await Post.countDocuments({ status: 'brouillon' });
    const totalSubscribers = await Subscriber.countDocuments({ isActive: true });
    const totalComments = await Comment.countDocuments();

    // Articles populaires (par vues)
    const popularPosts = await Post.find({ status: 'publié' })
      .sort({ views: -1 })
      .limit(5)
      .select('title status createdAt slug views');

    // Articles récents
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt slug');

    // Statistiques par catégorie
    const categoryStats = await Post.aggregate([
      { $match: { status: 'publié' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Remplir les noms de catégories si possible
    const categories = await require('../../../../models/category.model').find({}); // Assurez-vous d'importer votre modèle Category
    const categoryMap = new Map(categories.map(cat => [cat._id.toString(), cat.name]));

    const populatedCategoryStats = categoryStats.map(stat => ({
        name: categoryMap.get(stat._id.toString()) || 'Inconnu',
        count: stat.count
    }));


    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalPosts,
          publishedPosts,
          draftPosts,
          totalSubscribers,
          totalComments
        },
        popularPosts,
        recentPosts,
        categoryStats: populatedCategoryStats
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques du blog (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des statistiques',
      error: error.message
    });
  }
};