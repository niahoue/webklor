// your-project-root/api/admin/newsletter/[id]/status.js
const dbConnect = require('../../../../utils/dbConnect');
const { Subscriber } = require('../../../../server/models/newsletter.model');
const { protect, restrictTo } = require('../../../../server/utils/authServerless');
const crypto = require('crypto'); // Pour regénérer le token si nécessaire

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const authenticatedUser = await protect(req, res);
  if (!authenticatedUser) {
    return;
  }

  const isAuthorized = restrictTo(req, res, ['admin']);
  if (!isAuthorized) {
    return;
  }

  try {
    const { id } = req.query;
    const { status } = req.body;

    const subscriber = await Subscriber.findById(id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Abonné non trouvé.' });
    }

    const validStatuses = ['active', 'unsubscribed', 'pending'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Les statuts valides sont : ${validStatuses.join(', ')}`
      });
    }

    // Appliquer le changement de statut
    switch (status) {
      case 'active':
        subscriber.isActive = true;
        subscriber.confirmationToken = undefined;
        subscriber.unsubscribedAt = undefined;
        if (!subscriber.confirmedAt) {
          subscriber.confirmedAt = new Date();
        }
        break;
      case 'unsubscribed':
        subscriber.isActive = false;
        subscriber.confirmationToken = undefined;
        subscriber.unsubscribedAt = new Date();
        break;
      case 'pending':
        subscriber.isActive = false;
        // Regénérer un token si on le remet en pending
        subscriber.confirmationToken = crypto.randomBytes(32).toString('hex');
        subscriber.confirmedAt = undefined;
        subscriber.unsubscribedAt = undefined;
        // Optionnel: renvoyer l'email de confirmation ici
        // await emailService.sendConfirmationEmail(subscriber, process.env.FRONTEND_URL);
        break;
    }

    await subscriber.save();

    res.status(200).json({
      success: true,
      message: `Statut de l'abonné changé vers "${status}" avec succès.`,
      data: subscriber
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut de l\'abonné (Admin - Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors du changement de statut de l\'abonné',
      error: error.message
    });
  }
};