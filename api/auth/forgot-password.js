// your-project-root/api/auth/forgot-password.js
const dbConnect = require('../../utils/dbConnect');
const User = require('../../server/models/user.model');
const sendEmail = require('../../utils/email.service'); // Assurez-vous que le chemin est correct
const crypto = require('crypto');
const config = require('../../server/config/config'); // Pour accéder aux variables d'environnement

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir une adresse email'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Pour des raisons de sécurité, toujours renvoyer un succès
      // même si l'utilisateur n'est pas trouvé, pour éviter l'énumération d'emails.
      return res.status(200).json({
        success: true,
        message: 'Si un compte associé à cet email existe, un lien de réinitialisation a été envoyé.'
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hasher le token et l'enregistrer dans la base de données
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Définir une expiration de 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Construire l'URL de réinitialisation
    // NOTE: Pour Vercel, `req.protocol` et `req.get('host')` peuvent ne pas être fiables
    // ou ne pas pointer vers votre frontend. Il est préférable d'utiliser une variable d'environnement
    // pour l'URL de votre frontend. Exemple: process.env.FRONTEND_URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // Assurez-vous que process.env.FRONTEND_URL est défini dans vos variables d'environnement Vercel.

    const message = `
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Vous recevez cet email car vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Veuillez cliquer sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
      <a href="${resetURL}" target="_blank">Réinitialiser mon mot de passe</a>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
      <p>Cordialement,</p>
      <p>L'équipe WebKlor</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe WebKlor',
        html: message
      });

      res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé'
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false }); // Annuler les changements si l'envoi d'email échoue

      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation (Serverless):', emailError);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de réinitialisation. Veuillez réessayer plus tard.',
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation (Serverless):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la demande de réinitialisation',
      error: error.message
    });
  }
};