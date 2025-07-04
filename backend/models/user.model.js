const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Schéma pour les utilisateurs administrateurs
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Veuillez entrer une adresse email valide'
      ]
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
      select: false // Ne pas retourner le mot de passe par défaut
    },
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire']
    },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'editor'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Middleware pour crypter le mot de passe avant de l'enregistrer
userSchema.pre('save', async function(next) {
  // Ne hash le mot de passe que s'il est modifié (ou nouveau)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Générer un salt avec 12 rounds
    const salt = await bcrypt.genSalt(12);
    
    // Hasher le mot de passe avec le salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un token JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
