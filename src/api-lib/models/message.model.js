const mongoose = require('mongoose');

/**
 * Schéma de message pour les contacts clients
 */
const messageSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide'],
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Le sujet est obligatoire'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Le message est obligatoire'],
      trim: true,
    },
    consentGiven: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['nouveau', 'en_cours', 'traité'],
      default: 'nouveau'
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
