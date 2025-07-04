// backend/routes/newsletter.routes.js

const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Routes publiques (sans authentification)
// POST /api/newsletters/subscribe - Pour s'abonner à la newsletter
router.post('/subscribe', newsletterController.subscribe);
// GET /api/newsletters/confirm/:token - Pour confirmer l'abonnement via email
router.get('/confirm/:token', newsletterController.confirmSubscription);
// GET /api/newsletters/unsubscribe - Pour se désabonner (via un lien dans l'email)
router.get('/unsubscribe', newsletterController.unsubscribe);

// Routes protégées (nécessitent authentification et rôle admin/editor)
// Les routes suivantes sont pour la gestion des newsletters et abonnés via l'interface admin

// Routes pour la gestion des campagnes de newsletters
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('admin', 'editor'), newsletterController.createNewsletter);
router.get('/', authMiddleware.protect, authMiddleware.restrictTo('admin', 'editor'), newsletterController.getAllNewsletters);
router.get('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin', 'editor'), newsletterController.getNewsletterById);
router.put('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin', 'editor'), newsletterController.updateNewsletter);
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), newsletterController.deleteNewsletter);
router.post('/:id/send', authMiddleware.protect, authMiddleware.restrictTo('admin'), newsletterController.sendNewsletter);

// Routes pour la gestion des abonnés
router.get('/subscribers/list', authMiddleware.protect, authMiddleware.restrictTo('admin', 'editor'), newsletterController.getSubscribers);
router.get('/subscribers/stats', authMiddleware.protect, authMiddleware.restrictTo('admin', 'editor'), newsletterController.getSubscriberStats);
router.put('/subscribers/:id', authMiddleware.protect, authMiddleware.restrictTo('admin', 'editor'), newsletterController.updateSubscriber);
router.delete('/subscribers/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), newsletterController.deleteSubscriber);
router.put('/subscribers/:id/status', authMiddleware.protect, authMiddleware.restrictTo('admin', 'editor'), newsletterController.changeSubscriberStatus);


module.exports = router;