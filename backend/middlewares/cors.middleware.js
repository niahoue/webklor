// Middleware de configuration CORS strict pour la production
const cors = require('cors');
const config = require('../config/config');

const allowedOrigins = [
  config.frontendUrl,
  'https://webklor.com',
  'https://webklor.vercel.app',
  'http://localhost:5174',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autorise les requêtes sans origin (ex: Postman, requêtes du même domaine)
    // ou si l'origine est whitelistée
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS - Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 heures
};

module.exports = cors(corsOptions);