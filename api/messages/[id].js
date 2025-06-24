// your-project-root/api/admin/messages/[id].js
const dbConnect = require('../../utils/dbConnect');
const Message = require('../../server/models/message.model');
const { protect, restrictTo } = require('../../utils/authServerLess');

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

  if (req.method === 'GET') {
    // Logique GET
    try {
      const message = await Message.findById(id);

      if (!message) {
        return res.status(404).json({ success: false, message: 'Message non trouvé.' });
      }

      // Optionnel: marquer le message comme 'lu' lors de la consultation
      if (message.status === 'non lu') {
        message.status = 'lu';
        await message.save();
      }

      res.status(200).json({ success: true, data: message });
    } catch (error) {
      console.error('Erreur lors de la récupération du message par ID (Admin - Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération du message',
        error: error.message
      });
    }
  } else if (req.method === 'PUT') {
    // Logique PUT (updateMessageStatus)
    try {
      const { status } = req.body;

      const validStatuses = ['lu', 'non lu', 'archivé'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Statut invalide. Les statuts valides sont : ${validStatuses.join(', ')}`
        });
      }

      const message = await Message.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!message) {
        return res.status(404).json({ success: false, message: 'Message non trouvé.' });
      }

      res.status(200).json({
        success: true,
        message: `Statut du message changé vers "${status}" avec succès.`,
        data: message
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du message (Admin - Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour du statut du message',
        error: error.message
      });
    }
  } else if (req.method === 'DELETE') {
    // Logique DELETE (deleteMessage)
    try {
      const message = await Message.findByIdAndDelete(id);

      if (!message) {
        return res.status(404).json({ success: false, message: 'Message non trouvé.' });
      }

      res.status(200).json({ success: true, message: 'Message supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression du message (Admin - Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression du message',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};