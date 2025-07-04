const User = require('../models/user.model');
const config = require('../config/config');
const mongoose = require('mongoose');

/**
 * Contrôleur pour l'initialisation du système
 */
const setupController = {
  /**
   * Initialisation de l'utilisateur administrateur par défaut
   * Cette fonction crée un utilisateur administrateur s'il n'en existe aucun
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async initializeAdmin(req, res) {
    try {
      // Vérifier si la clé d'initialisation est valide
      const initKey = req.body.initKey || req.query.initKey;

      // Si aucune clé secrète n'est fournie dans la requête
      if (!initKey || initKey !== process.env.ADMIN_INIT_KEY) {
        return res.status(403).json({
          success: false,
          message: 'Clé d\'initialisation invalide ou manquante'
        });
      }

      // Vérifier si un administrateur existe déjà
      const adminExists = await User.findOne({ role: 'admin' });

      if (adminExists) {
        return res.status(200).json({
          success: true,
          message: 'Un administrateur existe déjà',
          admin: {
            email: adminExists.email,
            name: adminExists.name
          }
        });
      }

      // Créer un utilisateur administrateur par défaut
      const admin = await User.create({
        name: 'Administrateur',
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@webklor.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
        role: 'admin'
      });

      // Masquer le mot de passe dans la réponse
      admin.password = undefined;

      res.status(201).json({
        success: true,
        message: 'Utilisateur administrateur créé avec succès',
        admin: {
          email: admin.email,
          name: admin.name
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'administrateur:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'initialisation',
        error: error.message
      });
    }
  },

  /**
   * Vérification de l'état du système
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async checkSystemStatus(req, res) {
    try {
      // Compter le nombre d'administrateurs
      const adminCount = await User.countDocuments({ role: 'admin' });
      
      // Vérifier l'état de la base de données
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

      res.status(200).json({
        success: true,
        status: {
          database: dbStatus,
          adminAccountsCreated: adminCount > 0,
          adminCount,
          environment: config.nodeEnv,
          serverTime: new Date()
        }
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'état du système:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la vérification de l\'état du système',
        error: error.message
      });
    }
  }
};

module.exports = setupController;
