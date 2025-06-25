const Message = require('../models/message.model');
const emailService = require('../utils/email.service');

/**
 * Contrôleur pour la gestion des messages
 */
const messageController = {
  /**
   * Création d'un nouveau message
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async createMessage(req, res) {
    try {
      const { fullName, email, phone, subject, message, consentGiven } = req.body;
      
      // Vérification des champs obligatoires
      if (!fullName || !email || !subject || !message) {
        return res.status(400).json({ 
          success: false,
          message: 'Veuillez fournir tous les champs obligatoires' 
        });
      }
      
      // Vérification du consentement
      if (!consentGiven) {
        return res.status(400).json({ 
          success: false,
          message: 'Vous devez accepter la politique de confidentialité' 
        });
      }
      
      // Création du message dans la base de données
      const newMessage = new Message({
        fullName,
        email,
        phone,
        subject,
        message,
        consentGiven
      });
      
      await newMessage.save();
      
      // Envoi des emails
      try {
        await emailService.sendNotificationEmail(newMessage);
        await emailService.sendConfirmationEmail(newMessage);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi des emails:', emailError);
        // Continuer malgré l'erreur d'email
      }
      
      res.status(201).json({
        success: true,
        message: 'Votre message a été envoyé avec succès',
        data: { id: newMessage._id }
      });
    } catch (error) {
      console.error('Erreur lors de la création du message:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du message',
        error: error.message
      });
    }
  },
  
  /**
   * Récupération de tous les messages (pour un tableau de bord admin)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllMessages(req, res) {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des messages',
        error: error.message
      });
    }
  },
  
  /**
   * Récupération d'un message spécifique
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getMessage(req, res) {
    try {
      const message = await Message.findById(req.params.id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du message:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération du message',
        error: error.message
      });
    }
  },
  
  /**
   * Mise à jour du statut d'un message
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async updateMessageStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!['nouveau', 'en_cours', 'traité'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide'
        });
      }
      
      const message = await Message.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du message:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour du statut du message',
        error: error.message
      });
    }
  },
  
  /**
   * Suppression d'un message
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async deleteMessage(req, res) {
    try {
      const message = await Message.findByIdAndDelete(req.params.id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Message supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression du message',
        error: error.message
      });
    }
  }
};

module.exports = messageController;
