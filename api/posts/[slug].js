const dbConnect = require('../../utils/dbConnect');
const Post = require('../../server/models/post.model');


module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { slug } = req.query; // Récupérer le slug du paramètre dynamique

    // Trouver l'article par slug et s'assurer qu'il est publié
    const post = await Post.findOne({ slug, status: 'publié' })
      .populate('category', 'name slug')
      .populate('author', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé ou non publié'
      });
    }

    // Incrémenter le nombre de vues
    post.views = (post.views || 0) + 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article par slug (public):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération de l\'article',
      error: error.message
    });
  }
};