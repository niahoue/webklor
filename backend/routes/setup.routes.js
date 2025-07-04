const express = require('express');
const setupController = require('../controllers/setup.controller');

const router = express.Router();

/**
 * Routes d'initialisation du système
 */

// Initialisation de l'administrateur
router.post('/setup/init-admin', setupController.initializeAdmin);

// Vérification de l'état du système
router.get('/setup/status', setupController.checkSystemStatus);

module.exports = router;
