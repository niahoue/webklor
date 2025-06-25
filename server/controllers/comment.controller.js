const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const sendEmail = require('../utils/email.service');

/**
 * Contrôleur pour la gestion des commentaires
 */
const commentController = {
  /**
   * Récupérer les commentaires d'un article
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getCommentsByPost(req, res) {
    try {
      const { postId } = req.params;
      
      // Vérifier si l'article existe
      const post = await Post.findById(postId);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
      }
      
      // Récupérer les commentaires de premier niveau approuvés (pas les réponses)
      const comments = await Comment.find({
        post: postId,
        parentComment: null,
        status: req.path.includes('/admin') ? { $in: ['en attente', 'approuvé', 'rejeté'] } : 'approuvé'
      }).sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des commentaires',
        error: error.message
      });
    }
  },
  
  /**
   * Récupérer les commentaires en attente de modération (admin)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getPendingComments(req, res) {
    try {
      const comments = await Comment.find({ status: 'en attente' })
        .populate('post', 'title slug')
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires en attente:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des commentaires en attente',
        error: error.message
      });
    }
  },
  
  /**
   * Ajouter un nouveau commentaire
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async addComment(req, res) {
    try {
      const { postId } = req.params;
      const { name, email, content, parentCommentId } = req.body;
      
      // Vérifier si l'article existe
      const post = await Post.findById(postId);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
      }
      
      // Vérifier si le commentaire parent existe (si c'est une réponse)
      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        
        if (!parentComment) {
          return res.status(404).json({
            success: false,
            message: 'Commentaire parent non trouvé'
          });
        }
      }
      
      // Créer le nouveau commentaire
      const comment = new Comment({
        post: postId,
        name,
        email,
        content,
        parentComment: parentCommentId || null
      });
      
      await comment.save();
      
      // Envoyer un email de notification
      try {
        await sendEmail({
          to: process.env.EMAIL_TO,
          subject: 'Nouveau commentaire sur le blog WebKlor',
          html: `
            <h1>Nouveau commentaire à modérer</h1>
            <p><strong>Article:</strong> ${post.title}</p>
            <p><strong>De:</strong> ${name} (${email})</p>
            <p><strong>Contenu:</strong></p>
            <div style="background-color: #f5f5f5; padding: 10px; border-left: 4px solid #0275d8;">
              ${content}
            </div>
            <p><a href="${process.env.FRONTEND_URL}/admin/comments" target="_blank">Modérer ce commentaire</a></p>
          `
        });
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
        // Ne pas renvoyer d'erreur au client si l'email échoue
      }
      
      res.status(201).json({
        success: true,
        message: 'Commentaire ajouté avec succès et en attente de modération',
        data: comment
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'ajout du commentaire',
        error: error.message
      });
    }
  },
  
  /**
   * Modérer un commentaire (admin)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async moderateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { status } = req.body;
      
      // Vérifier si le statut est valide
      if (!['en attente', 'approuvé', 'rejeté'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide'
        });
      }
      
      // Mettre à jour le statut du commentaire
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { status },
        { new: true, runValidators: true }
      );
      
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        message: `Commentaire ${status === 'approuvé' ? 'approuvé' : status === 'rejeté' ? 'rejeté' : 'mis en attente'} avec succès`,
        data: comment
      });
    } catch (error) {
      console.error('Erreur lors de la modération du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la modération du commentaire',
        error: error.message
      });
    }
  },
  
  /**
   * Supprimer un commentaire (admin)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      
      // Trouver et supprimer le commentaire
      const comment = await Comment.findByIdAndDelete(commentId);
      
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }
      
      // Supprimer également toutes les réponses à ce commentaire
      await Comment.deleteMany({ parentComment: commentId });
      
      res.status(200).json({
        success: true,
        message: 'Commentaire et ses réponses supprimés avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression du commentaire',
        error: error.message
      });
    }
  },
  
  /**
   * Récupérer tous les commentaires avec filtrage par statut (admin)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllComments(req, res) {
    try {
      const { status } = req.query;
      
      // Construire la requête de filtrage
      const filter = {};
      
      // Filtrer par statut si spécifié
      if (status && ['approuvé', 'en attente', 'rejeté'].includes(status)) {
        filter.status = status;
      }
      
      // Récupérer les commentaires avec les informations des articles associés
      const comments = await Comment.find(filter)
        .populate('post', 'title slug')
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des commentaires',
        error: error.message
      });
    }
  }
};

module.exports = commentController;
