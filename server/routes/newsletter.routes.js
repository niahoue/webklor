const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Routes publiques
router.post('/subscribe', newsletterController.subscribe);
router.get('/confirm/:token', newsletterController.confirmSubscription);
router.get('/unsubscribe', newsletterController.unsubscribe);

// Routes protégées (admin)
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
