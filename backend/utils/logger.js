// Configuration du logger (remplace console.log en production)
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.MODE === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // Ajoutez un fichier log en production si besoin
     new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

module.exports = logger;
