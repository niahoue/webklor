// backend/models/testimonial.model.js

const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Le nom de l\'auteur est requis'],
    trim: true,
    maxlength: [100, 'Le nom de l\'auteur ne peut pas dépasser 100 caractères']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères'],
    default: ''
  },
  email: {
    type: String,
    required: [true, 'L\'adresse email est requise'],
    unique: false, // Peut avoir plusieurs témoignages avec le même email, mais chaque témoignage est unique
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Veuillez utiliser une adresse email valide']
  },
  content: {
    type: String,
    required: [true, 'Le contenu du témoignage est requis'],
    minlength: [10, 'Le témoignage doit contenir au moins 10 caractères'],
    maxlength: [500, 'Le témoignage ne peut pas dépasser 500 caractères']
  },
  rating: {
    type: Number,
    required: [true, 'La note est requise'],
    min: [1, 'La note doit être d\'au moins 1 étoile'],
    max: [5, 'La note ne peut pas dépasser 5 étoiles']
  },
  isApproved: {
    type: Boolean,
    default: false // Les témoignages sont en attente d'approbation par défaut
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date,
    default: null
  }
});

// Index pour améliorer les performances des requêtes
testimonialSchema.index({ isApproved: 1, createdAt: -1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;