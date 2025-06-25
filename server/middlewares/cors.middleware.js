// Middleware de configuration CORS strict pour la production
const cors = require('cors');
const config = require('../config/config');

const allowedOrigins = [
  config.frontendUrl,
  // Ajoutez d'autres domaines autorisés si besoin
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autorise les requêtes sans origin (ex: Postman) ou si l'origine est whitelistée
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
