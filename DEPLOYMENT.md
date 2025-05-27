# 🚀 Guide de Déploiement - WebKlor

## 📋 Vue d'ensemble

Ce document détaille les étapes de déploiement de l'application WebKlor, une plateforme web moderne développée avec React, Vite et MongoDB.

## 🏗️ Architecture

- **Frontend** : React 18 + Vite + Bootstrap 5
- **Backend** : Node.js + Express + MongoDB
- **Authentification** : JWT
- **Animations** : Framer Motion
- **SEO** : React Helmet Async

## 📦 Prérequis

### Environnement de développement
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0

### Variables d'environnement
Créer un fichier `.env` dans le dossier `server/` :

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/webklor
# ou pour MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webklor

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Email (pour la newsletter)
EMAIL_SERVICE=gmail
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# Configuration serveur
PORT=5000
NODE_ENV=production

# Frontend URL (pour CORS)
FRONTEND_URL=http://localhost:5173
```

## 🛠️ Installation

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/webklor.git
cd webklor
```

### 2. Installation des dépendances

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
```

### 3. Configuration de la base de données
```bash
# Démarrer MongoDB localement
mongod

# Ou connecter à MongoDB Atlas via MONGODB_URI
```

### 4. Initialisation de l'administrateur
```bash
cd server
node -e "
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webklor');

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123!', 12);
  await User.create({
    username: 'admin',
    email: 'admin@webklor.com',
    password: hashedPassword,
    role: 'admin'
  });
  console.log('Admin créé avec succès');
  process.exit(0);
}

createAdmin();
"
```

## 🚀 Déploiement

### Développement

#### Démarrer le backend
```bash
cd server
npm run dev
```

#### Démarrer le frontend
```bash
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:5000

### Production

#### 1. Build du frontend
```bash
npm run build
```

#### 2. Démarrer le serveur de production
```bash
cd server
npm start
```

## 🌐 Déploiement sur serveur

### Option 1 : Netlify (Frontend) + Railway/Render (Backend)

#### Frontend sur Netlify
1. Connecter le repository GitHub à Netlify
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Configurer les redirects pour SPA dans `public/_redirects` :
```
/*    /index.html   200
```

#### Backend sur Railway/Render
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer le dossier `server/`

### Option 2 : VPS/Serveur dédié

#### Avec PM2 (recommandé)
```bash
# Installation PM2
npm install -g pm2

# Configuration PM2
cd server
pm2 start server.js --name "webklor-api"

# Frontend avec serveur statique
cd ..
npm run build
pm2 serve dist 3000 --name "webklor-frontend" --spa

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

#### Avec Docker
```dockerfile
# Dockerfile pour le backend
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile
# Dockerfile pour le frontend
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Option 3 : Vercel (Full-stack)
```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel

# Configuration dans vercel.json
{
  "functions": {
    "server/server.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    { "src": "/api/(.*)", "dest": "/server/server.js" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## 🔧 Configuration Nginx (pour VPS)

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend
    location / {
        root /var/www/webklor/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔒 Sécurité

### Variables d'environnement sensibles
- ✅ JWT_SECRET : Générer une clé forte (32+ caractères)
- ✅ MONGODB_URI : Utiliser des credentials sécurisés
- ✅ EMAIL_PASS : Utiliser un mot de passe d'application

### Configuration MongoDB
```javascript
// Activer l'authentification
use admin
db.createUser({
  user: "webklor_admin",
  pwd: "mot_de_passe_securise",
  roles: ["readWriteAnyDatabase"]
})
```

### HTTPS (obligatoire en production)
```bash
# Avec Certbot (Let's Encrypt)
sudo certbot --nginx -d votre-domaine.com
```

## 📊 Monitoring

### Logs avec PM2
```bash
pm2 logs webklor-api
pm2 monit
```

### Métriques importantes
- Temps de réponse API
- Utilisation mémoire/CPU
- Erreurs 4xx/5xx
- Connexions MongoDB

## 🔄 Mise à jour

### Déploiement automatique avec GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy WebKlor
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to server
        # Ajouter les étapes de déploiement
```

## 🆘 Troubleshooting

### Erreurs communes

#### MongoDB connexion failed
```bash
# Vérifier le service MongoDB
sudo systemctl status mongod
sudo systemctl start mongod
```

#### Port already in use
```bash
# Trouver le processus utilisant le port
netstat -tulpn | grep :5000
kill -9 <PID>
```

#### Build errors
```bash
# Nettoyer le cache
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

Pour toute question ou problème de déploiement :
- 📧 Email : support@webklor.com
- 🐛 Issues : [GitHub Issues](https://github.com/votre-username/webklor/issues)

---

**Date de dernière mise à jour** : 27 mai 2025
**Version** : v1.0.0