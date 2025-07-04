const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Routes d'authentification
 */

// Routes publiques
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password/:token', authController.resetPassword);

// Routes protégées
router.get('/auth/me', protect, authController.getMe);
router.post('/auth/logout', protect, authController.logout);

// Routes d'administration des utilisateurs (protégées et réservées aux admins)
router.get('/auth/users', protect, authController.restrictTo('admin'), authController.getAllUsers);
router.get('/auth/users/:id', protect, authController.restrictTo('admin'), authController.getUserById);
router.put('/auth/users/:id', protect, authController.restrictTo('admin'), authController.updateUser);
router.delete('/auth/users/:id', protect, authController.restrictTo('admin'), authController.deleteUser);

module.exports = router;
