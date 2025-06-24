// your-project-root/api/newsletter/unsubscribe.js
const dbConnect = require('../../utils/dbConnect');
const { Subscriber } = require('../../server/models/newsletter.model');
const emailService = require('../../server/utils/email.service'); // Pour l'email de confirmation de désabonnement

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'L\'email est obligatoire.' });
    }

    const subscriber = await Subscriber.findOne({ email, isActive: true });

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Abonné non trouvé ou déjà désabonné.' });
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    subscriber.confirmationToken = undefined; // S'assurer que le token est retiré
    await subscriber.save();

    // Optionnel: Envoyer un email de confirmation de désabonnement
    // Assurez-vous que cette fonction sendUnsubscribeConfirmationEmail existe dans votre email.service.js
    await emailService.sendUnsubscribeConfirmationEmail(subscriber);

    res.status(200).json({
      success: true,
      message: 'Vous avez été désabonné de la newsletter avec succès.'
    });
  } catch (error) {
    console.error('Erreur lors du désabonnement (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors du désabonnement',
      error: error.message
    });
  }
};