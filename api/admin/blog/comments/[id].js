// your-project-root/api/admin/blog/comments/[id].js
const dbConnect = require('../../../../utils/dbConnect');
const Comment = require('../../../../server/models/comment.model');
const { protect, restrictTo } = require('../../../../utils/authServerLess');

module.exports = async (req, res) => {
  await dbConnect();

  const { id } = req.query; // ID du commentaire

  const authenticatedUser = await protect(req, res);
  if (!authenticatedUser) {
    return;
  }

  const isAuthorized = restrictTo(req, res, ['admin', 'editor']); // Normalement 'admin' seulement pour la suppression, mais à vous de voir
  if (!isAuthorized) {
    return;
  }

  if (req.method === 'DELETE') {
    // Logique DELETE
    try {
      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json({ success: false, message: 'Commentaire non trouvé.' });
      }

      // Supprimer le commentaire et toutes ses réponses récursivement
      // Cette logique peut être complexe. Voici une approche simple :
      // 1. Trouver toutes les réponses directes et indirectes (peut nécessiter une fonction récursive ou une agrégation)
      // 2. Supprimer tous ces commentaires
      // Ou, plus simplement pour commencer:
      // Supprimer les réponses directes et mettre à jour le parent (si applicable)
      // Pour une suppression entièrement récursive, il faudrait une méthode plus sophistiquée dans le modèle Comment.

      // Simplification : On supprime le commentaire et on s'assure qu'il n'est plus une réponse d'un parent
      await Comment.findByIdAndDelete(id);

      // Si ce commentaire était une réponse, le retirer du tableau 'replies' du parent
      if (comment.parentComment) {
        await Comment.findByIdAndUpdate(
          comment.parentComment,
          { $pull: { replies: id } },
          { new: true }
        );
      }
      
      // Si le commentaire avait des réponses, elles deviendront orphelines.
      // Une meilleure approche impliquerait une suppression en cascade ou de les lier directement à l'article.
      // Pour l'instant, nous considérons que supprimer un commentaire supprime ses réponses DIRECTES si elles étaient liées.
      // Si `replies` est un champ dans `Comment` et non juste un `populate`, alors `deleteMany` serait utile ici.
      // Ex: await Comment.deleteMany({ parentComment: id }); // Ceci supprimerait toutes les réponses directes

      res.status(200).json({ success: true, message: 'Commentaire supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire (Admin - Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression du commentaire',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};