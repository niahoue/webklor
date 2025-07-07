const express = require('express');
const postController = require('../controllers/post.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Routes pour la gestion du blog
 * Organisation :
 * 1. Routes publiques
 * 2. Routes d'administration (protégées)
 */

// ===========================================
// ROUTES PUBLIQUES (non protégées)
// ===========================================

// GET - Récupérer tous les articles publiés (pour le blog public)
router.get('/blog/posts', postController.getAllPosts);

// GET - Récupérer un article spécifique par son slug (pour le blog public)
router.get('/blog/posts/:slug', postController.getPostBySlug);

// ===========================================
// ROUTES D'ADMINISTRATION (protégées)
// ===========================================

// Middleware de protection pour toutes les routes admin
router.use('/admin/blog', protect);

// GET - Statistiques du blog (dashboard admin)
router.get('/admin/blog/stats', restrictTo('admin', 'editor'), postController.getBlogStats);

// GET - Tous les articles pour l'administration (avec filtres et pagination)
router.get('/admin/blog/posts', restrictTo('admin', 'editor'), postController.getAllPostsAdmin);

// POST - Créer un nouvel article
router.post('/admin/blog/posts', restrictTo('admin', 'editor'), postController.createPost);

// Routes spécifiques avec paramètres (ATTENTION À L'ORDRE)
// =======================================================

// GET - Récupérer un article par son ID (pour modification)
// IMPORTANT : Cette route doit être AVANT la route :slug pour éviter les conflits
router.get('/admin/blog/posts/:id', restrictTo('admin', 'editor'), postController.getPostById);

// GET - Récupérer un article par son slug (pour prévisualisation admin)
router.get('/admin/blog/posts/slug/:slug', restrictTo('admin', 'editor'), postController.getPostBySlug);

// PUT - Mettre à jour un article par son ID
router.put('/admin/blog/posts/:id', restrictTo('admin', 'editor'), postController.updatePost);

// DELETE - Supprimer un article par son ID
router.delete('/admin/blog/posts/:id', restrictTo('admin'), postController.deletePost);

// PUT - Changer le statut d'un article (publier/archiver/brouillon)
router.put('/admin/blog/posts/:id/status', restrictTo('admin', 'editor'), postController.changePostStatus);

module.exports = router;