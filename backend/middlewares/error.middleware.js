// Middleware de gestion centralisée des erreurs Express
module.exports = (err, req, res, next) => {
  // Log détaillé en dev, minimal en prod
  if (process.env.NODE_ENV !== 'production') {
    console.error('Erreur Express:', err);
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
