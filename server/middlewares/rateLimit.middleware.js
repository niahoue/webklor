// Middleware de limitation de requêtes (anti-bruteforce/DDOS)
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
