// backend/routes/testimonial.routes.js

const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // Si vous avez un middleware d'authentification

/**
 * Routes pour la gestion des témoignages
 */

// Route publique pour soumettre un nouveau témoignage
// POST /api/testimonials
router.post('/testimonials', testimonialController.submitTestimonial);

// Route publique pour récupérer tous les témoignages approuvés
// GET /api/testimonials
router.get('/testimonials', testimonialController.getAllApprovedTestimonials);


// Routes d'administration (protégées par authentification et rôle)
// Toutes les routes admin nécessitent une authentification et un rôle 'admin' ou 'editor'
router.use('/admin/testimonials', authMiddleware.protect);

// GET /api/admin/testimonials - Récupérer tous les témoignages (y compris non approuvés)
router.get('/admin/testimonials', authMiddleware.restrictTo('admin', 'editor'), testimonialController.getAllTestimonialsAdmin);

// PUT /api/admin/testimonials/:id/status - Mettre à jour le statut d'approbation d'un témoignage
router.put('/admin/testimonials/:id/status', authMiddleware.restrictTo('admin', 'editor'), testimonialController.updateTestimonialStatus);

// DELETE /api/admin/testimonials/:id - Supprimer un témoignage
router.delete('/admin/testimonials/:id', authMiddleware.restrictTo('admin'), testimonialController.deleteTestimonial);

module.exports = router;