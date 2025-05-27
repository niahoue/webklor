# Script PowerShell pour créer un utilisateur administrateur WebKlor
# Usage: .\create-admin-user.ps1

Write-Host "🚀 Création d'un utilisateur administrateur pour WebKlor" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Vérifier si Node.js est installé
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Error "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
}

Write-Host "✅ Node.js détecté : $nodeVersion" -ForegroundColor Yellow

# Naviguer vers le dossier server
Set-Location "server"

# Vérifier si les dépendances sont installées
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Demander les informations d'administrateur
$username = Read-Host "Nom d'utilisateur admin (par défaut: admin)"
if (-not $username) { $username = "admin" }

$email = Read-Host "Email admin (par défaut: admin@webklor.com)"
if (-not $email) { $email = "admin@webklor.com" }

$password = Read-Host "Mot de passe admin (par défaut: admin123!)"
if (-not $password) { $password = "admin123!" }

# Créer le script Node.js temporaire
$createAdminScript = @"
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');

// Connexion à MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/webklor';
mongoose.connect(mongoUri);

async function createAdmin() {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ username: '$username' });
    if (existingAdmin) {
      console.log('⚠️  Un utilisateur avec ce nom existe déjà');
      process.exit(1);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('$password', 12);

    // Créer l'utilisateur admin
    const admin = await User.create({
      username: '$username',
      email: '$email',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    console.log('🔐 Mot de passe:', '$password');
    console.log('');
    console.log('🌐 Vous pouvez maintenant vous connecter à l\'interface d\'administration');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
"@

# Sauvegarder le script temporaire
$createAdminScript | Out-File -FilePath "temp-create-admin.js" -Encoding UTF8

Write-Host "👤 Création de l'utilisateur administrateur..." -ForegroundColor Yellow

# Exécuter le script
node temp-create-admin.js

# Supprimer le script temporaire
Remove-Item "temp-create-admin.js" -Force

Write-Host "🎉 Configuration terminée !" -ForegroundColor Green
Write-Host "Vous pouvez maintenant démarrer l'application avec 'npm run dev'" -ForegroundColor Green

# Retourner au dossier parent
Set-Location ".."
