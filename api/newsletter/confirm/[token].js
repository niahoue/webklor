// your-project-root/api/newsletter/confirm/[token].js
const dbConnect = require('../../../utils/dbConnect');
const { Subscriber } = require('../../../server/models/newsletter.model');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { token } = req.query; // Récupérer le token

    const subscriber = await Subscriber.findOne({
      confirmationToken: token,
      isActive: false // S'assurer qu'il est bien en attente de confirmation
    });

    if (!subscriber) {
      return res.status(400).json({
        success: false,
        message: 'Lien de confirmation invalide ou déjà utilisé.'
      });
    }

    subscriber.isActive = true;
    subscriber.confirmedAt = new Date();
    subscriber.confirmationToken = undefined; // Supprimer le token
    await subscriber.save();

    // Redirection vers une page de succès sur votre frontend
    // Cela dépend de votre configuration. Par exemple:
    // res.redirect(`${process.env.FRONTEND_URL}/newsletter-success?status=confirmed`);
    // Ou simplement renvoyer un JSON si le frontend gère la redirection lui-même:
    res.status(200).json({
      success: true,
      message: 'Votre abonnement à la newsletter a été confirmé avec succès !'
    });
  } catch (error) {
    console.error('Erreur lors de la confirmation de l\'abonnement (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la confirmation de l\'abonnement',
      error: error.message
    });
  }
};