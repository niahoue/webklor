const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  // Configuration du serveur
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // URL du frontend pour les liens dans les emails
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Configuration MongoDB
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/webklor',
  
  // Configuration email flexible
  email: {
    // Service email (gmail, outlook, yahoo, etc.) OU configuration SMTP personnalisée
    service: process.env.EMAIL_SERVICE,
    
    // Configuration SMTP personnalisée (alternative au service)
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : undefined,
    secure: process.env.EMAIL_SECURE === 'true', // true pour port 465, false pour autres
    
    // Authentification
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    
    // Adresses d'envoi et de réception
    from: process.env.EMAIL_FROM || `WebKlor <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    
    // Configuration avancée
    rateLimit: process.env.EMAIL_RATE_LIMIT ? parseInt(process.env.EMAIL_RATE_LIMIT) : 50,
    dailyLimit: process.env.EMAIL_DAILY_LIMIT ? parseInt(process.env.EMAIL_DAILY_LIMIT) : 500,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

 
};
