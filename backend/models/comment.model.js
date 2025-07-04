const mongoose = require('mongoose');

/**
 * Schéma pour les commentaires d'articles
 */
const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, "L'article est obligatoire"]
    },
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Veuillez entrer une adresse email valide'
      ]
    },
    content: {
      type: String,
      required: [true, 'Le contenu du commentaire est obligatoire'],
      trim: true,
      maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
    },
    status: {
      type: String,
      enum: ['en attente', 'approuvé', 'rejeté'],
      default: 'en attente'
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuel pour les réponses à ce commentaire
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

// Middleware pour transformer les réponses en cascade
commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'replies',
    select: 'name content status createdAt',
    match: { status: 'approuvé' }
  });
  
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
