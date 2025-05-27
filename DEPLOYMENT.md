# 🚀 Guide de Déploiement - WebKlor

## Prérequis

- Node.js 18+ installé
- MongoDB configuré
- Serveur web (Apache/Nginx) ou service d'hébergement
- Nom de domaine configuré

## 📋 Étapes de Déploiement

### 1. Préparation du Build

```bash
# Cloner le repository
git clone https://github.com/votre-username/webklor.git
cd webklor

# Installer les dépendances
npm install
cd server && npm install && cd ..

# Créer le build de production
npm run build
```

### 2. Configuration de l'Environnement

Copiez `.env.example` vers `.env` et configurez les variables :

```bash
cp .env.example .env
```

Variables essentielles à configurer :
- `MONGODB_URI_PROD` - URL de votre base MongoDB de production
- `JWT_SECRET` - Clé secrète pour JWT (générez-en une forte)
- `EMAIL_USER` et `EMAIL_PASS` - Configuration email pour la newsletter
- `REACT_APP_API_URL_PROD` - URL de votre API en production

### 3. Déploiement Frontend

Le dossier `dist/` contient les fichiers statiques à déployer :

#### Option A: Serveur traditionnel (Apache/Nginx)
```bash
# Uploadez le contenu de dist/ vers votre serveur web
scp -r dist/* user@server:/var/www/webklor/
```

#### Option B: Services d'hébergement
- **Netlify** : Déployez directement depuis GitHub
- **Vercel** : Connect GitHub repository
- **GitHub Pages** : Activez dans les paramètres du repo

### 4. Déploiement Backend

```bash
# Sur votre serveur
git clone https://github.com/votre-username/webklor.git
cd webklor/server
npm install --production

# Configurez les variables d'environnement
cp ../.env.example .env
# Éditez .env avec vos valeurs de production

# Démarrez le serveur
npm start
```

### 5. Configuration du Serveur Web

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend
    location / {
        root /var/www/webklor;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📱 Services Recommandés

### Hébergement Frontend
- **Netlify** (gratuit) - Déploiement automatique depuis Git
- **Vercel** (gratuit) - Optimisé pour React
- **GitHub Pages** (gratuit) - Simple à configurer

### Hébergement Backend
- **Railway** - Simple et abordable
- **Render** - Gratuit avec limitations
- **DigitalOcean** - VPS classique
- **Heroku** - Platform-as-a-Service

### Base de Données
- **MongoDB Atlas** - Cloud MongoDB gratuit jusqu'à 512MB
- **Railway MongoDB** - Intégré avec l'hébergement

## 🔧 Scripts Utiles

```bash
# Build de production
npm run build

# Test du build localement
npm run preview

# Démarrage du serveur de développement
npm run dev

# Démarrage du serveur backend
cd server && npm start
```

## 🔍 Vérifications Post-Déploiement

- [ ] Site accessible via le nom de domaine
- [ ] Navigation entre les pages fonctionne
- [ ] Formulaire de contact envoie bien les emails
- [ ] Newsletter fonctionne
- [ ] Administration accessible et sécurisée
- [ ] Blog et commentaires opérationnels
- [ ] HTTPS configuré et forcé
- [ ] SEO et métadonnées correctes

## 🚨 Sécurité

- Changez tous les mots de passe par défaut
- Configurez HTTPS (Let's Encrypt gratuit)
- Limitez l'accès à l'administration
- Sauvegardez régulièrement la base de données
- Surveillez les logs d'erreur

## 📞 Support

Pour toute question sur le déploiement, contactez l'équipe WebKlor.
