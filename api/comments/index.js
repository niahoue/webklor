// your-project-root/api/comments/index.js
const dbConnect = require('../../utils/dbConnect');
const Comment = require('../../server/models/comment.model');
const Post = require('../../server/models/post.model'); // Pour vérifier l'existence de l'article
const sendEmail = require('../.././server/utils/email.service'); // Pour notifier les admins

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method === 'POST') {
    // Logique POST (createComment)
    try {
      const { post: postId, parentComment, authorName, authorEmail, content } = req.body;

      if (!postId || !authorName || !authorEmail || !content) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs obligatoires (article, nom, email, contenu) sont requis.'
        });
      }

      // Vérifier si l'article existe
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Article non trouvé.' });
      }

      // Si c'est une réponse, vérifier le commentaire parent
      let parentCommentObj = null;
      if (parentComment) {
        parentCommentObj = await Comment.findById(parentComment);
        if (!parentCommentObj) {
          return res.status(404).json({ success: false, message: 'Commentaire parent non trouvé.' });
        }
      }

      const newComment = await Comment.create({
        post: postId,
        parentComment,
        authorName,
        authorEmail,
        content,
        status: 'en attente' // Tous les nouveaux commentaires sont en attente de modération
      });

      // Si c'est une réponse, l'ajouter au tableau des réponses du parent
      if (parentCommentObj) {
          parentCommentObj.replies.push(newComment._id);
          await parentCommentObj.save();
      }

      // Envoyer une notification aux administrateurs (ou propriétaires de l'article)
      // Ceci nécessite une logique pour récupérer les admins ou l'auteur de l'article
      // et l'adresse email de l'administrateur configurée dans les variables d'environnement.
      const adminEmail = process.env.ADMIN_EMAIL_FOR_NOTIFICATIONS; // Assurez-vous que cette variable est définie
      if (adminEmail) {
          const emailSubject = `Nouveau commentaire en attente sur l'article: "${post.title}"`;
          const emailBody = `
            Un nouveau commentaire a été soumis par ${authorName} (${authorEmail}) sur l'article "${post.title}".<br>
            Contenu: "${content}"<br>
            Statut: En attente de modération.<br><br>
            Veuillez vous connecter au tableau de bord pour le modérer.
          `;
          await sendEmail({
              to: adminEmail,
              subject: emailSubject,
              html: emailBody
          });
      }

      res.status(201).json({
        success: true,
        message: 'Commentaire soumis avec succès et en attente de modération.',
        data: newComment
      });
    } catch (error) {
      console.error('Erreur lors de la création du commentaire (public - Serverless):', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la soumission du commentaire',
        error: error.message
      });
    }
  } else if (req.method === 'GET') {
    // Logique GET (getAllComments pour le public, si applicable)
    // Généralement, les commentaires publics sont récupérés par article.
    // Cette route `/api/comments` sans paramètre est moins courante pour le public.
    // Vous pouvez choisir de ne pas implémenter de GET ici, ou de lister tous les commentaires approuvés.
    // Pour l'instant, je vais laisser cette partie vide ou la faire retourner une erreur Method Not Allowed.
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};