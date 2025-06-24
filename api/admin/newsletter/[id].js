// your-project-root/api/admin/newsletter/[id].js
const dbConnect = require('../../../utils/dbConnect');
const { Subscriber } = require('../../../server/models/newsletter.model');
const { protect, restrictTo } = require('../../../server/utils/authServerless');

module.exports = async (req, res) => {
  await dbConnect();

  const { id } = req.query;

  const authenticatedUser = await protect(req, res);
  if (!authenticatedUser) {
    return;
  }

  const isAuthorized = restrictTo(req, res, ['admin']);
  if (!isAuthorized) {
    return;
  }

  if (req.method === 'DELETE') {
    // Logique DELETE
    try {
      const subscriber = await Subscriber.findByIdAndDelete(id);

      if (!subscriber) {
        return res.status(404).json({ success: false, message: 'Abonné non trouvé.' });
      }

      res.status(200).json({ success: true, message: 'Abonné supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'abonné (Admin - Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression de l\'abonné',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};