// your-project-root/api/messages/index.js
const dbConnect = require('../../utils/dbConnect');
const Message = require('../../server/models/message.model');
const emailService = require('../../server/utils/email.service'); // Pour notifier les admins

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { fullName, email, phone, subject, message, consentGiven } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir tous les champs obligatoires (Nom, Email, Sujet, Message).'
      });
    }

    if (!consentGiven) {
      return res.status(400).json({
        success: false,
        message: 'Vous devez accepter la politique de confidentialité.'
      });
    }

    const newMessage = new Message({
      fullName,
      email,
      phone,
      subject,
      message,
      consentGiven,
      status: 'non lu' // Statut initial
    });

    await newMessage.save();

    // Envoyer une notification par email aux administrateurs
    // Assurez-vous que process.env.ADMIN_EMAIL_FOR_NOTIFICATIONS est configuré dans Vercel
    const adminEmail = process.env.ADMIN_EMAIL_FOR_NOTIFICATIONS;
    if (adminEmail) {
        const emailSubject = `Nouveau message de contact de: ${fullName}`;
        const emailBody = `
          Vous avez reçu un nouveau message via le formulaire de contact de WebKlor.<br><br>
          De: ${fullName}<br>
          Email: ${email}<br>
          Téléphone: ${phone || 'N/A'}<br>
          Sujet: ${subject}<br>
          Message: "${message}"<br><br>
          Statut: Non lu.<br>
          Veuillez vous connecter au tableau de bord pour le consulter.
        `;
        // Assurez-vous que votre emailService a une fonction `sendEmail` générique
        await emailService.sendEmail({
            to: adminEmail,
            subject: emailSubject,
            html: emailBody
        });
    }

    res.status(201).json({
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt !'
    });
  } catch (error) {
    console.error('Erreur lors de la création du message (public - Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi de votre message',
      error: error.message
    });
  }
};