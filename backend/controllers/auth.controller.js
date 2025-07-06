const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const mongoose = require('mongoose');
const emailService = require('../utils/email.service');

/**
 * Contrôleur pour la gestion des utilisateurs et de l'authentification
 */
const authController = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }
      
      // Créer un nouvel utilisateur
      const user = await User.create({
        name,
        email,
        password
      });
      
      // Générer un token JWT
      const token = user.generateAuthToken();
      
      // Masquer le mot de passe dans la réponse
      user.password = undefined;
      
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        token,
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'inscription',
        error: error.message
      });
    }
  },
  
  /**
   * Connexion d'un utilisateur existant
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Vérifier si l'utilisateur a fourni un email et un mot de passe
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir un email et un mot de passe'
        });
      }
      
      // Rechercher l'utilisateur et inclure explicitement le mot de passe
      const user = await User.findOne({ email }).select('+password');
      
      // Vérifier si l'utilisateur existe
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }
      
      // Vérifier si le mot de passe est correct
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }
      
      // Générer un token JWT
      const token = user.generateAuthToken();
      
      // Masquer le mot de passe dans la réponse
      user.password = undefined;
      
      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        token,
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la connexion',
        error: error.message
      });
    }
  },
  
  /**
   * Récupération des informations de l'utilisateur connecté
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getMe(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération du profil',
        error: error.message
      });
    }
  },
  
  /**
   * Déconnexion de l'utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async logout(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la déconnexion',
        error: error.message
      });
    }
  },
  
  /**
   * Demande de réinitialisation de mot de passe
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
 async forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir une adresse email'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Aucun utilisateur trouvé avec cette adresse email'
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hasher le token et l'enregistrer dans la base de données
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Définir une expiration de 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Construire l'URL de réinitialisation
    const resetURL = `${req.get('origin')}/reset-password/${resetToken}`;
    // Message HTML de l'email
    const htmlMessage = `
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Vous recevez cet email car vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Veuillez cliquer sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
      <p><a href="${resetURL}" target="_blank" style="color:#007BFF;">Réinitialiser mon mot de passe</a></p>
      <p>Ce lien est valide pendant 10 minutes.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
      <p>Cordialement,<br>L'équipe WebKlor</p>
    `;

    // Envoi de l'email avec retry et gestion d'erreurs
    await emailService.sendEmailWithRetry(() =>
      emailService.getTransporter().sendMail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: 'Réinitialisation de votre mot de passe WebKlor',
        html: htmlMessage
      })
    );

    res.status(200).json({
      success: true,
      message: 'Email de réinitialisation envoyé'
    });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);

    // Nettoyer les champs en cas d'échec
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la demande de réinitialisation',
      error: error.message
    });
  }
},

  
  /**
   * Réinitialisation du mot de passe
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      
      // Hasher le token pour le comparer avec celui stocké en base
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
      
      // Rechercher l'utilisateur avec le token non expiré
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
      }
      
      // Mettre à jour le mot de passe et supprimer les champs de réinitialisation
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      
      await user.save();
      
      // Générer un nouveau token JWT pour la connexion automatique
      const authToken = user.generateAuthToken();
      
      res.status(200).json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès',
        token: authToken
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la réinitialisation du mot de passe',
        error: error.message
      });
    }
  },

  /**
   * Récupère tous les utilisateurs (administrateurs uniquement)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search, role } = req.query;
      
      // Construire la requête de recherche
      const query = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (role) {
        query.role = role;
      }
      
      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await User.countDocuments(query);
      
      res.status(200).json({
        success: true,
        count: users.length,
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        data: users
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des utilisateurs',
        error: error.message
      });
    }
  },

  /**
   * Récupérer un utilisateur par son ID
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération de l\'utilisateur',
        error: error.message
      });
    }
  },

  /**
   * Créer un nouvel administrateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async createAdmin(req, res) {
    try {
      const { name, email, password, role = 'editor' } = req.body;
      
      // Validation des champs obligatoires
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs sont obligatoires (nom, email, mot de passe)'
        });
      }
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }
      
      // Valider le rôle
      if (!['admin', 'editor'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Rôle invalide. Utilisez "admin" ou "editor"'
        });
      }
      
      // Créer le nouvel utilisateur
      const user = await User.create({
        name,
        email,
        password,
        role
      });
      
      // Masquer le mot de passe dans la réponse
      user.password = undefined;
      
      res.status(201).json({
        success: true,
        message: 'Administrateur créé avec succès',
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'administrateur:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la création de l\'administrateur',
        error: error.message
      });
    }
  },

  /**
   * Mettre à jour un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;
      
      // Vérifier que l'utilisateur existe
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      // Empêcher l'utilisateur de modifier son propre rôle
      if (req.user.id === id && role && req.user.role !== role) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas modifier votre propre rôle'
        });
      }
      
      // Vérifier l'unicité de l'email si il est modifié
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Cet email est déjà utilisé'
          });
        }
      }
      
      // Mettre à jour les champs
      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (email) updatedFields.email = email;
      if (role && ['admin', 'editor'].includes(role)) updatedFields.role = role;
      
      const updatedUser = await User.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true, runValidators: true }
      ).select('-password');
      
      res.status(200).json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: updatedUser
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur',
        error: error.message
      });
    }
  },

  /**
   * Supprimer un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Empêcher l'utilisateur de se supprimer lui-même
      if (req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte'
        });
      }
      
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      await User.findByIdAndDelete(id);
      
      res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression de l\'utilisateur',
        error: error.message
      });
    }
  },

  /**
   * Changer le rôle d'un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async changeUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      // Empêcher l'utilisateur de modifier son propre rôle
      if (req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas modifier votre propre rôle'
        });
      }
      
      // Valider le rôle
      if (!['admin', 'editor'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Rôle invalide. Utilisez "admin" ou "editor"'
        });
      }
      
      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Rôle mis à jour avec succès',
        data: user
      });
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors du changement de rôle',
        error: error.message
      });
    }
  },

  /**
   * Récupérer les statistiques du tableau de bord
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getDashboardStats(req, res) {
    try {
      const Post = require('../models/post.model');
      const Subscriber = require('../models/newsletter.model').Subscriber;
      const Comment = require('../models/comment.model');
      
      // Statistiques générales
      const totalUsers = await User.countDocuments();
      const totalPosts = await Post.countDocuments();
      const publishedPosts = await Post.countDocuments({ status: 'publié' });
      const draftPosts = await Post.countDocuments({ status: 'brouillon' });
      const totalSubscribers = await Subscriber.countDocuments();
      const totalComments = await Comment.countDocuments();
      
      // Articles populaires (par vues)
      const popularPosts = await Post.find({ status: 'publié' })
        .sort({ views: -1 })
        .limit(5)
        .select('title views slug');
      
      // Articles récents
      const recentPosts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status createdAt slug');
      
      // Statistiques par catégorie
      const categoryStats = await Post.aggregate([
        { $match: { status: 'publié' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalPosts,
            publishedPosts,
            draftPosts,
            totalSubscribers,
            totalComments
          },
          popularPosts,
          recentPosts,
          categoryStats
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des statistiques',
        error: error.message
      });
    }
  },

  /**
   * Middleware pour restreindre l'accès selon le rôle
   * @param  {...String} roles - Rôles autorisés
   * @returns {Function} - Middleware Express
   */
  restrictTo(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action'
        });
      }
      next();
    };
  }
};

module.exports = authController;
