const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('./logger');

/**
 * Service d'envoi d'emails avec configuration flexible et gestion d'erreurs améliorée
 */
const emailService = {
  /**
   * Création du transporteur email avec gestion des différents services
   */
  getTransporter() {
    try {
      // Configuration pour SMTP personnalisé
      if (config.email.host) {
        logger.info('🔧 Configuration SMTP personnalisée');
        return nodemailer.createTransport({
          host: config.email.host,
          port: config.email.port || 587,
          secure: config.email.secure || false, // true pour port 465, false pour autres
          auth: {
            user: config.email.user,
            pass: config.email.pass,
          },
          tls: {
            rejectUnauthorized: false // Pour les certificats auto-signés
          }
        });
      }

      // Configuration pour services tiers (Gmail, Outlook, etc.)
      logger.info(`🔧 Configuration service: ${config.email.service}`);
      return nodemailer.createTransport({
        service: config.email.service,
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } catch (error) {
      logger.error('❌ Erreur création transporteur:', error);
      throw error;
    }
  },
  /**
   * Envoi d'un email de notification pour un nouveau commentaire
   * @param {Object} comment - Données du commentaire
   * @param {Object} post - Données de l'article
   * @returns {Promise} - Résultat de l'envoi
   */
  async sendCommentNotificationEmail(comment, post) {
    try {
      logger.info(`📧 Envoi notification commentaire pour: ${comment.name}`);
      const transporter = this.getTransporter();

      // Gestion des destinataires multiples
      const recipients = config.email.to.split(',').map(email => email.trim());

      const mailOptions = {
        from: config.email.from,
        to: recipients,
        subject: `💬 Nouveau commentaire sur "${post.title}" - WebKlor`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
            <div style="background-color: #007BFF; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">💬 Nouveau Commentaire WebKlor</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">📝 Article:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${post.title}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">👤 Auteur:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${comment.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">📧 Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${comment.email}">${comment.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">💬 Type:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${comment.parentComment ? 'Réponse à un commentaire' : 'Commentaire principal'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">⏰ Date:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleString('fr-FR')}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px;">
                <h3 style="color: #333; border-bottom: 2px solid #007BFF; padding-bottom: 10px;">💬 Contenu du commentaire:</h3>
                <div style="background-color: #fff; padding: 15px; border-left: 4px solid #007BFF; margin: 10px 0; white-space: pre-wrap;">${comment.content}</div>
              </div>

              <div style="margin-top: 20px; padding: 15px; background-color: #e8f4ff; border-left: 4px solid #007BFF;">
                <h4 style="margin: 0 0 10px 0; color: #0056b3;">🚀 Actions rapides:</h4>
                <p style="margin: 5px 0;">
                  <a href="${process.env.FRONTEND_URL}/admin/comments" 
                     style="background-color: #007BFF; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    ✅ Modérer
                  </a>
                  <a href="mailto:${comment.email}?subject=Re: Votre commentaire sur ${encodeURIComponent(post.title)}" 
                     style="background-color: #28a745; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    ↩️ Répondre
                  </a>
                  <a href="${process.env.FRONTEND_URL}/blog/${post.slug}" 
                     style="background-color: #6c757d; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">
                    👁️ Voir l'article
                  </a>
                </p>
              </div>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              <p>© ${new Date().getFullYear()} WebKlor - Système automatique de notification</p>
            </div>
          </div>
        `,
        text: `
Nouveau commentaire WebKlor

Article: ${post.title}
Auteur: ${comment.name} <${comment.email}>
Type: ${comment.parentComment ? 'Réponse à un commentaire' : 'Commentaire principal'}
Date: ${new Date().toLocaleString('fr-FR')}

Contenu:
${comment.content}

---
Actions:
- Modérer: ${process.env.FRONTEND_URL}/admin/comments
- Répondre: ${comment.email}
- Voir l'article: ${process.env.FRONTEND_URL}/blog/${post.slug}
        `
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info('✅ Email de notification commentaire envoyé:', result.messageId);
      return result;
    } catch (error) {
      logger.error('❌ Erreur envoi notification commentaire:', error);
      throw error;
    }
  },
  
  /**
   * Validation des paramètres email
   */
  validateEmailConfig() {
    const requiredFields = ['user', 'pass', 'from', 'to'];
    const missingFields = requiredFields.filter(field => !config.email[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Configuration email incomplète. Champs manquants: ${missingFields.join(', ')}`);
    }
    
    if (!config.email.service && !config.email.host) {
      throw new Error('Vous devez spécifier soit EMAIL_SERVICE soit EMAIL_HOST dans le fichier .env');
    }

    logger.info('✅ Configuration email validée');
  },

  /**
   * Test de la connexion email
   */
  async testConnection() {
    try {
      logger.info('🔍 Test de la connexion email...');
      this.validateEmailConfig();
      const transporter = this.getTransporter();
      await transporter.verify();
      logger.info('✅ Connexion email réussie');
      return { success: true, message: 'Configuration email valide' };
    } catch (error) {
      logger.error('❌ Erreur de connexion email:', error.message);
      return { success: false, message: error.message };
    }
  },

  /**
   * Envoi d'un email de notification à l'équipe WebKlor (amélioré)
   * @param {Object} message - Message reçu du formulaire de contact
   * @returns {Promise} - Résultat de l'envoi
   */
  async sendNotificationEmail(message) {
    try {
      logger.info(`📧 Envoi notification email pour: ${message.fullName}`);
      const transporter = this.getTransporter();

      // Gestion des destinataires multiples
      const recipients = config.email.to.split(',').map(email => email.trim());

      const mailOptions = {
        from: config.email.from,
        to: recipients,
        subject: `🔔 Nouveau message WebKlor - ${message.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
            <div style="background-color: #007BFF; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">📧 Nouveau Message WebKlor</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">👤 Nom complet:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${message.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">📧 Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${message.email}">${message.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">📱 Téléphone:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${message.phone || 'Non fourni'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">📋 Sujet:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${message.subject}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; background-color: #f1f1f1;">⏰ Date:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleString('fr-FR')}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px;">
                <h3 style="color: #333; border-bottom: 2px solid #007BFF; padding-bottom: 10px;">💬 Message:</h3>
                <div style="background-color: #fff; padding: 15px; border-left: 4px solid #007BFF; margin: 10px 0; white-space: pre-wrap;">${message.message}</div>
              </div>

              <div style="margin-top: 20px; padding: 15px; background-color: #e8f4ff; border-left: 4px solid #007BFF;">
                <h4 style="margin: 0 0 10px 0; color: #0056b3;">🚀 Actions rapides:</h4>
                <p style="margin: 5px 0;">
                  <a href="mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}" 
                     style="background-color: #007BFF; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                    ↩️ Répondre
                  </a>
                  ${message.phone ? `<a href="tel:${message.phone}" style="background-color: #28a745; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">📞 Appeler</a>` : ''}
                </p>
              </div>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              <p>© ${new Date().getFullYear()} WebKlor - Système automatique de notification</p>
            </div>
          </div>
        `,
        // Ajout d'une version texte pour les clients qui ne supportent pas HTML
        text: `
Nouveau message WebKlor

De: ${message.fullName} <${message.email}>
Téléphone: ${message.phone || 'Non fourni'}
Sujet: ${message.subject}
Date: ${new Date().toLocaleString('fr-FR')}

Message:
${message.message}

---
Pour répondre: ${message.email}
        `
      };

      const result = await transporter.sendMail(mailOptions);
    logger.info('✅ Email de notification envoyé:', result.messageId);
      return result;
    } catch (error) {
      logger.error('❌ Erreur envoi notification:', error);
      throw error;
    }
  },

  /**
   * Envoi d'un email de confirmation à l'utilisateur (amélioré)
   * @param {Object} message - Message reçu du formulaire de contact
   * @returns {Promise} - Résultat de l'envoi
   */
  async sendConfirmationEmail(message) {
    try {
      logger.info(`📧 Envoi confirmation email à: ${message.email}`);
      const transporter = this.getTransporter();

      const mailOptions = {
        from: config.email.from,
        to: message.email,
        subject: `✅ Merci pour votre message - WebKlor`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #007BFF; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">WebKlor</h1>
              <p style="color: white; margin: 10px 0 0 0;">Agence Web & Marketing Digital</p>
            </div>
            <div style="padding: 30px; border: 1px solid #eee; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">✅ Message bien reçu !</h2>
              
              <p style="font-size: 16px; line-height: 1.6;">Bonjour <strong>${message.fullName}</strong>,</p>
              
              <p style="font-size: 16px; line-height: 1.6;">
                Nous vous remercions pour votre message concernant <strong>"${message.subject}"</strong>.
              </p>
              
              <div style="background-color: #e8f4ff; padding: 20px; border-left: 4px solid #007BFF; margin: 20px 0;">
                <h3 style="color: #0056b3; margin: 0 0 10px 0;">⏱️ Délai de réponse</h3>
                <p style="margin: 0;">Un membre de notre équipe vous répondra dans les <strong>24-48 heures</strong>.</p>
              </div>

              <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0;">📋 Récapitulatif de votre message:</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #6c757d;">
                  ${message.message.replace(/\n/g, '<br>')}
                </div>
              </div>

              <div style="background-color: #d4edda; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h3 style="color: #155724; margin: 0 0 10px 0;">🚀 En attendant notre réponse</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Consultez notre <a href="${config.frontendUrl}/portfolio" style="color: #007BFF;">portfolio</a></li>
                  <li>Découvrez nos <a href="${config.frontendUrl}/services" style="color: #007BFF;">services</a></li>
                  <li>Lisez nos <a href="${config.frontendUrl}/temoignages" style="color: #007BFF;">témoignages clients</a></li>
                </ul>
              </div>

              <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Cordialement,<br>
                <strong>L'équipe WebKlor</strong>
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${config.frontendUrl}" 
                   style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  🌐 Visiter notre site
                </a>
              </div>
            </div>
            <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p style="margin: 0 0 10px 0;"><strong>WebKlor - Agence Web & Marketing Digital</strong></p>
              <p style="margin: 0 0 10px 0;">📍 74 Rue des Balances, Marcory, Abidjan, Côte d'Ivoire</p>
              <p style="margin: 0 0 10px 0;">📧 contact@webklor.com | 🌐 www.webklor.com</p>
              <p style="margin: 0;">© ${new Date().getFullYear()} WebKlor. Tous droits réservés.</p>
            </div>
          </div>
        `,
        text: `
Merci pour votre message - WebKlor

Bonjour ${message.fullName},

Nous vous remercions pour votre message concernant "${message.subject}".
Un membre de notre équipe vous répondra dans les 24-48 heures.

Récapitulatif de votre message:
${message.message}

Cordialement,
L'équipe WebKlor

---
WebKlor - Agence Web & Marketing Digital
74 Rue des Balances, Marcory, Abidjan, Côte d'Ivoire
contact@webklor.com | www.webklor.com
        `
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info('✅ Email de confirmation envoyé:', result.messageId);
      return result;
    } catch (error) {
      logger.error('❌ Erreur envoi confirmation:', error);
      throw error;
    }
  },

  /**
   * Envoi d'un email de test pour vérifier la configuration
   */
  async sendTestEmail() {
    const testMessage = {
      fullName: 'Test User',
      email: config.email.user, // Envoyer à soi-même pour test
      phone: '+225 01 02 03 04 05',
      subject: 'Test de configuration Nodemailer',
      message: 'Ceci est un test automatique de la configuration email.\n\nSi vous recevez cet email, la configuration fonctionne correctement !\n\n✅ Configuration réussie'
    };

    try {
      logger.info('🧪 Envoi d\'un email de test...');
      await this.sendNotificationEmail(testMessage);
      logger.info('✅ Email de test envoyé avec succès');
      return { success: true, message: 'Email de test envoyé avec succès' };
    } catch (error) {
      logger.error('❌ Erreur lors du test:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Gestion des erreurs d'envoi avec retry automatique
   */
  async sendEmailWithRetry(emailFunction, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await emailFunction();
      } catch (error) {
        logger.info(`❌ Tentative ${i + 1}/${maxRetries} échouée:`, error.message);
        if (i === maxRetries - 1) throw error;
        
        // Attendre avant de réessayer (backoff exponentiel)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  },

  // ... Maintenir les autres méthodes existantes pour la newsletter
  async sendSubscriptionConfirmationEmail(subscriber) {
    const transporter = this.getTransporter();
    const confirmationUrl = `${config.frontendUrl}/confirm-subscription/${subscriber.confirmationToken}`;

    const mailOptions = {
      from: config.email.from,
      to: subscriber.email,
      subject: `Confirmez votre abonnement à la newsletter de WebKlor`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #007BFF; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">WebKlor</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee; background-color: #f9f9f9;">
            <h2>Merci pour votre abonnement${subscriber.firstName ? ', ' + subscriber.firstName : ''} !</h2>
            <p>Pour finaliser votre abonnement à notre newsletter, veuillez cliquer sur le bouton ci-dessous :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Confirmer mon abonnement
              </a>
            </div>
            <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
            <p>${confirmationUrl}</p>
            <p>À bientôt,</p>
            <p><strong>L'équipe WebKlor</strong></p>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} WebKlor. Tous droits réservés.</p>
            <p>74 Rue des Balances, Marcory, Abidjan, Côte d'Ivoire</p>
            <p>Si vous n'avez pas demandé cet abonnement, vous pouvez ignorer cet email.</p>
          </div>
        </div>
      `,
    };

    return transporter.sendMail(mailOptions);
  },

  async sendNewsletterToSubscriber(newsletter, subscriber) {
    const transporter = this.getTransporter();
    const unsubscribeUrl = `${config.frontendUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
    const trackingPixel = `<img src="${config.frontendUrl}/api/newsletters/track/${newsletter._id}/open?email=${encodeURIComponent(subscriber.email)}" width="1" height="1" alt="" style="display:none;"/>`;

    const mailOptions = {
      from: config.email.from,
      to: subscriber.email,
      subject: newsletter.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #007BFF; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">WebKlor</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee; background-color: #f9f9f9;">
            ${this.processNewsletterContent(newsletter.content, newsletter._id, subscriber.email)}
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} WebKlor. Tous droits réservés.</p>
            <p>74 Rue des Balances, Marcory, Abidjan, Côte d'Ivoire</p>
            <p>Vous recevez cet email car vous êtes abonné à notre newsletter.</p>
            <p><a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Se désabonner</a></p>
          </div>
          ${trackingPixel}
        </div>
      `,
    };

    return transporter.sendMail(mailOptions);
  },

  processNewsletterContent(content, newsletterId, subscriberEmail) {
    return content.replace(/<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["']([^>]*?)>(.*?)<\/a>/gi, (match, url, attrs, text) => {
      const trackingUrl = `${config.frontendUrl}/api/newsletters/track/${newsletterId}/click?email=${encodeURIComponent(subscriberEmail)}&url=${encodeURIComponent(url)}`;
      return `<a href="${trackingUrl}" ${attrs || ''}>${text}</a>`;
    });
  },
  async sendBulkNewsletter(newsletter, subscribers) {
    let sentCount = 0;
    for (const subscriber of subscribers) {
      try {
        await this.sendNewsletterToSubscriber(newsletter, subscriber);
        sentCount++;
      } catch (error) {
        console.error(`Erreur d'envoi de newsletter à ${subscriber.email}:`, error);
      }
    }
    return sentCount;
  },

  /**
   * Test de connexion email avec informations détaillées
   * @returns {Promise<Object>} - Résultat du test avec détails
   */
  async testEmailConnection() {
    try {
      logger.info('🔍 Test de connexion SMTP...');
      this.validateEmailConfig();
      
      const transporter = this.getTransporter();
      
      // Obtenir les informations de configuration
      const transporterOptions = transporter.options;
      
      // Tester la connexion
      await transporter.verify();
      
      logger.info('✅ Connexion SMTP réussie');
      
      return {
        success: true,
        message: 'Connexion SMTP réussie',
        server: transporterOptions.host || transporterOptions.service || 'Service par défaut',
        port: transporterOptions.port || (transporterOptions.service ? 'Automatique' : 'N/A'),
        secure: transporterOptions.secure || false,
        service: config.email.service || 'Custom SMTP'
      };
    } catch (error) {
      logger.error('❌ Erreur de connexion SMTP:', error.message);
      
      return {
        success: false,
        error: error.message,
        code: error.code || 'UNKNOWN',
        details: this.getErrorDiagnostics(error)
      };
    }
  },

  /**
   * Envoi d'un email de test
   * @param {string} recipient - Adresse email du destinataire
   * @returns {Promise<Object>} - Résultat de l'envoi
   */
  async sendTestEmail(recipient) {
    try {
      logger.info(`📧 Envoi d'email de test à: ${recipient}`);
      this.validateEmailConfig();
      
      const transporter = this.getTransporter();
      const testDate = new Date().toLocaleString('fr-FR');
      
      const mailOptions = {
        from: config.email.from,
        to: recipient,
        subject: `🧪 Test WebKlor - Configuration Email Réussie`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
            <div style="background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Test Réussi !</h1>
              <p style="color: white; margin: 15px 0 0 0; font-size: 18px;">Configuration Email WebKlor</p>
            </div>
            
            <div style="padding: 30px; background-color: #f8f9fa;">
              <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #28a745; margin-bottom: 20px; display: flex; align-items: center;">
                  ✅ Félicitations ! Votre configuration email fonctionne parfaitement
                </h2>
                
                <div style="background: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0;">
                  <h3 style="color: #1976d2; margin-top: 0;">📋 Détails du Test</h3>
                  <ul style="color: #333; line-height: 1.8;">
                    <li><strong>Service:</strong> ${config.email.service || 'SMTP Personnalisé'}</li>
                    <li><strong>Expéditeur:</strong> ${config.email.from}</li>
                    <li><strong>Destinataire:</strong> ${recipient}</li>
                    <li><strong>Date/Heure:</strong> ${testDate}</li>
                    <li><strong>Statut:</strong> <span style="color: #28a745; font-weight: bold;">✅ Envoyé avec succès</span></li>
                  </ul>
                </div>
                
                <div style="background: #f1f8e9; padding: 20px; border-radius: 6px; margin: 20px 0;">
                  <h3 style="color: #388e3c; margin-top: 0;">🚀 Prochaines Étapes</h3>
                  <ul style="color: #333; line-height: 1.8;">
                    <li>Votre formulaire de contact est maintenant opérationnel</li>
                    <li>Les messages des visiteurs seront automatiquement transmis</li>
                    <li>Les confirmations seront envoyées aux expéditeurs</li>
                    <li>Surveillez les logs pour le monitoring des envois</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${config.frontendUrl}/contact" 
                     style="background: #007BFF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    🌐 Tester le Formulaire de Contact
                  </a>
                </div>
              </div>
            </div>
            
            <div style="background: #343a40; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; opacity: 0.8;">
                Email de test généré automatiquement par WebKlor<br>
                <small>Si vous recevez cet email, votre configuration fonctionne ! 🎯</small>
              </p>
            </div>
          </div>
        `,
        text: `
🧪 TEST WEBKLOR - Configuration Email Réussie

✅ Félicitations ! Votre configuration email fonctionne parfaitement.

📋 Détails du Test:
- Service: ${config.email.service || 'SMTP Personnalisé'}
- Expéditeur: ${config.email.from}
- Destinataire: ${recipient}
- Date/Heure: ${testDate}
- Statut: ✅ Envoyé avec succès

🚀 Prochaines Étapes:
- Votre formulaire de contact est maintenant opérationnel
- Les messages des visiteurs seront automatiquement transmis
- Les confirmations seront envoyées aux expéditeurs
- Surveillez les logs pour le monitoring des envois

🌐 Testez votre formulaire: ${config.frontendUrl}/contact

---
Email de test généré automatiquement par WebKlor
Si vous recevez cet email, votre configuration fonctionne ! 🎯
        `
      };

      const result = await transporter.sendMail(mailOptions);
      logger.info('✅ Email de test envoyé avec succès:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        recipient: recipient,
        message: 'Email de test envoyé avec succès'
      };
      
    } catch (error) {
      logger.error('❌ Erreur envoi email de test:', error.message);
      
      return {
        success: false,
        error: error.message,
        code: error.code || 'UNKNOWN',
        details: this.getErrorDiagnostics(error)
      };
    }
  },

  /**
   * Diagnostics d'erreur pour aider au dépannage
   * @param {Error} error - Erreur à analyser
   * @returns {string} - Conseils de dépannage
   */
  getErrorDiagnostics(error) {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('authentication') || errorMessage.includes('auth')) {
      return 'Problème d\'authentification. Vérifiez vos EMAIL_USER et EMAIL_PASS. Pour Gmail/Outlook, utilisez un mot de passe d\'application.';
    }
    
    if (errorMessage.includes('connection') || errorMessage.includes('timeout')) {
      return 'Problème de connexion. Vérifiez votre connexion internet et les paramètres de pare-feu.';
    }
    
    if (errorMessage.includes('hostname') || errorMessage.includes('host')) {
      return 'Serveur SMTP introuvable. Vérifiez EMAIL_HOST ou EMAIL_SERVICE.';
    }
    
    if (errorMessage.includes('certificate') || errorMessage.includes('tls')) {
      return 'Problème de certificat SSL/TLS. Essayez avec EMAIL_SECURE=false ou contactez votre fournisseur.';
    }
    
    if (errorMessage.includes('rate') || errorMessage.includes('limit')) {
      return 'Limite de taux atteinte. Attendez quelques minutes avant de réessayer.';
    }
      return 'Erreur inconnue. Consultez la documentation ou contactez le support technique.';
  }
};

module.exports = emailService;
