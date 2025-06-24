// your-project-root/api/health.js
module.exports = async (req, res) => {
  // Cette fonction sera accessible via GET /api/health
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'success',
      message: 'API WebKlor fonctionne correctement (via Serverless Function)',
      timestamp: new Date()
    });
  } else {
    // Gérer les méthodes non autorisées
    res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }
};