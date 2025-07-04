const mongoose = require('mongoose');

/**
 * Schema pour les abonnés à la newsletter
 */
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "L'adresse email est requise"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir une adresse email valide'],
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    confirmationToken: {
      type: String,
      default: null,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Schema pour les newsletters envoyées
 */
const newsletterSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Le sujet est requis'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Le contenu est requis'],
    },
    sentAt: {
      type: Date,
      default: null,
    },
    recipients: {
      count: {
        type: Number,
        default: 0,
      },
      opens: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
      default: 'draft',
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = {
  Subscriber,
  Newsletter,
};
