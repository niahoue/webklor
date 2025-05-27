# 🚀 Guide de Démarrage Rapide - WebKlor

## Installation en 5 minutes

### 1. Prérequis
- [Node.js 18+](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) ou compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Git](https://git-scm.com/)

### 2. Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/webklor.git
cd webklor

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd server
npm install
cd ..
```

### 3. Configuration

```bash
# Copier le fichier d'exemple d'environnement
copy .env.example server\.env

# Modifier server\.env avec vos configurations
```

### 4. Base de données

#### Option A : MongoDB local
```bash
# Démarrer MongoDB
mongod
```

#### Option B : MongoDB Atlas
```bash
# Remplacer MONGODB_URI dans server\.env par votre URL Atlas
# Exemple: mongodb+srv://username:password@cluster.mongodb.net/webklor
```

### 5. Créer un administrateur

```powershell
# Exécuter le script de création d'admin
.\create-admin-user.ps1
```

### 6. Démarrage

```bash
# Terminal 1 : Backend
cd server
npm run dev

# Terminal 2 : Frontend  
npm run dev
```

🎉 **L'application est maintenant accessible sur http://localhost:5173**

## Déploiement rapide

### Netlify (Frontend)
```powershell
.\deploy-netlify.ps1
```

### Docker (Complet)
```bash
docker-compose up -d
```

## URLs importantes

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **Admin** : http://localhost:5173/login

## Comptes par défaut

- **Admin** : admin / admin123!

## Support

📧 **Support** : support@webklor.com
🐛 **Issues** : [GitHub Issues](https://github.com/votre-username/webklor/issues)
📖 **Documentation** : [DEPLOYMENT.md](./DEPLOYMENT.md)
