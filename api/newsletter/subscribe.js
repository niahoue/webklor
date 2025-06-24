// your-project-root/api/newsletter/subscribe.js
const dbConnect = require('../../utils/dbConnect');
const { Subscriber } = require('../../server/models/newsletter.model');
const emailService = require('../../server/utils/email.service');
const crypto = require('crypto');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'L\'email est obligatoire.' });
    }

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      // Si l'abonné existe mais s'est désabonné, on le réactive
      if (!subscriber.isActive && subscriber.unsubscribedAt) {
        subscriber.isActive = true;
        subscriber.unsubscribedAt = null;
        // On ne génère pas de nouveau token si l'utilisateur était déjà confirmé
        // ou si on souhaite le réactiver sans nouvelle confirmation.
        await subscriber.save();

        return res.status(200).json({
          success: true,
          message: 'Votre abonnement a été réactivé avec succès.'
        });
      } else if (subscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cette adresse email est déjà abonnée à notre newsletter.'
        });
      } else if (!subscriber.isActive && subscriber.confirmationToken) {
          // L'utilisateur a déjà tenté de s'abonner mais n'a pas confirmé.
          // On peut renvoyer le même message de succès et potentiellement renvoyer l'email de confirmation.
          await emailService.sendConfirmationEmail(subscriber, process.env.FRONTEND_URL); // Renvoie l'email
          return res.status(200).json({
              success: true,
              message: 'Cette adresse email est en attente de confirmation. Un nouvel email de confirmation vous a été envoyé.'
          });
      }
    }

    // Génération d'un token de confirmation
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Créer un nouvel abonné
    subscriber = new Subscriber({
      email,
      firstName,
      lastName,
      confirmationToken,
      isActive: false, // En attente de confirmation
      confirmedAt: null
    });

    await subscriber.save();

    // Envoyer l'email de confirmation
    await emailService.sendConfirmationEmail(subscriber, process.env.FRONTEND_URL);

    res.status(201).json({
      success: true,
      message: 'Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.'
    });
  } catch (error) {
    console.error('Erreur lors de l\'abonnement (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'abonnement',
      error: error.message
    });
  }
};