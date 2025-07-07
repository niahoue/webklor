const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('./middlewares/helmet.middleware');
const rateLimit = require('./middlewares/rateLimit.middleware');
const compression = require('./middlewares/compression.middleware');
const corsStrict = require('./middlewares/cors.middleware');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const config = require('./config/config');

// Import des routes
const messageRoutes = require('./routes/message.routes');
const postRoutes = require('./routes/post.routes');
const authRoutes = require('./routes/auth.routes');
const commentRoutes = require('./routes/comment.routes');
const newsletterRoutes = require('./routes/newsletter.routes');
const setupRoutes = require('./routes/setup.routes');
const adminRoutes = require('./routes/admin.routes');
const testimonialRoutes = require('./routes/testimonial.routes');

// Initialisation de l'application Express
const app = express();

app.set('trust proxy', 1);
// Configuration des middlewares
app.use(corsStrict);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet);
app.use(rateLimit);
app.use(compression);

// Configuration des routes
app.use('/api', messageRoutes);
app.use('/api', postRoutes);
app.use('/api', authRoutes);
app.use('/api', commentRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api', setupRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', testimonialRoutes);
// Route de test API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API WebKlor fonctionne correctement',
    timestamp: new Date()
  });
});
 app.use((req, res, next) => {
      // Si la requête commence par /api, renvoyer une réponse JSON 404
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
          success: false,
          message: `Route API non trouvée: ${req.method} ${req.originalUrl}`
        });
      }
      // Pour les autres requêtes (non-API), vous pouvez renvoyer une page HTML 404
      // ou simplement passer la main au prochain middleware (qui pourrait être votre errorHandler)
      res.status(404).send('<h1>404 - Page non trouvée</h1><p>La ressource demandée n\'existe pas.</p>');
    });

 app.use(errorHandler);
// Connexion à MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info('Connecté à MongoDB avec succès');
    
    // Démarrage du serveur
    const server = app.listen(config.port, () => {
      logger.info(`Serveur démarré sur le port ${config.port} en mode ${config.nodeEnv}`);
    });
    
    // Gestion des erreurs non prévues
    process.on('unhandledRejection', (err) => {
      logger.error('ERREUR NON GÉRÉE:', err.message);
      logger.error(err.stack);
      
      // Fermeture propre du serveur
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch(err => {
    logger.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  });
