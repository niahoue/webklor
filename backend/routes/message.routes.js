const express = require('express');
const messageController = require('../controllers/message.controller');

const router = express.Router();

/**
 * Routes pour la gestion des messages
 */

// Route POST pour créer un nouveau message
router.post('/messages', messageController.createMessage);

// Route GET pour récupérer tous les messages (protégée dans un vrai environnement)
router.get('/messages', messageController.getAllMessages);

// Route GET pour récupérer un message spécifique
router.get('/messages/:id', messageController.getMessage);

// Route PUT pour mettre à jour le statut d'un message
router.put('/messages/:id', messageController.updateMessageStatus);

// Route DELETE pour supprimer un message
router.delete('/messages/:id', messageController.deleteMessage);

module.exports = router;
