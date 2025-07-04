// backend/controllers/testimonial.controller.js

const Testimonial = require('../models/testimonial.model');
const logger = require('../utils/logger'); 

const testimonialController = {
  /**
   * Soumettre un nouveau témoignage (public)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async submitTestimonial(req, res) {
    try {
      const { author, company, email, content, rating } = req.body;

      if (!author || !email || !content || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir tous les champs obligatoires (auteur, email, contenu, note).'
        });
      }

      const newTestimonial = new Testimonial({
        author,
        company,
        email,
        content,
        rating,
        isApproved: false // Toujours non approuvé par défaut lors de la soumission initiale
      });

      await newTestimonial.save();

      logger.info(`Nouveau témoignage soumis par ${author} (${email}). En attente d'approbation.`);
      res.status(201).json({
        success: true,
        message: 'Votre témoignage a été soumis avec succès et est en attente de modération.',
        data: newTestimonial
      });
    } catch (error) {
      logger.error("Erreur lors de la soumission du témoignage:", error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: error.message,
          errors: error.errors
        });
      }
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la soumission de votre témoignage.',
        error: error.message
      });
    }
  },

  /**
   * Récupérer tous les témoignages approuvés (public)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllApprovedTestimonials(req, res) {
    try {
      const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 }); // Tri par les plus récents
      res.status(200).json({
        success: true,
        count: testimonials.length,
        data: testimonials
      });
    } catch (error) {
      logger.error("Erreur lors de la récupération des témoignages approuvés:", error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des témoignages.',
        error: error.message
      });
    }
  },

  /**
   * Récupérer tous les témoignages (pour l'admin, inclut non approuvés)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllTestimonialsAdmin(req, res) {
    try {
      const testimonials = await Testimonial.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        count: testimonials.length,
        data: testimonials
      });
    } catch (error) {
      logger.error("Erreur lors de la récupération de tous les témoignages (Admin):", error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des témoignages.',
        error: error.message
      });
    }
  },

  /**
   * Mettre à jour le statut d'un témoignage (admin)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async updateTestimonialStatus(req, res) {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;

      if (typeof isApproved !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Le statut d\'approbation doit être un booléen (true/false).'
        });
      }

      const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { isApproved, approvedAt: isApproved ? new Date() : null },
        { new: true, runValidators: true }
      );

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Témoignage non trouvé.'
        });
      }

      logger.info(`Témoignage ${id} mis à jour. Statut: ${isApproved ? 'Approuvé' : 'Non Approuvé'}`);
      res.status(200).json({
        success: true,
        message: `Témoignage ${isApproved ? 'approuvé' : 'désapprouvé'} avec succès.`,
        data: testimonial
      });
    } catch (error) {
      logger.error("Erreur lors de la mise à jour du statut du témoignage:", error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour du statut du témoignage.',
        error: error.message
      });
    }
  },

  /**
   * Supprimer un témoignage (admin)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async deleteTestimonial(req, res) {
    try {
      const { id } = req.params;
      const testimonial = await Testimonial.findByIdAndDelete(id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Témoignage non trouvé.'
        });
      }

      logger.info(`Témoignage ${id} supprimé.`);
      res.status(200).json({
        success: true,
        message: 'Témoignage supprimé avec succès.'
      });
    } catch (error) {
      logger.error("Erreur lors de la suppression du témoignage:", error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression du témoignage.',
        error: error.message
      });
    }
  }
};

module.exports = testimonialController;