const express = require('express');
const authController = require('../controllers/auth.controller');
const postController = require('../controllers/post.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Routes d'administration
 * Toutes les routes sont protégées et nécessitent une authentification
 */

// Middleware de protection pour toutes les routes admin
router.use(protect);

// ============ GESTION DES UTILISATEURS ============

// GET - Récupérer tous les utilisateurs administrateurs
router.get('/users', restrictTo('admin'), authController.getAllUsers);

// GET - Récupérer un utilisateur par son ID
router.get('/users/:id', restrictTo('admin'), authController.getUserById);

// POST - Créer un nouvel administrateur
router.post('/users', restrictTo('admin'), authController.createAdmin);

// PUT - Mettre à jour un utilisateur
router.put('/users/:id', restrictTo('admin'), authController.updateUser);

// DELETE - Supprimer un utilisateur
router.delete('/users/:id', restrictTo('admin'), authController.deleteUser);

// PUT - Changer le rôle d'un utilisateur
router.put('/users/:id/role', restrictTo('admin'), authController.changeUserRole);

// ============ GESTION DU BLOG ============

// GET - Statistiques du blog
router.get('/blog/stats', restrictTo('admin', 'editor'), postController.getBlogStats);

// GET - Tous les articles avec filtres et pagination
router.get('/blog/posts', restrictTo('admin', 'editor'), postController.getAllPostsAdmin);

// GET - Récupérer un article par son ID pour modification
router.get('/blog/posts/:id', restrictTo('admin', 'editor'), postController.getPostById);

// POST - Créer un nouvel article
router.post('/blog/posts', restrictTo('admin', 'editor'), postController.createPost);

// PUT - Mettre à jour un article
router.put('/blog/posts/:id', restrictTo('admin', 'editor'), postController.updatePost);

// DELETE - Supprimer un article
router.delete('/blog/posts/:id', restrictTo('admin'), postController.deletePost);

// PUT - Changer le statut d'un article (publier/archiver/brouillon)
router.put('/blog/posts/:id/status', restrictTo('admin', 'editor'), postController.changePostStatus);

// ============ TABLEAU DE BORD ============

// GET - Statistiques générales du site
router.get('/dashboard/stats', restrictTo('admin', 'editor'), authController.getDashboardStats);

module.exports = router;
