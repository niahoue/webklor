const express = require('express');
const postController = require('../controllers/post.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Routes pour la gestion du blog
 */

// Routes publiques
// GET - Récupérer tous les articles publiés
router.get('/blog/posts', postController.getAllPosts);

// GET - Récupérer un article spécifique par son slug
router.get('/blog/posts/:slug', postController.getPostBySlug);

// Routes d'administration (protégées par authentification)
// Toutes les routes admin nécessitent une authentification
router.use('/admin/blog', protect);

// GET - Statistiques du blog
router.get('/admin/blog/stats', restrictTo('admin', 'editor'), postController.getBlogStats);

// GET - Tous les articles (y compris les brouillons et archives)
router.get('/admin/blog/posts', restrictTo('admin', 'editor'), postController.getAllPosts);

// GET - Récupérer un article admin par son slug
router.get('/admin/blog/posts/:slug', restrictTo('admin', 'editor'), postController.getPostBySlug);

// POST - Créer un nouvel article
router.post('/admin/blog/posts', restrictTo('admin', 'editor'), postController.createPost);

// PUT - Mettre à jour un article
router.put('/admin/blog/posts/:id', restrictTo('admin', 'editor'), postController.updatePost);

// DELETE - Supprimer un article
router.delete('/admin/blog/posts/:id', restrictTo('admin'), postController.deletePost);

module.exports = router;
