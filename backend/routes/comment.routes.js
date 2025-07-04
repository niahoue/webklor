const express = require('express');
const commentController = require('../controllers/comment.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Routes pour la gestion des commentaires
 */

// Routes publiques
// GET - Récupérer les commentaires approuvés d'un article
router.get('/blog/posts/:postId/comments', commentController.getCommentsByPost);

// POST - Ajouter un commentaire
router.post('/blog/posts/:postId/comments', commentController.addComment);

// Routes d'administration (protégées)
// GET - Récupérer tous les commentaires d'un article (y compris en attente et rejetés)
router.get('/admin/blog/posts/:postId/comments', protect, restrictTo('admin', 'editor'), commentController.getCommentsByPost);

// GET - Récupérer les commentaires en attente de modération
router.get('/admin/blog/comments/pending', protect, restrictTo('admin', 'editor'), commentController.getPendingComments);

// GET - Récupérer tous les commentaires, avec filtrage par statut optionnel
router.get('/admin/blog/comments', protect, restrictTo('admin', 'editor'), commentController.getAllComments);

// PUT - Modérer un commentaire
router.put('/admin/blog/comments/:commentId', protect, restrictTo('admin', 'editor'), commentController.moderateComment);

// DELETE - Supprimer un commentaire
router.delete('/admin/blog/comments/:commentId', protect, restrictTo('admin'), commentController.deleteComment);

module.exports = router;
