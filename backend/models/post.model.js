const mongoose = require('mongoose');

/**
 * Schéma pour les articles de blog
 */
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
    },
    slug: {
      type: String,
      required: [true, 'Le slug est obligatoire'],
      unique: true,
      trim: true,
      lowercase: true
    },
    content: {
      type: String,
      required: [true, 'Le contenu est obligatoire']
    },
    excerpt: {
      type: String,
      required: [true, 'L\'extrait est obligatoire'],
      maxlength: [500, 'L\'extrait ne peut pas dépasser 500 caractères']
    },
    featuredImage: {
      type: String,
      default: '/assets/images/default-blog-image.jpg'
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      enum: ['Développement Web', 'SEO', 'Marketing Digital', 'Design', 'Technologie', 'Astuces', 'Actualités']
    },
    tags: [String],
    author: {
      type: String,
      required: [true, 'L\'auteur est obligatoire'],
      default: 'Équipe WebKlor'
    },
    status: {
      type: String,
      enum: ['brouillon', 'publié', 'archivé'],
      default: 'brouillon'
    },
    readTime: {
      type: Number,
      default: 5
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Méthode pour générer automatiquement un slug à partir du titre
postSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Supprimer tous les caractères non-word (non-alphanumérique)
      .replace(/[\s_-]+/g, '-') // Remplacer les espaces et underscores par des tirets
      .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin de chaîne
  }
  next();
});

// Ajouter une méthode pour incrémenter les vues
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
