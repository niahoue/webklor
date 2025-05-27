const { Subscriber, Newsletter } = require('../models/newsletter.model');
const emailService = require('../utils/email.service');
const crypto = require('crypto');

/**
 * Contrôleur pour gérer les fonctionnalités de newsletter
 */
const newsletterController = {
  /**
   * S'abonner à la newsletter
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async subscribe(req, res) {
    try {
      const { email, firstName, lastName } = req.body;

      // Vérifier si l'abonné existe déjà
      let subscriber = await Subscriber.findOne({ email });

      if (subscriber) {
        // Si l'abonné existe mais s'est désabonné, on le réactive
        if (!subscriber.isActive) {
          subscriber.isActive = true;
          subscriber.unsubscribedAt = null;
          await subscriber.save();
          
          return res.status(200).json({
            success: true,
            message: "Votre abonnement a été réactivé avec succès.",
          });
        }
        
        return res.status(400).json({
          success: false,
          message: "Cette adresse email est déjà abonnée à notre newsletter.",
        });
      }

      // Génération d'un token de confirmation
      const confirmationToken = crypto.randomBytes(32).toString('hex');

      // Créer un nouvel abonné
      subscriber = new Subscriber({
        email,
        firstName,
        lastName,
        confirmationToken,
      });

      await subscriber.save();

      // Envoyer un email de confirmation
      await emailService.sendSubscriptionConfirmationEmail({
        email,
        firstName,
        lastName,
        confirmationToken,
      });

      res.status(201).json({
        success: true,
        message: "Merci de vous être abonné ! Veuillez vérifier votre boîte mail pour confirmer votre abonnement.",
      });
    } catch (error) {
      console.error("Erreur d'abonnement à la newsletter:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'abonnement à la newsletter.",
      });
    }
  },

  /**
   * Confirmer l'abonnement à la newsletter
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async confirmSubscription(req, res) {
    try {
      const { token } = req.params;

      const subscriber = await Subscriber.findOne({ confirmationToken: token });

      if (!subscriber) {
        return res.status(400).json({
          success: false,
          message: "Token de confirmation invalide ou expiré.",
        });
      }

      subscriber.confirmationToken = null;
      subscriber.confirmedAt = new Date();
      subscriber.isActive = true;
      
      await subscriber.save();

      // Rediriger vers une page de confirmation ou envoyer une réponse JSON
      res.status(200).json({
        success: true,
        message: "Votre abonnement a été confirmé avec succès.",
      });
    } catch (error) {
      console.error("Erreur de confirmation d'abonnement:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la confirmation de votre abonnement.",
      });
    }
  },

  /**
   * Se désabonner de la newsletter
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async unsubscribe(req, res) {
    try {
      const { token } = req.params;
      const { email } = req.query;

      const subscriber = await Subscriber.findOne({ email });

      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: "Abonné non trouvé.",
        });
      }

      subscriber.isActive = false;
      subscriber.unsubscribedAt = new Date();
      
      await subscriber.save();

      res.status(200).json({
        success: true,
        message: "Vous avez été désabonné avec succès.",
      });
    } catch (error) {
      console.error("Erreur de désabonnement:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors du désabonnement.",
      });
    }
  },

  /**
   * Créer une nouvelle newsletter (draft)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async createNewsletter(req, res) {
    try {
      const { subject, content, scheduledFor } = req.body;
      const userId = req.user.id;
      
      const newsletter = new Newsletter({
        subject,
        content,
        createdBy: userId,
        status: scheduledFor ? 'scheduled' : 'draft',
        scheduledFor: scheduledFor || null,
      });

      await newsletter.save();

      res.status(201).json({
        success: true,
        message: "Newsletter créée avec succès.",
        data: newsletter,
      });
    } catch (error) {
      console.error("Erreur de création de newsletter:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la création de la newsletter.",
      });
    }
  },

  /**
   * Obtenir toutes les newsletters
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllNewsletters(req, res) {
    try {
      const newsletters = await Newsletter.find()
        .sort({ createdAt: -1 })
        .populate('createdBy', 'username email');

      res.status(200).json({
        success: true,
        count: newsletters.length,
        data: newsletters,
      });
    } catch (error) {
      console.error("Erreur de récupération des newsletters:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la récupération des newsletters.",
      });
    }
  },

  /**
   * Obtenir une newsletter par son ID
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getNewsletterById(req, res) {
    try {
      const { id } = req.params;
      
      const newsletter = await Newsletter.findById(id)
        .populate('createdBy', 'username email');

      if (!newsletter) {
        return res.status(404).json({
          success: false,
          message: "Newsletter non trouvée.",
        });
      }

      res.status(200).json({
        success: true,
        data: newsletter,
      });
    } catch (error) {
      console.error("Erreur de récupération de la newsletter:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la récupération de la newsletter.",
      });
    }
  },

  /**
   * Mettre à jour une newsletter
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async updateNewsletter(req, res) {
    try {
      const { id } = req.params;
      const { subject, content, status, scheduledFor } = req.body;
      
      const newsletter = await Newsletter.findById(id);
      
      if (!newsletter) {
        return res.status(404).json({
          success: false,
          message: "Newsletter non trouvée.",
        });
      }

      // Vérifier si la newsletter peut être modifiée
      if (newsletter.status === 'sending' || newsletter.status === 'sent') {
        return res.status(400).json({
          success: false,
          message: "Impossible de modifier une newsletter déjà envoyée ou en cours d'envoi.",
        });
      }

      // Mettre à jour les champs
      newsletter.subject = subject || newsletter.subject;
      newsletter.content = content || newsletter.content;
      newsletter.status = status || newsletter.status;
      newsletter.scheduledFor = scheduledFor || newsletter.scheduledFor;

      await newsletter.save();

      res.status(200).json({
        success: true,
        message: "Newsletter mise à jour avec succès.",
        data: newsletter,
      });
    } catch (error) {
      console.error("Erreur de mise à jour de la newsletter:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la mise à jour de la newsletter.",
      });
    }
  },

  /**
   * Supprimer une newsletter
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async deleteNewsletter(req, res) {
    try {
      const { id } = req.params;
      
      const newsletter = await Newsletter.findById(id);
      
      if (!newsletter) {
        return res.status(404).json({
          success: false,
          message: "Newsletter non trouvée.",
        });
      }

      // Vérifier si la newsletter peut être supprimée
      if (newsletter.status === 'sending' || newsletter.status === 'sent') {
        return res.status(400).json({
          success: false,
          message: "Impossible de supprimer une newsletter déjà envoyée ou en cours d'envoi.",
        });
      }

      await Newsletter.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Newsletter supprimée avec succès.",
      });
    } catch (error) {
      console.error("Erreur de suppression de la newsletter:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la suppression de la newsletter.",
      });
    }
  },

  /**
   * Envoyer une newsletter
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async sendNewsletter(req, res) {
    try {
      const { id } = req.params;
      
      const newsletter = await Newsletter.findById(id);
      
      if (!newsletter) {
        return res.status(404).json({
          success: false,
          message: "Newsletter non trouvée.",
        });
      }

      // Vérifier si la newsletter peut être envoyée
      if (newsletter.status === 'sending' || newsletter.status === 'sent') {
        return res.status(400).json({
          success: false,
          message: "Cette newsletter a déjà été envoyée ou est en cours d'envoi.",
        });
      }

      // Récupérer tous les abonnés actifs
      const activeSubscribers = await Subscriber.find({
        isActive: true,
        confirmedAt: { $ne: null },
      });

      if (activeSubscribers.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Aucun abonné actif pour envoyer la newsletter.",
        });
      }

      // Mettre à jour le statut de la newsletter
      newsletter.status = 'sending';
      await newsletter.save();
      
      // Lancer l'envoi de la newsletter en arrière-plan
      // Dans une application en production, nous utiliserions une queue de tâches (comme Bull/Redis)
      setTimeout(async () => {
        try {
          const sentCount = await emailService.sendBulkNewsletter(newsletter, activeSubscribers);
          
          // Mettre à jour la newsletter avec les statistiques
          newsletter.status = 'sent';
          newsletter.sentAt = new Date();
          newsletter.recipients.count = sentCount;
          
          await newsletter.save();
          
          console.log(`Newsletter envoyée avec succès à ${sentCount} abonnés.`);
        } catch (error) {
          console.error("Erreur lors de l'envoi de la newsletter:", error);
          
          // Mettre à jour le statut en cas d'erreur
          newsletter.status = 'failed';
          await newsletter.save();
        }
      }, 0);

      res.status(200).json({
        success: true,
        message: "Envoi de la newsletter en cours...",
      });
    } catch (error) {
      console.error("Erreur d'envoi de la newsletter:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'envoi de la newsletter.",
      });
    }
  },
  
  /**
   * Obtenir la liste des abonnés avec pagination et filtres
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getSubscribers(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        search 
      } = req.query;
      
      // Construire la requête de filtrage
      const query = {};
      
      if (status) {
        if (status === 'active') {
          query.isActive = true;
        } else if (status === 'unsubscribed') {
          query.isActive = false;
        } else if (status === 'pending') {
          query.confirmationToken = { $ne: null };
        }
      }
      
      // Recherche par email ou nom
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const subscribers = await Subscriber.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
        
      const total = await Subscriber.countDocuments(query);

      res.status(200).json({
        success: true,
        count: subscribers.length,
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        data: subscribers.map(sub => ({
          _id: sub._id,
          email: sub.email,
          name: `${sub.firstName || ''} ${sub.lastName || ''}`.trim() || null,
          firstName: sub.firstName,
          lastName: sub.lastName,
          status: sub.isActive ? 'active' : (sub.confirmationToken ? 'pending' : 'unsubscribed'),
          createdAt: sub.createdAt,
          confirmedAt: sub.confirmedAt,
          unsubscribedAt: sub.unsubscribedAt
        }))
      });
    } catch (error) {
      console.error("Erreur de récupération des abonnés:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la récupération des abonnés."
      });
    }
  },
  
  /**
   * Obtenir les statistiques des abonnés
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getSubscriberStats(req, res) {
    try {
      const total = await Subscriber.countDocuments();
      const active = await Subscriber.countDocuments({ isActive: true });
      const unsubscribed = await Subscriber.countDocuments({ isActive: false, confirmationToken: null });
      const pending = await Subscriber.countDocuments({ confirmationToken: { $ne: null } });
      
      // Abonnements récents (7 derniers jours)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentSubscriptions = await Subscriber.countDocuments({
        createdAt: { $gte: weekAgo }
      });

      res.status(200).json({
        success: true,
        data: {
          total,
          active,
          unsubscribed,
          pending,
          recentSubscriptions
        }
      });
    } catch (error) {
      console.error("Erreur de récupération des statistiques:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la récupération des statistiques."
      });
    }
  },
  
  /**
   * Mettre à jour un abonné
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async updateSubscriber(req, res) {
    try {
      const { id } = req.params;
      const { email, firstName, lastName, status } = req.body;
      
      const subscriber = await Subscriber.findById(id);
      
      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: "Abonné non trouvé."
        });
      }
      
      // Mettre à jour les informations
      if (email) subscriber.email = email;
      if (firstName !== undefined) subscriber.firstName = firstName;
      if (lastName !== undefined) subscriber.lastName = lastName;
      
      // Gérer le changement de statut
      if (status) {
        switch (status) {
          case 'active':
            subscriber.isActive = true;
            subscriber.confirmationToken = null;
            subscriber.unsubscribedAt = null;
            if (!subscriber.confirmedAt) {
              subscriber.confirmedAt = new Date();
            }
            break;
          case 'unsubscribed':
            subscriber.isActive = false;
            subscriber.confirmationToken = null;
            subscriber.unsubscribedAt = new Date();
            break;
          case 'pending':
            subscriber.isActive = false;
            subscriber.confirmationToken = crypto.randomBytes(32).toString('hex');
            subscriber.confirmedAt = null;
            subscriber.unsubscribedAt = null;
            break;
        }
      }
      
      await subscriber.save();
      
      res.status(200).json({
        success: true,
        message: "Abonné mis à jour avec succès.",
        data: subscriber
      });
    } catch (error) {
      console.error("Erreur de mise à jour de l'abonné:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la mise à jour de l'abonné."
      });
    }
  },
  
  /**
   * Supprimer un abonné
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async deleteSubscriber(req, res) {
    try {
      const { id } = req.params;
      
      const subscriber = await Subscriber.findByIdAndDelete(id);
      
      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: "Abonné non trouvé."
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Abonné supprimé avec succès."
      });
    } catch (error) {
      console.error("Erreur de suppression de l'abonné:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la suppression de l'abonné."
      });
    }
  },
  
  /**
   * Changer le statut d'un abonné
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async changeSubscriberStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const subscriber = await Subscriber.findById(id);
      
      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: "Abonné non trouvé."
        });
      }
      
      // Valider le statut
      const validStatuses = ['active', 'unsubscribed', 'pending'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Statut invalide. Les statuts valides sont : " + validStatuses.join(', ')
        });
      }
      
      // Appliquer le changement de statut
      switch (status) {
        case 'active':
          subscriber.isActive = true;
          subscriber.confirmationToken = null;
          subscriber.unsubscribedAt = null;
          if (!subscriber.confirmedAt) {
            subscriber.confirmedAt = new Date();
          }
          break;
        case 'unsubscribed':
          subscriber.isActive = false;
          subscriber.confirmationToken = null;
          subscriber.unsubscribedAt = new Date();
          break;
        case 'pending':
          subscriber.isActive = false;
          subscriber.confirmationToken = crypto.randomBytes(32).toString('hex');
          subscriber.confirmedAt = null;
          subscriber.unsubscribedAt = null;
          break;
      }
      
      await subscriber.save();
      
      res.status(200).json({
        success: true,
        message: `Statut de l'abonné changé vers "${status}" avec succès.`,
        data: subscriber
      });
    } catch (error) {
      console.error("Erreur de changement de statut:", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors du changement de statut."
      });
    }
  },
};

module.exports = newsletterController;
