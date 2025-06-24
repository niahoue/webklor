// your-project-root/api/comments/post/[postId].js
const dbConnect = require('../../../utils/dbConnect');
const Comment = require('../../../server/models/comment.model');
const Post = require('../../../server/models/post.model'); // Pour vérifier l'existence de l'article

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { postId } = req.query; // Paramètre dynamique

    // Vérifier si l'article existe et est publié
    const post = await Post.findById(postId);
    if (!post || post.status !== 'publié') {
      return res.status(404).json({ success: false, message: 'Article non trouvé ou non publié.' });
    }

    // Récupérer les commentaires approuvés de premier niveau (pas les réponses directes)
    const comments = await Comment.find({
      post: postId,
      parentComment: null, // Seulement les commentaires de niveau supérieur
      status: 'approuvé' // Seulement les commentaires approuvés pour le public
    })
    .populate({
        path: 'author',
        select: 'name' // Sélectionnez les champs de l'auteur que vous souhaitez exposer
    })
    .populate({
        path: 'replies', // Populate les réponses
        match: { status: 'approuvé' }, // Seulement les réponses approuvées
        populate: { // Populate l'auteur des réponses
            path: 'author',
            select: 'name'
        },
        options: { sort: { createdAt: 1 } } // Trier les réponses par ordre chronologique
    })
    .sort({ createdAt: -1 }); // Trier les commentaires principaux par les plus récents en premier

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires par article (public - Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des commentaires',
      error: error.message
    });
  }
};