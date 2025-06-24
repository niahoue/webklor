const dbConnect = require('../../../../utils/dbConnect');
const Post = require('../../../../server/models/post.model');
const { protect, restrictTo } = require('../../../../utils/authServerLess');


module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
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
    const { title, content, excerpt, category, tags, imageUrl, status, slug } = req.body;

    // Ajouter l'ID de l'auteur (l'utilisateur authentifié)
    const author = req.user.id; // L'ID de l'utilisateur est stocké dans req.user par `protect`

    // Vérifier si le slug est unique si fourni
    if (slug) {
      const existingPost = await Post.findOne({ slug });
      if (existingPost) {
        return res.status(400).json({ success: false, message: 'Ce slug est déjà utilisé.' });
      }
    }

    const newPost = await Post.create({
      title, content, excerpt, category, tags, imageUrl, status, slug, author
    });

    res.status(201).json({
      success: true,
      message: 'Article créé avec succès',
      data: newPost
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'article (Admin - Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la création de l\'article',
      error: error.message
    });
  }
};