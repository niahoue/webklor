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

module.exports = router;
