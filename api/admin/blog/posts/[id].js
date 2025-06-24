// your-project-root/api/admin/blog/posts/[id].js
const dbConnect = require('../../../../utils/dbConnect');
const Post = require('../../../../server/models/post.model');
const { protect, restrictTo } = require('../../../../utils/authServerLess');

module.exports = async (req, res) => {
  await dbConnect();

  const { id } = req.query; // Récupérer l'ID

  const authenticatedUser = await protect(req, res);
  if (!authenticatedUser) {
    return;
  }

  const isAuthorized = restrictTo(req, res, ['admin', 'editor']);
  if (!isAuthorized) {
    return;
  }

  if (req.method === 'GET') {
    // Logique GET
    try {
      const post = await Post.findById(id)
        .populate('category', 'name slug')
        .populate('author', 'name');

      if (!post) {
        return res.status(404).json({ success: false, message: 'Article non trouvé' });
      }

      res.status(200).json({ success: true, data: post });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article par ID (Admin - Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération de l\'article',
        error: error.message
      });
    }
  } else if (req.method === 'PUT') {
    // Logique PUT (updatePost) - Sera ajouté à ce fichier
    try {
      const { title, content, excerpt, category, tags, imageUrl, status, slug } = req.body;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Article non trouvé' });
      }

      // S'assurer que le slug est unique s'il est modifié
      if (slug && slug !== post.slug) {
        const existingPost = await Post.findOne({ slug });
        if (existingPost && existingPost._id.toString() !== id) {
          return res.status(400).json({ success: false, message: 'Ce slug est déjà utilisé.' });
        }
      }

      const updatedFields = {
        title, content, excerpt, category, tags, imageUrl, status, slug
      };
      // Permettre de ne modifier que certains champs si non fournis
      Object.keys(updatedFields).forEach(key => updatedFields[key] === undefined && delete updatedFields[key]);

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true, runValidators: true }
      )
      .populate('category', 'name slug')
      .populate('author', 'name');

      res.status(200).json({
        success: true,
        message: 'Article mis à jour avec succès',
        data: updatedPost
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article (Admin - Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour de l\'article',
        error: error.message
      });
    }
  } else if (req.method === 'DELETE') {
    // Logique DELETE (deletePost) - Sera ajouté à ce fichier
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Article non trouvé' });
        }

        // Supprimer tous les commentaires liés à cet article
        await Comment.deleteMany({ post: id }); // Assurez-vous d'importer Comment

        await Post.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Article et ses commentaires supprimés avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'article (Admin - Serverless):', error);
        res.status(500).json({
            success: false,
            message: 'Une erreur est survenue lors de la suppression de l\'article',
            error: error.message
        });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};